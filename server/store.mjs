import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';

const deriveKey = promisify(scrypt);
const scryptOptions = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
export const databasePath = resolve(process.env.AUTH_DB_PATH || 'server/data/auth.sqlite');
export const sessionDuration = 8 * 60 * 60 * 1000;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await deriveKey(password, salt, 64, scryptOptions);
  return `${salt}:${key.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [salt, hex] = stored.split(':');
  const key = await deriveKey(password, salt, 64, scryptOptions);
  const expected = Buffer.from(hex, 'hex');
  return expected.length === key.length && timingSafeEqual(expected, key);
}

export function validateRegistration(input) {
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const username = typeof input?.username === 'string' ? input.username.trim() : '';
  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
  const affiliation = typeof input?.affiliation === 'string' ? input.affiliation.trim() : '';
  const password = typeof input?.password === 'string' ? input.password : '';
  if (name.length < 2 || name.length > 80) return { error: '이름은 2~80자로 입력해 주세요.' };
  if (!/^[A-Za-z][A-Za-z0-9_]{2,31}$/.test(username)) return { error: '아이디는 영문으로 시작하는 영문·숫자·밑줄 3~32자로 입력해 주세요.' };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: '올바른 이메일을 입력해 주세요.' };
  if (affiliation.length < 2 || affiliation.length > 120) return { error: '소속은 2~120자로 입력해 주세요.' };
  if (password.length < 12 || password.length > 128) return { error: '비밀번호는 12~128자로 입력해 주세요.' };
  return { name, username, email, affiliation, password };
}

export function publicUser(user) {
  return { id: user.id, name: user.name, username: user.username, email: user.email, affiliation: user.affiliation,
    role: user.role, status: user.status, createdAt: user.created_at, reviewedAt: user.reviewed_at };
}

export const tokenHash = token => createHash('sha256').update(token).digest('hex');

export const storeSchema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE COLLATE NOCASE,
      email TEXT NOT NULL UNIQUE,
      affiliation TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'master')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      reviewed_at TEXT,
      reviewed_by INTEGER REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
`;

export function createStore(path = databasePath) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path, { timeout: 5000 });
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
${storeSchema}
  `);
  if (!db.prepare('PRAGMA table_info(users)').all().some(column => column.name === 'username')) {
    db.exec('ALTER TABLE users ADD COLUMN username TEXT');
  }
  db.exec('BEGIN');
  try {
    db.prepare("UPDATE users SET username = CASE WHEN role = 'master' AND id = (SELECT MIN(id) FROM users WHERE role = 'master') THEN 'ERS' ELSE 'user' || id END WHERE username IS NULL").run();
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username COLLATE NOCASE)');
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); db.close(); throw error; }
  return {
    db,
    findByUsername: username => db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(username),
    findByEmail: email => db.prepare('SELECT * FROM users WHERE email = ?').get(email),
    findById: id => db.prepare('SELECT * FROM users WHERE id = ?').get(id),
    addUser(input, passwordHash, role = 'member') {
      const result = db.prepare('INSERT INTO users (name, username, email, affiliation, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(input.name, input.username, input.email, input.affiliation, passwordHash, role, role === 'master' ? 'approved' : 'pending');
      return this.findById(Number(result.lastInsertRowid));
    },
    updateMasterCredentials(username, passwordHash) {
      db.exec('BEGIN');
      try {
        const masters = db.prepare("SELECT id FROM users WHERE role = 'master'").all();
        if (masters.length !== 1) throw new Error('관리자 계정이 정확히 하나여야 합니다.');
        db.prepare('UPDATE users SET username = ?, password_hash = ? WHERE id = ?').run(username, passwordHash, masters[0].id);
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(masters[0].id);
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    listMembers: () => db.prepare("SELECT * FROM users WHERE role = 'member' ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created_at DESC, id DESC").all().map(publicUser),
    review(id, status, masterId) {
      return db.prepare("UPDATE users SET status = ?, reviewed_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), reviewed_by = ? WHERE id = ? AND role = 'member' AND status = 'pending'")
        .run(status, masterId, id).changes === 1;
    },
    createSession(userId) {
      db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
      const token = randomBytes(32).toString('hex');
      db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(tokenHash(token), userId, Date.now() + sessionDuration);
      return token;
    },
    sessionUser(token) {
      if (!token || !/^[a-f0-9]{64}$/.test(token)) return undefined;
      return db.prepare("SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ? AND users.status = 'approved'")
        .get(tokenHash(token), Date.now());
    },
    deleteSession(token) { if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token)); },
    countPosts: () => db.prepare('SELECT COUNT(*) AS total FROM posts').get().total,
    listPosts: (limit, offset) => db.prepare(`SELECT posts.id, posts.title, posts.author_id AS authorId,
      users.name AS authorName, posts.created_at AS createdAt, posts.updated_at AS updatedAt
      FROM posts JOIN users ON users.id = posts.author_id ORDER BY posts.id DESC LIMIT ? OFFSET ?`).all(limit, offset),
    findPost: id => db.prepare(`SELECT posts.id, posts.title, posts.body, posts.author_id AS authorId,
      users.name AS authorName, posts.created_at AS createdAt, posts.updated_at AS updatedAt
      FROM posts JOIN users ON users.id = posts.author_id WHERE posts.id = ?`).get(id),
    createPost(input, authorId) {
      const result = db.prepare('INSERT INTO posts (author_id, title, body) VALUES (?, ?, ?)').run(authorId, input.title, input.body);
      return this.findPost(Number(result.lastInsertRowid));
    },
    updatePost(id, input) {
      db.prepare("UPDATE posts SET title = ?, body = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?").run(input.title, input.body, id);
    },
    deletePost: id => db.prepare('DELETE FROM posts WHERE id = ?').run(id),
    close: () => db.close(),
  };
}
