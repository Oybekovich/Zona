# PRD — Universal Zona Boshqaruv Tizimi

**Hujjat turi:** Product Requirements Document (PRD)
**Versiya:** 1.0 (MVP)
**Holat:** Loyihalash bosqichi

---

## 1. Umumiy ma'lumot

### 1.1. Maqsad

Vaqt asosida pullanadigan xizmat nuqtalariga ega bizneslar (billiard klublari, tennis kortlari, PlayStation zonalari, karaoke xonalari va shunga o'xshash o'yin/dam olish zonalari) uchun **universal boshqaruv tizimi** yaratish. Tizim har bir stol/joy uchun vaqtni (soat yoki teskari sanoq) real vaqtda ko'rsatadi, narxni avtomatik hisoblaydi, oziq-ovqat/ichimlik sotuvini kuzatadi va daromad statistikasini beradi.

### 1.2. Muammo

Hozirda ko'plab kichik-o'rta o'yin zonalari (billiard, tennis va h.k.) stol vaqtini qo'lda (qog'ozda, soat bilan) hisoblaydi. Bu quyidagi muammolarni keltirib chiqaradi:
- Vaqt va narx hisobida xatoliklar
- Qaysi stol qancha daromad keltirayotgani noaniq
- Ovqat-ichimlik sotuvi alohida, umumiy hisobdan uzilgan
- Bir nechta turdagi xizmat (billiard + tennis) bir joyda bo'lsa, ularni boshqarish uchun alohida-alohida vositalar kerak bo'ladi

### 1.3. Yechim

Bitta yengil, sodda tizim — istalgan turdagi vaqt-asoslangan xizmatni ("resurs") boshqaradi, real-vaqt taymer va narx ko'rsatadi, mahsulot sotuvini biriktiradi va barcha daromadni bitta joyda statistika qilib beradi.

### 1.4. Nima uchun universal?

Bitta jismoniy zona ichida bir nechta xizmat turi bo'lishi mumkin (masalan, bitta klubda ham billiard stollari, ham tennis korti bo'lishi mumkin). Shuning uchun tizim "billiard tizimi" emas, balki **istalgan resurs turini qo'shish mumkin bo'lgan** universal platforma sifatida qurilishi kerak.

---

## 2. Maqsadlar va maqsad bo'lmagan narsalar

