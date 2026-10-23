import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createApp } from './app.mjs';
import { createStore } from './store.mjs';
import { createRemoteStore } from './remote-store.mjs';
import { createFileStorage } from './file-storage.mjs';

for (const backend of ['sqlite', 'libsql']) test(`${backend}: library categories, metadata, search, files and persistence`, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'timber-library-'));
  const path = join(directory, 'test.sqlite');
  const open = () => backend === 'sqlite' ? createStore(path) : createRemoteStore({ url: pathToFileURL(path).href });
  const store = await open();
  const user = await store.addUser({ name: 'Library Tester', username: 'library', email: 'library@example.test', affiliation: 'Test' }, 'unused', 'master');
  const cookie = `timber_session=${await store.createSession(user.id)}`;
  const app = await createApp(store, { fileStorage: createFileStorage({ ATTACHMENT_DIR: join(directory, 'files') }) });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(done => server.once('listening', done));
  t.after(async () => {
    await new Promise(done => { server.close(done); server.closeAllConnections(); });
    store.close();
    assert.ok(resolve(directory).startsWith(resolve(tmpdir())) && directory.includes('timber-library-'));
    await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  });
  const request = (suffix = '', method = 'GET', body, authenticated = true) => fetch(`http://127.0.0.1:${server.address().port}/api/board/posts${suffix}`, {
    method, headers: { Origin: 'http://localhost:5173', 'Content-Type': Buffer.isBuffer(body) ? 'application/octet-stream' : 'application/json', ...(authenticated ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : Buffer.isBuffer(body) ? body : JSON.stringify(body),
  });
  const draft = { title: '완성 보고서', body: '검색 가능한 내용', division: null, documentType: '최종보고서' };
  await store.createPost({ title: '기존 활동', body: '소식', division: null }, user.id);
  const posts = {};
  for (const category of ['reports', 'materials', 'minutes', 'forms']) {
    const response = await request('', 'POST', { ...draft, category, meetingDate: category === 'minutes' ? '2026-10-23' : '' });
    assert.equal(response.status, 201);
    posts[category] = (await response.json()).post;
    const list = await (await request(`?category=${category}`, 'GET', undefined, false)).json();
    assert.equal(list.total, 1);
    assert.equal(list.posts[0].category, category);
    assert.equal(list.posts[0].documentType, draft.documentType);
    assert.equal(list.posts[0].body, undefined);
    assert.equal(list.posts[0].excerpt, draft.body);
    assert.deepEqual(list.posts[0].attachments, []);
  }
  assert.equal((await (await request('?division=activities')).json()).total, 1);
  assert.equal((await (await request()).json()).total, 1);
  assert.equal((await (await request('?category=reports&q=검색')).json()).total, 1);
  assert.equal((await (await request('?category=reports&q=없음')).json()).total, 0);
  assert.equal((await (await request('?category=forms&q=최종보고서')).json()).total, 1);
  for (let i = 0; i < 10; i++) await store.createPost({ ...draft, category: 'reports' }, user.id);
  const page = await (await request('?category=reports&page=2')).json();
  assert.equal(page.total, 11);
  assert.equal(page.posts.length, 1);
  assert.equal(page.posts[0].id, posts.reports.id);
  for (const suffix of ['?category=bad', '?category=reports&division=1']) assert.equal((await request(suffix)).status, 400);
  for (const invalid of [{ category: 'bad' }, { category: 'reports', division: 2 }, { meetingDate: '2026-02-30' }, { documentType: [] }]) {
    assert.equal((await request('', 'POST', { ...draft, ...invalid })).status, 400);
  }
  assert.equal((await request('', 'POST', { ...draft, category: 'forms' }, false)).status, 401);
  const folder = `/${posts.forms.id}/attachments`;
  const reserved = await request(folder, 'POST', { name: '회의록 양식.txt', size: 6 });
  assert.equal(reserved.status, 201);
  const file = (await reserved.json()).attachment;
  assert.deepEqual((await (await request('?category=forms')).json()).posts[0].attachments, []);
  assert.equal((await request(`${folder}/${file.id}/content`, 'PUT', Buffer.from('양식'))).status, 200);
  const list = await (await request('?category=forms', 'GET', undefined, false)).json();
  assert.equal(list.posts[0].attachments[0].name, '회의록 양식.txt');
  const download = await request(`${folder}/${file.id}/content`, 'GET', undefined, false);
  assert.equal(download.status, 200);
  assert.equal(await download.text(), '양식');
  assert.equal((await request(`/${posts.minutes.id}`, 'PATCH', { title: '수정 회의', body: '수정 내용' })).status, 200);
  const edited = (await (await request(`/${posts.minutes.id}`)).json()).post;
  assert.equal(edited.category, 'minutes');
  assert.equal(edited.meetingDate, '2026-10-23');
  const second = await open();
  assert.equal((await second.findPost(posts.forms.id)).documentType, '최종보고서');
  second.close();
  assert.equal((await request(`/${posts.materials.id}`, 'DELETE')).status, 200);
  assert.equal((await (await request('?category=materials')).json()).total, 0);
});
