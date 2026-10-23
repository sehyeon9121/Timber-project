import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { createStore } from './store.mjs';
import { createRemoteStore } from './remote-store.mjs';
import { createApp } from './app.mjs';
import { migrateLocalStore } from './migrate-to-turso.mjs';

for (const backend of ['local', 'libsql']) {
  test(`${backend}: post and notice views count visits, preserve edits, and survive reopens`, async t => {
    const directory = mkdtempSync(join(tmpdir(), 'timber-views-'));
    const path = join(directory, 'views.sqlite');
    const open = () => backend === 'local' ? createStore(path) : createRemoteStore({ url: pathToFileURL(path).href });
    const store = await open();
    const admin = await store.addUser({ name: 'Admin', username: 'Admin', email: 'admin@test.example', affiliation: 'Test' }, 'test-hash', 'master');
    const pending = await store.addUser({ name: 'Pending', username: 'Pending', email: 'pending@test.example', affiliation: 'Test' }, 'test-hash');
    const cookie = `timber_session=${await store.createSession(admin.id)}`;
    const pendingCookie = `timber_session=${await store.createSession(pending.id)}`;
    const app = await createApp(store);
    const server = app.listen(0, '127.0.0.1');
    await new Promise(ready => server.once('listening', ready));
    const base = `http://127.0.0.1:${server.address().port}/api/board`;
    const request = async (path, method = 'GET', session = cookie, origin = 'http://localhost:5173', body) => {
      const response = await fetch(base + path, { method, headers: { Origin: origin, 'Content-Type': 'application/json', ...(session ? { Cookie: session } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
      return { status: response.status, data: method === 'HEAD' ? null : await response.json() };
    };
    t.after(async () => {
      await new Promise(done => { server.close(done); server.closeAllConnections(); });
      store.close();
      await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
    });
    for (const kind of ['posts', 'notices']) {
      const created = await request(`/${kind}`, 'POST', cookie, undefined, { title: '조회수 검증', body: '기존 본문', viewCount: 999 });
      const post = created.data.post;
      assert.equal(post.viewCount, 0);
      const path = `/${kind}/${post.id}`;
      const viewPath = `${path}/views`;
      // Editor reads, list reads and HEAD requests must never count as visits.
      assert.equal((await request(path)).data.post.viewCount, 0);
      assert.equal((await request(path, 'HEAD')).status, 200);
      assert.equal((await request(`/${kind}`)).data.posts[0].viewCount, 0);
      for (const session of [null, pendingCookie]) {
        assert.equal((await request(path, 'GET', session)).status, 200);
        assert.equal((await request(path, 'PATCH', session, undefined, { title: 'Forged', body: 'Forged' })).status, 401);
        assert.equal((await request(path, 'DELETE', session)).status, 401);
      }
      assert.equal((await request(viewPath, 'POST', cookie, 'https://untrusted.example')).status, 403);
      assert.equal((await request(`/${kind}/invalid/views`, 'POST')).status, 404);
      assert.equal((await request(`/${kind}/999999/views`, 'POST')).status, 404);
      const first = (await request(viewPath, 'POST', null)).data.post;
      assert.equal(first.viewCount, 1);
      assert.equal(first.body, post.body);
      assert.equal(first.updatedAt, post.updatedAt);
      const visits = await Promise.all(Array.from({ length: 8 }, (_, index) => request(viewPath, 'POST', index % 2 ? pendingCookie : null)));
      assert.ok(visits.every(result => result.status === 200));
      assert.deepEqual(visits.map(result => result.data.post.viewCount).sort((a, b) => a - b), [2, 3, 4, 5, 6, 7, 8, 9]);
      assert.equal((await request(`/${kind}`)).data.posts[0].viewCount, 9);
      const edited = await request(path, 'PATCH', cookie, undefined, { title: '수정한 글', body: '수정 본문', viewCount: 10000 });
      assert.equal(edited.data.post.viewCount, 9);
      const reopened = await open();
      try {
        const saved = await (kind === 'posts' ? reopened.findPost(post.id) : reopened.findNotice(post.id));
        assert.equal(saved.viewCount, 9);
        assert.equal(saved.body, '수정 본문');
      } finally { reopened.close(); }
    }
  });
  test(`${backend}: existing databases gain zeroed counters without losing content`, async () => {
    const directory = mkdtempSync(join(tmpdir(), 'timber-views-legacy-'));
    const path = join(directory, 'legacy.sqlite');
    const old = new DatabaseSync(path);
    for (const table of ['posts', 'notices']) {
      old.exec(`CREATE TABLE ${table} (id INTEGER PRIMARY KEY AUTOINCREMENT, author_id INTEGER NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL,
        ${table === 'posts' ? 'division INTEGER' : 'pinned INTEGER NOT NULL DEFAULT 0'}, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
        INSERT INTO ${table} (author_id, title, body, created_at, updated_at) VALUES (1, '기존 글', '보존할 본문', '2026-01-01', '2026-01-01');`);
    }
    old.close();
    let store;
    try {
      store = await (backend === 'local' ? createStore(path) : createRemoteStore({ url: pathToFileURL(path).href }));
      await store.addUser({ name: 'Legacy', username: 'Legacy', email: 'legacy@test.example', affiliation: 'Test' }, 'test-hash', 'master');
      for (const post of [await store.findPost(1), await store.findNotice(1)]) {
        assert.equal(post.viewCount, 0);
        assert.equal(post.body, '보존할 본문');
        assert.equal(post.updatedAt, '2026-01-01');
      }
    } finally {
      store?.close();
      await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
    }
  });
}

test('local-to-libSQL migration preserves nonzero view counts and is repeatable', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'timber-views-migration-'));
  const path = join(directory, 'source.sqlite');
  const source = createStore(path);
  const target = await createRemoteStore({ url: pathToFileURL(join(directory, 'target.sqlite')).href });
  try {
    const admin = source.addUser({ name: 'Admin', username: 'Admin', email: 'admin@test.example', affiliation: 'Test' }, 'test-hash', 'master');
    const post = source.createPost({ title: '글', body: '본문' }, admin.id);
    const notice = source.createNotice({ title: '공지', body: '본문' }, admin.id);
    source.incrementPostViews(post.id);
    source.incrementNoticeViews(notice.id);
    source.incrementNoticeViews(notice.id);
    assert.equal((await migrateLocalStore(path, target)).status, 'imported');
    assert.equal((await target.findPost(post.id)).viewCount, 1);
    assert.equal((await target.findNotice(notice.id)).viewCount, 2);
    assert.equal((await migrateLocalStore(path, target)).status, 'unchanged');
  } finally {
    source.close(); target.close();
    await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  }
});
