import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createStore } from './store.mjs';
import { createRemoteStore } from './remote-store.mjs';
import { createApp } from './app.mjs';
import { reportingDate, validateResearchResults } from './research-results.mjs';
import defaults from '../shared/research-results-defaults.json' with { type: 'json' };

function payload(result) {
  return { year: result.year, asOfDate: result.asOfDate ?? '', revision: result.revision,
    items: Object.fromEntries(result.groups.flatMap(group => group.items).map(item => [item.id, {
      first: item.first, second: item.second, completed: item.completed,
      annualPlan: item.annualPlan, annualCompleted: item.annualCompleted,
    }])),
  };
}

test('result validation checks integer counts, dates, years, indicator IDs, and cumulative totals', () => {
  const input = payload({ ...defaults, revision: 0 });
  assert.ok(validateResearchResults(input));
  for (const change of [{ year: 2025 }, { year: 2031 }, { revision: -1 }, { asOfDate: '2026-02-30' }, { asOfDate: null }]) {
    assert.equal(validateResearchResults({ ...input, ...change }), null);
  }
  for (const [field, value] of [['first', null], ['first', -1], ['second', 1.5], ['completed', '1'], ['annualPlan', 1000001], ['completed', 0]]) {
    const next = structuredClone(input);
    next.items.scie[field] = value;
    assert.equal(validateResearchResults(next), null);
  }
  const missing = structuredClone(input); delete missing.items.scie;
  assert.equal(validateResearchResults(missing), null);
  missing.items.unknown = input.items.scie;
  assert.equal(validateResearchResults(missing), null);
  const valid = structuredClone(input);
  valid.asOfDate = '2028-02-29'; valid.items.scie.annualPlan = 0;
  assert.ok(validateResearchResults(valid));
});

for (const backend of ['sqlite', 'libsql']) test(`${backend}: administrators publish persistent research results with a reporting date`, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'timber-results-test-'));
  const path = join(directory, 'results.sqlite');
  const open = () => backend === 'sqlite' ? createStore(path) : createRemoteStore({ url: pathToFileURL(path).href });
  const store = await open();
  const master = await store.addUser({ name: 'Master', username: 'master', email: 'master@example.test', affiliation: 'Lab' }, 'private-hash', 'master');
  const member = await store.addUser({ name: 'Member', username: 'member', email: 'member@example.test', affiliation: 'Lab' }, 'private-hash');
  await store.review(member.id, 'approved', master.id);
  const masterCookie = `timber_session=${await store.createSession(master.id)}`;
  const memberCookie = `timber_session=${await store.createSession(member.id)}`;
  const post = await store.createPost({ title: 'Preserve this post', body: 'Unchanged', division: 2 }, member.id);
  const notice = await store.createNotice({ title: 'Preserve this notice', body: 'Unchanged', pinned: true }, master.id);
  const server = (await createApp(store)).listen(0, '127.0.0.1');
  await new Promise(done => server.once('listening', done));
  t.after(async () => {
    await new Promise(done => { server.close(done); server.closeAllConnections(); });
    store.close();
    assert.ok(resolve(directory).startsWith(resolve(tmpdir())) && directory.includes('timber-results-test-'));
    await rm(directory, { recursive: true, maxRetries: 10, retryDelay: 100 });
  });
  async function request(body, cookie, origin = 'http://localhost:5173') {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api${body ? '/admin/research/results' : '/research/results'}`, {
      method: body ? 'PUT' : 'GET', headers: { Origin: origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: response.status, data: await response.json() };
  }
  const initial = await request();
  assert.equal(initial.status, 200);
  assert.equal(initial.data.revision, 0);
  assert.equal(initial.data.asOfDate, null);
  assert.equal(initial.data.groups.flatMap(group => group.items).length, 12);
  assert.equal(initial.data.groups[0].items[0].annualPlan, 1);
  assert.equal(initial.data.groups[0].items[0].annualCompleted, 1);
  const input = payload(initial.data);
  assert.equal((await request(input)).status, 401);
  assert.equal((await request(input, memberCookie)).status, 403);
  assert.equal((await request(input, masterCookie, 'https://untrusted.example')).status, 403);
  assert.equal((await request({ ...input, asOfDate: '2026-02-30' }, masterCookie)).status, 400);
  input.items.software.completed = 0;
  const saved = await request(input, masterCookie);
  assert.equal(saved.status, 200);
  assert.equal(saved.data.asOfDate, reportingDate());
  assert.equal(saved.data.revision, 1);
  assert.ok(saved.data.updatedAt);
  assert.deepEqual((await request()).data, saved.data);
  assert.ok(!JSON.stringify(saved.data).includes('private-hash'));
  assert.ok(!('updatedBy' in saved.data));
  assert.equal(saved.data.groups[0].items.find(item => item.id === 'software').completed, 0);
  assert.equal(saved.data.groups[0].items.find(item => item.id === 'standards').completed, null);
  assert.equal((await request(input, masterCookie)).status, 409);
  const changes = payload(saved.data); changes.asOfDate = '2026-10-01'; changes.items.scie.first = 40;
  const competing = await Promise.all([request(changes, masterCookie), request(changes, masterCookie)]);
  assert.deepEqual(competing.map(result => result.status).sort(), [200, 409]);
  const latest = (await request()).data;
  assert.equal(latest.revision, 2);
  assert.equal(latest.asOfDate, '2026-10-01');
  assert.equal(latest.groups[0].items[0].first, 40);
  const reopened = await open();
  try {
    assert.deepEqual(await reopened.getResearchResults(), latest);
    assert.equal((await reopened.findPost(post.id)).body, 'Unchanged');
    assert.equal((await reopened.findNotice(notice.id)).pinned, 1);
    assert.equal((await reopened.findById(master.id)).password_hash, 'private-hash');
  } finally { reopened.close(); }
  await store.deleteSession(masterCookie.split('=')[1]);
  assert.equal((await request(payload(latest), masterCookie)).status, 401);
});
