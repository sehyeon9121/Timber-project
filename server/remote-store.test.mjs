import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createApp } from './app.mjs';
import { createStore, hashPassword, verifyPassword } from './store.mjs';
import { createRemoteStore } from './remote-store.mjs';
import { openStore, remoteStoreOptions } from './open-store.mjs';
import { migrateLocalStore } from './migrate-to-turso.mjs';
import handler, { siteOrigin } from '../api/index.mjs';
import express from 'express';

test('Vercel refuses missing DB configuration and returns a service error', async t => {
  await assert.rejects(openStore({ VERCEL: '1' }), /TURSO_DATABASE_URL/);
  await assert.rejects(openStore({ TURSO_DATABASE_URL: 'file:unsafe.sqlite', TURSO_AUTH_TOKEN: 'test' }), /TURSO_DATABASE_URL/);
  const saved = process.env.SITE_ORIGIN;
  delete process.env.SITE_ORIGIN;
  try {
    const logs = t.mock.method(console, 'error', () => {});
    let body;
    const response = { setHeader() {}, end(value) { body = JSON.parse(value); } };
    await handler({}, response);
    assert.equal(response.statusCode, 503);
    assert.equal(body.code, 'SERVICE_UNAVAILABLE');
    assert.deepEqual(logs.mock.calls[0].arguments, ['Login API initialization failed:', 'MISSING_SITE_ORIGIN']);
  } finally {
    if (saved === undefined) delete process.env.SITE_ORIGIN;
    else process.env.SITE_ORIGIN = saved;
  }
});

test('deployment configuration reports the failing field and accepts pasted whitespace', () => {
  const url = 'libsql://timber-auth-sehyeon9121.aws-ap-northeast-1.turso.io';
  const token = 'test-private-token';
  assert.throws(() => remoteStoreOptions({ TURSO_AUTH_TOKEN: token }), { code: 'MISSING_TURSO_DATABASE_URL' });
  assert.throws(() => remoteStoreOptions({ TURSO_DATABASE_URL: url }), { code: 'MISSING_TURSO_AUTH_TOKEN' });
  assert.throws(() => remoteStoreOptions({ TURSO_DATABASE_URL: 'bad-address', TURSO_AUTH_TOKEN: token }), { code: 'INVALID_TURSO_DATABASE_URL' });
  assert.deepEqual(remoteStoreOptions({ TURSO_DATABASE_URL: ` ${url}\n`, TURSO_AUTH_TOKEN: ` ${token}\n` }), { url, authToken: token });
  assert.throws(() => siteOrigin({}), { code: 'MISSING_SITE_ORIGIN' });
  for (const value of ['bad-address', 'http://example.com', 'https://user:password@example.com']) {
    assert.throws(() => siteOrigin({ SITE_ORIGIN: value }), { code: 'INVALID_SITE_ORIGIN' });
  }
  assert.equal(siteOrigin({ SITE_ORIGIN: ' https://timber-project-ten.vercel.app/\n' }), 'https://timber-project-ten.vercel.app');
});

