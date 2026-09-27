import { createApp } from '../server/app.mjs';
import { openStore } from '../server/open-store.mjs';

let appPromise;
async function initialize() {
  const site = new URL(process.env.SITE_ORIGIN || '');
  if (site.protocol !== 'https:') throw new Error('SITE_ORIGIN must use HTTPS.');
  const store = await openStore({ ...process.env, VERCEL: '1' });
  try {
    const app = await createApp(store, { origins: [site.origin], secureCookies: true });
    // Vercel is the trusted proxy; use its forwarded client address for rate limits.
    app.set('trust proxy', 1);
    return app;
  } catch (error) {
    store.close();
    throw error;
  }
}

export default async function handler(request, response) {
  try {
    const app = await (appPromise ??= initialize());
    app(request, response);
  } catch (error) {
    appPromise = undefined;
    console.error('Login API initialization failed:', error.code || error.name);
    response.setHeader('Cache-Control', 'no-store');
    response.statusCode = 503;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ code: 'SERVICE_UNAVAILABLE', message: '로그인 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.' }));
  }
}
