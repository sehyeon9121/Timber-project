import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boardPageWithArchive, boardListHref, boardPageNumbers } from '../src/lib/board-api.ts';

test('activity photo records share pagination without disappearing at a full page boundary', () => {
  const archive = Array.from({ length: 3 }, (_, index) => ({ id: `activity-${index}` }));
  for (const total of [0, 9, 10, 11, 19, 20, 21, 39, 40]) {
    const seen = [];
    const expectedPages = Math.max(1, Math.ceil((total + archive.length) / 10));
    for (let page = 1; page <= expectedPages; page++) {
      const offset = (page - 1) * 10;
      const posts = Array.from({ length: Math.min(10, Math.max(0, total - offset)) }, (_, index) => ({ id: total - offset - index }));
      const result = boardPageWithArchive({ posts, total, page, pageSize: 10, totalPages: Math.max(1, Math.ceil(total / 10)) }, archive);
      assert.equal(result.total, total + archive.length);
      assert.equal(result.totalPages, expectedPages);
      assert.ok(result.posts.length <= 10);
      seen.push(...result.posts.map(post => post.id));
    }
    assert.equal(seen.length, total + archive.length);
    assert.equal(new Set(seen).size, seen.length);
    assert.deepEqual(seen.slice(total), archive.map(post => post.id));
  }
});

test('numbered navigation stays bounded and includes the active page at either end', () => {
  assert.deepEqual(boardPageNumbers(1, 1), [1]);
  assert.deepEqual(boardPageNumbers(2, 3), [1, 2, 3]);
  assert.deepEqual(boardPageNumbers(1, 1000000), [1, 2, 3, 4, 5]);
  assert.deepEqual(boardPageNumbers(1000000, 1000000), [999996, 999997, 999998, 999999, 1000000]);
});

test('activity posts return to the default board; division links stay specific', () => {
  assert.equal(boardListHref(null), '/board');
  for (const division of [1, 2, 3, 4]) assert.equal(boardListHref(division), `/board?division=${division}`);
});
