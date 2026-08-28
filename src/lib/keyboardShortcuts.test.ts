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

  it('navigates to correct section on cmd+1 with section label toast', () => {
    const onToast = vi.fn();
    const cleanup = initKeyboardShortcuts({ onShowHelp, onToast });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', metaKey: true, bubbles: true }));
    expect(window.location.pathname).toBe('/');
    expect(onToast).toHaveBeenCalledWith('Today');
    cleanup();
  });

  it('navigates to interviews on cmd+i', () => {
    const onToast = vi.fn();
    const cleanup = initKeyboardShortcuts({ onShowHelp, onToast });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', metaKey: true, bubbles: true }));
    expect(window.location.pathname).toBe('/interviews');
    expect(onToast).toHaveBeenCalledWith('Interview Studio');
    cleanup();
  });

  it('navigates to communication on cmd+m', () => {
    const onToast = vi.fn();
    const cleanup = initKeyboardShortcuts({ onShowHelp, onToast });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', metaKey: true, bubbles: true }));
    expect(window.location.pathname).toBe('/communication');
    expect(onToast).toHaveBeenCalledWith('Communication Gym');
    cleanup();
  });

  it('navigates to handbook on cmd+h', () => {
    const onToast = vi.fn();
    const cleanup = initKeyboardShortcuts({ onShowHelp, onToast });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', metaKey: true, bubbles: true }));
    expect(window.location.pathname).toBe('/handbook');
    expect(onToast).toHaveBeenCalledWith('Handbook');
    cleanup();
  });

  it('navigates to settings on cmd+comma', () => {
    const onToast = vi.fn();
    const cleanup = initKeyboardShortcuts({ onShowHelp, onToast });
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ',', metaKey: true, bubbles: true }));
    expect(window.location.pathname).toBe('/settings');
    expect(onToast).toHaveBeenCalledWith('Settings');
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
