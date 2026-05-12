const CACHE_NAME = 'virtual-office-v10-ultra';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png'
];

// Instalación rápida
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activación y limpieza de basura antigua
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// ── ESTRATEGIA STALE-WHILE-REVALIDATE (Velocidad Instantánea) ──
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Solo interceptar nuestro propio dominio
  if (url.origin !== self.location.origin) return;

  // No cachear llamadas a API o Firebase
  if (url.pathname.includes('firestore') || url.pathname.includes('google')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Opción 1: Servir desde caché de inmediato
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {});

        // Devolver caché si existe, sino esperar a la red
        return cachedResponse || fetchPromise;
      });
    })
  );
});
