import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

window.scrollTo = vi.fn();

// Vitest 4 + jsdom 30 no longer copies window.localStorage onto the test
// global, so bind it (or fall back to an in-memory Storage) before any
// module reads bare `localStorage`.
if (typeof globalThis.localStorage === 'undefined') {
  const inMemoryStorage = (): Storage => {
    const map = new Map<string, string>();
    return {
      get length() { return map.size; },
      clear: () => map.clear(),
      getItem: (key) => (map.has(key) ? map.get(key)! : null),
      key: (index) => Array.from(map.keys())[index] ?? null,
      removeItem: (key) => { map.delete(key); },
      setItem: (key, value) => { map.set(key, String(value)); },
    };
  };
  const storage = typeof window !== 'undefined' && window.localStorage
    ? window.localStorage
    : inMemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
}

afterEach(cleanup);
