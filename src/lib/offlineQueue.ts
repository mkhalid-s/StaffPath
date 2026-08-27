import { useSyncExternalStore } from 'react';

export type QueuedActionType = 'journal' | 'practice' | 'roadmap';

export interface QueuedAction {
  id: string;
  type: QueuedActionType;
  label: string;
  createdAt: string;
}

const QUEUE_KEY = 'staffpath-offline-queue';
const listeners = new Set<() => void>();

function readQueue(): QueuedAction[] {
  try {
    const value = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedAction[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    /* Storage full — queue stays in memory for this session. */
  }
  listeners.forEach((listener) => listener());
}

export function isOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function getPendingCount(): number {
  return readQueue().length;
}

export function getQueue(): QueuedAction[] {
  return readQueue();
}

export function enqueueAction(type: QueuedActionType, label: string): void {
  if (isOnline()) return;
  const queue = readQueue();
  queue.push({ id: crypto.randomUUID(), type, label, createdAt: new Date().toISOString() });
  writeQueue(queue);
  registerBackgroundSync();
}

export function clearQueue(): void {
  writeQueue([]);
}

export function flushQueue(): number {
  const count = readQueue().length;
  clearQueue();
  return count;
}

function registerBackgroundSync() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready
    .then((registration) => {
      if ('sync' in registration) {
        return (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register('staffpath-sync');
      }
    })
    .catch(() => undefined);
}

export function subscribeQueue(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOnlineStatus(): boolean {
  if (typeof window === 'undefined') return true;
  return useSyncExternalStore(
    (callback) => {
      const handler = () => callback();
      window.addEventListener('online', handler);
      window.addEventListener('offline', handler);
      return () => {
        window.removeEventListener('online', handler);
        window.removeEventListener('offline', handler);
      };
    },
    () => navigator.onLine,
    () => true,
  );
}

export function usePendingQueueCount(): number {
  return useSyncExternalStore(subscribeQueue, getPendingCount, () => 0);
}

export function initOfflineSync(onFlush?: (count: number) => void): () => void {
  const handleOnline = () => {
    const flushed = flushQueue();
    if (flushed > 0) onFlush?.(flushed);
  };
  window.addEventListener('online', handleOnline);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'FLUSH_OFFLINE_QUEUE') handleOnline();
    });
  }

  return () => window.removeEventListener('online', handleOnline);
}