### 2.1. Maqsadlar (Goals)
- Har bir stol/resurs uchun real-vaqt taymer va narx ko'rsatish
- Stopwatch (yuqoriga sanoq) va countdown (pastga sanoq) rejimlarini qo'llab-quvvatlash
- Oziq-ovqat/ichimlik sotuvini sessiyaga biriktirish va alohida statistika qilish
- Daromad va boshqa statistikani (band bandlik, top-mahsulotlar) ko'rsatish
- Har qanday miqyosda ishlash: 1 ta kichik zonadan tortib ko'p filialli tarmoqqacha
- Interfeys juda sodda va tez o'rganiladigan bo'lishi (o'rtacha foydalanuvchi 5 daqiqada tushunadigan darajada)

### 2.2. Maqsad bo'lmagan narsalar (Non-goals — MVP doirasidan tashqarida)
- Kassir yoki ko'p rolli xodimlar tizimi — **faqat 1 ta Admin roli**
- Murakkab narx qoidalari (peak/off-peak, aksiyalar, chegirmalar)
- Mijozlar bazasi, a'zolik, wallet
- Onlayn bron qilish (booking)
- To'lov tizimlariga (payment gateway) integratsiya
- Dizayn/UI va logo — bu alohida keyingi bosqichda ko'riladi
- Statistikani Excel/PDF'ga eksport qilish — loyiha doirasiga kiritilmaydi

---

## 3. Foydalanuvchilar

| Foydalanuvchi | Tavsif | Ehtiyoj |
|---|---|---|
| **Admin (klub egasi/boshqaruvchisi)** | Tizimning yagona foydalanuvchisi. Zona/stollarni sozlaydi, sessiyalarni boshqaradi, statistikani kuzatadi. | Tez, sodda, xatosiz ishlaydigan vosita — texnik bilim talab qilmasin. |

MVP uchun boshqa foydalanuvchi turi yo'q (xodim, mijoz, kassir — barchasi keyingi bosqichlarga qoldirilgan).

---

## 4. Funksional talablar

Har bir talab foydalanuvchi hikoyasi (user story) va qabul qilish mezonlari (acceptance criteria) bilan berilgan.

### 4.1. Zona va Resurs boshqaruvi

**FR-1: Zona qo'shish**
- *Admin sifatida, men yangi zona qo'sha olishim kerak (masalan, "Billiard zali"), shunda men turli xizmat turlarini guruhlab boshqara olaman.*
- Qabul mezonlari: Admin zona nomini kiritadi → zona ro'yxatga qo'shiladi → tahrirlash va o'chirish mumkin.

**FR-2: Resurs turi qo'shish**
- *Admin sifatida, men zona ichida resurs turini belgilashim kerak (masalan, "Billiard" yoki "Tennis"), narxlash rejimi (soatlik) bilan birga.*
- Qabul mezonlari: Har bir resurs turiga nom va standart soatlik tarif belgilanadi.

**FR-3: Resurs (stol/kort) qo'shish**
- *Admin sifatida, men har bir jismoniy stol/kortni alohida qo'sha olishim kerak, shunda ularning holatini alohida kuzata olaman.*
- Qabul mezonlari: Resurs nomi (masalan "Stol №3") kiritiladi, boshlang'ich holati "bo'sh" bo'ladi.

### 4.2. Sessiya boshqaruvi

**FR-4: Sessiyani boshlash**
- *Admin sifatida, men bo'sh stolda bitta tugma bosish bilan sessiya boshlashim kerak, rejim (stopwatch/countdown) tanlab.*
- Qabul mezonlari: "Boshlash" bosilganda sessiya yaratiladi, stol holati "band"ga o'zgaradi, taymer ishga tushadi.

**FR-5: Real-vaqt taymer va narx ko'rsatish**
- *Admin sifatida, men har bir band stolning joriy vaqti va joriy narxini real vaqtda ko'rishim kerak.*
- Qabul mezonlari: Vaqt va narx sahifani yangilamasdan avtomatik yangilanib turadi. Narx = `o'tgan vaqt (soat) × soatlik tarif`.
- Vaqt hisobi **serverda** saqlanadi — sahifa yopilib qayta ochilsa ham, internet uzilib qayta ulansa ham vaqt to'g'ri ko'rsatiladi.

**FR-6: Countdown ogohlantirishi**
- *Admin sifatida, men countdown vaqti tugaganda ogohlantirish olishim kerak.*
- Qabul mezonlari: Vaqt nolga yetganda stol kartasi vizual ravishda ajralib turadi (rang o'zgarishi).

**FR-7: Sessiyani tugatish**
- *Admin sifatida, men sessiyani bitta tugma bilan yakunlab, yakuniy summani ko'rishim kerak.*
- Qabul mezonlari: "Tugatish" bosilganda stol vaqti narxi + mahsulotlar narxi qo'shilib, yakuniy summa ko'rsatiladi va tasdiqlanganda stol "bo'sh"ga qaytadi, yozuv tarixga saqlanadi.

### 4.3. Oziq-ovqat/ichimlik moduli

**FR-8: Mahsulot ro'yxatini boshqarish**
- *Admin sifatida, men har bir zona uchun sotiladigan mahsulotlar ro'yxatini (nomi, narxi) yuritishim kerak.*
- Qabul mezonlari: Mahsulot qo'shish/tahrirlash/o'chirish mumkin, har bir zona o'z ro'yxatiga ega.

**FR-9: Sessiyaga mahsulot qo'shish**
- *Admin sifatida, men faol sessiyaga mijoz olgan mahsulotlarni (soni bilan) qo'sha olishim kerak.*
- Qabul mezonlari: Mahsulot ro'yxatidan tanlanadi, soni kiritiladi, sessiya jami summasiga avtomatik qo'shiladi.

**FR-10: Stol va mahsulot summasini ajratish**
- *Admin sifatida, men yakuniy hisobda qaysi qismi stol vaqtidan, qaysi qismi mahsulotdan ekanini ko'rishim kerak.*
- Qabul mezonlari: Yakuniy chekda ikkita alohida qator: "Stol vaqti — X so'm" va "Mahsulotlar — Y so'm".

### 4.4. Statistika

**FR-11: Daromad statistikasi**
- *Admin sifatida, men kunlik/haftalik/oylik umumiy daromadni ko'rishim kerak, stol va mahsulot daromadi alohida-alohida.*

**FR-12: Top-mahsulotlar**
- *Admin sifatida, men eng ko'p sotilgan mahsulotlarni ko'rishim kerak, xarid strategiyamni yaxshilash uchun.*

**FR-13: Band bandlik statistikasi**
- *Admin sifatida, men qaysi stol/zona eng ko'p ishlatilayotganini ko'rishim kerak.*

### 4.5. Umumiy

**FR-14: Kirish (Login)**
- *Admin sifatida, men login/parol bilan tizimga kira olishim kerak.*

**FR-15: Ko'p qurilmada ishlash**
- *Admin sifatida, men tizimni ham veb-brauzerda, ham telefonda bir xil qulaylikda ishlatishim kerak.*

---

## 5. Nofunksional talablar

| Kategoriya | Talab |
|---|---|
| **Soddalik** | Yangi foydalanuvchi 5 daqiqadan kam vaqtda asosiy funksiyalarni (sessiya boshlash/tugatish) tushunishi kerak. Sozlamalar minimal bosishlar bilan bajarilishi kerak. |
| **Ishonchlilik** | Taymer va narx hisobi hech qachon internet uzilishi yoki sahifa yangilanishi sababli yo'qolmasligi kerak (server-tomonlama hisob). |
| **Tezlik** | Sessiya holati (taymer) 1 soniyadan kam kechikish bilan yangilanishi kerak. |
| **Masshtablanuvchanlik** | Tizim arxitekturasi 1 ta stoldan tortib minglab stol/ko'p filialgacha o'zgarishsiz ishlashi kerak (`tenant_id` asosidagi multi-tenancy). |
| **Mavjudlik** | Tizim ishlab turgan vaqtining kamida 99% da mavjud bo'lishi kerak (asosiy ish soatlarida uzilish bo'lmasligi). |
| **Xavfsizlik** | Har bir tenant (biznes)ning ma'lumotlari boshqalardan izolyatsiya qilingan bo'lishi kerak; login parolsiz kirish mumkin bo'lmasligi kerak. |
| **Moslashuvchanlik** | Yangi resurs turi (masalan, kelajakda "Karaoke") kod yozishga minimal o'zgartirish bilan qo'shila olishi kerak. |

---

## 6. Ma'lumotlar modeli (yuqori darajadagi)

```
Tenant (biznes)
 └─ Branch (filial)
     └─ Zone (zona)
         ├─ ResourceType (resurs turi: Billiard, Tennis...)
         │    └─ Resource (aniq stol/kort)
         │         └─ Session (sessiya: stopwatch/countdown)
         │              └─ SessionProduct (sessiyaga qo'shilgan mahsulot)
         └─ Product (zona mahsulotlari: choy, suv...)
```

To'liq jadval darajasidagi sxema (`tenants`, `branches`, `zones`, `resource_types`, `resources`, `sessions`, `products`, `session_products`, `payments`) — texnik loyiha hujjatida batafsil berilgan.

---

## 7. Asosiy foydalanuvchi oqimi

1. Admin tizimga kiradi → bosh ekranda barcha stollar/kortlar **karta** ko'rinishida: bo'sh (yashil) / band (qizil, taymer bilan).
2. Bo'sh stolga bosadi → rejim tanlaydi (Stopwatch yoki Countdown) → "Boshlash".
3. Stol kartasida jonli taymer va narx ko'rinadi.
4. Kerak bo'lsa, "+ Mahsulot qo'shish" orqali ovqat-ichimlik qo'shiladi.
5. "Tugatish" bosiladi → yakuniy summa (stol + mahsulot) ko'rsatiladi → tasdiqlanadi → stol bo'shaydi.
6. "Statistika" bo'limida daromad, top-mahsulotlar, band bandlik ko'riladi.

Jami **3 ta asosiy ekran**: Bosh ekran, Sessiya oynasi, Statistika + kichik Sozlamalar bo'limi.

---

## 8. Muvaffaqiyat mezonlari (Success Metrics)

- Admin bitta sessiyani (boshlash → mahsulot qo'shish → tugatish) **30 soniyadan kam vaqtda** bajara olishi
- Hisoblangan narxda **0% xatolik** (avtomatik hisoblash qo'lda hisoblashni to'liq almashtiradi)
- Statistika sahifasi real daromadni **aniq va real vaqtda** aks ettiradi
- Tizimni birinchi marta ko'rgan admin **qo'llanmasiz** asosiy funksiyalarni ishlata olishi

---

## 9. Faraz va cheklovlar (Assumptions & Constraints)

- MVP bosqichida bitta tizimda faqat bitta Admin hisobi ishlaydi (ko'p foydalanuvchi keyinroq)
- To'lovlar tizim ichida haqiqiy to'lov gateway orqali emas, faqat "qayd etish" (naqd/karta belgisi) sifatida saqlanadi
- Internet aloqasi mavjud deb faraz qilinadi (offline rejim MVP'da yo'q)
- Dizayn va vizual uslub ushbu hujjat doirasidan tashqarida — alohida bosqichda ishlanadi

---

## 10. Kelajakdagi bosqichlar (MVP'dan keyin)

- Murakkab narx qoidalari (peak/off-peak, aksiyalar)
- Mijozlar/a'zolik tizimi, wallet
- Onlayn bron qilish (booking)
- Ko'p xodim/rol tizimi (agar kerak bo'lib qolsa)
- To'lov tizimlariga integratsiya
- Kengaytirilgan dashboard va hisobotlar
- Mahsulot zaxirasi (stock/qoldiq) kuzatuvi
- Sessiyani pauza qilish imkoniyati

---

## 11. Ochiq savollar va qarorlar

- **Mahsulot zaxirasi (stock)** va **sessiyani pauza qilish** — MVP qaroriga kiritilmadi, keyinroq alohida ko'rib chiqiladi.
- **Statistikani Excel/PDF'ga eksport qilish** — kerak emas, loyiha doirasiga umuman kiritilmaydi.
