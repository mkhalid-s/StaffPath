import { navigate } from './router';

export const FOCUS_SEARCH_EVENT = 'staffpath:focus-search';
export const SHOW_SHORTCUTS_EVENT = 'staffpath:show-shortcuts';

export interface ShortcutDefinition {
  keys: string;
  label: string;
  description: string;
}

export const SHORTCUTS: ShortcutDefinition[] = [
  { keys: '⌘ K', label: 'Search', description: 'Open encyclopedia search' },
  { keys: '⌘ 1–8', label: 'Navigate', description: 'Jump to main sections' },
  { keys: '⌘ N', label: 'New journal', description: 'Open journal for a new entry' },
  { keys: '⌘ R', label: 'Roadmap', description: 'Start today\'s roadmap session' },
  { keys: '⌘ ?', label: 'Shortcuts', description: 'Show this help overlay' },
];

const NAV_SHORTCUTS = ['/', '/coach', '/roadmap', '/curriculum', '/practice', '/encyclopedia', '/resources', '/lifecycle'] as const;

export interface ShortcutHandlers {
  onShowHelp: () => void;
  onToast?: (message: string) => void;
}

function isMod(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function initKeyboardShortcuts(handlers: ShortcutHandlers): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (isTypingTarget(event.target) && !isMod(event)) return;

    if (isMod(event) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      navigate('/encyclopedia');
      window.setTimeout(() => window.dispatchEvent(new Event(FOCUS_SEARCH_EVENT)), 50);
      handlers.onToast?.('Search');
      return;
    }

    if (isMod(event) && event.key === '?') {
      event.preventDefault();
      handlers.onShowHelp();
      return;
    }

    if (isMod(event) && event.key.toLowerCase() === 'n') {
      event.preventDefault();
      navigate('/journal');
      handlers.onToast?.('New journal entry');
      return;
    }

    if (isMod(event) && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      navigate('/roadmap');
      handlers.onToast?.('Roadmap session');
      return;
    }

    if (isMod(event) && /^[1-8]$/.test(event.key)) {
      event.preventDefault();
      const index = Number(event.key) - 1;
      const path = NAV_SHORTCUTS[index];
      if (path) {
        navigate(path);
        handlers.onToast?.(`Section ${event.key}`);
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}
