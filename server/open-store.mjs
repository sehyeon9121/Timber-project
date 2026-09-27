import { createStore } from './store.mjs';

export function remoteStoreOptions(environment) {
  const url = environment.TURSO_DATABASE_URL?.trim();
  const authToken = environment.TURSO_AUTH_TOKEN?.trim();
  const invalid = (code, message) => { throw Object.assign(new Error(message), { code }); };
  if (!url) invalid('MISSING_TURSO_DATABASE_URL', 'TURSO_DATABASE_URL을 설정해야 합니다.');
  if (!authToken) invalid('MISSING_TURSO_AUTH_TOKEN', 'TURSO_AUTH_TOKEN을 설정해야 합니다.');
  let parsed;
  try { parsed = new URL(url); } catch { /* Report the field, never its value. */ }
  if (!parsed || !['libsql:', 'https:'].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) {
    invalid('INVALID_TURSO_DATABASE_URL', 'TURSO_DATABASE_URL에 올바른 libsql 또는 HTTPS 주소를 입력해 주세요.');
  }
  return { url, authToken };
}

export async function openStore(environment = process.env) {
  if (environment.TURSO_DATABASE_URL || environment.TURSO_AUTH_TOKEN || environment.VERCEL) {
    const options = remoteStoreOptions(environment);
    const { createRemoteStore } = await import('./remote-store.mjs');
    return createRemoteStore(options);
  }
  return createStore(environment.AUTH_DB_PATH);
}
