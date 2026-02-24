export function insertAtCursor(el: HTMLTextAreaElement, value: string) {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  el.value = el.value.slice(0, start) + value + el.value.slice(end);
  const cursor = start + value.length;
  el.setSelectionRange(cursor, cursor);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
