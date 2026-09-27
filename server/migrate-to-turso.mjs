import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';
import { databasePath } from './store.mjs';
import { openStore } from './open-store.mjs';

const tables = [
  { name: 'users', columns: ['id', 'name', 'email', 'affiliation', 'password_hash', 'role', 'status', 'created_at', 'reviewed_at', 'reviewed_by'] },
  { name: 'posts', columns: ['id', 'author_id', 'title', 'body', 'created_at', 'updated_at'] },
];
const values = (rows, columns) => rows.map(row => columns.map(column => row[column]));

// Copies accounts and posts atomically. The source DB is read-only; sessions stay local.
export async function migrateLocalStore(path, target) {
  const source = new DatabaseSync(path, { readOnly: true });
  let transaction;
  try {
    source.exec('BEGIN');
    const snapshots = tables.map(table => ({ ...table, rows: source.prepare(`SELECT * FROM ${table.name} ORDER BY id`).all() }));
    if (!snapshots[0].rows.some(user => user.role === 'master')) throw new Error('이전할 로컬 DB에 관리자 계정이 없습니다.');
    transaction = await target.client.transaction('write');
    const existing = [];
    for (const table of snapshots) existing.push((await transaction.execute(`SELECT * FROM ${table.name} ORDER BY id`)).rows);
    if (existing.some(rows => rows.length)) {
      const identical = snapshots.every((table, index) => JSON.stringify(values(table.rows, table.columns)) === JSON.stringify(values(existing[index], table.columns)));
      if (!identical) throw new Error('대상 DB에 다른 계정 또는 게시글이 있어 이전을 중단했습니다. 빈 DB를 사용하세요.');
      await transaction.rollback();
      return { status: 'unchanged', users: snapshots[0].rows.length, posts: snapshots[1].rows.length };
    }
    await transaction.execute('PRAGMA defer_foreign_keys = ON');
    for (const table of snapshots) {
      for (const row of table.rows) {
        await transaction.execute({
          sql: `INSERT INTO ${table.name} (${table.columns.join(', ')}) VALUES (${table.columns.map(() => '?').join(', ')})`,
          args: table.columns.map(column => row[column]),
        });
      }
      const copied = (await transaction.execute(`SELECT * FROM ${table.name} ORDER BY id`)).rows;
      if (JSON.stringify(values(copied, table.columns)) !== JSON.stringify(values(table.rows, table.columns))) throw new Error('DB 이전 검증에 실패했습니다.');
    }
    if ((await transaction.execute('PRAGMA foreign_key_check')).rows.length) throw new Error('DB 참조 검증에 실패했습니다.');
    await transaction.commit();
    return { status: 'imported', users: snapshots[0].rows.length, posts: snapshots[1].rows.length };
  } catch (error) {
    if (transaction && !transaction.closed) await transaction.rollback();
    throw error;
  } finally {
    transaction?.close();
    source.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let target;
  try {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) throw new Error('Turso 연결 환경 변수를 설정해 주세요.');
    target = await openStore();
    const result = await migrateLocalStore(databasePath, target);
    console.log(`DB 이전 ${result.status === 'unchanged' ? '이미 완료됨' : '완료'}: 계정 ${result.users}개, 게시글 ${result.posts}개. 기존 비밀번호로 로그인하세요.`);
  } catch (error) {
    console.error('DB 이전 실패:', error.message);
    process.exitCode = 1;
  } finally {
    target?.close();
  }
}
