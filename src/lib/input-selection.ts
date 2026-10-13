interface TextInput {
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
  ownerDocument: { activeElement: unknown };
  setSelectionRange: (start: number, end: number) => void;
}

// Protect the caret only when a completed edit is followed by an unexpected
// select-all. Pointer/keyboard actions invalidate the snapshot so users can
// still select, replace, and edit text normally.
export function createInputSelectionGuard() {
  let snapshot: { input: TextInput; value: string; caret: number } | undefined;
  let composing = false;
  return {
    clear() { snapshot = undefined; },
    compositionStart() { composing = true; snapshot = undefined; },
    compositionEnd() { composing = false; snapshot = undefined; },
    input(input: TextInput, isComposing: boolean) {
      snapshot = undefined;
      if (composing || isComposing || input.selectionStart === null || input.selectionStart !== input.selectionEnd) return;
      snapshot = { input, value: input.value, caret: input.selectionStart };
    },
    select(input: TextInput) {
      if (!snapshot || composing || input !== snapshot.input || input.ownerDocument.activeElement !== input
        || input.value !== snapshot.value || !input.value.length
        || input.selectionStart !== 0 || input.selectionEnd !== input.value.length) return;
      const caret = snapshot.caret;
      snapshot = undefined;
      input.setSelectionRange(caret, caret);
    },
  };
}
