# PRD — Zone Manager: Asosiy ilova + Admin panel

**Versiya:** 1.0 · **Sana:** 2026-08-14 · **Muallif:** Zone Manager loyihasi
**Qamrov:** barcha funksiyalar, arxitektura, ma'lumotlar modeli, xavfsizlik, testlar, cheklovlar

---

## 1. Loyiha haqida (Overview)

**Zone Manager** — billiard/sport zonalarini boshqarish tizimi. Ikki qismdan iborat:

| Qism | Papka | Port | Texnologiya |
|---|---|---|---|
| **Asosiy ilova** | `/home/oybekovic/Desktop/Zona` | `8000` | Pure HTML/CSS/JS + Supabase |
| **Admin panel** | `/home/oybekovic/Desktop/Zona-Admin` | `8080` | Node.js (dependsiz) + Supabase Management API |

Backend sifatida **Supabase** ishlatiladi: auth, PostgreSQL, Realtime — hammasi bulutda.

### 1.1 Nima qiladi (biznes maqsad)
- Har bir korxona (zona egasi) o'z hisobi bilan kiradi va **faqat o'z ma'lumotlarini** ko'radi/boshqaradi.
- Stolga sessiya ochiladi (sekundomer/taymer/budilnik), mahsulotlar qo'shiladi, sessiya yakunlanadi.
- Tizim egasi (admin) alohida paneldan **barcha foydalanuvchilarni** boshqaradi.

### 1.2 Non-goals (hozircha qilinmaydi)
- To'lov tizimlari (karta, terminal).
- Mobil ilova (faqat brauzer, lekin responsive).
- Tarmoqda (internetda) joylashtirish — hozircha faqat localhost.

---

## 2. Foydalanuvchilar va rollar

| Rol | Kirish | Imkoniyatlar |
|---|---|---|
| **Korxona egasi** | Asosiy ilova (8000) | Zonalar/stollar/mahsulotlar/sessiyalar — faqat o'z ma'lumotlari |
| **Tizim admini** | Admin panel (8080) | Barcha foydalanuvchilar, barcha jadvallar; bloklash, parol tiklash, o'chirish |

> **Muhim:** `admin@zona.uz` — bu ham oddiy foydalanuvchi (korxona egasi). Tizim admini panelga alohida `oybekovic1` login bilan kiradi (config faylda, kodda emas).

---

## 3. Arxitektura

```
Brauzer (localhost:8000)          Brauzer (localhost:8080)
   │  supabase-js (anon key)          │  fetch API
   ▼                                 ▼
Supabase buluti                Node server (server.mjs)
   ├─ Auth (GoTrue)                ├─ Statik fayllar (public/)
   ├─ PostgreSQL + RLS              ├─ HMAC token tekshiruvi
   ├─ Realtime                      └─ Management API (SQL)
   └─ Storage (hozircha yo'q)
```

**Asosiy ilova** — Supabase'ga `anon` kalit bilan to'g'ridan-to'g'ri ulanadi; RLS har bir so'rovni "bu qator egasiga tegishlimi?" deb tekshiradi.

**Admin panel** — Supabase'ga to'g'ridan-to'g'ri ulanmaydi. Server `service_role` emas, balki **Management API** (platforma access tokeni) orqali SQL ishlatadi. Bu xavfsizroq: paneldagi barcha amallar serverda logika bilan tekshiriladi.

---

## 4. Ma'lumotlar bazasi (Supabase/PostgreSQL)

### 4.1 Jadvallar (schema.sql)

