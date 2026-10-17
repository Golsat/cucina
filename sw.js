// Service worker: cache offline di tutta l'app. Incrementa VERSION quando modifichi i file.
const VERSION = 'cucina-1fffc70929';
const FILES = [
  './',
  './OLIVE/DASHBOARD-OLIVE.html',
  './POLLO_AL_CURRY/DASHBOARD-POLLO-AL-CURRY.html',
  './POLLO_AL_CURRY/assets/dish_final.jpg',
  './POLLO_AL_CURRY/assets/ingredients_flatlay.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rete prima (contenuti sempre aggiornati se online), cache come ripiego fuori rete.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
