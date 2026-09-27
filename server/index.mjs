import express from 'express';
import { resolve } from 'node:path';
import { createApp } from './app.mjs';
import { databasePath } from './store.mjs';
import { openStore } from './open-store.mjs';

const port = Number(process.env.AUTH_PORT || 3001);
const production = process.env.NODE_ENV === 'production';
if (production && !process.env.SITE_ORIGIN?.startsWith('https://')) {
  throw new Error('운영 환경에서는 SITE_ORIGIN에 사이트의 HTTPS 주소를 지정해야 합니다.');
}
const store = await openStore();
const app = await createApp(store, {
  origins: process.env.SITE_ORIGIN ? [new URL(process.env.SITE_ORIGIN).origin] : undefined,
  secureCookies: production,
});
if (production) {
  app.use(express.static(resolve('dist')));
  app.get('/{*path}', (_request, response) => response.sendFile(resolve('dist/index.html')));
}
const server = app.listen(port, process.env.AUTH_HOST || '127.0.0.1', () => {
  console.log(`Auth server: http://127.0.0.1:${port} (DB: ${process.env.TURSO_DATABASE_URL ? 'Turso' : databasePath})`);
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `${port} 포트가 이미 사용 중입니다. 기존 서버를 종료하거나 AUTH_PORT를 변경하세요.` : error.message);
  store.close();
  process.exitCode = 1;
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  server.close(() => { store.close(); process.exit(0); });
  server.closeIdleConnections();
});