```sql
-- Zona (korxona maydoni)
zones (
  id          bigint identity PK,
  name        text NOT NULL,
  owner_id    uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
)

-- Stol
tables (
  id          bigint identity PK,
  zone_id     bigint NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  name        text NOT NULL,
  sport       text DEFAULT 'billiard',   -- billiard / tennis / ...
  tariff      numeric DEFAULT 0,          -- soatlik tarif (so'm)
  repair      boolean DEFAULT false,      -- ta'mirlashda
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
)

-- Mahsulot
products (
  id          bigint identity PK,
  zone_id     bigint NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  name        text NOT NULL,
  price       numeric DEFAULT 0,
  icon        text DEFAULT 'local_bar',   -- Material Symbols ikonkasi
  sold        int DEFAULT 0,              -- sotilganlar soni
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
)

-- Sessiya (stolda vaqt)
sessions (
  id            bigint identity PK,
  table_id      bigint NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  mode          text DEFAULT 'stopwatch',  -- stopwatch / countdown / alarm
  rate          numeric,                   -- tarif (sessiya vaqtida saqlanadi)
  start_time    timestamptz DEFAULT now(),
  duration_sec  int,                       -- NULL = sessiya FAOL
  created_at    timestamptz DEFAULT now()
)

-- Sessiya mahsulotlari
session_products (
  id          bigint identity PK,
  session_id  bigint NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  product_id  bigint NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    int DEFAULT 1,
  price       numeric,                     -- mahsulot narxi (buyurtma vaqtida)
  created_at  timestamptz DEFAULT now()
)
```

**Faqat muhim logika:**
- `sessions.duration_sec = NULL` ⇔ **faol sessiya** (taymer yurib turibdi). Yakunlanganda soniya bilan to'ldiriladi.
- `session_products.price` buyurtma vaqtidagi narxni muzlatadi (keyin narx o'zgarsa ham hisob o'zgarmaydi).

### 4.2 RLS (Row Level Security) — ko'p tenatlik

Har bir jadvalda `ENABLE ROW LEVEL SECURITY` + `owner_*` policy:

| Policy | Qoida |
|---|---|
| `owner_zones` | `owner_id = auth.uid()` |
| `owner_tables` | zona egasi = joriy foydalanuvchi (exists orqali) |
| `owner_products` | zona egasi = joriy foydalanuvchi |
| `owner_sessions` | stol → zona → egasi zanjiri |
| `owner_session_products` | sessiya → stol → zona → egasi zanjiri |

**Natija:** A korxona B korxonaning hech narsasini ko'rolmaydi — SQL darajasida himoya, frontend emas. Yagona shart: policy'lar `exists` bilan yozilgani uchun **rekursiyaga tushmasligi** kerak (zanjir acyclic).

**Realtime ham RLS bilan filtrlanadi** — faqat o'z ma'lumotlari yangilanishini eshitadi.

---

## 5. Funksional talablar — Asosiy ilova (8000)

### 5.1 Auth
- **Ro'yxatdan o'tish (signup)**: Email + Parol + Parolni tasdiqlash (3 maydon).
- **Kirish (login)**: Email + Parol.
- **Rejim almashish**: login ⇄ signup — yagona tugma (`#mode-toggle`), eski "demo kirish" tugmasi o'rnida.
- **Parol ko'rsatish/yashirish**: ko'zcha tugmasi har maydonda.
- **Avtomatik konfirmatsiya**: `mailer_autoconfirm = true` — email tasdiqlashsiz darhol kirish.
- **Sessiya saqlanadi**: `localStorage` — brauzerni yopsa ham qaytib kirganda to'g'ridan-to'g'ri ichkarida.
- **Xatolar**: `userExists` → "Bu email allaqachon ro'yxatdan o'tgan"; `passTooShort`; `passMismatch`; login xatosi → umumiy "Noto'g'ri email yoki parol".
- **Logout** → login rejimiga qaytadi (signup emas).

### 5.2 Zonalar (korxona maydonlari)
- Zona yaratish, nomlash, tartiblash (sort_order).
- Bosh sahifada zonalar kartalari ko'rinadi.

### 5.3 Stollar
- Zona ichida stollar: nomi, sport turi (billiard/tennis...), soatlik tarif, ta'mirlash belgisi.
- **Ta'mirlashda** stol — sessiya ochib bo'lmaydi.

### 5.4 Mahsulotlar
- Nom, narx, ikonka (Material Symbols), sotilgan soni.

