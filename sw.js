/* Zone Manager — Service Worker (minimal offline) */
const CACHE_NAME = 'zona-shell-v15';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/theme-init.js',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/fonts/material-symbols-outlined.woff2',
  '/fonts/manrope-latin.woff2',
  '/fonts/manrope-latin-ext.woff2',
  '/fonts/manrope-cyrillic.woff2',
  '/fonts/sora-latin.woff2',
  '/fonts/sora-latin-ext.woff2',
];

/* CDN fayllari (Supabase JS). Ikon shrifti lokal — /fonts */
const CDN_ASSETS = [
  /* versiya qat'iy — keshda doimiy qolgani uchun '@2' kabi o'zgaruvchan manzil ishlatilmaydi */
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.0/dist/umd/supabase.js',
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
   - HTML sahifalar → network-first (yangilanishlar darhol ko'rinadi), offline'da keshdan
   - App shell va CDN → cache-first
*/
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  /* Supabase API so'rovlari — doimo network (cache qilinmaydi) */
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.io')) {
    return;
  }

  /* HTML navigatsiyalari — avval tarmoq, keyin kesh */
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(event.request).then(m => m || caches.match('/'))
      )
    );
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

/* ---------- Bildirishnomalar (Web Push): 5 daqiqa qoldi, vaqt tugadi, ruxsat, sinov muddati ---------- */
self.addEventListener('push', event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch { d = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(d.title || 'Zone Manager', {
    body: d.body || '',
    icon: '/img/icon-192.png',
    badge: '/img/favicon.png',
    tag: d.tag || 'zona',
    renotify: true,
    requireInteraction: !!d.requireInteraction,
    vibrate: d.kind === 'over' ? [300, 120, 300, 120, 600] : [200, 80, 200],
    data: { url: d.url || '/' },
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const win = list.find(w => new URL(w.url).origin === self.location.origin);
    return win ? win.focus() : self.clients.openWindow(target);
  }));
});
