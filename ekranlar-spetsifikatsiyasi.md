# To'liq ekran spetsifikatsiyasi — Zone Manager

Ushbu hujjat loyihaning **har bir ekrani va oynasini** (login'dan tortib kichik alert oynalargacha) tafsilotlar bilan tasvirlaydi. Stitch AI'da to'liq dizaynni qurish uchun asos sifatida ishlating.

**Bu bosqichda kelishilgan o'zgarishlar (avvalgi dizayn ko'rib chiqilgandan keyin):**
- Pastki navigatsiya 4 tadan **3 taga** tushirildi: Asosiy, Statistika, Profil (Zonalar boshqaruvi Profil ichiga ko'chirildi)
- Sessiya boshlash oynasida davomiylik tanlash faqat "Taymer" rejimida ko'rinadi
- Statistika ekrani maksimal soddalashtirildi (trend foizlari, ortiqcha bo'linmalar olib tashlandi)
- "+15 daq / +30 daq" tezkor uzaytirish funksiyasi rasman qo'shildi

---

## 0. Umumiy navigatsiya tuzilmasi

```
Login ekrani
  └─ Asosiy (Home) ─── pastki tab 1
       ├─ Sessiya boshlash oynasi (modal)
       ├─ Faol sessiya paneli (modal)
       │    └─ Sessiyani yakunlash tasdiqlash oynasi (alert)
       │    └─ Sessiyani bekor qilish tasdiqlash oynasi (alert)
  └─ Statistika ─── pastki tab 2
  └─ Profil ─── pastki tab 3
       ├─ Zonalar va Stollar boshqaruvi
       │    ├─ Zona qo'shish/tahrirlash oynasi
       │    └─ Stol qo'shish/tahrirlash oynasi
       │    └─ O'chirish tasdiqlash oynasi (alert)
       ├─ Mahsulotlar boshqaruvi
       │    ├─ Mahsulot qo'shish/tahrirlash oynasi
       │    └─ O'chirish tasdiqlash oynasi (alert)
       └─ Chiqish (Logout) tasdiqlash oynasi (alert)
```

Pastki tab bar barcha asosiy ekranlarda doimiy ko'rinadi (Login'dan tashqari): **Asosiy | Statistika | Profil**

---

## 1. LOGIN EKRANI

**Maqsad:** Admin tizimga kirishi.

**Elementlar:**
- Markazda oddiy forma: logotip/nom joyi (hozircha matn: "Zone Manager"), ostida qisqa tagline (masalan "Zonangizni boshqaring")
- Ikkita input maydon: "Login" va "Parol" (parol maydonida ko'z ikonkasi — ko'rsatish/yashirish)
- Bitta katta tugma: "Kirish" (to'liq kenglikda, asosiy rang)
- Xato holatida: input ostida qizil matn "Login yoki parol noto'g'ri"
- Yuklanish holatida: tugma ichida kichik spinner, matn "Kirish..." ga o'zgaradi

**Holatlar:**
- Bo'sh maydon bilan "Kirish" bosilsa → tegishli maydon ostida "Bu maydon to'ldirilishi shart" degan qizil matn chiqadi
- Muvaffaqiyatli kirish → to'g'ridan-to'g'ri Asosiy ekranga o'tadi

*(MVP'da faqat 1 ta Admin hisobi bo'lgani uchun "Ro'yxatdan o'tish" yoki "Parolni unutdim" tugmalari kerak emas — bular keyingi bosqichga qoldiriladi.)*

---

## 2. ASOSIY EKRAN (Home)

**Maqsad:** Barcha stollarni bir qarashda ko'rish va sessiya boshlash/boshqarish.

**Yuqori qism (header):**
- Chapda: joriy zona nomi yoki "Barchasi" (agar bir nechta zona bo'lsa, gorizontal skroll qiladigan kichik tab-chiplar: "Barchasi / Billiard zali / Tennis kortlari")
- O'ngda: qidiruv ikonkasi (ixtiyoriy, stol nomi bo'yicha qidirish)

**Asosiy qism — stol kartalari (grid, 2 ustun mobil, 4-5 ustun desktop):**

Har bir karta 3 holatdan birida bo'ladi:

1. **Bo'sh (yashil)**
   - Stol nomi yuqorida
   - Markazda katta doira ichida play (▶) ikonka
   - Matn: "Boshlash uchun bosing"
   - Bosilsa → Sessiya boshlash oynasi ochiladi

2. **Band (qizil)**
   - Stol nomi + "BAND" belgisi
   - Katta, qalin taymer (masalan "42:15")
   - Pastda: "Joriy hisob: 24,500 so'm"
   - Bosilsa → Faol sessiya paneli ochiladi

3. **Vaqt tugayapti (sariq/amber) — countdown rejimida oxirgi 5 daqiqa**
   - Xuddi "Band" kabi, lekin ramka/rang sariq, va son atrofida ozayib boruvchi doira (progress ring)

**Pastki navigatsiya:** Asosiy | Statistika | Profil (3 ta tab, hozirda "Asosiy" faol)

**Bo'sh holat (hech qanday stol yo'q bo'lsa — birinchi marta ochilganda):**
- Markazda oddiy illyustratsiya/ikonka, matn: "Hali stol qo'shilmagan" va tugma: "Birinchi stolni qo'shish" → Profil > Zonalar bo'limiga yo'naltiradi

---

## 3. SESSIYANI BOSHLASH OYNASI (modal/bottom-sheet)

**Ochilish:** Bo'sh stol kartasiga bosilganda.

**Elementlar:**
- Sarlavha: "Sessiyani boshlash" + kichik matnda stol nomi (masalan "Stol 3")
- Yopish (X) tugmasi yuqori o'ngda
- Ikki tugmali segment: **"Sekundomer"** / **"Taymer"** (default: Sekundomer tanlangan)

**Agar "Sekundomer" tanlansa:**
- Davomiylik bo'limi **ko'rinmaydi** (chunki ochiq vaqt, oldindan belgilanmaydi)
- Faqat tarif ko'rsatiladi: "Narxi: 25,000 so'm/soat"
- Pastda katta tugma: "Sessiyani boshlash"

**Agar "Taymer" tanlansa:**
- "Davomiylikni belgilash" bo'limi ko'rinadi: markazda katta son (masalan "45 daqiqa"), yon tomonlarida − va + tugmalari (15 daqiqalik qadam bilan)
- Tez tanlash tugmalari: "+15d / +30d / +1soat"
- Tarif ko'rsatiladi: "Narxi: 25,000 so'm/soat"
- Pastda katta tugma: "Sessiyani boshlash"

**Bosilgandan keyin:** Oyna yopiladi, stol kartasi darhol "Band" holatiga o'tadi va taymer 0'dan (yoki belgilangan vaqtdan) boshlanadi. Qo'shimcha tasdiqlash oynasi kerak emas — bu tez-tez bajariladigan oddiy amal.

---

## 4. FAOL SESSIYA PANELI (modal/bottom-sheet)

**Ochilish:** Band yoki "vaqt tugayapti" holatidagi stol kartasiga bosilganda.

**Yuqori qism:**
- Sarlavha: stol nomi (masalan "Stol 5") + yopish (X)
- Katta status-doira: markazida jonli taymer (masalan "42:15"), pastida kichik matn "QOLGAN VAQT" (countdown uchun) yoki "O'TGAN VAQT" (sekundomer uchun)
- Countdown rejimida: doira atrofida progress-ring, vaqt kamayishi bilan ring ham qisqaradi
- Ikkita kichik tugma doira ostida (faqat countdown rejimida ko'rinadi): "+15 daq" / "+30 daq" — bosilganda darhol qolgan vaqtga qo'shiladi, hech qanday tasdiqlash so'ralmaydi

**O'rta qism — Tezkor qo'shish:**
- Sarlavha: "Tezkor qo'shish"
- Shu zonaning eng ko'p sotiladigan 2-4 mahsuloti tugma sifatida ko'rinadi (masalan "Choy +", "Suv +") — bosilganda darhol 1 dona qo'shiladi
- "Barcha mahsulotlar" havolasi — to'liq ro'yxatni ochadi (agar tezkor tugmalarda yo'q mahsulot kerak bo'lsa)

**Pastki qism — Joriy buyurtma:**
- Sarlavha: "Joriy buyurtma" + "Tahrirlash" havolasi (qo'shilgan mahsulotlar sonini o'zgartirish/o'chirish uchun)
- Ro'yxat: har bir qator — "Sessiya vaqti (1 soat) — Tarif: 15,000 so'm/soat — 15,000 so'm", "Ko'k choy ×1 — 7,000 so'm" va h.k.
- Jami: "Jami: 22,000 so'm" (qalin, katta)

**Eng pastda — 2 ta tugma:**
- Katta qizil/asosiy tugma: **"Sessiyani yakunlash va to'lash"**
- Kichik ikkinchi darajali tugma: **"Sessiyani bekor qilish"**

---

## 5. SESSIYANI YAKUNLASH — TASDIQLASH OYNASI (alert)

**Ochilish:** "Sessiyani yakunlash va to'lash" bosilganda.

**Elementlar:**
- Sarlavha: "Sessiyani yakunlaysizmi?"
- Yakuniy hisob-kitob to'liq ko'rsatiladi: "Stol vaqti: 15,000 so'm" + "Mahsulotlar: 7,000 so'm" = **"Jami: 22,000 so'm"**
- Ikkita tugma yonma-yon: "Bekor qilish" (oddiy) va "Tasdiqlash" (asosiy rang, qalin)
- Tasdiqlangandan so'ng: stol "Bo'sh" holatiga qaytadi, panel yopiladi, ekran pastida qisqa muddatli xabar (toast) chiqadi: "Sessiya yakunlandi — 22,000 so'm"

---

## 6. SESSIYANI BEKOR QILISH — TASDIQLASH OYNASI (alert)

**Ochilish:** "Sessiyani bekor qilish" bosilganda.

**Elementlar:**
- Sarlavha: "Sessiyani bekor qilasizmi?"
- Ogohlantiruvchi matn (qizil/amber rangda): "Bu amal qaytarilmaydi. Sessiya o'chiriladi va hisoblanmaydi."
- Ikkita tugma: "Yo'q, qaytish" (oddiy, default fokus) va "Ha, bekor qilish" (qizil, xavfli amal rangida)

---

## 7. STATISTIKA EKRANI (maksimal soddalashtirilgan)

**Maqsad:** Daromadni tez va aniq ko'rish — ortiqcha grafik/dekоratsiyasiz.

**Yuqori qism:**
- Sarlavha: "Statistika"
- Sana filtri: 3 ta tab — "Bugun / Hafta / Oy"

**Asosiy raqam (eng katta, markaziy e'tibor):**
- Bitta katta karta: "Umumiy tushum" — juda katta, qalin son (masalan "14,285,000 so'm")
- Uning tagida, kichikroq matn bilan oddiy taqsimot: "Stol vaqtidan: 8,570,000 so'm  ·  Mahsulotdan: 5,715,000 so'm" (bitta qatorda, trend foizlari/o'q belgilarisiz — faqat sof raqamlar)

**Kunlik daromad grafigi:**
- Oddiy ustunli (bar) diagramma, hafta kunlari bo'yicha (Du-Ya)
- Hech qanday qo'shimcha rang/legend — bitta rangdagi ustunlar, eng yuqori kun biroz to'qroq rangda ajralib tursin

**Top mahsulotlar (faqat top-3, "Barchasi" kabi havolasiz — soddalik uchun):**
- Ro'yxat: raqam + nomi + sotilgan soni + summa (masalan "1. Ko'k choy — 145 ta — 2,900,000 so'm")

**Eng band stollar (faqat top-3):**
- Ro'yxat: stol nomi + jami band bo'lgan vaqt (masalan "Stol 4 — 4 soat 12 daqiqa")

*(Oldingi versiyadagi trend foizlari — "↑12%", "↓3%" — olib tashlandi, chunki bu qo'shimcha hisob-kitob talab qiladi va MVP uchun shart emas. Statistika endi faqat "hozirgi holat" raqamlarini ko'rsatadi.)*

**Bo'sh holat (hali hech qanday sessiya bo'lmagan bo'lsa):**
- Markazda oddiy matn: "Hali statistika mavjud emas — birinchi sessiyani boshlang"

---

## 8. PROFIL EKRANI

**Maqsad:** Barcha sozlamalarga (zonalar, mahsulotlar, hisob) kirish nuqtasi — kamdan-kam ochiladigan bo'lim.

**Ro'yxat ko'rinishida (list-style), yuqoridan pastga:**
1. **"Zonalar va stollar"** — bosilganda kengayadi yoki alohida sahifa ochadi (8.1)
2. **"Mahsulotlar"** — bosilganda kengayadi yoki alohida sahifa ochadi (8.2)
3. **Ajratuvchi chiziq**
4. **"Chiqish"** (qizil matn) — bosilganda tasdiqlash oynasi chiqadi

Har bir qatorda: chapda nom, o'ngda kichik ">" strelka ikonkasi.

---

## 8.1. ZONALAR VA STOLLAR BOSHQARUVI

**Elementlar:**
- Sarlavha: "Zonalar va stollar" + orqaga qaytish strelkasi
- Har bir zona — kengaytiriladigan (accordion) blok: zona nomi + ichida shu zonaga tegishli stollar ro'yxati (nomi + holati)
- Har bir zona bloki yonida kichik qalam (tahrirlash) ikonkasi
- Har bir stol qatori yonida ham qalam ikonkasi
- Eng pastda: "+ Yangi zona qo'shish" tugmasi (chizilgan/outline uslubda)
- Har bir zona ichida: "+ Yangi stol qo'shish" havolasi

**Zona qo'shish/tahrirlash oynasi (modal):**
- Sarlavha: "Yangi zona" yoki "Zonani tahrirlash"
- Input: "Zona nomi" (masalan "Billiard zali")
- Tugma: "Saqlash"
- Agar tahrirlash bo'lsa — pastda kichik qizil matn: "Zonani o'chirish" → bosilsa tasdiqlash oynasi (8.3)

**Stol qo'shish/tahrirlash oynasi (modal):**
- Sarlavha: "Yangi stol" yoki "Stolni tahrirlash"
- Input: "Stol nomi" (masalan "Stol 6")
- Input: "Soatlik tarif" (son, so'm)
- Tugma: "Saqlash"
- Agar tahrirlash bo'lsa — "Stolni o'chirish" havolasi → tasdiqlash oynasi (8.3)

---

## 8.2. MAHSULOTLAR BOSHQARUVI

**Elementlar:**
- Sarlavha: "Mahsulotlar" + orqaga qaytish strelkasi
- Zona tanlash (agar bir nechta zona bo'lsa — yuqorida kichik tab/dropdown)
- Oddiy ro'yxat: har bir qatorda mahsulot nomi + narxi + tahrirlash ikonkasi
- Eng pastda: "+ Yangi mahsulot qo'shish" tugmasi

**Mahsulot qo'shish/tahrirlash oynasi (modal):**
- Sarlavha: "Yangi mahsulot" yoki "Mahsulotni tahrirlash"
- Input: "Nomi" (masalan "Ko'k choy")
- Input: "Narxi" (son, so'm)
- Tugma: "Saqlash"
- Agar tahrirlash bo'lsa — "Mahsulotni o'chirish" havolasi → tasdiqlash oynasi (8.3)

---

## 8.3. O'CHIRISH — TASDIQLASH OYNASI (alert, universal)

Zona, stol yoki mahsulot o'chirilganda bir xil shablon ishlatiladi:

- Sarlavha: "[Nomi]ni o'chirasizmi?" (masalan "Stol 6ni o'chirasizmi?")
- Matn: "Bu amalni ortga qaytarib bo'lmaydi."
- Agar zona/stol o'chirilayotgan bo'lsa va unda faol sessiya bo'lsa: qo'shimcha ogohlantirish — "Diqqat: bu stolda faol sessiya bor. Avval sessiyani yakunlang."  va "O'chirish" tugmasi o'chirilgan/bosilmaydigan holatda bo'ladi
- Ikkita tugma: "Bekor qilish" va "O'chirish" (qizil)

---

## 9. CHIQISH (LOGOUT) — TASDIQLASH OYNASI (alert)

**Ochilish:** Profil ekranidagi "Chiqish" bosilganda.

- Sarlavha: "Tizimdan chiqasizmi?"
- Ikkita tugma: "Bekor qilish" va "Chiqish" (qizil)
- Tasdiqlansa → Login ekraniga qaytariladi

---

## 10. TIZIM XABARLARI (Toast / Snackbar — ekran pastida qisqa vaqt chiqib, avtomatik yo'qoladigan xabarlar)

Quyidagi holatlarda ekran pastida kichik, avtomatik yo'qoluvchi xabar (2-3 soniya) chiqadi — alohida oyna emas:

| Holat | Xabar matni |
|---|---|
| Sessiya muvaffaqiyatli boshlandi | "Sessiya boshlandi" |
| Sessiya yakunlandi | "Sessiya yakunlandi — [summa] so'm" |
| Sessiya bekor qilindi | "Sessiya bekor qilindi" |
| Mahsulot qo'shildi | "[Mahsulot nomi] qo'shildi" |
| Zona/stol/mahsulot saqlandi | "Saqlandi" |
| Zona/stol/mahsulot o'chirildi | "O'chirildi" |
| Internet aloqasi yo'q | "Internet aloqasi yo'q — qayta urinilmoqda..." (bu xabar aloqa tiklanguncha ekranda qoladi, avtomatik yo'qolmaydi) |
| Server xatoligi | "Xatolik yuz berdi, qaytadan urinib ko'ring" |

---

## 11. MAXSUS HOLAT — COUNTDOWN TUGAGANDA

Countdown 00:00 ga yetganda, alohida modal oyna **ochilmaydi** (bu ish jarayonini to'xtatib qo'yadi) — buning o'rniga:
- Stol kartasi rangi avtomatik qizilga (yoki alohida "muddati tugadi" rangiga) o'zgaradi
- Karta ichida kichik belgi: "Vaqt tugadi — davom etmoqda" va shu paytdan boshlab tizim avtomatik sekundomer rejimiga o'tib, qo'shimcha vaqtni alohida hisoblay boshlaydi
- Agar admin telefon/planshetni qo'lida ushlab tursa (ilova ochiq bo'lsa) — bitta marta yengil tebranish (vibration, agar mobil qurilma qo'llab-quvvatlasa) yoki tovush signali beriladi, lekin ekranni to'sib turadigan katta alert chiqmaydi

---

## Xulosa — umumiy oyna soni

| Turi | Soni |
|---|---|
| To'liq ekranlar | Login, Asosiy, Statistika, Profil, Zonalar ro'yxati, Mahsulotlar ro'yxati = **6 ta** |
| Modal/bottom-sheet oynalar | Sessiya boshlash, Faol sessiya, Zona qo'shish/tahrirlash, Stol qo'shish/tahrirlash, Mahsulot qo'shish/tahrirlash = **5 ta** |
| Tasdiqlash (alert) oynalar | Sessiyani yakunlash, Sessiyani bekor qilish, O'chirish (universal), Chiqish = **4 ta** |
| Tizim xabarlari (toast) | 8 xil holat, bitta umumiy komponent |

Jami — atigi **~15 ta unikal ekran/oyna** bilan butun tizim qamrab olinadi. Bu Stitch'da qurish uchun ham, keyinchalik kodlash uchun ham boshqarish oson bo'lgan hajm.
