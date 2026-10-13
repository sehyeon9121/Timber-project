import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInputSelectionGuard } from './input-selection.ts';

function input(value = 'abcd', caret = value.length) {
  const field = { value, selectionStart: caret, selectionEnd: caret,
    ownerDocument: { activeElement: null },
    setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; },
  };
  field.ownerDocument.activeElement = field;
  return field;
}
function selectAll(field) { field.selectionStart = 0; field.selectionEnd = field.value.length; }

test('unexpected select-all after an edit restores the actual caret, including mid-word edits', () => {
  for (const caret of [2, 4]) {
    const field = input('abcd', caret);
    const guard = createInputSelectionGuard();
    guard.input(field, false);
    selectAll(field);
    guard.select(field);
    assert.equal(field.selectionStart, caret);
    assert.equal(field.selectionEnd, caret);
    assert.equal(field.value, 'abcd');
  }
});
test('intentional keyboard/pointer selection is preserved, as are partial selections', () => {
  const field = input();
  const guard = createInputSelectionGuard();
  guard.input(field, false);
  field.selectionStart = 1;
  field.selectionEnd = 3;
  guard.select(field);
  assert.equal(field.selectionStart, 1);
  assert.equal(field.selectionEnd, 3);
  guard.clear(); // keydown (Ctrl+A/arrows) or pointerdown
  selectAll(field);
  guard.select(field);
  assert.equal(field.selectionStart, 0);
  assert.equal(field.selectionEnd, 4);
});
test('Korean IME composition and the committed text selection are left to the browser', () => {
  const field = input('한글', 2);
  const guard = createInputSelectionGuard();
  guard.compositionStart();
  guard.input(field, false);
  selectAll(field);
  guard.select(field);
  assert.equal(field.selectionStart, 0);
  guard.compositionEnd();
  guard.select(field);
  assert.equal(field.selectionStart, 0);
  field.selectionStart = field.selectionEnd = 2;
  guard.input(field, true);
  selectAll(field);
  guard.select(field);
  assert.equal(field.selectionStart, 0);
});
test('autofill, focus changes, and input types without a selection API are not overwritten', () => {
  const field = input();
  const guard = createInputSelectionGuard();
  guard.input(field, false);
  field.value = 'autofilled';
  selectAll(field);
  guard.select(field);
  assert.equal(field.selectionStart, 0);
  const email = input('a@example.test');
  email.selectionStart = email.selectionEnd = null;
  guard.input(email, false);
  guard.select(email);
  assert.equal(email.selectionStart, null);
  field.selectionStart = field.selectionEnd = 2;
  guard.input(field, false);
  field.ownerDocument.activeElement = null;
  selectAll(field);
  guard.select(field);
  assert.equal(field.selectionStart, 0);
});
