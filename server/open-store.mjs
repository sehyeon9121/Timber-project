import { createStore } from './store.mjs';

export async function openStore(environment = process.env) {
  const url = environment.TURSO_DATABASE_URL;
  const authToken = environment.TURSO_AUTH_TOKEN;
  if (url || authToken || environment.VERCEL) {
    if (!url || !authToken || !/^(libsql|https):\/\//.test(url)) {
      throw new Error('TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN을 설정해야 합니다.');
    }
    const { createRemoteStore } = await import('./remote-store.mjs');
    return createRemoteStore({ url, authToken });
  }
  return createStore(environment.AUTH_DB_PATH);
}
