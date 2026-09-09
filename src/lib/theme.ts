export type ColorTheme = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'staffpath-theme';
export const THEME_CHANGE_EVENT = 'staffpath-theme';

const THEMES: ColorTheme[] = ['system', 'light', 'dark'];

export function isColorTheme(value: unknown): value is ColorTheme {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function getStoredTheme(): ColorTheme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isColorTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function resolveColorTheme(theme: ColorTheme, prefersDark = false): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') return theme;
  return prefersDark ? 'dark' : 'light';
}

export function systemPrefersDark(media: { matches: boolean } | null = null): boolean {
  if (media) return media.matches;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(theme: ColorTheme) {
  if (typeof document === 'undefined') return;
  const resolved = resolveColorTheme(theme, systemPrefersDark());
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-preference', theme);
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0c0f0d' : '#f4f3ee');
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme, resolved } }));
}

export function persistTheme(theme: ColorTheme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private browsing */
  }
  applyTheme(theme);
}

export function nextTheme(theme: ColorTheme): ColorTheme {
  return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
}
