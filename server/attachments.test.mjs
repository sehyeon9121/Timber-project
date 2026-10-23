import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Readable } from 'node:stream';
import { createHmac } from 'node:crypto';
import { getPayloadFromClientToken } from '@vercel/blob/client';
import { createApp } from './app.mjs';
import { createStore } from './store.mjs';
import { createRemoteStore } from './remote-store.mjs';
import { createFileStorage } from './file-storage.mjs';
import { maxFileSize } from './attachments.mjs';
import { migrateLocalStore } from './migrate-to-turso.mjs';
import { attachmentExtensions, attachmentFileError, maxAttachmentSize } from '../src/lib/attachment-files.ts';
import { validateAttachment } from './attachments.mjs';

test('file selection accepts supported document extensions and distinguishes size errors', () => {
  assert.equal(maxAttachmentSize, maxFileSize);
  for (const extension of attachmentExtensions) {
    for (const name of [`회의 자료.${extension}`, `회의 자료.${extension.toUpperCase()}`]) {
      assert.equal(attachmentFileError({ name, size: 512 }), null, name);
      assert.ok(validateAttachment({ name, size: 512 }), name);
    }
  }
  assert.equal(attachmentFileError({ name: '자료.pptx', size: maxFileSize }), null);
  assert.equal(attachmentFileError({ name: '자료.pptx', size: maxFileSize + 1 }), 'oversized');
  assert.equal(attachmentFileError({ name: '자료.hwp', size: 0 }), 'empty');
  assert.equal(attachmentFileError({ name: '자료.exe', size: 512 }), 'unsupported');
});

