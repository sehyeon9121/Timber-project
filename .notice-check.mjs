import express from 'express';
import { resolve, join } from 'node:path';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { createApp } from './server/app.mjs';
import { createStore, hashPassword } from './server/store.mjs';
import { createFileStorage } from './server/file-storage.mjs';

const directory = await mkdtemp(join(tmpdir(), 'timber-notice-cards-'));
const store = createStore(':memory:');
const password = await hashPassword('Notice-check-2026!');
const master = store.addUser({ name: '카드 검증', username: 'noticecheck', email: 'notice@example.test', affiliation: 'Test' }, password, 'master');
const member = store.addUser({ name: '회원 검증', username: 'membercheck', email: 'member@example.test', affiliation: 'Test' }, password);
store.review(member.id, 'approved', master.id);
const storage = createFileStorage({ ATTACHMENT_DIR: join(directory, 'files') });
for (const [title, image] of [['참여기관 협력 네트워크 안내', 'Net.jpg'], ['목구조 대공간 연구단 운영 안내', 'test-homepage.jpg']]) {
  const post = store.createNotice({ title, body: '', pinned: false }, master.id);
  const bytes = await readFile(resolve('public/images/leeseunglab', image));
  const attachment = await store.reserveAttachment('notices', post.id, { id: randomUUID(), name: image, size: bytes.length, contentType: 'image/jpeg', pathname: image, backend: 'local' });
  await storage.write(attachment, bytes);
  await store.readyAttachment(attachment.id);
}
const app = await createApp(store, { origins: ['http://localhost:5192'], fileStorage: storage });
app.use(express.static(resolve('dist')));
app.get('/{*path}', (_request, response) => response.sendFile(resolve('dist/index.html')));
const server = app.listen(5192, '127.0.0.1', () => console.log(JSON.stringify({ port: 5192, directory })));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => {
  server.closeAllConnections(); server.close(); store.close();
  if (!directory.startsWith(tmpdir()) || !directory.includes('timber-notice-cards-')) throw new Error('Unexpected test path');
  await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  process.exit(0);
});
