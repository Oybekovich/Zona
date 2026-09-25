/* Tema CSS'dan oldin qo'llanadi (miltillash bo'lmasin). Alohida fayl — CSP inline skriptlarni taqiqlaydi.
   Mavzular: violet (Qora bordo, standart) | gold | teal | felt | light. Eski "dark" → violet. */
(function () {
  var ok = { violet: 1, gold: 1, teal: 1, felt: 1, light: 1 };
  var v = 'violet';
  try { v = localStorage.getItem('zona-theme') || 'violet'; } catch (e) {}
  if (v === 'dark') v = 'violet';
  if (!ok[v]) v = 'violet';
  document.documentElement.dataset.theme = v;
})();