### 5.5 Sessiyalar (asosiy funksiya)
- Stolga **sessiya ochish** → DB'ga `sessions` qatori (faol).
- **3 rejim:**
  - **Stopwatch (Sekundomer)** — o'tgan vaqtni hisoblaydi. Qo'shimcha tugmalar: `+15 daqiqa`, `+30 daqiqa`.
  - **Countdown (Taymer)** — oldindan belgilangan vaqt, tugaganda signal.
  - **Alarm (Budilnik)** — ma'lum vaqtga.
- **Sessiya mahsulotlari**: sessiya davomida mahsulot qo'shish (miqdor bilan) → `session_products`.
- **Yakunlash**: `duration_sec` to'ldiriladi, sessiya yakunlanadi (to'lov hisoblanadi).
- **Bekor qilish**: sessiya o'chiriladi.
- **Reload'da tiklanish**: faol sessiyalar DB'dan qayta yuklanadi va taymer davom etadi.
- **Vibratsiya**: countdown tugasa `navigator.vibrate`.

### 5.6 Realtime
- Boshqa qurilma (xuddi shu hisob bilan) o'zgartirsa — interfeys avtomatik yangilanadi.

### 5.7 UI/UX
- **3 til**: o'zbek (`uz`), rus (`ru`), ingliz (`en`) — `i18n` obyekti app.js'da.
- **Tungi/yorug' rejim**: `data-theme="dark|light"`, barcha ranglar `--var` bilan.
- **Material Symbols** ikonkalar (Google Fonts).
- Toasts, confirm dialoglar, empty states, loading state.

---

## 6. Funksional talablar — Admin panel (8080)

