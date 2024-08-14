const CACHE_NAME = 'boairx-calc-v1';
const urlsToCache = [
  '/',
  '/quitting',
  '/static/css/custom.css',
  '/static/js/offline-calculator.js',
  '/static/js/quitting-offline.js',
  '/static/images/icon-192x192.png',
  '/static/images/icon-512x512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});