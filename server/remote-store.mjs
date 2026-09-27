import { createClient } from '@libsql/client';
import { randomBytes } from 'node:crypto';
import { publicUser, sessionDuration, storeSchema, tokenHash } from './store.mjs';

export async function createRemoteStore(options) {
  const client = createClient(options);
  try {
    await client.executeMultiple(`PRAGMA foreign_keys = ON; ${storeSchema}`);
  } catch (error) {
    client.close();
    throw error;
  }
  const execute = (sql, args = []) => client.execute({ sql, args });
  const first = async (sql, args) => (await execute(sql, args)).rows[0];
  return {
    client,
    findByEmail: email => first('SELECT * FROM users WHERE email = ?', [email]),
    findById: id => first('SELECT * FROM users WHERE id = ?', [id]),
    async addUser(input, passwordHash, role = 'member') {
      const result = await execute('INSERT INTO users (name, email, affiliation, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [input.name, input.email, input.affiliation, passwordHash, role, role === 'master' ? 'approved' : 'pending']);
      return this.findById(Number(result.lastInsertRowid));
    },
    async listMembers() {
      const result = await execute("SELECT * FROM users WHERE role = 'member' ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created_at DESC, id DESC");
      return result.rows.map(publicUser);
    },
    async review(id, status, masterId) {
      const result = await execute("UPDATE users SET status = ?, reviewed_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), reviewed_by = ? WHERE id = ? AND role = 'member' AND status = 'pending'", [status, masterId, id]);
      return result.rowsAffected === 1;
    },
    async createSession(userId) {
      const token = randomBytes(32).toString('hex');
      await client.batch([
        { sql: 'DELETE FROM sessions WHERE expires_at <= ?', args: [Date.now()] },
        { sql: 'INSERT INTO sessions VALUES (?, ?, ?)', args: [tokenHash(token), userId, Date.now() + sessionDuration] },
      ], 'write');
      return token;
    },
    sessionUser(token) {
      if (!token || !/^[a-f0-9]{64}$/.test(token)) return undefined;
      return first("SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ? AND users.status = 'approved'", [tokenHash(token), Date.now()]);
    },
    async deleteSession(token) {
      if (token) await execute('DELETE FROM sessions WHERE token_hash = ?', [tokenHash(token)]);
    },
    async countPosts() { return (await first('SELECT COUNT(*) AS total FROM posts')).total; },
    async listPosts(limit, offset) {
      return (await execute(`SELECT posts.id, posts.title, posts.author_id AS authorId,
        users.name AS authorName, posts.created_at AS createdAt, posts.updated_at AS updatedAt
        FROM posts JOIN users ON users.id = posts.author_id ORDER BY posts.id DESC LIMIT ? OFFSET ?`, [limit, offset])).rows;
    },
    findPost: id => first(`SELECT posts.id, posts.title, posts.body, posts.author_id AS authorId,
      users.name AS authorName, posts.created_at AS createdAt, posts.updated_at AS updatedAt
      FROM posts JOIN users ON users.id = posts.author_id WHERE posts.id = ?`, [id]),
    async createPost(input, authorId) {
      const result = await execute('INSERT INTO posts (author_id, title, body) VALUES (?, ?, ?)', [authorId, input.title, input.body]);
      return this.findPost(Number(result.lastInsertRowid));
    },
    updatePost: (id, input) => execute("UPDATE posts SET title = ?, body = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?", [input.title, input.body, id]),
    deletePost: id => execute('DELETE FROM posts WHERE id = ?', [id]),
    close: () => client.close(),
  };
}