### 6.1 Kirish
- Login ekran: login + parol, ko'zcha tugmasi, "Yuklanmoqda..." ekrani (token bor bo'lsa).
- Login `oybekovic1` / parol — `admin-config.json` da (gitignore qilingan, **kodda YO'Q**).
- **HMAC token**: `sha256(secret, username:exp)` → `base64url`, TTL **365 kun** (`tokenTtlDays`).
- Token `localStorage` da — brauzer yopilsa ham login saqlanadi.
- 401 bo'lsa: token tozalanadi, login ekraniga qaytadi. **Login uchun 401** → "Login yoki parol noto'g'ri" (maxsus ishlov).

### 6.2 Yuqori nav (liquid glass)
6 ta bo'lim — har biri Supabase jadvalining frontend ko'rinishi:
1. **Foydalanuvchilar** (`auth.users`)
2. **Zonalar** (`public.zones`)
3. **Stollar** (`public.tables`)
4. **Mahsulotlar** (`public.products`)
5. **Sessiyalar** (`public.sessions`)
6. **Sessiya mahsulotlari** (`public.session_products`)

Dizayn: `backdrop-filter: blur(18px)`, gradient shaffof fon, yaltiroq chegaralar, hover'da yorug'lik o'tishi, faol bo'lim ko'k rangda. Topbar ham shisha.

### 6.3 Foydalanuvchilar bo'limi
- **Statistika kartalari**: Jami, Faol, Bloklangan, Zonalar soni.
- **Qidiruv**: email bo'yicha filtr.
- **Jadval**: email, ID (qisqa), ro'yxatdan o'tgan vaqt, oxirgi kirish (Asia/Tashkent, `DD.MM.YYYY HH:MM`), holat (Faol/Bloklangan/Tasdiqlanmagan), biznes ma'lumot (zona · stol · mahsulot).
- **Amallar:**
  - **Bloklash**: `banned_until = now() + 100 yil` → kirish yopiladi.
  - **Yechish**: `banned_until = null`.
  - **Parol tiklash**: `encrypted_password = crypt('yangi', gen_salt('bf'))` — yangi parol o'rnatish.
  - **O'chirish**: user + identitetlar + zonalari/stollari/sessiyalari (cascade) — qaytarib bo'lmaydi, tasdiqlash oynasi.

> **Parollarni ko'rsatib bo'lmaydi** — Supabase bcrypt hash'da saqlaydi. Shuning uchun faqat "tiklash" bor.

### 6.4 Qolgan bo'limlar (jadval ko'rinishlari)
- Har bir bo'lim: ID, nomlar, bog'liqliklar (zona nomi, stol nomi...), vaqtlar, narxlar (`so'm` formatida).
- **O'chirish** amali: tasdiqlash oynasi → `DELETE ... WHERE id = N` (cascade).
- Sessiyalarda: faol sessiya `Faol` badge bilan, yakunlanganlari daqiqalarda.
- Har bo'limda "Yangilash" tugmasi + topbardagi global yangilash.

### 6.5 Server API (server.mjs)

| Metod | Yo'l | Vazifasi |
|---|---|---|
| POST | `/api/login` | Login tekshirish, HMAC token berish |
| GET | `/api/users` | Foydalanuvchilar + biznes ma'lumot |
| POST | `/api/users/:id/block` | Bloklash |
| POST | `/api/users/:id/unblock` | Yechish |
| POST | `/api/users/:id/password` | Parol tiklash (min 6 belgi) |
| POST | `/api/users/:id/delete` | O'chirish |
| GET | `/api/zones` `/api/tables` `/api/products` `/api/sessions` `/api/session-products` | Jadval ma'lumotlari |
| POST | `/api/:table/:id/delete` | Jadvaldan o'chirish |

---

## 7. Supabase integratsiyasi

### 7.1 Asosiy ilova
- **Client**: `supabase-js` (anon key) — frontend'da faqat anon kalit.
- **Auth config**: `mailer_autoconfirm = true`.
- **Realtime**: `postgres_changes` — RLS filtrli.

### 7.2 Admin panel (Management API)
```
POST https://api.supabase.com/v1/projects/{projectRef}/database/query
Authorization: Bearer {SUPABASE_ACCESS_TOKEN}
User-Agent: Mozilla/5.0 ... (BRAZERIYA — kerak!)
Body: { "query": "SQL ..." }
```
- **Muhim**: Cloudflare 403 bermasligi uchun `User-Agent` brauzer sifatida bo'lishi shart.
- `auth.config` jadvali yo'q → auth sozlamalari `/config/auth` (GET/PATCH) orqali.

### 7.3 Muhim qoidalar
- `service_role` kaliti frontendga hech qachon kirmaydi.
- MCP config yozilgan (`~/.config/opencode/opencode.jsonc`), restart kerak — hozircha hammasi Management API orqali.

---

## 8. Xavfsizlik

1. **RLS** — asosiy izolyatsiya (server darajasida).
2. **service_role frontendda yo'q** — faqat Management API serverda.
3. **Admin kredensiallari config faylda**, kodda yo'q, `.gitignore` da.
4. **HMAC token** — serverdan boshqa hech kim yarata olmaydi.
5. **UUID tekshiruvi** (UUID_RE) — SQL injection'ga qarshi; parol `'` dan himoyalanadi (escape).
6. **Bloklangan user** kirishda `banned_until` tufayli GoTrue rad etadi.
7. **Password policy**: kamida 6 belgi (panel), tasdiqlash (ilova).

---

## 9. Konfiguratsiya va ishga tushirish

### 9.1 Fayllar
```
Zona/
  index.html      # ilova (style.css?v=59, app.js?v=36)
  style.css
  app.js          # barcha logika + i18n (uz/ru/en)
  supabase/schema.sql

Zona-Admin/
  server.mjs           # Node server (8080)
  admin-config.json    # port, login, parol, secret, projectRef, accessToken, tokenTtlDays
  .gitignore           # admin-config.json chiqarilgan
  public/
    index.html, admin.css, admin.js
```

### 9.2 Ishga tushirish
```bash
# Asosiy ilova (8000)
cd ~/Desktop/Zona && python3 -m http.server 8000

# Admin panel (8080) — setsid bilan, terminal yopilsa ham ishlaydi
cd ~/Desktop/Zona-Admin
setsid bash -c 'exec node server.mjs' > /tmp/zona-admin-server.log 2>&1 < /dev/null &
```

> **Eslatma**: kompyuter qayta ishga tushsa, ikkala serverni ham qayta ishga tushirish kerak (systemd sozlash rejada).

### 9.3 Muhim kalitlar va joylari
| Nima | Qayerda |
|---|---|
| Supabase URL/anon key | `Zona/app.js` (anon — xavfsiz) |
| Management token (30 kunda o'chadi!) | `Zona-Admin/admin-config.json` |
| Admin login/parol | `Zona-Admin/admin-config.json` |
| HMAC secret | `Zona-Admin/admin-config.json` |

---

## 10. Test strategiyasi

**Headless Chrome CDP** (`/tmp/zona-tests/cdp.mjs`):
```bash
node cdp.mjs <profil-papka> <url> <test-script.mjs>
```
- Har test alohida brauzer profili (localStorage izolyatsiyasi).
- Eval timeout 50 soniya; `Browser.close` bilan graceful shutdown (localStorage diskka yoziladi).

| Test | Nima tekshiradi |
|---|---|
| t11 | To'liq ish jarayoni: sessiya ochish → DB, mahsulot → DB, yakunlash → DB toza, bekor qilish → DB toza |
| t13a/b | Login saqlanishi; yangi brauzer loginsiz auto-kirish, karta 4 ta, profil to'g'ri |
| t17-19 | Signup rejimi: 3 maydon, mismatch, qisqa parol, dublikat email, muvaffaqiyatli signup |
| t20 | Tungi rejim taymer chiplari rangi |
| t21-26 | Ko'p tenatlik: B korxona A ma'lumotini ko'rmaydi, RLS insert bloki, admin faqat o'zini ko'radi |
| t27-36 | Admin panel: login, ro'yxat, blok/unblok/parol/delete, CSS hidden bug, localStorage sessiya, nav bo'limlari, o'chirish amali |

---

## 11. Cheklovlar va saboqlar (muhim!)

1. **GoTrue "Database error querying schema"** — SQL bilan user yaratganda `confirmation_token` kabi ustunlar **NULL bo'lmasligi** kerak (`''` bo'lishi shart), aks holda signIn 500 beradi. **Xulosa: user'lar faqat signup/GoTrue orqali yaratiladi, raw SQL bilan emas.**
2. **`pkill -f "pattern"`** — o'z shellini ham o'ldiradi (buyruq satridagi matn ham mos keladi). **Doim PID bilan kill qiling.**
3. **CDP + `location.reload()`** — eval vaqtida reload CDP javobini buzadi; testni 2 bosqichga bo'lish kerak.
4. **`display: flex` `[hidden]` ni yengadi** — CSS'da `display` yozilsa, `hidden` atributi ishlamay qoladi (modal/login ekrani doim ko'rinib qolgan xato). Yechim: `#id[hidden] { display: none; }`.
5. **`data-del` → `dataset.del`** (not `.dataset.sec`) — atribut nomi dataset kalitiga aylanganda tirelar tushadi.
6. **Parollarni ko'rsatish mumkin emas** (bcrypt hash) — faqat tiklash.
7. **Management API User-Agent** bo'lmasa Cloudflare 403.
8. **Admin server** qo'lda ishga tushiriladi — reboot'da avtomatik emas.
9. **Supabase access tokeni 30 kunda o'chadi** — config'dan yangilash kerak.

---

## 12. Kelajak rejalari (Roadmap)

- [ ] Admin paneldan yangi foydalanuvchi yaratish (GoTrue signup orqali, raw SQL emas!)
- [ ] Systemd: ikkala serverni avtomatik ishga tushirish
- [ ] Sessiya yakunida to'lov hisoboti (PDF/CSV)
- [ ] Mahsulot ombori (qoldiq, minus balans)
- [ ] Zona egasiga SMS/email bildirishnoma
- [ ] Online joylashtirish (VPS + domain + HTTPS)
- [ ] Audit log: admin amallari tarixi
- [ ] PWA (mobil qurilmalarga o'rnatish)
- [ ] Ishchilar (xodim) rollari — faqat stolni boshqaradi, sozlamalarni emas

---

*Hujjat loyihaning barcha qismlarini qamrab oladi. Yangi o'zgarishlar kiritilganda shu hujjatni ham yangilab borish tavsiya etiladi.*
