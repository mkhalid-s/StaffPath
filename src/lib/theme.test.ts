import { afterEach, describe, expect, it } from 'vitest';
import {
  applyTheme,
  getStoredTheme,
  isColorTheme,
  nextTheme,
  persistTheme,
  resolveColorTheme,
  THEME_STORAGE_KEY,
} from './theme';

afterEach(() => {
  localStorage.removeItem(THEME_STORAGE_KEY);
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.colorScheme = '';
});

describe('theme preference', () => {
  it('accepts only system, light, and dark', () => {
    expect(isColorTheme('dark')).toBe(true);
    expect(isColorTheme('auto')).toBe(false);
  });

  it('resolves system from the OS preference', () => {
    expect(resolveColorTheme('system', true)).toBe('dark');
    expect(resolveColorTheme('system', false)).toBe('light');
    expect(resolveColorTheme('light', true)).toBe('light');
    expect(resolveColorTheme('dark', false)).toBe('dark');
  });

  it('cycles system → light → dark', () => {
    expect(nextTheme('system')).toBe('light');
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('system');
  });

  it('applies data-theme and persists the choice', () => {
    persistTheme('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(getStoredTheme()).toBe('dark');
  });

  it('resolves system to a concrete palette on the document', () => {
    persistTheme('light');
    applyTheme('system');
    expect(document.documentElement.getAttribute('data-theme')).toMatch(/^(light|dark)$/);
    expect(document.documentElement.getAttribute('data-theme-preference')).toBe('system');
  });
});
