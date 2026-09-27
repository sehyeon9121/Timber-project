import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createApp } from './app.mjs';
import { createStore, hashPassword, verifyPassword } from './store.mjs';
import { getDevelopmentOrigins } from './origins.mjs';

test('approval-based membership and master authorization', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'timber-auth-test-'));
  const path = join(directory, 'auth.sqlite');
  const store = createStore(path);
  const password = 'Test-only-password-2026';
  const passwordHash = await hashPassword(password);
  const master = store.addUser({ name: 'Master', email: 'master@example.com', affiliation: 'Administration' }, passwordHash, 'master');
  const app = await createApp(store);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolveReady => server.once('listening', resolveReady));
  const base = `http://127.0.0.1:${server.address().port}`;
  const origin = 'http://localhost:5173';
  async function request(pathname, method = 'GET', body, cookie, siteOrigin = origin) {
    const response = await fetch(`${base}/api${pathname}`, {
      method, headers: { 'Content-Type': 'application/json', Origin: siteOrigin, ...(cookie ? { Cookie: cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie'), headers: response.headers };
  }
  let memberId;
  let memberCookie;
  let masterCookie;
  t.after(async () => {
    await new Promise(resolveClosed => { server.close(resolveClosed); server.closeAllConnections(); });
    store.close();
    // This directory is created exclusively by the fixture and is inside the OS temp directory.
    assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + '\\') || resolve(directory).startsWith(resolve(tmpdir()) + '/'));
    assert.ok(directory.includes('timber-auth-test-'));
    rmSync(directory, { recursive: true });
  });

  await t.test('anonymous access and forged cookies cannot read private APIs', async () => {
    assert.equal((await request('/auth/me')).data.user, null);
    assert.equal((await request('/members/home')).status, 401);
    assert.equal((await request('/admin/users')).status, 401);
    assert.equal((await request('/admin/users', 'GET', undefined, 'timber_session=' + '0'.repeat(64))).status, 401);
  });
  await t.test('signup validates data, hashes passwords, and ignores role/status supplied by clients', async () => {
    const invalid = await request('/auth/signup', 'POST', { name: 'A', email: 'bad', affiliation: 'Lab', password: 'short' });
    assert.equal(invalid.status, 400);
    const registered = await request('/auth/signup', 'POST', { name: 'Member', email: ' MEMBER@example.com ', affiliation: 'Research lab', password, role: 'master', status: 'approved' });
    assert.equal(registered.status, 201);
    assert.equal(registered.data.status, 'pending');
    assert.equal(registered.cookie, null);
    const user = store.findByEmail('member@example.com');
    memberId = user.id;
    assert.equal(user.role, 'member');
    assert.equal(user.status, 'pending');
    assert.notEqual(user.password_hash, password);
    assert.notEqual(user.password_hash, passwordHash);
    assert.ok(await verifyPassword(password, user.password_hash));
    assert.equal((await request('/auth/signup', 'POST', { name: 'Member', email: user.email, affiliation: user.affiliation, password })).status, 409);
  });
  await t.test('pending accounts cannot login; status is only revealed with a correct password', async () => {
    assert.equal((await request('/auth/login', 'POST', { email: 'member@example.com', password: 'incorrect' })).status, 401);
    const pending = await request('/auth/login', 'POST', { email: 'member@example.com', password });
    assert.equal(pending.status, 403);
    assert.equal(pending.data.code, 'PENDING');
    assert.equal(pending.cookie, null);
  });
  await t.test('only master can approve a pending member; returned profiles have no password hashes', async () => {
    const login = await request('/auth/login', 'POST', { email: master.email, password });
    assert.equal(login.status, 200);
    assert.match(login.cookie, /HttpOnly/i);
    assert.match(login.cookie, /SameSite=Strict/i);
    masterCookie = login.cookie.split(';')[0];
    const list = await request('/admin/users', 'GET', undefined, masterCookie);
    assert.equal(list.status, 200);
    assert.equal(list.data.users.length, 1);
    assert.ok(!('password_hash' in list.data.users[0]));
    assert.equal((await request(`/admin/users/${master.id}`, 'PATCH', { status: 'rejected' }, masterCookie)).status, 409);
    assert.equal((await request(`/admin/users/${memberId}`, 'PATCH', { status: 'approved' }, masterCookie)).status, 200);
    assert.equal(store.findById(memberId).reviewed_by, master.id);
    assert.equal((await request(`/admin/users/${memberId}`, 'PATCH', { status: 'rejected' }, masterCookie)).status, 409);
  });
  await t.test('approved members can access member APIs but cannot list or approve registrations', async () => {
    const login = await request('/auth/login', 'POST', { email: 'member@example.com', password });
    assert.equal(login.status, 200);
    memberCookie = login.cookie.split(';')[0];
    assert.equal((await request('/members/home', 'GET', undefined, memberCookie)).status, 200);
    assert.equal((await request('/auth/me', 'GET', undefined, memberCookie)).data.user.id, memberId);
    assert.equal((await request('/admin/users', 'GET', undefined, memberCookie)).status, 403);
    assert.equal((await request(`/admin/users/${memberId}`, 'PATCH', { status: 'approved' }, memberCookie)).status, 403);
    const token = memberCookie.split('=')[1];
    assert.equal(store.db.prepare('SELECT * FROM sessions WHERE token_hash = ?').get(token), undefined);
  });
  await t.test('cross-site and missing-origin mutations are rejected', async () => {
    assert.equal((await request('/auth/logout', 'POST', {}, memberCookie, 'https://untrusted.example')).status, 403);
    assert.equal((await request('/members/home', 'GET', undefined, memberCookie)).status, 200);
    const missingOrigin = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: { Cookie: memberCookie } });
    assert.equal(missingOrigin.status, 403);
  });
  await t.test('Vite network URLs are accepted while unrelated hosts and ports remain blocked', async () => {
    const developmentOrigins = getDevelopmentOrigins();
    for (const siteOrigin of developmentOrigins) {
      const result = await request('/auth/login', 'POST', { password: 123 }, undefined, siteOrigin);
      assert.equal(result.status, 400, `Expected credentials validation from ${siteOrigin}`);
      assert.equal(result.data.code, 'INVALID_CREDENTIALS');
    }
    for (const siteOrigin of ['http://localhost.attacker.example:5173', 'http://localhost:5174', 'null']) {
      const result = await request('/auth/login', 'POST', { password: 123 }, undefined, siteOrigin);
      assert.equal(result.status, 403);
      assert.equal(result.data.code, 'INVALID_ORIGIN');
    }
  });
  await t.test('rejected accounts cannot login', async () => {
    const user = store.addUser({ name: 'Rejected', email: 'rejected@example.com', affiliation: 'Research lab' }, passwordHash);
    assert.equal((await request(`/admin/users/${user.id}`, 'PATCH', { status: 'rejected' }, masterCookie)).status, 200);
    const login = await request('/auth/login', 'POST', { email: user.email, password });
    assert.equal(login.status, 403);
    assert.equal(login.data.code, 'REJECTED');
    assert.equal(login.cookie, null);
  });
  await t.test('logout and session expiry invalidate access on the server', async () => {
    assert.equal((await request('/auth/logout', 'POST', {}, memberCookie)).status, 200);
    assert.equal((await request('/members/home', 'GET', undefined, memberCookie)).status, 401);
    const login = await request('/auth/login', 'POST', { email: 'member@example.com', password });
    const cookie = login.cookie.split(';')[0];
    store.db.prepare('UPDATE sessions SET expires_at = 0 WHERE user_id = ?').run(memberId);
    assert.equal((await request('/members/home', 'GET', undefined, cookie)).status, 401);
  });
  await t.test('approval status persists when the database is reopened', () => {
    const reopened = createStore(path);
    assert.equal(reopened.findById(memberId).status, 'approved');
    assert.equal(reopened.findById(master.id).role, 'master');
    reopened.close();
  });
  await t.test('repeated authentication attempts are rate limited', async () => {
    let result;
    for (let count = 0; count < 31; count++) result = await request('/auth/login', 'POST', { password: 123 });
    assert.equal(result.status, 429);
    assert.ok(Number(result.headers.get('retry-after')) > 0);
  });
});

test('an explicitly configured site origin does not inherit development origins', async t => {
  const store = createStore(':memory:');
  const app = await createApp(store, { origins: ['https://timber.example'], secureCookies: true });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolveReady => server.once('listening', resolveReady));
  t.after(async () => {
    await new Promise(resolveClosed => { server.close(resolveClosed); server.closeAllConnections(); });
    store.close();
  });
  for (const siteOrigin of ['https://timber.example', ...getDevelopmentOrigins(), 'https://untrusted.example']) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: siteOrigin },
      body: JSON.stringify({ password: 123 }),
    });
    assert.equal(response.status, siteOrigin === 'https://timber.example' ? 400 : 403);
  }
});
