/* Palitra va rejim CSS'dan oldin qo'llanadi (miltillash bo'lmasin). Alohida fayl — CSP inline skriptlarni taqiqlaydi.
   Palitralar: platinum | lime | emerald | sapphire (standart) | arctic | lavender. Rejim: dark | light
   (birinchi ochilishda — tizim sozlamasi, prefers-color-scheme). */
(function () {
  var ok = { platinum: 1, lime: 1, emerald: 1, sapphire: 1, arctic: 1, lavender: 1 };
  var p = null, m = null;
  try {
    p = localStorage.getItem('zona.palette');
    m = localStorage.getItem('zona.mode');
    localStorage.removeItem('zona-theme');
  } catch (e) {}
  if (!ok[p]) p = 'sapphire';
  if (m !== 'dark' && m !== 'light') {
    m = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  var h = document.documentElement;
  h.dataset.palette = p;
  h.dataset.mode = m;
})();
