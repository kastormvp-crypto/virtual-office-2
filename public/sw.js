const CACHE_NAME = 'virtual-office-v8';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Solo borrar caches ANTIGUOS, preservar el actual
  // NOTA: clients.claim() eliminado — causaba toma de control agresiva
  // que producía pantallas en blanco al actualizar el SW
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // NO llamamos clients.claim() — el SW toma control en la siguiente carga
  // esto evita interrumpir navegaciones en curso
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Solo interceptar peticiones del mismo origen
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate para assets de Vite (JS/CSS con hash)
  // Sirve desde cache instantáneamente, actualiza en background
  if (url.pathname.startsWith('/assets/') && event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cached);
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Network-first para HTML y todo lo demás
  // Si falla la red, servir desde cache como fallback
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Guardar copia en cache si es una respuesta válida
          if (response && response.ok && ASSETS_TO_CACHE.includes(url.pathname)) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
