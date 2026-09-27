import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { hashPassword, validateRegistration } from './store.mjs';
import { openStore } from './open-store.mjs';

// Master accounts are created only from the server terminal, never from signup.
const email = process.argv[2];
const name = process.argv[3] || '마스터 관리자';
if (!email) {
  console.error('사용법: npm run master:create -- master@example.com "관리자 이름"');
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
  process.stdout.write('마스터 비밀번호 (12~128자, 입력은 표시되지 않음): ');
  const password = await terminal.question('');
  process.stdout.write('\n비밀번호 확인: ');
  const confirmation = await terminal.question('');
  process.stdout.write('\n');
  if (password !== confirmation) throw new Error('비밀번호가 일치하지 않습니다.');
  const input = validateRegistration({ name, email, affiliation: '사이트 관리', password });
  if (input.error) throw new Error(input.error);
  store = await openStore();
  if (await store.findByEmail(input.email)) throw new Error('이미 등록된 이메일입니다. 다른 이메일을 사용하세요.');
  await store.addUser(input, await hashPassword(password), 'master');
  console.log(`마스터 계정이 등록되었습니다: ${input.email}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  terminal.close();
  store?.close();
}