for (const backend of ['sqlite', 'libsql']) test(`${backend}: attachment lifecycle, permissions, limits and persistence`, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'timber-attachments-'));
  const dbPath = join(directory, 'auth.sqlite');
  const open = () => backend === 'sqlite' ? createStore(dbPath) : createRemoteStore({ url: pathToFileURL(dbPath).href });
  const store = await open();
  const storage = createFileStorage({ ATTACHMENT_DIR: join(directory, 'files') });
  const master = await store.addUser({ name: 'Master', username: 'master', email: 'master@test.example', affiliation: 'Lab' }, 'unused', 'master');
  const author = await store.addUser({ name: 'Author', username: 'author', email: 'author@test.example', affiliation: 'Lab' }, 'unused');
  const other = await store.addUser({ name: 'Other', username: 'other', email: 'other@test.example', affiliation: 'Lab' }, 'unused');
  const pending = await store.addUser({ name: 'Pending', username: 'pending', email: 'pending@test.example', affiliation: 'Lab' }, 'unused');
  await store.review(author.id, 'approved', master.id);
  await store.review(other.id, 'approved', master.id);
  const cookies = {};
  for (const user of [master, author, other, pending]) cookies[user.username] = `timber_session=${await store.createSession(user.id)}`;
  const app = await createApp(store, { fileStorage: storage });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(done => server.once('listening', done));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const request = (path, method = 'GET', body, who = 'author', origin = 'http://localhost:5173') => fetch(base + path, {
    method, headers: { Origin: origin, ...(cookies[who] ? { Cookie: cookies[who] } : {}),
      'Content-Type': Buffer.isBuffer(body) ? 'application/octet-stream' : 'application/json' },
    body: body === undefined ? undefined : Buffer.isBuffer(body) ? body : JSON.stringify(body),
  });
  async function reserve(path, name = '자료.txt', size = 6, who = 'author') {
    const response = await request(path, 'POST', { name, size }, who);
    assert.equal(response.status, 201);
    return (await response.json()).attachment;
  }
  t.after(async () => {
    await new Promise(done => { server.close(done); server.closeAllConnections(); });
    store.close();
    assert.ok(directory.startsWith(tmpdir()) && directory.includes('timber-attachments-'));
    await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  });
  const posts = [];
  for (const division of [null, 1, 2, 3, 4]) posts.push(await store.createPost({ title: 'Files', body: 'Body', division }, author.id));
  const path = `/board/posts/${posts[0].id}/attachments`;
  const file = await reserve(path);
  await t.test('members can attach in every board and download exact bytes with the original filename', async () => {
    for (const post of posts) {
      const folder = `/board/posts/${post.id}/attachments`;
      const current = post.id === posts[0].id ? file : await reserve(folder);
      assert.equal((await request(`${folder}/${current.id}/content`, 'PUT', Buffer.from('자료'))).status, 200);
      const download = await request(`${folder}/${current.id}/content`, 'GET', undefined, 'other');
      assert.equal(download.status, 200);
      assert.equal(Buffer.from(await download.arrayBuffer()).toString(), '자료');
      assert.match(download.headers.get('content-disposition'), /filename\*=UTF-8''%EC/);
      assert.match(download.headers.get('cache-control'), /no-store/);
      assert.equal(download.headers.get('x-content-type-options'), 'nosniff');
      const detail = await (await request(`/board/posts/${post.id}`)).json();
      assert.equal(detail.post.attachments[0].state, 'ready');
      assert.equal(detail.post.attachments[0].pathname, undefined);
    }
  });
  await t.test('member downloads work; anonymous and inactive users cannot read or upload; ownership stays enforced', async () => {
    for (const who of ['anonymous', 'pending']) {
      const download = await request(`${path}/${file.id}/content`, 'GET', undefined, who);
      assert.equal(download.status, 401);
      assert.equal((await download.json()).code, 'UNAUTHENTICATED');
      assert.equal((await request(path, 'POST', { name: 'a.txt', size: 1 }, who)).status, 401);
      assert.equal((await request(`${path}/${file.id}`, 'DELETE', undefined, who)).status, 401);
      assert.equal((await request(`${path}/${file.id}/content`, 'PUT', Buffer.from('자료'), who)).status, 401);
      assert.equal((await request(`${path}/${file.id}/complete`, 'POST', undefined, who)).status, 401);
    }
    for (const who of ['other', 'master']) {
      assert.equal((await request(path, 'POST', { name: 'a.txt', size: 1 }, who)).status, 403);
      assert.equal((await request(`${path}/${file.id}`, 'DELETE', undefined, who)).status, 403);
    }
    assert.equal((await request(`/board/posts/${posts[1].id}/attachments/${file.id}/content`)).status, 404);
    assert.equal((await request(path, 'POST', { name: 'a.txt', size: 1 }, 'author', 'https://evil.example')).status, 403);
  });
  await t.test('PDF, HWP and PowerPoint retain their filenames, MIME types and exact bytes', async () => {
    const post = await store.createPost({ title: 'Documents', body: 'Body', division: null }, author.id);
    const folder = `/board/posts/${post.id}/attachments`;
    for (const name of ['회의자료.pdf', '회의자료.hwp', '회의자료.hwpx', '회의자료.ppt', '회의자료.PPTX', 'meeting.pdf']) {
      const bytes = Buffer.from(`document fixture: ${name}`);
      const current = await reserve(folder, name, bytes.length);
      assert.equal((await request(`${folder}/${current.id}/content`, 'PUT', bytes)).status, 200);
      assert.equal((await request(`${folder}/${current.id}/complete`, 'POST')).status, 200);
      const download = await request(`${folder}/${current.id}/content`, 'GET', undefined, 'other');
      assert.equal(download.status, 200);
      assert.equal(download.headers.get('content-type'), validateAttachment({ name, size: bytes.length }).contentType);
      assert.equal(download.headers.get('content-length'), String(bytes.length));
      const disposition = download.headers.get('content-disposition');
      assert.match(disposition, /^attachment;/);
      if (name === 'meeting.pdf') assert.match(disposition, /filename="meeting.pdf"/);
      else assert.ok(disposition.includes(`filename*=UTF-8''${encodeURIComponent(name)}`), disposition);
      assert.match(disposition, new RegExp(`filename="[^\"]+\\.${name.split('.').at(-1)}"`));
      assert.equal(download.headers.get('content-security-policy'), "default-src 'none'; sandbox allow-downloads");
      assert.equal(download.headers.get('x-content-type-options'), 'nosniff');
      assert.deepEqual(Buffer.from(await download.arrayBuffer()), bytes);
    }
  });
  await t.test('size, extension, filename and real image signatures are checked', async () => {
    for (const input of [{ name: 'a.txt', size: 0 }, { name: 'a.txt', size: maxFileSize + 1 },
      { name: '../a.txt', size: 1 }, { name: 'a\r\n.txt', size: 1 }, { name: 'x.svg', size: 1 }, { name: 'x.html', size: 1 }]) {
      assert.equal((await request(path, 'POST', input)).status, 400);
    }
    const bad = await reserve(path, 'fake.png', 12);
    assert.equal((await request(`${path}/${bad.id}/content`, 'PUT', Buffer.alloc(12))).status, 400);
    assert.equal((await request(`${path}/${bad.id}/content`)).status, 404);
    assert.equal((await request(`${path}/${bad.id}`, 'DELETE')).status, 200);
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==', 'base64');
    const image = await reserve(path, '사진.png', png.length);
    assert.equal((await request(`${path}/${image.id}/content`, 'PUT', png)).status, 200);
    const preview = await request(`${path}/${image.id}/content?preview=1`, 'GET', undefined, 'other');
    assert.equal(preview.status, 200);
    assert.equal(preview.headers.get('content-type'), 'image/png');
    assert.match(preview.headers.get('content-disposition'), /^inline/);
    assert.equal(preview.headers.get('content-security-policy'), "default-src 'none'; sandbox");
    assert.deepEqual(Buffer.from(await preview.arrayBuffer()), png);
    assert.equal((await request(`${path}/${image.id}/complete`, 'POST')).status, 200);
  });
  await t.test('pending metadata stays private; reservations atomically enforce the ten-file limit', async () => {
    const post = await store.createPost({ title: 'Limits', body: 'Body', division: 4 }, author.id);
    const folder = `/board/posts/${post.id}/attachments`;
    const results = await Promise.all(Array.from({ length: 12 }, () => request(folder, 'POST', { name: 'a.txt', size: 1 })));
    assert.equal(results.filter(res => res.status === 201).length, 10);
    assert.equal(results.filter(res => res.status === 400).length, 2);
    const own = await (await request(`/board/posts/${post.id}`)).json();
    const member = await (await request(`/board/posts/${post.id}`, 'GET', undefined, 'other')).json();
    assert.equal(own.post.attachments.length, 10);
    assert.equal(member.post.attachments.length, 0);
    for (const who of ['anonymous', 'pending']) {
      const detail = await (await request(`/board/posts/${post.id}`, 'GET', undefined, who)).json();
      assert.equal(detail.post, undefined);
      assert.equal(detail.code, 'UNAUTHENTICATED');
      assert.equal((await request(`${folder}/${own.post.attachments[0].id}/content`, 'GET', undefined, who)).status, 401);
    }
    assert.equal((await request(`/board/posts/${post.id}`, 'DELETE')).status, 200);
    assert.equal((await store.listAttachments('posts', post.id, true)).length, 0);
  });
  await t.test('only masters attach notices; members download; parent deletion removes metadata and physical files', async () => {
    const notice = await store.createNotice({ title: 'Notice', body: 'Body' }, master.id);
    const folder = `/board/notices/${notice.id}/attachments`;
    assert.equal((await request(folder, 'POST', { name: 'a.txt', size: 6 })).status, 403);
    const current = await reserve(folder, '공지.txt', 6, 'master');
    assert.equal((await request(`${folder}/${current.id}/content`, 'PUT', Buffer.from('자료'), 'master')).status, 200);
    assert.equal((await request(`${folder}/${current.id}/content`, 'GET', undefined, 'other')).status, 200);
    assert.equal((await request(`/board/notices/${notice.id}`, 'DELETE', undefined, 'master')).status, 200);
    assert.equal(await store.findAttachment(current.id), undefined);
    assert.ok(!(await readdir(join(directory, 'files'))).includes(current.id));
    assert.equal((await request(`/board/posts/${posts[1].id}`, 'DELETE', undefined, 'master')).status, 200);
    assert.equal((await store.listAttachments('posts', posts[1].id, true)).length, 0);
  });
  await t.test('attachment metadata and content survive a second DB instance', async () => {
    const second = await open();
    try {
      const persisted = await second.findAttachment(file.id);
      assert.equal(persisted.state, 'ready');
      assert.equal((await storage.inspect(persisted)).size, 6);
    } finally { second.close(); }
  });
});

