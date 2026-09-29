import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { hashPassword } from './store.mjs';
import { openStore } from './open-store.mjs';

const username = process.argv[2];
if (!username || !/^[A-Za-z][A-Za-z0-9_]{2,31}$/.test(username)) {
  console.error('사용법: npm run master:update -- ERS');
  process.exit(1);
}
if (!process.stdin.isTTY) {
  console.error('비밀번호를 숨겨 입력할 수 있는 대화형 터미널에서 실행해 주세요.');
  process.exit(1);
}
const silentOutput = new Writable({ write(_chunk, _encoding, callback) { callback(); } });
const terminal = createInterface({ input: process.stdin, output: silentOutput, terminal: true });
let store;
try {
  process.stdout.write('새 관리자 비밀번호 (8~128자, 입력은 표시되지 않음): ');
  const password = await terminal.question('');
  process.stdout.write('\n비밀번호 확인: ');
  const confirmation = await terminal.question('');
  process.stdout.write('\n');
  if (password !== confirmation) throw new Error('비밀번호가 일치하지 않습니다.');
  if (password.length < 8 || password.length > 128) throw new Error('비밀번호는 8~128자로 입력해 주세요.');
  store = await openStore();
  const existing = await store.findByUsername(username);
  if (existing && existing.role !== 'master') throw new Error('이미 사용 중인 아이디입니다.');
  await store.updateMasterCredentials(username, await hashPassword(password));
  console.log(`관리자 아이디와 비밀번호를 변경했습니다: ${username}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  terminal.close();
  store?.close();
}
