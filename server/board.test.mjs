import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createApp } from './app.mjs';
import { createStore } from './store.mjs';

test('member-only board permissions, content lifecycle, and persistence', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'timber-board-test-'));
  const path = join(directory, 'auth.sqlite');
  const store = createStore(path);
  const createUser = (name, role = 'member') => store.addUser({ name, username: name, email: `${name}@example.test`, affiliation: 'Test lab' }, 'unused-test-hash', role);
  const master = createUser('Master', 'master');
  const author = createUser('Author');
  const other = createUser('Other');
  const pending = createUser('Pending');
  const rejected = createUser('Rejected');
  store.review(author.id, 'approved', master.id);
  store.review(other.id, 'approved', master.id);
  store.review(rejected.id, 'rejected', master.id);
  const cookie = user => `timber_session=${store.createSession(user.id)}`;
  const authorCookie = cookie(author);
  const otherCookie = cookie(other);
  const masterCookie = cookie(master);
  const app = await createApp(store);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolveReady => server.once('listening', resolveReady));
  const base = `http://127.0.0.1:${server.address().port}/api/board/posts`;
  async function request(suffix = '', method = 'GET', body, session = authorCookie, origin = 'http://localhost:5173') {
    const response = await fetch(`${base}${suffix}`, { method,
      headers: { 'Content-Type': 'application/json', Origin: origin, ...(session ? { Cookie: session } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, data: await response.json() };
  }
  t.after(async () => {
    await new Promise(resolveClosed => { server.close(resolveClosed); server.closeAllConnections(); });
    store.close();
    assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + '\\') || resolve(directory).startsWith(resolve(tmpdir()) + '/'));
    assert.ok(directory.includes('timber-board-test-'));
    rmSync(directory, { recursive: true });
  });
  let postId;
  await t.test('anonymous and inactive members cannot read or write board content', async () => {
    for (const session of [null, cookie(pending), cookie(rejected), 'timber_session=' + '0'.repeat(64)]) {
      for (const [suffix, method] of [['', 'GET'], ['/1', 'GET'], ['', 'POST'], ['/1', 'PATCH'], ['/1', 'DELETE']]) {
        assert.equal((await request(suffix, method, method === 'GET' ? undefined : { title: 'Private', body: 'Private' }, session)).status, 401);
      }
    }
    assert.equal(store.countPosts(), 0);
  });
  await t.test('approved members create posts and the server owns authorship', async () => {
    const result = await request('', 'POST', { title: ' 첫 번째 글 ', body: '회원 전용 내용\n<script>alert("xss")</script>', authorId: master.id });
    assert.equal(result.status, 201);
    postId = result.data.post.id;
    assert.equal(result.data.post.authorId, author.id);
    assert.equal(result.data.post.title, '첫 번째 글');
    assert.equal(result.data.post.body, '회원 전용 내용\n<script>alert("xss")</script>');
    assert.ok(!('email' in result.data.post));
    assert.ok(!('password_hash' in result.data.post));
    assert.equal((await request(`/${postId}`, 'GET', undefined, otherCookie)).status, 200);
    const list = await request();
    assert.equal(list.data.total, 1);
    assert.equal(list.data.posts[0].id, postId);
    assert.ok(!('body' in list.data.posts[0]));
  });
  await t.test('blank or oversized content is rejected; long Korean bodies fit the request limit', async () => {
    for (const body of [{ title: ' ', body: 'x' }, { title: 'x', body: ' ' }, { title: 'x'.repeat(121), body: 'x' }, { title: 'x', body: 'x'.repeat(10001) }, { title: [], body: {} }]) {
      assert.equal((await request('', 'POST', body)).status, 400);
    }
    assert.equal((await request('', 'POST', { title: '긴 한글 글', body: '가'.repeat(10000) })).status, 201);
    assert.equal((await request('?page=0')).status, 400);
    assert.equal((await request('?page=1.5')).status, 400);
    assert.equal((await request('/invalid')).status, 404);
    assert.equal((await request('/999999')).status, 404);
  });
  await t.test('only authors can edit; client fields cannot change authorship', async () => {
    const changed = { title: '수정한 제목', body: '수정한 내용', authorId: other.id };
    assert.equal((await request(`/${postId}`, 'PATCH', changed, otherCookie)).status, 403);
    assert.equal((await request(`/${postId}`, 'PATCH', changed, masterCookie)).status, 403);
    assert.equal((await request(`/${postId}`, 'PATCH', { title: '', body: 'x' })).status, 400);
    const result = await request(`/${postId}`, 'PATCH', changed);
    assert.equal(result.status, 200);
    assert.equal(result.data.post.title, changed.title);
    assert.equal(result.data.post.authorId, author.id);
  });
  await t.test('untrusted sites cannot publish even with a valid session', async () => {
    const count = store.countPosts();
    assert.equal((await request('', 'POST', { title: 'Attack', body: 'Attack' }, authorCookie, 'https://untrusted.example')).status, 403);
    assert.equal(store.countPosts(), count);
  });
  await t.test('pagination returns newest posts first without exposing full content', async () => {
    for (let index = 0; index < 23; index++) store.createPost({ title: `Post ${index}`, body: 'Private body' }, other.id);
    const first = await request('?page=1');
    const second = await request('?page=2');
    assert.equal(first.data.total, 25);
    assert.equal(first.data.posts.length, 20);
    assert.equal(second.data.posts.length, 5);
    assert.equal(first.data.totalPages, 2);
    assert.ok(first.data.posts.every((post, index, posts) => index === 0 || posts[index - 1].id > post.id));
    assert.ok(!first.data.posts.some(post => second.data.posts.some(item => item.id === post.id)));
  });
  await t.test('posts and existing account roles survive a database reopen', () => {
    const reopened = createStore(path);
    assert.equal(reopened.findPost(postId).title, '수정한 제목');
    assert.equal(reopened.findPost(postId).authorId, author.id);
    assert.equal(reopened.findById(master.id).role, 'master');
    assert.equal(reopened.findById(author.id).status, 'approved');
    reopened.close();
  });
  await t.test('authors and masters can delete; unrelated members cannot', async () => {
    const original = store.findPost(postId);
    for (const session of [null, cookie(pending), cookie(rejected), 'timber_session=' + '0'.repeat(64)]) {
      const result = await request(`/${postId}`, 'DELETE', undefined, session);
      assert.equal(result.status, 401);
      assert.deepEqual(store.findPost(postId), original);
    }
    for (const body of [undefined, { authorId: other.id, role: 'master', user: { id: author.id, role: 'master' } }]) {
      const result = await request(`/${postId}`, 'DELETE', body, otherCookie);
      assert.equal(result.status, 403);
      assert.equal(result.data.code, 'POST_FORBIDDEN');
      assert.deepEqual(store.findPost(postId), original);
    }
    const deleted = await request(`/${postId}`, 'DELETE', undefined, masterCookie);
    assert.equal(deleted.status, 200);
    assert.deepEqual(deleted.data, { ok: true });
    assert.equal(store.findPost(postId), undefined);
    assert.equal((await request(`/${postId}`)).status, 404);
    const own = store.createPost({ title: '삭제 검증', body: '삭제 검증' }, author.id);
    assert.equal((await request(`/${own.id}`, 'DELETE')).status, 200);
    assert.equal(store.findPost(own.id), undefined);
    const next = store.createPost({ title: '새 게시글', body: '새 게시글' }, author.id);
    assert.ok(next.id > own.id);
  });
  await t.test('logout and expired sessions remove board access', async () => {
    const authorPost = store.createPost({ title: '로그아웃 후 삭제 차단', body: '보존할 내용' }, author.id);
    const otherPost = store.createPost({ title: '세션 만료 후 삭제 차단', body: '보존할 내용' }, other.id);
    store.deleteSession(authorCookie.split('=')[1]);
    assert.equal((await request()).status, 401);
    assert.equal((await request(`/${authorPost.id}`, 'DELETE')).status, 401);
    assert.deepEqual(store.findPost(authorPost.id), authorPost);
    store.db.prepare('UPDATE sessions SET expires_at = 0 WHERE user_id = ?').run(other.id);
    assert.equal((await request('', 'GET', undefined, otherCookie)).status, 401);
    assert.equal((await request(`/${otherPost.id}`, 'DELETE', undefined, otherCookie)).status, 401);
    assert.deepEqual(store.findPost(otherPost.id), otherPost);
  });
});
