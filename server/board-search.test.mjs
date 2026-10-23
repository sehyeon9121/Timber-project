import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createStore } from './store.mjs';
import { createRemoteStore } from './remote-store.mjs';
import { createApp } from './app.mjs';

test('board and notice lists start both queries before waiting for the count', async t => {
  const store = createStore(':memory:');
  const author = store.addUser({ name: 'Author', username: 'author', email: 'author@example.test', affiliation: 'Lab' }, 'unused', 'master');
  const cookie = `timber_session=${store.createSession(author.id)}`;
  store.createPost({ title: 'Activity', body: 'Private content', division: 1 }, author.id);
  store.createNotice({ title: 'Notice', body: 'Private content', pinned: true }, author.id);
  const server = (await createApp(store)).listen(0, '127.0.0.1');
  await new Promise(done => server.once('listening', done));
  t.after(async () => {
    await new Promise(done => { server.close(done); server.closeAllConnections(); });
    store.close();
  });

  for (const [path, countMethod, listMethod] of [
    ['/board/posts?division=1', 'countPosts', 'listPosts'],
    ['/board/notices', 'countNotices', 'listNotices'],
  ]) {
    await t.test(path, async () => {
      const count = store[countMethod].bind(store);
      const list = store[listMethod].bind(store);
      let startCount;
      let releaseCount;
      const countStarted = new Promise(resolve => { startCount = resolve; });
      const countGate = new Promise(resolve => { releaseCount = resolve; });
      let listStarted = false;
      store[countMethod] = async (...args) => {
        startCount();
        await countGate;
        return count(...args);
      };
      store[listMethod] = async (...args) => {
        listStarted = true;
        return list(...args);
      };
      const request = fetch(`http://127.0.0.1:${server.address().port}/api${path}`, { headers: { Cookie: cookie } });
      await countStarted;
      try {
        assert.ok(listStarted, 'The list query must start while the count query is still pending');
      } finally {
        releaseCount();
        const response = await request;
        assert.equal(response.status, 200);
        const result = await response.json();
        assert.equal(result.total, 1);
        assert.equal(result.posts.length, 1);
        assert.equal(result.totalPages, 1);
        assert.ok(!('body' in result.posts[0]));
        store[countMethod] = count;
        store[listMethod] = list;
      }
    });
  }
});

for (const backend of ['sqlite', 'libsql']) test(`${backend}: member search filters before ten-post pagination`, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'timber-board-search-'));
  const store = backend === 'sqlite' ? createStore(':memory:') : await createRemoteStore({ url: pathToFileURL(join(directory, 'remote.sqlite')).href });
  const author = await store.addUser({ name: 'Author', username: 'author', email: 'author@example.test', affiliation: 'Lab' }, 'unused', 'master');
  const cookie = `timber_session=${await store.createSession(author.id)}`;
  for (let index = 0; index < 23; index++) await store.createPost({ title: `Match ${index}`, body: '공통 본문', division: index % 2 + 1 }, author.id);
  const activity = await store.createPost({ title: '워크숍 사진', body: '목구조 연구 결과 50%_완료', division: null }, author.id);
  const server = (await createApp(store)).listen(0, '127.0.0.1');
  await new Promise(done => server.once('listening', done));
  const base = `http://127.0.0.1:${server.address().port}/api/board/posts`;
  const request = (query, authenticated = true) => fetch(`${base}?${query}`, { headers: authenticated ? { Cookie: cookie } : {} });
  const list = async query => { const response = await request(query); assert.equal(response.status, 200); return response.json(); };
  t.after(async () => {
    await new Promise(done => { server.close(done); server.closeAllConnections(); });
    store.close();
    assert.ok(directory.startsWith(tmpdir()) && directory.includes('timber-board-search-'));
    await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  });
  const first = await list('q=MATCH');
  const second = await list('q=MATCH&page=2');
  const third = await list('q=MATCH&page=3');
  assert.equal(first.total, 23);
  assert.equal(first.pageSize, 10);
  assert.equal(first.totalPages, 3);
  assert.deepEqual([first.posts.length, second.posts.length, third.posts.length], [10, 10, 3]);
  const all = [...first.posts, ...second.posts, ...third.posts];
  assert.equal(new Set(all.map(post => post.id)).size, 23);
  assert.ok(all.every((post, index) => index === 0 || all[index - 1].id > post.id));
  assert.ok(all.every(post => !('body' in post) && !('email' in post)));
  const division = await list('q=match&division=1');
  assert.equal(division.total, 12);
  assert.ok(division.posts.every(post => post.division === 1));
  const bodySearch = await list('q=' + encodeURIComponent('  목구조  '));
  assert.deepEqual(bodySearch.posts.map(post => post.id), [activity.id]);
  assert.equal((await list('q=' + encodeURIComponent('공통'))).total, 23);
  assert.equal((await list('q=' + encodeURIComponent('목구조') + '&division=1')).total, 0);
  assert.equal((await list('division=activities&q=' + encodeURIComponent('목구조'))).total, 1);
  assert.equal((await list('q=%25_')).total, 1); // Wildcards are literal text.
  assert.equal((await list('q=' + encodeURIComponent("' OR 1=1 --"))).total, 0);
  const empty = await list('q=missing');
  assert.equal(empty.total, 0);
  assert.equal(empty.totalPages, 1);
  assert.deepEqual(empty.posts, []);
  const publicSearch = await request('q=match', false);
  assert.equal(publicSearch.status, 401);
  assert.equal((await publicSearch.json()).posts, undefined);
  for (const query of ['q=' + 'x'.repeat(121), 'q=a&q=b']) assert.equal((await request(query)).status, 400);
});
