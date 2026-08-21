/* Zone Manager — Service Worker (minimal offline) */
const CACHE_NAME = 'zona-shell-v2';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/billiard.jpeg',
  '/img/table-tennis.png',
];

/* CDN fayllari (Supabase JS, Material Symbols) */
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block',
];

/* Install — app shell ni keshlash */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([...SHELL_ASSETS, ...CDN_ASSETS]).catch(err => {
        console.warn('SW: cache.addAll partial fail', err);
      });
    })
  );
  self.skipWaiting();
});

/* Activate — eski keshlarni tozalash */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Fetch — strategiya:
   - Supabase API (network) → offline'da xato qaytaradi (app xatosini ko'rsatadi)
   - App shell va CDN → cache-first
*/
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  /* Supabase API so'rovlari — doimo network (cache qilinmaydi) */
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.io')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        /* Faqat muvaffaqiyatli javoblarni keshlash */
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        /* Offline va cache'da yo'q — offline fallback */
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
