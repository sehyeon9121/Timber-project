import { createApp } from '../server/app.mjs';
import { openStore } from '../server/open-store.mjs';

let appPromise;
export function siteOrigin(environment = process.env) {
  const value = environment.SITE_ORIGIN?.trim();
  const invalid = code => { throw Object.assign(new Error('SITE_ORIGIN에 사이트의 HTTPS 주소를 설정해야 합니다.'), { code }); };
  if (!value) invalid('MISSING_SITE_ORIGIN');
  let site;
  try { site = new URL(value); } catch { /* Report the field, never its value. */ }
  if (!site || site.protocol !== 'https:' || site.username || site.password) invalid('INVALID_SITE_ORIGIN');
  return site.origin;
}

async function initialize() {
  const origin = siteOrigin();
  const store = await openStore({ ...process.env, VERCEL: '1' });
  try {
    const app = await createApp(store, { origins: [origin], secureCookies: true });
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
