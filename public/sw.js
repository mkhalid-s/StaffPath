const CACHE_VERSION = 'staffpath-v2';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const CONTENT_CACHE = `${CACHE_VERSION}-content`;

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/staffpath-icon.svg',
];

const CONTENT_ROUTES = [
  '/',
  '/roadmap',
  '/practice',
  '/encyclopedia',
  '/skills',
  '/journal',
  '/coach',
  '/handbook',
  '/communication',
  '/interviews',
  '/curriculum',
  '/resources',
  '/lifecycle',
  '/settings',
];

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await cache.match('/') || await cache.match('/index.html');
      if (shell) return shell;
    }
    throw new Error('Offline');
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => undefined);
  return cached || fetchPromise || fetch(request);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate' || CONTENT_ROUTES.includes(url.pathname)) {
    event.respondWith(networkFirst(event.request, SHELL_CACHE));
    return;
  }

  if (/\.(js|css|svg|woff2?|png|webp)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event.request, CONTENT_CACHE));
    return;
  }

  event.respondWith(networkFirst(event.request, CONTENT_CACHE));
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'staffpath-sync') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'FLUSH_OFFLINE_QUEUE' }));
      }),
    );
  }
});
