import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boardPageWithArchive, boardListHref } from '../src/lib/board-api.ts';

test('activity photo records share pagination without disappearing at a full page boundary', () => {
  const archive = Array.from({ length: 3 }, (_, index) => ({ id: `activity-${index}` }));
  for (const total of [0, 19, 20, 21, 39, 40]) {
    const seen = [];
    const expectedPages = Math.max(1, Math.ceil((total + archive.length) / 20));
    for (let page = 1; page <= expectedPages; page++) {
      const offset = (page - 1) * 20;
      const posts = Array.from({ length: Math.min(20, Math.max(0, total - offset)) }, (_, index) => ({ id: total - offset - index }));
      const result = boardPageWithArchive({ posts, total, page, pageSize: 20, totalPages: Math.max(1, Math.ceil(total / 20)) }, archive);
      assert.equal(result.total, total + archive.length);
      assert.equal(result.totalPages, expectedPages);
      assert.ok(result.posts.length <= 20);
      seen.push(...result.posts.map(post => post.id));
    }
    assert.equal(seen.length, total + archive.length);
    assert.equal(new Set(seen).size, seen.length);
    assert.deepEqual(seen.slice(total), archive.map(post => post.id));
  }
});

test('activity posts return to the default board; division links stay specific', () => {
  assert.equal(boardListHref(null), '/board');
  for (const division of [1, 2, 3, 4]) assert.equal(boardListHref(division), `/board?division=${division}`);
});
