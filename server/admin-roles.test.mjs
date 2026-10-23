import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { createStore, storeSchema } from './store.mjs';
import { createRemoteStore } from './remote-store.mjs';
import { createApp } from './app.mjs';
import { createFileStorage } from './file-storage.mjs';

for (const backend of ['sqlite', 'libsql']) test(`${backend}: only the master appoints administrators; permissions persist and revoke on existing sessions`, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'timber-admin-roles-'));
  const path = join(directory, 'roles.sqlite');
  const legacy = new DatabaseSync(path);
  legacy.exec(storeSchema.replace('      is_admin INTEGER NOT NULL DEFAULT 0 CHECK (is_admin IN (0, 1)),\n', ''));
  const insert = legacy.prepare('INSERT INTO users (name, username, email, affiliation, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insert.run('Master', 'master', 'master@example.test', 'Original affiliation', 'preserve-hash', 'master', 'approved');
  insert.run('Operator', 'operator', 'operator@example.test', 'Lab', 'preserve-member-hash', 'member', 'approved');
  legacy.close();
  const open = () => backend === 'sqlite' ? createStore(path) : createRemoteStore({ url: pathToFileURL(path).href });
  const store = await open();
  const master = await store.findByUsername('master');
  const operator = await store.findByUsername('operator');
  assert.equal(master.role, 'master');
  assert.equal(master.affiliation, 'Original affiliation');
  assert.equal(master.password_hash, 'preserve-hash');
  assert.equal(operator.is_admin, 0);
  const users = { master, operator };
  for (const name of ['member', 'pending', 'rejected']) {
    users[name] = await store.addUser({ name, username: name, email: `${name}@example.test`, affiliation: 'Lab' }, 'unused');
    if (name !== 'pending') await store.review(users[name].id, name === 'member' ? 'approved' : 'rejected', master.id);
  }
  const cookies = {};
  for (const [name, user] of Object.entries(users)) cookies[name] = `timber_session=${await store.createSession(user.id)}`;
  const server = (await createApp(store, { fileStorage: createFileStorage({ ATTACHMENT_DIR: join(directory, 'files') }) })).listen(0, '127.0.0.1');
  await new Promise(done => server.once('listening', done));
  t.after(async () => {
    await new Promise(done => { server.close(done); server.closeAllConnections(); });
    store.close();
    assert.ok(resolve(directory).startsWith(resolve(tmpdir())) && directory.includes('timber-admin-roles-'));
    await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  });
  async function request(path, method = 'GET', body, who = 'master', origin = 'http://localhost:5173') {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api${path}`, {
      method, headers: { Origin: origin, 'Content-Type': Buffer.isBuffer(body) ? 'application/octet-stream' : 'application/json', ...(cookies[who] ? { Cookie: cookies[who] } : {}) },
      body: body === undefined ? undefined : Buffer.isBuffer(body) ? body : JSON.stringify(body),
    });
    return { status: response.status, data: await response.json() };
  }
  const assign = `/admin/users/${operator.id}/administrator`;
  for (const who of ['anonymous', 'pending', 'rejected']) assert.equal((await request(assign, 'PATCH', { enabled: true }, who)).status, 401);
  for (const who of ['member', 'operator']) assert.equal((await request(assign, 'PATCH', { enabled: true, role: 'master' }, who)).status, 403);
  for (const id of [master.id, users.pending.id, users.rejected.id, 999999]) {
    assert.equal((await request(`/admin/users/${id}/administrator`, 'PATCH', { enabled: true })).status, 409);
  }
  for (const enabled of [undefined, null, 1, 'true', {}]) assert.equal((await request(assign, 'PATCH', { enabled })).status, 400);
  assert.equal((await request(assign, 'PATCH', { enabled: true }, 'master', 'https://evil.example')).status, 403);
  assert.equal((await request('/admin/users', 'GET', undefined, 'operator')).status, 403);
  const granted = await request(assign, 'PATCH', { enabled: true });
  assert.equal(granted.status, 200);
  assert.equal(granted.data.user.isAdmin, true);
  assert.equal(granted.data.user.role, 'member');
  assert.equal((await request(assign, 'PATCH', { enabled: true })).status, 200);
  assert.equal((await request('/auth/me', 'GET', undefined, 'operator')).data.user.isAdmin, true);
  const second = await open();
  try {
    assert.equal((await second.findById(operator.id)).is_admin, 1);
    assert.equal((await second.sessionUser(cookies.operator.split('=')[1])).is_admin, 1);
    // Appointed administrators do not become additional master accounts.
    await second.updateMasterCredentials('master', 'updated-master-hash');
  } finally { second.close(); }
  cookies.master = `timber_session=${await store.createSession(master.id)}`;
  const listing = await request('/admin/users', 'GET', undefined, 'operator');
  assert.equal(listing.status, 200);
  assert.equal(listing.data.users.find(user => user.id === operator.id).isAdmin, true);
  assert.equal((await request(`/admin/users/${users.pending.id}`, 'PATCH', { status: 'approved' }, 'operator')).status, 200);
  for (const id of [master.id, operator.id, users.member.id]) {
    assert.equal((await request(`/admin/users/${id}/administrator`, 'PATCH', { enabled: false }, 'operator')).status, 403);
  }
  const notice = await request('/board/notices', 'POST', { title: '관리자 공지', body: '내용' }, 'operator');
  assert.equal(notice.status, 201);
  const document = await request('/board/posts', 'POST', { title: '보고서 서식', body: '작성 서식', category: 'forms' }, 'operator');
  assert.equal(document.status, 201);
  const id = document.data.post.id;
  const folder = `/board/posts/${id}/attachments`;
  const reserved = await request(folder, 'POST', { name: '서식.txt', size: 6 }, 'operator');
  assert.equal(reserved.status, 201);
  const fileId = reserved.data.attachment.id;
  assert.equal((await request(`${folder}/${fileId}/content`, 'PUT', Buffer.from('서식'), 'operator')).status, 200);
  const results = (await request('/research/results')).data;
  const payload = { year: results.year, asOfDate: '', revision: results.revision, items: Object.fromEntries(results.groups.flatMap(group => group.items).map(item => [item.id, { first: item.first, second: item.second, completed: item.completed, annualPlan: item.annualPlan, annualCompleted: item.annualCompleted }])) };
  assert.equal((await request('/admin/research/results', 'PUT', payload, 'operator')).status, 200);
  const removed = await request(assign, 'PATCH', { enabled: false });
  assert.equal(removed.status, 200);
  assert.equal(removed.data.user.isAdmin, false);
  assert.equal((await request('/auth/me', 'GET', undefined, 'operator')).data.user.isAdmin, false);
  assert.equal((await request('/members/home', 'GET', undefined, 'operator')).status, 200);
  assert.equal((await request('/admin/users', 'GET', undefined, 'operator')).status, 403);
  assert.equal((await request('/board/notices', 'POST', { title: '차단 공지' }, 'operator')).status, 403);
  assert.equal((await request(`/board/notices/${notice.data.post.id}`, 'PATCH', { title: '차단 수정' }, 'operator')).status, 403);
  assert.equal((await request(`/board/posts/${id}`, 'PATCH', { title: '우회 시도', body: '내용', category: 'reports' }, 'operator')).status, 403);
  assert.equal((await request(`/board/posts/${id}`, 'DELETE', undefined, 'operator')).status, 403);
  assert.equal((await request(`${folder}/${fileId}`, 'DELETE', undefined, 'operator')).status, 403);
  assert.equal((await request(`${folder}/${fileId}/token`, 'POST', {}, 'operator')).status, 403);
  assert.equal((await request('/admin/research/results', 'PUT', payload, 'operator')).status, 403);
  assert.equal((await store.findById(master.id)).role, 'master');
});
