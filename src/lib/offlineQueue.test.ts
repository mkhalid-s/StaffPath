import { beforeEach, describe, expect, it, vi } from 'vitest';
import { enqueueAction, flushQueue, getPendingCount, getQueue } from './offlineQueue';

describe('offlineQueue', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('navigator', { ...navigator, onLine: false });
  });

  it('queues actions when offline', () => {
    enqueueAction('journal', 'Journal reflection');
    expect(getPendingCount()).toBe(1);
    expect(getQueue()[0].type).toBe('journal');
  });

  it('does not queue when online', () => {
    vi.stubGlobal('navigator', { ...navigator, onLine: true });
    enqueueAction('practice', 'Practice attempt');
    expect(getPendingCount()).toBe(0);
  });

  it('flushes queue and returns count', () => {
    enqueueAction('journal', 'Entry 1');
    enqueueAction('roadmap', 'Session 1');
    expect(flushQueue()).toBe(2);
    expect(getPendingCount()).toBe(0);
  });
});
