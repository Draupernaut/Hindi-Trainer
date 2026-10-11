const CACHE = 'hindi-trainer-v7';
const ASSETS = [
  './', './index.html', './styles.css', './course.css', './india-theme.css', './script-trainer.css', './app.js', './quality.js', './script-trainer.js', './db.js', './srs.js',
  './data/content.js', './data/expanded-content.js', './data/curriculum.js', './data/units/u3.js', './data/units/u4.js',
  './data/units/u5.js', './data/units/u6.js', './manifest.webmanifest', './icons/icon.svg',
  './icons/icon-180.png', './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
