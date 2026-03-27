// ── Librario Service Worker ─────────────────────────────────────
// Gives PAID members (BASIC, STANDARD, PREMIUM) offline access
// Strategy: Cache-first for static assets, network-first for API

const CACHE_NAME     = 'librario-v1';
const OFFLINE_URL    = '/offline.html';

// Static assets to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/index.html',
];

// ── Install ────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch Strategy ─────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, or socket requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.pathname.startsWith('/api/')) {
    // API calls: network-first, fallback to cache
    event.respondWith(networkFirstWithCache(request));
    return;
  }

  // Static assets: cache-first
  event.respondWith(cacheFirstWithNetwork(request));
});

// Network first (API) — try network, fall back to cache
async function networkFirstWithCache(request) {
  try {
    const response = await fetch(request.clone());
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ error: 'You are offline. Please reconnect to access live data.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Cache first (static) — try cache, fall back to network
async function cacheFirstWithNetwork(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request.clone());
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || caches.match(OFFLINE_URL);
    }
    return new Response('Offline', { status: 503 });
  }
}
