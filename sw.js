const CACHE_STATIC  = 'savee-static-v3.7.4';
const CACHE_FONTS   = 'savee-fonts-v1';
const CACHE_CDN     = 'savee-cdn-v1';

const STATIC_ASSETS = [
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png'
];

const FONT_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

const CDN_HOSTS = [
  'cdnjs.cloudflare.com'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  const keep = [CACHE_STATIC, CACHE_FONTS, CACHE_CDN];
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (FONT_HOSTS.includes(url.hostname)) {
    if (url.hostname === 'fonts.googleapis.com') {
      e.respondWith(staleWhileRevalidate(e.request, CACHE_FONTS));
    } else {
      e.respondWith(cacheFirst(e.request, CACHE_FONTS));
    }
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(cacheFirst(e.request, CACHE_CDN));
    return;
  }

  if (e.request.destination === 'document' || url.pathname.endsWith('.html')) {
    e.respondWith(networkFirstWithFallback(e.request));
    return;
  }

  if (['image','font','style','script'].includes(e.request.destination)) {
    e.respondWith(cacheFirst(e.request, CACHE_STATIC));
    return;
  }
});

function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then(cache =>
    cache.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
    })
  );
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(cache =>
    cache.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      });
      return cached || fetchPromise;
    })
  );
}

function networkFirstWithFallback(request) {
  return fetch(request)
    .then(response => {
      if (response.ok) {
        caches.open(CACHE_STATIC).then(cache => cache.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => caches.match(request).then(cached => cached || caches.match('/index.html')));
}
const CACHE_FONTS   = 'savee-fonts-v1';
const CACHE_CDN     = 'savee-cdn-v1';

const STATIC_ASSETS = [
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png'
];

const FONT_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

const CDN_HOSTS = [
  'cdnjs.cloudflare.com'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  const keep = [CACHE_STATIC, CACHE_FONTS, CACHE_CDN];
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (FONT_HOSTS.includes(url.hostname)) {
    if (url.hostname === 'fonts.googleapis.com') {
      e.respondWith(staleWhileRevalidate(e.request, CACHE_FONTS));
    } else {
      e.respondWith(cacheFirst(e.request, CACHE_FONTS));
    }
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(cacheFirst(e.request, CACHE_CDN));
    return;
  }

  if (e.request.destination === 'document' || url.pathname.endsWith('.html')) {
    e.respondWith(networkFirstWithFallback(e.request));
    return;
  }

  if (['image','font','style','script'].includes(e.request.destination)) {
    e.respondWith(cacheFirst(e.request, CACHE_STATIC));
    return;
  }
});

function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then(cache =>
    cache.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
    })
  );
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then(cache =>
    cache.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      });
      return cached || fetchPromise;
    })
  );
}

function networkFirstWithFallback(request) {
  return fetch(request)
    .then(response => {
      if (response.ok) {
        caches.open(CACHE_STATIC).then(cache => cache.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => caches.match(request).then(cached => cached || caches.match('/index.html')));
}