test('serverless file storage fails closed without a private Blob token', async t => {
  assert.equal(createFileStorage({ VERCEL: '1' }), null);
  assert.equal(createFileStorage({ NODE_ENV: 'production' }), null);
  const store = createStore(':memory:');
  const master = store.addUser({ name: 'Master', username: 'master', email: 'master@example.test', affiliation: 'Lab' }, 'unused', 'master');
  const post = store.createPost({ title: 'Title', body: 'Body' }, master.id);
  const cookie = `timber_session=${store.createSession(master.id)}`;
  const server = (await createApp(store, { fileStorage: null })).listen(0, '127.0.0.1');
  await new Promise(done => server.once('listening', done));
  t.after(async () => { await new Promise(done => { server.close(done); server.closeAllConnections(); }); store.close(); });
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/board/posts/${post.id}/attachments`, {
    method: 'POST', headers: { Cookie: cookie, Origin: 'http://localhost:5173', 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'a.txt', size: 1 }),
  });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'ATTACHMENT_UNAVAILABLE');
});

test('private Blob tokens are scoped; signed completion and large streamed downloads work', async t => {
  const store = createStore(':memory:');
  const master = store.addUser({ name: 'Master', username: 'master', email: 'master@example.test', affiliation: 'Lab' }, 'unused', 'master');
  const post = store.createPost({ title: 'Title', body: 'Body' }, master.id);
  const cookie = `timber_session=${store.createSession(master.id)}`;
  const objects = new Map();
  const storage = { backend: 'blob', token: 'vercel_blob_rw_teststore_testsecret',
    inspect: async file => { const bytes = objects.get(file.pathname); if (!bytes) throw new Error('Missing object'); return { size: bytes.length, contentType: file.content_type }; },
    read: async file => objects.has(file.pathname) ? Readable.from([objects.get(file.pathname)]) : null,
    remove: async file => { objects.delete(file.pathname); },
  };
  const origin = 'https://example.test';
  const server = (await createApp(store, { origins: [origin], fileStorage: storage })).listen(0, '127.0.0.1');
  await new Promise(done => server.once('listening', done));
  t.after(async () => { await new Promise(done => { server.close(done); server.closeAllConnections(); }); store.close(); });
  const url = `http://127.0.0.1:${server.address().port}/api`;
  const path = `/board/posts/${post.id}/attachments`;
  const request = (suffix, body, headers = {}) => fetch(url + suffix, { method: 'POST',
    headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  const size = 6 * 1024 * 1024;
  const reservation = await (await request(path, { name: 'large.zip', size })).json();
  const id = reservation.attachment.id;
  const event = { type: 'blob.generate-client-token', payload: { pathname: reservation.pathname, multipart: true, clientPayload: null } };
  const tokenResponse = await request(`${path}/${id}/token`, event);
  assert.equal(tokenResponse.status, 200);
  const payload = getPayloadFromClientToken((await tokenResponse.json()).clientToken);
  assert.equal(payload.pathname, reservation.pathname);
  assert.equal(payload.maximumSizeInBytes, size);
  assert.equal(payload.allowOverwrite, false);
  assert.deepEqual(payload.allowedContentTypes, ['application/zip']);
  assert.ok(payload.validUntil <= Date.now() + 15 * 60 * 1000);
  assert.equal((await request(`${path}/${id}/token`, { ...event, payload: { ...event.payload, pathname: 'unrelated/file.zip' } })).status, 400);
  assert.equal((await request(`${path}/${id}/token`, event, { Cookie: '' })).status, 401);
  assert.equal((await request(`${path}/${id}/token`, event, { Origin: 'https://evil.test' })).status, 403);
  objects.set(reservation.pathname, Buffer.alloc(size, 7));
  const completed = { type: 'blob.upload-completed', payload: { blob: { pathname: reservation.pathname }, tokenPayload: payload.onUploadCompleted.tokenPayload } };
  assert.equal((await request('/attachments/callback', completed, { Cookie: '', Origin: '' })).status, 400);
  const signature = createHmac('sha256', storage.token).update(JSON.stringify(completed)).digest('hex');
  assert.equal((await request('/attachments/callback', completed, { Cookie: '', Origin: '', 'x-vercel-signature': signature })).status, 200);
  assert.equal((await store.findAttachment(id)).state, 'ready');
  const response = await fetch(`${url}${path}/${id}/content`, { headers: { Cookie: cookie } });
  assert.equal(response.status, 200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), Buffer.alloc(size, 7));
  // A late signed completion for a deleted reservation cleans up its object.
  await store.deleteAttachment(id);
  assert.equal((await request('/attachments/callback', completed, { Cookie: '', Origin: '', 'x-vercel-signature': signature })).status, 200);
  assert.equal(objects.size, 0);
  await t.test('private Blob permits every requested document type and downloads it without redirecting', async () => {
    for (const name of ['회의자료.pdf', '회의자료.hwp', '회의자료.hwpx', '회의자료.ppt', '회의자료.pptx']) {
      const bytes = Buffer.from(`private document fixture: ${name}`);
      const reserved = await (await request(path, { name, size: bytes.length })).json();
      const documentId = reserved.attachment.id;
      const tokenResponse = await request(`${path}/${documentId}/token`, {
        type: 'blob.generate-client-token', payload: { pathname: reserved.pathname, multipart: false, clientPayload: null },
      });
      assert.equal(tokenResponse.status, 200);
      const token = getPayloadFromClientToken((await tokenResponse.json()).clientToken);
      assert.deepEqual(token.allowedContentTypes, [validateAttachment({ name, size: bytes.length }).contentType]);
      objects.set(reserved.pathname, bytes);
      assert.equal((await request(`${path}/${documentId}/complete`, {})).status, 200);
      const download = await fetch(`${url}${path}/${documentId}/content`, { headers: { Cookie: cookie }, redirect: 'manual' });
      assert.equal(download.status, 200);
      assert.equal(download.headers.get('location'), null);
      assert.equal(download.headers.get('content-type'), reserved.attachment.contentType);
      assert.ok(download.headers.get('content-disposition').includes(`filename*=UTF-8''${encodeURIComponent(name)}`));
      assert.deepEqual(Buffer.from(await download.arrayBuffer()), bytes);
    }
  });
});

test('local migration refuses attachments rather than silently losing files', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'timber-attachments-migration-'));
  const path = join(directory, 'source.sqlite');
  const store = createStore(path);
  const master = store.addUser({ name: 'Master', username: 'master', email: 'master@example.test', affiliation: 'Lab' }, 'unused', 'master');
  const post = store.createPost({ title: 'Title', body: 'Body' }, master.id);
  await store.reserveAttachment('posts', post.id, { id: 'test', name: 'a.txt', size: 1, contentType: 'text/plain', pathname: 'test/a.txt', backend: 'local' });
  t.after(async () => { store.close(); assert.ok(directory.startsWith(tmpdir()) && directory.includes('timber-attachments-migration-')); await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 }); });
  await assert.rejects(migrateLocalStore(path, {}), /첨부파일/);
  assert.equal((await store.listAttachments('posts', post.id, true)).length, 1);
});