test('libSQL migration preserves accounts, passwords, permissions, posts, and sessions across instances', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'timber-turso-test-'));
  const path = join(directory, 'local.sqlite');
  const remoteOptions = { url: pathToFileURL(join(directory, 'remote.sqlite')).href };
  const source = createStore(path);
  const password = 'Test-only-password-2026';
  const hash = await hashPassword(password);
  const master = source.addUser({ name: 'Master', username: 'ERS', email: 'master@example.test', affiliation: 'Admin' }, hash, 'master');
  const author = source.addUser({ name: 'Member', username: 'member', email: 'member@example.test', affiliation: 'Lab' }, hash);
  source.review(author.id, 'approved', master.id);
  const rejected = source.addUser({ name: 'Rejected', username: 'rejected', email: 'rejected@example.test', affiliation: 'Lab' }, hash);
  source.review(rejected.id, 'rejected', master.id);
  const pending = source.addUser({ name: 'Pending', username: 'pending', email: 'pending@example.test', affiliation: 'Lab' }, hash);
  const originalPost = source.createPost({ title: 'Before migration', body: 'Keep this body' }, author.id);
  source.createSession(master.id);
  const target = await createRemoteStore(remoteOptions);
  const second = await createRemoteStore(remoteOptions);
  const origin = 'https://timber-project-ten.vercel.app';
  const wrapper = express();
  wrapper.use(await createApp(target, { origins: [origin], secureCookies: true }));
  const server = wrapper.listen(0, '127.0.0.1');
  await new Promise(ready => server.once('listening', ready));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const request = async (path, method = 'GET', body, cookie, site = origin) => {
    const response = await fetch(base + path, { method,
      headers: { 'Content-Type': 'application/json', Origin: site, ...(cookie ? { Cookie: cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie') };
  };
  t.after(async () => {
    await new Promise(done => { server.close(done); server.closeAllConnections(); });
    target.close(); second.close(); source.close();
    assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + '\\') || resolve(directory).startsWith(resolve(tmpdir()) + '/'));
    assert.ok(directory.includes('timber-turso-test-'));
    await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  });
  await t.test('migration is verified, repeatable, and leaves source accounts intact', async () => {
    assert.deepEqual(await migrateLocalStore(path, target), { status: 'imported', users: 4, posts: 1 });
    assert.deepEqual(await migrateLocalStore(path, target), { status: 'unchanged', users: 4, posts: 1 });
    assert.equal(source.findById(master.id).password_hash, hash);
    assert.equal((await target.findById(author.id)).reviewed_by, master.id);
    assert.equal((await target.findPost(originalPost.id)).body, originalPost.body);
    assert.equal((await target.client.execute('SELECT COUNT(*) AS count FROM sessions')).rows[0].count, 0);
    assert.ok(await verifyPassword(password, (await target.findById(master.id)).password_hash));
  });
  let memberCookie;
  let masterCookie;
  await t.test('original accounts login; roles and approved status are enforced', async () => {
    for (const [user, status] of [[master, 200], [author, 200], [pending, 403], [rejected, 403]]) {
      const result = await request('/auth/login', 'POST', { username: user.username, password });
      assert.equal(result.status, status);
      if (user.id === master.id) masterCookie = result.cookie.split(';')[0];
      if (user.id === author.id) memberCookie = result.cookie.split(';')[0];
      if (status === 200) { assert.match(result.cookie, /Secure/); assert.match(result.cookie, /HttpOnly/); }
    }
    assert.equal((await request('/auth/login', 'POST', { username: master.username, password: 'wrong' })).status, 401);
    assert.equal((await request('/admin/users', 'GET', undefined, memberCookie)).status, 403);
    assert.equal((await request('/admin/users', 'GET', undefined, masterCookie)).body.users.length, 3);
    assert.equal((await request('/auth/login', 'POST', { username: master.username, password }, undefined, 'https://untrusted.example')).status, 403);
  });
  await t.test('signup conflicts are handled and approvals are persisted', async () => {
    const input = { name: 'New member', username: 'newmember', email: 'new@example.test', affiliation: 'Lab', password };
    const results = await Promise.all([request('/auth/signup', 'POST', input), request('/auth/signup', 'POST', input)]);
    assert.deepEqual(results.map(result => result.status).sort(), [201, 409]);
    const created = await target.findByEmail(input.email);
    assert.equal(created.status, 'pending');
    assert.equal((await request(`/admin/users/${created.id}`, 'PATCH', { status: 'approved' }, masterCookie)).status, 200);
    assert.equal((await second.findById(created.id)).status, 'approved');
  });
  await t.test('board writes persist, ownership is enforced, and sessions work across instances', async () => {
    assert.equal((await request('/board/posts')).status, 401);
    assert.equal((await second.sessionUser(memberCookie.split('=')[1])).id, author.id);
    const created = await request('/board/posts', 'POST', { title: 'Cloud board', body: 'Persistent body' }, memberCookie);
    assert.equal(created.status, 201);
    const id = created.body.post.id;
    assert.ok(id > originalPost.id);
    assert.equal((await second.findPost(id)).body, 'Persistent body');
    assert.equal((await request('/board/posts', 'GET', undefined, memberCookie)).body.total, 2);
    assert.equal((await request(`/board/posts/${id}`, 'PATCH', { title: 'Edited', body: 'New body' }, masterCookie)).status, 403);
    assert.equal((await request(`/board/posts/${id}`, 'PATCH', { title: 'Edited', body: 'New body' }, memberCookie)).status, 200);
    assert.equal((await request(`/board/posts/${id}`, 'DELETE', undefined, masterCookie)).status, 200);
    assert.equal((await second.findPost(id)), undefined);
    await request('/auth/logout', 'POST', undefined, memberCookie);
    assert.equal(await second.sessionUser(memberCookie.split('=')[1]), undefined);
  });
  await t.test('retry refuses different destination data without overwriting either database', async () => {
    await assert.rejects(migrateLocalStore(path, target), /다른 계정/);
    assert.ok(await second.findByEmail('new@example.test'));
    assert.equal(source.findByEmail('new@example.test'), undefined);
    assert.equal(source.findPost(originalPost.id).body, originalPost.body);
  });
});
