# E2E testlar

Haqiqiy Supabase'ga tegmasdan ikkala ilovani to'liq tekshiradi:

- **Lokal PostgreSQL 16** — `supabase/schema.sql` shu yerda qo'llanadi (RLS, trigger, RPC'lar haqiqiy).
- **`mock-supabase.mjs`** — GoTrue (auth) va PostgREST'ning ilova ishlatadigan qismi + Management API emulyatori.
- **Playwright (Chromium)** — `supabase.co` so'rovlari emulyatorga yo'naltiriladi, CDN'dagi supabase-js lokal nusxadan beriladi.
- `static-server.mjs` `vercel.json` sarlavhalarini (CSP) qo'llaydi — CSP xatolari ham ushlanadi.

| Fayl | Nima tekshiradi |
|---|---|
| `test-db.mjs` | Ruxsat darvozasi (sinov/tasdiq/rad/blok), tenantlar izolyatsiyasi, RPC'lar (uzaytirish, mahsulot, yakunlash, tarix) |
| `test-app.mjs` | Ro'yxatdan o'tish → so'rov, CRUD, XSS, sessiya, 1000+ tarix, qulflash/ochilish, profil, blok |
| `test-admin.mjs` | Brute-force himoyasi, CSP, XSS, so'rovlarni tasdiqlash/rad etish, sinov muddati sozlamasi, eski amallar |

```bash
cd tests/e2e
npm install
npx playwright install chromium   # bir marta
bash run.sh                        # Zona-Admin qo'shni papkada bo'lishi kerak (yoki ADMIN_DIR=...)
```
