// Focus-trap primitives shared by the Project Index and work-page overlays.
// Both render into shadow DOM, so focusable elements are queried within the
// shadow root — not the document. Kept pure and DOM-only (no framework) so the
// trap logic lives in one obvious place, not duplicated per island.

const FOCUSABLE =
  'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"]),input,select,textarea';

/** Tabbable, currently-rendered elements inside a root, in document order. */
export function focusableWithin(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el.getClientRects().length > 0,
  );
}

/**
 * Keep Tab focus inside `root` (a ShadowRoot). Call from the overlay's keydown
 * handler; returns true when it handled the event. Wraps at both ends.
 */
export function trapTab(root: ShadowRoot, event: KeyboardEvent): boolean {
  if (event.key !== 'Tab') return false;
  const items = focusableWithin(root);
  if (items.length === 0) {
    event.preventDefault();
    return true;
  }
  const first = items[0]!;
  const last = items[items.length - 1]!;
  const focused = root.activeElement;
  if (event.shiftKey && focused === first) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && focused === last) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}
