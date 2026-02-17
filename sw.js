// use application version to namespace caches, so updates don't require cookie clearing
const VERSION = '0.3';
const CACHE_NAME = 'crubs-cache-v' + VERSION;
const urlsToCache = [
  '/',          // ensure root route is cached
  '.',
  'index.html',
  'manifest.json', // manifest must be cached so install works offline
  'logo.png',
  'favicon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim(); // take control immediately
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
