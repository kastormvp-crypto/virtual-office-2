const CACHE_NAME = 'virtual-office-v11-fluid';

// Instalación rápida
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activación y LIMPIEZA TOTAL de todos los cachés antiguos para sanar los dispositivos de inmediato
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Interceptación de red sin caché (Network-First completo de navegador)
// Esto mantiene la PWA instalable pero permite que el navegador y el CDN de Vercel
// gestionen el caché de forma ultra-rápida y 100% libre de errores.
self.addEventListener('fetch', (event) => {
  // Simplemente delegar a la red, permitiendo el caché HTTP estándar del navegador
  event.respondWith(fetch(event.request));
});
