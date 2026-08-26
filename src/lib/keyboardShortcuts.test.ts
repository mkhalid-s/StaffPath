import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initKeyboardShortcuts, FOCUS_SEARCH_EVENT } from './keyboardShortcuts';

describe('keyboardShortcuts', () => {
  let onShowHelp: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onShowHelp = vi.fn();
    window.history.pushState({}, '', '/');
  });

  it('opens help on cmd+?', () => {
    const cleanup = initKeyboardShortcuts({ onShowHelp });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '?', metaKey: true, bubbles: true }));
    expect(onShowHelp).toHaveBeenCalled();
    cleanup();
  });

  it('navigates to journal on cmd+n', () => {
    const cleanup = initKeyboardShortcuts({ onShowHelp });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', metaKey: true, bubbles: true }));
    expect(window.location.pathname).toBe('/journal');
    cleanup();
  });

  it('dispatches focus search event on cmd+k', async () => {
    const handler = vi.fn();
    window.addEventListener(FOCUS_SEARCH_EVENT, handler);
    const cleanup = initKeyboardShortcuts({ onShowHelp });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
    expect(window.location.pathname).toBe('/encyclopedia');
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(handler).toHaveBeenCalled();
    cleanup();
    window.removeEventListener(FOCUS_SEARCH_EVENT, handler);
  });
});
