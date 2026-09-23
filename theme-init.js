/* Tema CSS'dan oldin qo'llanadi (miltillash bo'lmasin). Alohida fayl — CSP inline skriptlarni taqiqlaydi */
try { document.documentElement.dataset.theme = localStorage.getItem('zona-theme') || 'dark'; } catch { document.documentElement.dataset.theme = 'dark'; }
