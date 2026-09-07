const CACHE_VERSION = 'staffpath-v3';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const CONTENT_CACHE = `${CACHE_VERSION}-content`;

// The app deploys under vite.config.ts's base path (GitHub Pages serves it at
// /StaffPath/). The registration scope is that base, so derive every URL from
// it and the worker works at root or under a sub-path.
const BASE = new URL(self.registration.scope).pathname;

const PRECACHE = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}staffpath-icon.svg`,
];

const APP_ROUTES = [
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
  '/flashcards',
];

const CONTENT_ROUTES = APP_ROUTES.map((route) => (route === '/' ? BASE : `${BASE}${route.slice(1)}`));

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
      const shell = await cache.match(BASE) || await cache.match(`${BASE}index.html`);
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
