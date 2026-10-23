import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createStore } from './store.mjs';
import { createRemoteStore } from './remote-store.mjs';
import { createApp } from './app.mjs';
import { migrateLocalStore } from './migrate-to-turso.mjs';

for (const backend of ['local', 'libsql']) {
  test(`${backend}: notices enforce administrator writes and preserve member board isolation`, async t => {
    const directory = mkdtempSync(join(tmpdir(), 'timber-notices-test-'));
    const path = join(directory, 'notices.sqlite');
    const open = () => backend === 'local' ? createStore(path) : createRemoteStore({ url: pathToFileURL(path).href });
    const store = await open();
    const addUser = (name, role = 'member') => store.addUser({ name, username: name, email: `${name}@example.test`, affiliation: 'Test' }, 'unused-test-hash', role);
    const admin = await addUser('Admin', 'master');
    const member = await addUser('Member');
    const pending = await addUser('Pending');
    await store.review(member.id, 'approved', admin.id);
    const adminCookie = `timber_session=${await store.createSession(admin.id)}`;
    const memberCookie = `timber_session=${await store.createSession(member.id)}`;
    const pendingCookie = `timber_session=${await store.createSession(pending.id)}`;
    const app = await createApp(store);
    const server = app.listen(0, '127.0.0.1');
    await new Promise(ready => server.once('listening', ready));
    const base = `http://127.0.0.1:${server.address().port}/api`;
    async function request(path = '/board/notices', method = 'GET', body, cookie = adminCookie, origin = 'http://localhost:5173') {
      const response = await fetch(base + path, { method, headers: { Origin: origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
      return { status: response.status, data: await response.json() };
    }
    t.after(async () => {
      await new Promise(done => { server.close(done); server.closeAllConnections(); });
      store.close();
      assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + '/') || resolve(directory).startsWith(resolve(tmpdir()) + '\\'));
      assert.ok(directory.includes('timber-notices-test-'));
      await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
    });

    for (const cookie of [null, pendingCookie, 'timber_session=' + '0'.repeat(64)]) {
      assert.equal((await request('/board/notices', 'GET', undefined, cookie)).status, 200);
      assert.equal((await request('/board/notices/1', 'GET', undefined, cookie)).status, 404);
      for (const [path, method] of [['/board/notices', 'POST'], ['/board/notices/1', 'PATCH'], ['/board/notices/1', 'DELETE']]) {
        assert.equal((await request(path, method, { title: 'Public', body: 'Public' }, cookie)).status, 401);
      }
    }
    assert.equal((await request('/board/notices', 'POST', { title: 'Forged', body: 'Body', role: 'master', authorId: admin.id }, memberCookie)).status, 403);
    const created = await request('/board/notices', 'POST', { title: ' 회의 일정 ', body: '첫 줄\n<script>alert(1)</script>', pinned: true, authorId: member.id });
    assert.equal(created.status, 201);
    const notice = created.data.post;
    assert.equal(notice.authorId, admin.id);
    assert.equal(notice.title, '회의 일정');
    assert.equal(notice.pinned, 1);
    for (const cookie of [null, pendingCookie, 'timber_session=' + '0'.repeat(64)]) {
      const detail = await request(`/board/notices/${notice.id}`, 'GET', undefined, cookie);
      assert.equal(detail.status, 200);
      assert.equal(detail.data.post.body, notice.body);
      assert.ok(!('password_hash' in detail.data.post));
    }
    assert.equal((await request(`/board/notices/${notice.id}`, 'GET', undefined, memberCookie)).data.post.body, '첫 줄\n<script>alert(1)</script>');
    for (const method of ['PATCH', 'DELETE']) assert.equal((await request(`/board/notices/${notice.id}`, method, { title: 'Forged', body: 'Body' }, memberCookie)).status, 403);
    assert.equal((await store.findNotice(notice.id)).title, '회의 일정');
    const board = await request('/board/posts', 'POST', { title: '활동 글', body: '분리된 글', division: 1 }, memberCookie);
    assert.equal(board.status, 201);
    assert.equal((await request('/board/posts', 'GET', undefined, memberCookie)).data.total, 1);
    assert.equal((await request('/board/notices')).data.total, 1);
    for (const body of [{ title: '', body: 'Body' }, { title: 'Title', body: 42 }, { title: 'x'.repeat(121), body: 'Body' }, { title: 'Title', body: 'x'.repeat(10001) }, { title: 'Title', body: 'Body', pinned: 'true' }]) {
      assert.equal((await request('/board/notices', 'POST', body)).status, 400);
    }
    assert.equal((await request('/board/notices', 'POST', { title: '긴 공지', body: '가'.repeat(10000) })).status, 201);
    assert.equal((await request('/board/notices', 'POST', { title: 'Attack', body: 'Body' }, adminCookie, 'https://untrusted.example')).status, 403);
    for (let index = 0; index < 22; index++) await store.createNotice({ title: `자료 제출 ${index}`, body: 'Body', pinned: false }, admin.id);
    const list = (await request('/board/notices', 'GET', undefined, memberCookie)).data;
    assert.equal(list.total, 24);
    assert.equal(list.posts[0].id, notice.id);
    assert.equal(list.posts.length, 20);
    assert.ok(list.posts.every(post => !('body' in post)));
    assert.equal((await request('/board/notices?page=2')).data.posts.length, 4);
    assert.equal((await request('/board/notices?q=' + encodeURIComponent('회의'))).data.total, 1);
    assert.equal((await request('/board/notices?q=' + encodeURIComponent("' OR 1=1 --"))).data.total, 0);
    for (const suffix of ['?page=0', '?page=1.5', '?q=' + 'x'.repeat(121)]) assert.equal((await request('/board/notices' + suffix)).status, 400);
    for (const id of ['invalid', '999999']) assert.equal((await request('/board/notices/' + id)).status, 404);
    const edited = await request(`/board/notices/${notice.id}`, 'PATCH', { title: '변경된 공지', body: '수정 본문', pinned: false, authorId: member.id });
    assert.equal(edited.status, 200);
    assert.equal(edited.data.post.authorId, admin.id);
    assert.equal(edited.data.post.pinned, 0);
    const reopened = await open();
    assert.equal((await reopened.findNotice(notice.id)).body, '수정 본문');
    reopened.close();
    await store.deleteSession(adminCookie.split('=')[1]);
    assert.equal((await request(`/board/notices/${notice.id}`, 'DELETE')).status, 401);
    const freshCookie = `timber_session=${await store.createSession(admin.id)}`;
    assert.equal((await request(`/board/notices/${notice.id}`, 'DELETE', undefined, freshCookie)).status, 200);
    assert.equal((await request(`/board/notices/${notice.id}`, 'GET', undefined, memberCookie)).status, 404);
    assert.equal((await request('/board/posts', 'GET', undefined, memberCookie)).data.total, 1);
    await t.test('title-only cards show ready image covers, omit pending files and retain administrator-only writes', async () => {
      const created = await request('/board/notices', 'POST', { title: '카드 공지' }, freshCookie);
      assert.equal(created.status, 201);
      const id = created.data.post.id;
      assert.equal(created.data.post.body, '');
      assert.equal((await request('/board/notices', 'POST', { title: '위조 카드' }, memberCookie)).status, 403);
      for (const [fileId, contentType, ready] of [['card-pdf', 'application/pdf', true], ['card-pending', 'image/png', false], ['card-cover', 'image/png', true]]) {
        await store.reserveAttachment('notices', id, { id: fileId, name: `${fileId}.png`, size: 1, contentType, pathname: `private/${fileId}`, backend: 'local' });
        if (ready) await store.readyAttachment(fileId);
      }
      const list = await request('/board/notices?q=' + encodeURIComponent('카드 공지'), 'GET', undefined, memberCookie);
      assert.equal(list.data.posts.length, 1);
      assert.equal(list.data.posts[0].coverImageId, 'card-cover');
      assert.equal(list.data.posts[0].coverImageName, 'card-cover.png');
      assert.ok(!('pathname' in list.data.posts[0]));
      const card = list.data.posts[0];
      assert.ok(!JSON.stringify(card).includes('card-pending'));
      await store.deleteAttachment('card-cover');
      assert.equal((await request('/board/notices?q=' + encodeURIComponent('카드 공지'), 'GET', undefined, memberCookie)).data.posts[0].coverImageId, null);
      assert.equal((await request(`/board/notices/${id}`, 'PATCH', { title: '제목 수정', body: '' }, freshCookie)).status, 200);
      // Member board posts still require a body.
      assert.equal((await request('/board/posts', 'POST', { title: '본문 필요', division: 1 }, memberCookie)).status, 400);
      await store.deleteNotice(id);
    });
  });
}

test('local-to-libSQL migration copies notices and their important flags', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'timber-notices-migration-'));
  const path = join(directory, 'source.sqlite');
  const source = createStore(path);
  const target = await createRemoteStore({ url: pathToFileURL(join(directory, 'target.sqlite')).href });
  try {
    const admin = source.addUser({ name: 'Admin', username: 'Admin', email: 'admin@example.test', affiliation: 'Test' }, 'test-hash', 'master');
    const notice = source.createNotice({ title: '보존할 공지', body: '보존할 본문', pinned: true }, admin.id);
    assert.deepEqual(await migrateLocalStore(path, target), { status: 'imported', users: 1, posts: 0, notices: 1 });
    assert.deepEqual(await target.findNotice(notice.id), { ...source.findNotice(notice.id) });
    assert.deepEqual(await migrateLocalStore(path, target), { status: 'unchanged', users: 1, posts: 0, notices: 1 });
  } finally {
    source.close(); target.close();
    assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + '/') || resolve(directory).startsWith(resolve(tmpdir()) + '\\'));
    await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  }
});
