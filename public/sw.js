// ============================================================
// Service Worker — TuHojadeVida.com
// Version Gris — Estrategia: Cache First para assets + Network First para datos
// ============================================================

const CACHE_VERSION = 'v3-gris';
const STATIC_CACHE = `thv-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `thv-dynamic-${CACHE_VERSION}`;

// Assets que se cachean al instalar el SW (Shell de la app)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/icon.png',
  '/manifest.json',
];

// ─── INSTALL: pre-cachear el shell de la app ─────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE: limpiar TODAS las caches viejas ───────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
    // clients.claim() eliminado: causaba freeze en Android al transferir control
    // El SW tomará control en la siguiente carga (comportamiento estándar seguro)
  );
});

// ─── FETCH: estrategia inteligente por tipo de recurso ───────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Solicitudes a Firebase / APIs externas → siempre red (datos en tiempo real)
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('payphonetodoesposible.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('api.vercel.com')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. Navegación (HTML) → Network First con fallback a caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 3. Assets JS/CSS/fonts/images (chunks de Vite con hash) → Cache First
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
          return res;
        });
      })
    );
    return;
  }

  // 4. Resto → Stale While Revalidate
  event.respondWith(
    caches.open(DYNAMIC_CACHE).then((cache) => {
      return cache.match(request).then((cached) => {
        const networkFetch = fetch(request).then((res) => {
          cache.put(request, res.clone());
          return res;
        });
        return cached || networkFetch;
      });
    })
  );
});
