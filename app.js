/* ============ Zone Manager — Frontend (Stitch uslub) ============ */
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ---------------- TILLAR (i18n) ---------------- */
const I18N = {
  uz: {
    'login.subtitle': 'Zonangizni boshqaring', 'login.username': 'Email', 'login.usernamePh': 'Emailingizni kiriting',
    'login.password': 'Parol', 'login.passwordPh': 'Parolni kiriting',
    'login.error': 'Email yoki parol noto\'g\'ri', 'login.btn': 'Kirish', 'login.btnBusy': 'Kirish...',
    'login.or': 'yoki', 'login.signupBtn': 'Ro\'yxatdan o\'tish', 'login.signupBtnBusy': 'Ro\'yxatdan o\'tilmoqda...',
    'login.confirmPassword': 'Parolni tasdiqlash', 'login.confirmPasswordPh': 'Parolni qayta kiriting',
    'login.passMismatch': 'Parollar mos emas', 'login.passTooShort': 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
    'login.userExists': 'Bunday email allaqachon ro\'yxatdan o\'tgan', 'login.checkEmail': 'Emailingizni tekshiring — tasdiqlash havolasi yuborildi',
    'login.banned': 'Bu hisob bloklangan',
    'login.secure': 'Xavfsiz va himoyalangan tizim',
    'app.title': 'Asosiy oyna', 'search.tablePh': 'Stol qidirish…',
    'filter.all': 'Barchasi', 'filter.free': 'Bo\'sh', 'filter.busy': 'Band',
    'home.empty': 'Hali stol qo\'shilmagan', 'home.firstTable': 'Birinchi stolni qo\'shish',
    'nav.home': 'Stollar', 'nav.zones': 'Zonalar', 'nav.history': 'Tarix', 'nav.products': 'Mahsulotlar', 'nav.profile': 'Profil',
    'history.title': 'Tarix', 'history.today': 'Bugun', 'history.empty': 'Hali yakunlangan sessiya yo\'q',
    'history.time': 'Vaqt', 'history.tableTime': 'Stol', 'history.products': 'Mahsulot', 'history.total': 'Jami',
    'history.tablesTotal': 'Stollardan', 'history.productsTotal': 'Mahsulotlardan', 'history.dayTotal': 'Kun jami',
    'zones.title': 'Zonalar', 'zones.add': 'Zona qo\'shish', 'zones.empty': 'Hali zona yo\'q — birinchi zonani qo\'shing',
    'zones.tables': 'stol', 'zones.statusBusy': 'Band', 'zones.statusFree': 'Bo\'sh', 'zones.addTable': 'Yangi stol qo\'shish',
    'products.title': 'Mahsulotlar', 'products.add': 'Mahsulot qo\'shish', 'products.empty': 'Avval zona qo\'shing',
    'products.none': 'Hali mahsulot yo\'q',
    'profile.title': 'Profil', 'profile.role': 'Egasi', 'profile.logout': 'Chiqish', 'profile.edit': 'Profilni tahrirlash',
    'profile.name': 'Ism', 'profile.login': 'Login', 'profile.nameLoginReq': 'Ism va loginni kiriting',
    'profile.logoutTitle': 'Tizimdan chiqasizmi?', 'profile.logoutBtn': 'Chiqish',
    'modal.editZone': 'Zonani tahrirlash', 'modal.newZone': 'Yangi zona', 'modal.zoneName': 'Zona nomi', 'modal.zonePh': 'Masalan: Asosiy oyna',
    'modal.editTable': 'Stolni tahrirlash', 'modal.newTable': 'Yangi stol', 'modal.tableName': 'Stol nomi', 'modal.tablePh': 'Masalan: Stol 07',
    'modal.tariff': 'Soatlik tarif', 'modal.tariffPh': 'Masalan: 25 000',
    'modal.editProduct': 'Mahsulotni tahrirlash', 'modal.newProduct': 'Yangi mahsulot', 'modal.prodName': 'Nomi', 'modal.prodNamePh': 'Masalan: Ko\'k choy',
    'modal.prodPrice': 'Narxi', 'modal.prodPricePh': 'Masalan: 7 000',
    'modal.save': 'Saqlash', 'modal.delete': 'O\'chirish', 'modal.deleteZone': 'Zonani o\'chirish', 'modal.deleteTable': 'Stolni o\'chirish', 'modal.deleteProduct': 'Mahsulotni o\'chirish',
    'err.required': 'Bu maydon to\'ldirilishi shart', 'err.number': 'To\'g\'ri son kiriting', 'err.rate': 'To\'g\'ri narx kiriting',
    'start.title': 'Sessiyani boshlash', 'start.stopwatch': 'Sekundomer', 'start.timer': 'Taymer',
    'start.duration': 'Davomiylikni belgilash', 'start.minutes': 'daqiqa', 'start.hourly': 'Soatlik narx', 'start.btn': 'Boshlash',
    'time.hour': 'soat', 'time.min': 'daqiqa',
    'panel.addProduct': 'Mahsulot qo\'shish', 'panel.searchPh': 'Mahsulot qidirish...', 'panel.noProduct': 'Mahsulot topilmadi',
    'panel.order': 'Joriy buyurtma', 'panel.done': 'Bajarildi', 'panel.edit': 'Tahrirlash',
    'panel.sessionTime': 'Sessiya vaqti', 'panel.tariff': 'Tarif', 'panel.perHour': '/ soat', 'panel.total': 'Jami',
    'panel.finish': 'Yakunlash', 'panel.cancelSession': 'Sessiyani bekor qilish',
    'panel.overtime': 'Qo\'shimcha vaqt', 'panel.timeLeft': 'Qolgan vaqt', 'panel.timePassed': 'O\'tgan vaqt',
    'panel.active': 'Faol', 'panel.ending': 'Yaqin tugaydi', 'panel.timeOver': 'Vaqt tugadi', 'panel.dona': '/ dona',
    'dialog.add': 'Qo\'shish', 'dialog.added': 'qo\'shildi',
    'finish.title': 'Sessiyani yakunlaysizmi?', 'finish.time': 'Vaqt', 'finish.tableTime': 'Stol vaqti', 'finish.products': 'Mahsulotlar', 'finish.total': 'Jami', 'finish.confirm': 'Tasdiqlash',
    'cancel.title': 'Sessiyani bekor qilasizmi?', 'cancel.warn': 'Bu amal qaytarilmaydi. Sessiya o\'chiriladi va hisoblanmaydi.',
    'cancel.no': 'Yo\'q, qaytish', 'cancel.yes': 'Ha, bekor qilish',
    'confirm.deleteTitle': 'ni o\'chirasizmi?', 'confirm.irreversible': 'Bu amalni ortga qaytarib bo\'lmaydi.',
    'confirm.zoneActive': 'Diqqat: bu zonada faol sessiya bor. Avval sessiyalarni yakunlang.',
    'confirm.tableActive': 'Diqqat: bu stolda faol sessiya bor. Avval sessiyani yakunlang.',
    'common.cancel': 'Bekor qilish', 'common.delete': 'O\'chirish', 'common.deleted': 'O\'chirildi', 'common.saved': 'Saqlandi',
    'toast.sessionStarted': 'Sessiya boshlandi', 'toast.sessionEnded': 'Sessiya yakunlandi', 'toast.sessionCancelled': 'Sessiya bekor qilindi',
    'block.title': 'Hisob bloklangan', 'block.text': 'Hisobingiz administrator tomonidan bloklangan. Blok olib tashlanganda bu oyna avtomatik yo\'qoladi.', 'block.retry': 'Qayta tekshirish',
    'net.title': 'Internet bilan muammo', 'net.text': 'Internet aloqasi yo\'q. Aloqa tiklanganda avtomatik davom etadi.', 'net.retry': 'Qayta urinish',
    'theme.title': 'Ko\'rinish uslubi',
    'err.tableBusy': 'Bu stolda allaqachon faol sessiya bor', 'err.sessionGone': 'Sessiya allaqachon yakunlangan yoki o\'chirilgan',
    'access.trialLeft': 'Sinov muddati: {n} kun qoldi · admin tasdig\'i kutilmoqda',
    'access.pendingTitle': 'Admin tasdig\'i kutilmoqda', 'access.pendingText': 'Sinov muddati tugadi. To\'lovdan so\'ng admin ruxsat beradi va ilova umrbod ochiladi. Ruxsat berilishi bilan bu oyna avtomatik yo\'qoladi.',
    'access.newText': 'Hisobingiz administratorga yuborildi. Admin tasdiqlagach {n} kunlik sinov muddati boshlanadi. Tasdiqlanishi bilan bu oyna avtomatik yo\'qoladi.',
    'access.rejectedTitle': 'Ruxsat berilmagan', 'access.rejectedText': 'Administrator bu hisobga ruxsat bermagan. Batafsil ma\'lumot uchun administrator bilan bog\'laning.',
    'access.retry': 'Qayta tekshirish', 'access.logout': 'Chiqish',
    'home.title': 'Stollar', 'home.emptyText': 'Zona va stollarni qo\'shing — keyin shu yerdan sessiyalarni boshqarasiz.', 'home.noMatch': 'Mos stol topilmadi',
    'stats.busy': 'Band stollar', 'stats.live': 'Joriy hisob', 'stats.today': 'Bugungi tushum', 'tile.start': 'Boshlash',
    'zones.sub': 'Zonalar, stollar va tariflar', 'zones.busyCount': '{n} band', 'zones.emptyText': 'Masalan: «Asosiy zal», «VIP xona». Har bir zonaga stollar qo\'shasiz.',
    'history.sub': 'Tushum va yakunlangan sessiyalar', 'history.sessions': 'Sessiyalar', 'history.todaySessions': 'Bugungi sessiyalar',
    'history.past': 'Oldingi kunlar', 'history.week': 'So\'nggi 7 kun', 'history.weekTotal': '7 kun jami', 'history.noToday': 'Bugun hali yakunlangan sessiya yo\'q',
    'products.sub': 'Bar va oshxona menyusi', 'products.sold': 'Sotilgan: {n}', 'products.noneText': 'Sessiya davomida mijozga sotiladigan ichimlik va taomlarni qo\'shing.',
    'profile.settings': 'Sozlamalar', 'modal.icon': 'Belgi',
    'start.stopwatchHint': 'Vaqt ochiq, oxirida hisoblanadi', 'start.timerHint': 'Oldindan belgilangan vaqt', 'start.estimate': 'Taxminiy summa',
    'panel.startedAt': 'Boshlangan', 'panel.endsAt': 'Tugaydi', 'panel.bill': 'Hisob', 'panel.noProducts': 'Hali mahsulot qo\'shilmagan',
    'cur': 'so\'m', 'lang.label': 'Til',
    'brand.tag': 'Boshqaruv tizimi', 'login.headA': 'Zonangizni', 'login.headB': 'boshqaring',
    'login.lead': 'Stollar, vaqt, bar va tushum — bitta oynada, real vaqtda. Vaqt tugaganda ovozli signal beradi.',
    'login.welcome': 'Xush kelibsiz', 'login.subLogin': 'Hisobingizga kiring va zonani boshqaring',
    'login.subSignup': 'Yangi hisob yarating — admin tasdiqlagach ishga tushadi',
    'nav.menu': 'Menyu', 'view.grid': 'Kartalar', 'view.map': 'Zal xaritasi',
    'stats.liveNow': 'Joriy hisob · jonli', 'stats.activeN': '{n} ta faol sessiya', 'stats.liveNote': '{n} ta faol sessiya · har soniyada yangilanadi',
    'stats.freeN': '{n} ta stol bo\'sh', 'stats.doneN': '{n} ta yakunlangan sessiya', 'legend.ending': '5 daq qoldi',
    'theme.style': 'Uslub', 'theme.count': '{n} ta uslub',
    'theme.violet': 'Qora bordo', 'theme.violetDesc': 'Qora va bordo — lyuks klub',
    'theme.gold': 'Oltin klub', 'theme.goldDesc': 'Qora va oltin — lyuks klub',
    'theme.teal': 'Tungi teal', 'theme.tealDesc': 'Chuqur va boy tungi uslub',
    'theme.felt': 'Klassik movut', 'theme.feltDesc': 'Yashil movut va krem — klassik billiard',
    'theme.light': 'Kunduzgi', 'theme.lightDesc': 'Yorug\' fon va bordo aksent — kunduzi uchun',
    'profile.sub': 'Hisob va sozlamalar', 'profile.logoutFull': 'Tizimdan chiqish',
    'sound.title': 'Vaqt tugaganda ovozli signal', 'sound.sub': '5 daqiqa qolganda qisqa signal, vaqt tugaganda qo\'ng\'iroq chalinadi.',
    'sound.test': 'Sinab ko\'rish', 'sound.on': 'Ovozli signal yoqildi', 'sound.off': 'Ovozli signal o\'chirildi',
    'lang.sub': 'Interfeys tili', 'map.click': 'stolni bosing', 'map.hint': 'Sichqonchani harakatlantiring',
    'sport.billiard': 'Billiard', 'sport.tennis': 'Stol tennisi', 'tile.startSub': 'Sessiya ochish', 'tile.perHour': 'soatiga',
    'zones.meta': '{t} ta stol · {b} band', 'zones.hint': 'Har bir zonaga alohida stollar va zal xaritasi beriladi.', 'modal.type': 'Stol turi',
    'products.newTile': 'Yangi mahsulot', 'products.top': 'Top', 'panel.menu': 'Menyu', 'panel.open': 'Ochiq',
    'done.title': 'Sessiya yakunlandi', 'done.note': 'Chek tarixga qo\'shildi', 'finish.rate': 'Tarif',
    'history.dayCount': '{n} kun', 'history.split': 'Stollar {a} · Mahsulotlar {b}',
    'alarm.ending': '{t}: 5 daqiqa qoldi', 'alarm.over': '{t}: vaqt tugadi',
  },
  en: {
    'login.subtitle': 'Manage your zone', 'login.username': 'Email', 'login.usernamePh': 'Enter your email',
    'login.password': 'Password', 'login.passwordPh': 'Enter password',
    'login.error': 'Invalid email or password', 'login.btn': 'Log in', 'login.btnBusy': 'Logging in...',
    'login.or': 'or', 'login.signupBtn': 'Sign up', 'login.signupBtnBusy': 'Signing up...',
    'login.confirmPassword': 'Confirm password', 'login.confirmPasswordPh': 'Re-enter password',
    'login.passMismatch': 'Passwords do not match', 'login.passTooShort': 'Password must be at least 6 characters',
    'login.userExists': 'This email is already registered', 'login.checkEmail': 'Check your email — a confirmation link has been sent',
    'login.banned': 'This account is blocked',
    'login.secure': 'Secure and protected system',
    'app.title': 'Main Floor', 'search.tablePh': 'Search tables…',
    'filter.all': 'All', 'filter.free': 'Free', 'filter.busy': 'Busy',
    'home.empty': 'No tables yet', 'home.firstTable': 'Add the first table',
    'nav.home': 'Tables', 'nav.zones': 'Zones', 'nav.history': 'History', 'nav.products': 'Products', 'nav.profile': 'Profile',
    'history.title': 'History', 'history.today': 'Today', 'history.empty': 'No finished sessions yet',
    'history.time': 'Time', 'history.tableTime': 'Table', 'history.products': 'Products', 'history.total': 'Total',
    'history.tablesTotal': 'Tables', 'history.productsTotal': 'Products', 'history.dayTotal': 'Day total',
    'zones.title': 'Zones', 'zones.add': 'Add zone', 'zones.empty': 'No zones yet — add the first one',
    'zones.tables': 'tables', 'zones.statusBusy': 'Busy', 'zones.statusFree': 'Free', 'zones.addTable': 'Add new table',
    'products.title': 'Products', 'products.add': 'Add product', 'products.empty': 'Add a zone first',
    'products.none': 'No products yet',
    'profile.title': 'Profile', 'profile.role': 'Owner', 'profile.logout': 'Log out', 'profile.edit': 'Edit profile',
    'profile.name': 'Name', 'profile.login': 'Login', 'profile.nameLoginReq': 'Enter name and login',
    'profile.logoutTitle': 'Log out?', 'profile.logoutBtn': 'Log out',
    'modal.editZone': 'Edit zone', 'modal.newZone': 'New zone', 'modal.zoneName': 'Zone name', 'modal.zonePh': 'e.g.: Main floor',
    'modal.editTable': 'Edit table', 'modal.newTable': 'New table', 'modal.tableName': 'Table name', 'modal.tablePh': 'e.g.: Table 07',
    'modal.tariff': 'Hourly rate', 'modal.tariffPh': 'e.g.: 25 000',
    'modal.editProduct': 'Edit product', 'modal.newProduct': 'New product', 'modal.prodName': 'Name', 'modal.prodNamePh': 'e.g.: Green tea',
    'modal.prodPrice': 'Price', 'modal.prodPricePh': 'e.g.: 7 000',
    'modal.save': 'Save', 'modal.delete': 'Delete', 'modal.deleteZone': 'Delete zone', 'modal.deleteTable': 'Delete table', 'modal.deleteProduct': 'Delete product',
    'err.required': 'This field is required', 'err.number': 'Enter a valid number', 'err.rate': 'Enter a valid rate',
    'start.title': 'Start session', 'start.stopwatch': 'Stopwatch', 'start.timer': 'Timer',
    'start.duration': 'Set duration', 'start.minutes': 'min', 'start.hourly': 'Hourly rate', 'start.btn': 'Start',
    'time.hour': 'h', 'time.min': 'min',
    'panel.addProduct': 'Add product', 'panel.searchPh': 'Search products...', 'panel.noProduct': 'No products found',
    'panel.order': 'Current order', 'panel.done': 'Done', 'panel.edit': 'Edit',
    'panel.sessionTime': 'Session time', 'panel.tariff': 'Rate', 'panel.perHour': '/ hour', 'panel.total': 'Total',
    'panel.finish': 'Finish', 'panel.cancelSession': 'Cancel session',
    'panel.overtime': 'Overtime', 'panel.timeLeft': 'Time left', 'panel.timePassed': 'Elapsed',
    'panel.active': 'Active', 'panel.ending': 'Ending soon', 'panel.timeOver': 'Time is up', 'panel.dona': 'per item',
    'dialog.add': 'Add', 'dialog.added': 'added',
    'finish.title': 'Finish the session?', 'finish.time': 'Time', 'finish.tableTime': 'Table time', 'finish.products': 'Products', 'finish.total': 'Total', 'finish.confirm': 'Confirm',
    'cancel.title': 'Cancel the session?', 'cancel.warn': 'This action cannot be undone. The session will be deleted.',
    'cancel.no': 'No, go back', 'cancel.yes': 'Yes, cancel',
    'confirm.deleteTitle': 'delete?', 'confirm.irreversible': 'This action cannot be undone.',
    'confirm.zoneActive': 'Attention: this zone has active sessions. Finish them first.',
    'confirm.tableActive': 'Attention: this table has an active session. Finish it first.',
    'common.cancel': 'Cancel', 'common.delete': 'Delete', 'common.deleted': 'Deleted', 'common.saved': 'Saved',
    'toast.sessionStarted': 'Session started', 'toast.sessionEnded': 'Session finished', 'toast.sessionCancelled': 'Session cancelled',
    'block.title': 'Account blocked', 'block.text': 'Your account has been blocked by the administrator. This window will disappear automatically once the block is lifted.', 'block.retry': 'Check again',
    'net.title': 'Connection problem', 'net.text': 'No internet connection. It will continue automatically once the connection is restored.', 'net.retry': 'Try again',
    'theme.title': 'Appearance',
    'err.tableBusy': 'This table already has an active session', 'err.sessionGone': 'The session was already finished or deleted',
    'access.trialLeft': 'Trial: {n} days left · waiting for admin approval',
    'access.pendingTitle': 'Waiting for admin approval', 'access.pendingText': 'Your trial has ended. After payment the admin approves it and the app is unlocked for life. This window disappears automatically once approved.',
    'access.newText': 'Your account has been sent to the administrator. Once approved, a {n}-day trial starts. This window disappears automatically once approved.',
    'access.rejectedTitle': 'Access not granted', 'access.rejectedText': 'The administrator has not granted access to this account. Please contact the administrator.',
    'access.retry': 'Check again', 'access.logout': 'Log out',
    'home.title': 'Tables', 'home.emptyText': 'Add zones and tables — then run all sessions from here.', 'home.noMatch': 'No matching tables',
    'stats.busy': 'Busy tables', 'stats.live': 'Running total', 'stats.today': 'Today\'s revenue', 'tile.start': 'Start',
    'zones.sub': 'Zones, tables and rates', 'zones.busyCount': '{n} busy', 'zones.emptyText': 'For example: “Main hall”, “VIP room”. Then add tables to each zone.',
    'history.sub': 'Revenue and finished sessions', 'history.sessions': 'Sessions', 'history.todaySessions': 'Today\'s sessions',
    'history.past': 'Previous days', 'history.week': 'Last 7 days', 'history.weekTotal': '7-day total', 'history.noToday': 'No finished sessions today yet',
    'products.sub': 'Bar and kitchen menu', 'products.sold': 'Sold: {n}', 'products.noneText': 'Add drinks and snacks you sell to customers during a session.',
    'profile.settings': 'Settings', 'modal.icon': 'Icon',
    'start.stopwatchHint': 'Open-ended, billed at the end', 'start.timerHint': 'Fixed, pre-set duration', 'start.estimate': 'Estimated amount',
    'panel.startedAt': 'Started', 'panel.endsAt': 'Ends', 'panel.bill': 'Bill', 'panel.noProducts': 'No products added yet',
    'cur': 'UZS', 'lang.label': 'Language',
    'brand.tag': 'Management system', 'login.headA': 'Run your', 'login.headB': 'zone',
    'login.lead': 'Tables, time, bar and revenue — in one window, in real time. Plays a sound when time is up.',
    'login.welcome': 'Welcome', 'login.subLogin': 'Sign in to your account and run your zone',
    'login.subSignup': 'Create a new account — it starts once the admin approves it',
    'nav.menu': 'Menu', 'view.grid': 'Cards', 'view.map': 'Floor map',
    'stats.liveNow': 'Running total · live', 'stats.activeN': '{n} active sessions', 'stats.liveNote': '{n} active sessions · updates every second',
    'stats.freeN': '{n} tables free', 'stats.doneN': '{n} finished sessions', 'legend.ending': '5 min left',
    'theme.style': 'Style', 'theme.count': '{n} styles',
    'theme.violet': 'Black bordeaux', 'theme.violetDesc': 'Black and bordeaux — luxury club',
    'theme.gold': 'Gold club', 'theme.goldDesc': 'Black and gold — luxury club',
    'theme.teal': 'Night teal', 'theme.tealDesc': 'Deep and rich night style',
    'theme.felt': 'Classic felt', 'theme.feltDesc': 'Green felt and cream — classic billiards',
    'theme.light': 'Daylight', 'theme.lightDesc': 'Light background with a bordeaux accent',
    'profile.sub': 'Account and settings', 'profile.logoutFull': 'Log out',
    'sound.title': 'Sound alert when time is up', 'sound.sub': 'A short beep at 5 minutes left, a bell when time is up.',
    'sound.test': 'Test', 'sound.on': 'Sound alerts on', 'sound.off': 'Sound alerts off',
    'lang.sub': 'Interface language', 'map.click': 'click a table', 'map.hint': 'Move the mouse',
    'sport.billiard': 'Billiards', 'sport.tennis': 'Table tennis', 'tile.startSub': 'Open a session', 'tile.perHour': 'per hour',
    'zones.meta': '{t} tables · {b} busy', 'zones.hint': 'Each zone gets its own tables and floor map.', 'modal.type': 'Table type',
    'products.newTile': 'New product', 'products.top': 'Top', 'panel.menu': 'Menu', 'panel.open': 'Open',
    'done.title': 'Session finished', 'done.note': 'Receipt added to history', 'finish.rate': 'Rate',
    'history.dayCount': '{n} days', 'history.split': 'Tables {a} · Products {b}',
    'alarm.ending': '{t}: 5 minutes left', 'alarm.over': '{t}: time is up',
  },
  ru: {
    'login.subtitle': 'Управляйте своей зоной', 'login.username': 'Email', 'login.usernamePh': 'Введите email',
    'login.password': 'Пароль', 'login.passwordPh': 'Введите пароль',
    'login.error': 'Неверный email или пароль', 'login.btn': 'Войти', 'login.btnBusy': 'Вход...',
    'login.or': 'или', 'login.signupBtn': 'Зарегистрироваться', 'login.signupBtnBusy': 'Регистрация...',
    'login.confirmPassword': 'Подтверждение пароля', 'login.confirmPasswordPh': 'Повторите пароль',
    'login.passMismatch': 'Пароли не совпадают', 'login.passTooShort': 'Пароль должен быть не короче 6 символов',
    'login.userExists': 'Этот email уже зарегистрирован', 'login.checkEmail': 'Проверьте email — отправлена ссылка для подтверждения',
    'login.banned': 'Этот аккаунт заблокирован',
    'login.secure': 'Безопасная и защищённая система',
    'app.title': 'Основной зал', 'search.tablePh': 'Поиск стола…',
    'filter.all': 'Все', 'filter.free': 'Свободные', 'filter.busy': 'Занятые',
    'home.empty': 'Столы ещё не добавлены', 'home.firstTable': 'Добавить первый стол',
    'nav.home': 'Столы', 'nav.zones': 'Зоны', 'nav.history': 'История', 'nav.products': 'Товары', 'nav.profile': 'Профиль',
    'history.title': 'История', 'history.today': 'Сегодня', 'history.empty': 'Завершённых сессий пока нет',
    'history.time': 'Время', 'history.tableTime': 'Стол', 'history.products': 'Товары', 'history.total': 'Итого',
    'history.tablesTotal': 'Столы', 'history.productsTotal': 'Товары', 'history.dayTotal': 'Итог дня',
    'zones.title': 'Зоны', 'zones.add': 'Добавить зону', 'zones.empty': 'Зон ещё нет — добавьте первую',
    'zones.tables': 'стол.', 'zones.statusBusy': 'Занят', 'zones.statusFree': 'Свободен', 'zones.addTable': 'Добавить новый стол',
    'products.title': 'Товары', 'products.add': 'Добавить товар', 'products.empty': 'Сначала добавьте зону',
    'products.none': 'Товаров ещё нет',
    'profile.title': 'Профиль', 'profile.role': 'Владелец', 'profile.logout': 'Выйти', 'profile.edit': 'Редактирование профиля',
    'profile.name': 'Имя', 'profile.login': 'Логин', 'profile.nameLoginReq': 'Введите имя и логин',
    'profile.logoutTitle': 'Выйти из системы?', 'profile.logoutBtn': 'Выйти',
    'modal.editZone': 'Редактирование зоны', 'modal.newZone': 'Новая зона', 'modal.zoneName': 'Название зоны', 'modal.zonePh': 'Напр.: Основной зал',
    'modal.editTable': 'Редактирование стола', 'modal.newTable': 'Новый стол', 'modal.tableName': 'Название стола', 'modal.tablePh': 'Напр.: Стол 07',
    'modal.tariff': 'Тариф за час', 'modal.tariffPh': 'Напр.: 25 000',
    'modal.editProduct': 'Редактирование товара', 'modal.newProduct': 'Новый товар', 'modal.prodName': 'Название', 'modal.prodNamePh': 'Напр.: Зелёный чай',
    'modal.prodPrice': 'Цена', 'modal.prodPricePh': 'Напр.: 7 000',
    'modal.save': 'Сохранить', 'modal.delete': 'Удалить', 'modal.deleteZone': 'Удалить зону', 'modal.deleteTable': 'Удалить стол', 'modal.deleteProduct': 'Удалить товар',
    'err.required': 'Это поле обязательно', 'err.number': 'Введите корректное число', 'err.rate': 'Введите корректную цену',
    'start.title': 'Начать сессию', 'start.stopwatch': 'Секундомер', 'start.timer': 'Таймер',
    'start.duration': 'Установить длительность', 'start.minutes': 'мин', 'start.hourly': 'Тариф за час', 'start.btn': 'Начать',
    'time.hour': 'ч', 'time.min': 'мин',
    'panel.addProduct': 'Добавить товар', 'panel.searchPh': 'Поиск товаров...', 'panel.noProduct': 'Товары не найдены',
    'panel.order': 'Текущий заказ', 'panel.done': 'Готово', 'panel.edit': 'Изменить',
    'panel.sessionTime': 'Время сессии', 'panel.tariff': 'Тариф', 'panel.perHour': '/ час', 'panel.total': 'Итого',
    'panel.finish': 'Завершить', 'panel.cancelSession': 'Отменить сессию',
    'panel.overtime': 'Дополнительное время', 'panel.timeLeft': 'Осталось времени', 'panel.timePassed': 'Прошло времени',
    'panel.active': 'Активна', 'panel.ending': 'Скоро закончится', 'panel.timeOver': 'Время вышло', 'panel.dona': '/ шт',
    'dialog.add': 'Добавить', 'dialog.added': 'добавлен',
    'finish.title': 'Завершить сессию?', 'finish.time': 'Время', 'finish.tableTime': 'Время стола', 'finish.products': 'Товары', 'finish.total': 'Итого', 'finish.confirm': 'Подтвердить',
    'cancel.title': 'Отменить сессию?', 'cancel.warn': 'Это действие необратимо. Сессия будет удалена.',
    'cancel.no': 'Нет, назад', 'cancel.yes': 'Да, отменить',
    'confirm.deleteTitle': ' удалить?', 'confirm.irreversible': 'Это действие нельзя отменить.',
    'confirm.zoneActive': 'Внимание: в этой зоне есть активные сессии. Сначала завершите их.',
    'confirm.tableActive': 'Внимание: на этом столе есть активная сессия. Сначала завершите её.',
    'common.cancel': 'Отмена', 'common.delete': 'Удалить', 'common.deleted': 'Удалено', 'common.saved': 'Сохранено',
    'toast.sessionStarted': 'Сессия началась', 'toast.sessionEnded': 'Сессия завершена', 'toast.sessionCancelled': 'Сессия отменена',
    'block.title': 'Аккаунт заблокирован', 'block.text': 'Ваш аккаунт заблокирован администратором. Это окно исчезнет автоматически после снятия блокировки.', 'block.retry': 'Проверить снова',
    'net.title': 'Проблема с интернетом', 'net.text': 'Нет подключения к интернету. Работа продолжится автоматически после восстановления связи.', 'net.retry': 'Повторить',
    'theme.title': 'Оформление',
    'err.tableBusy': 'На этом столе уже есть активная сессия', 'err.sessionGone': 'Сессия уже завершена или удалена',
    'access.trialLeft': 'Пробный период: осталось {n} дн. · ожидается подтверждение администратора',
    'access.pendingTitle': 'Ожидается подтверждение', 'access.pendingText': 'Пробный период закончился. После оплаты администратор подтвердит доступ, и приложение откроется навсегда. Это окно исчезнет автоматически.',
    'access.newText': 'Ваш аккаунт отправлен администратору. После подтверждения начнётся пробный период ({n} дн.). Это окно исчезнет автоматически.',
    'access.rejectedTitle': 'Доступ не предоставлен', 'access.rejectedText': 'Администратор не предоставил доступ этому аккаунту. Свяжитесь с администратором.',
    'access.retry': 'Проверить снова', 'access.logout': 'Выйти',
    'home.title': 'Столы', 'home.emptyText': 'Добавьте зоны и столы — затем управляйте всеми сеансами здесь.', 'home.noMatch': 'Столы не найдены',
    'stats.busy': 'Занято столов', 'stats.live': 'Текущий счёт', 'stats.today': 'Выручка сегодня', 'tile.start': 'Начать',
    'zones.sub': 'Зоны, столы и тарифы', 'zones.busyCount': 'занято: {n}', 'zones.emptyText': 'Например: «Основной зал», «VIP комната». Затем добавьте столы в каждую зону.',
    'history.sub': 'Выручка и завершённые сеансы', 'history.sessions': 'Сеансы', 'history.todaySessions': 'Сеансы за сегодня',
    'history.past': 'Предыдущие дни', 'history.week': 'Последние 7 дней', 'history.weekTotal': 'Итого за 7 дней', 'history.noToday': 'Сегодня завершённых сеансов пока нет',
    'products.sub': 'Меню бара и кухни', 'products.sold': 'Продано: {n}', 'products.noneText': 'Добавьте напитки и закуски, которые продаёте во время сеанса.',
    'profile.settings': 'Настройки', 'modal.icon': 'Иконка',
    'start.stopwatchHint': 'Без лимита, расчёт в конце', 'start.timerHint': 'Заранее заданное время', 'start.estimate': 'Ориентировочная сумма',
    'panel.startedAt': 'Начало', 'panel.endsAt': 'Окончание', 'panel.bill': 'Счёт', 'panel.noProducts': 'Товары ещё не добавлены',
    'cur': 'сум', 'lang.label': 'Язык',
    'brand.tag': 'Система управления', 'login.headA': 'Управляйте', 'login.headB': 'зоной',
    'login.lead': 'Столы, время, бар и выручка — в одном окне, в реальном времени. Звуковой сигнал по окончании времени.',
    'login.welcome': 'Добро пожаловать', 'login.subLogin': 'Войдите в аккаунт и управляйте зоной',
    'login.subSignup': 'Создайте аккаунт — он заработает после подтверждения администратором',
    'nav.menu': 'Меню', 'view.grid': 'Карточки', 'view.map': 'Карта зала',
    'stats.liveNow': 'Текущий счёт · онлайн', 'stats.activeN': 'Активных сессий: {n}', 'stats.liveNote': 'Активных сессий: {n} · обновляется каждую секунду',
    'stats.freeN': 'Свободно столов: {n}', 'stats.doneN': 'Завершено сессий: {n}', 'legend.ending': 'Осталось 5 мин',
    'theme.style': 'Стиль', 'theme.count': 'Стилей: {n}',
    'theme.violet': 'Чёрный бордо', 'theme.violetDesc': 'Чёрный и бордо — люкс-клуб',
    'theme.gold': 'Золотой клуб', 'theme.goldDesc': 'Чёрный и золото — люкс-клуб',
    'theme.teal': 'Ночной бирюзовый', 'theme.tealDesc': 'Глубокий ночной стиль',
    'theme.felt': 'Классическое сукно', 'theme.feltDesc': 'Зелёное сукно и крем — классический бильярд',
    'theme.light': 'Дневной', 'theme.lightDesc': 'Светлый фон и бордовый акцент',
    'profile.sub': 'Аккаунт и настройки', 'profile.logoutFull': 'Выйти из системы',
    'sound.title': 'Звуковой сигнал по окончании времени', 'sound.sub': 'Короткий сигнал за 5 минут, звонок — когда время вышло.',
    'sound.test': 'Проверить', 'sound.on': 'Звуковой сигнал включён', 'sound.off': 'Звуковой сигнал выключен',
    'lang.sub': 'Язык интерфейса', 'map.click': 'нажмите на стол', 'map.hint': 'Двигайте мышью',
    'sport.billiard': 'Бильярд', 'sport.tennis': 'Настольный теннис', 'tile.startSub': 'Открыть сессию', 'tile.perHour': 'в час',
    'zones.meta': 'Столов: {t} · занято: {b}', 'zones.hint': 'У каждой зоны свои столы и карта зала.', 'modal.type': 'Тип стола',
    'products.newTile': 'Новый товар', 'products.top': 'Топ', 'panel.menu': 'Меню', 'panel.open': 'Открыто',
    'done.title': 'Сессия завершена', 'done.note': 'Чек добавлен в историю', 'finish.rate': 'Тариф',
    'history.dayCount': 'Дней: {n}', 'history.split': 'Столы {a} · Товары {b}',
    'alarm.ending': '{t}: осталось 5 минут', 'alarm.over': '{t}: время вышло',
  },
};
let currentLang = localStorage.getItem('zona-lang') || 'uz';
const cur = () => I18N[currentLang]['cur'];
const t = k => (I18N[currentLang] && I18N[currentLang][k]) || I18N.uz[k] || k;

/* ---------------- Mavzular (uslublar) ---------------- */
/* Ko'rinish namunalari uchun har bir mavzuning asosiy ranglari (CSS'dagi token'lar bilan bir xil) */
const THEMES = {
  violet: { bg: '#070404', surf: '#1d0909', line: 'rgba(160,30,30,.32)', text: '#f6eaea', text3: '#8a6666', acc: '#a31c1c', gA: '#b82828', gB: '#420101', ink: '#fff2f2', r: '20px' },
  gold: { bg: '#0a0908', surf: '#1b1713', line: 'rgba(214,178,112,.24)', text: '#f5eddf', text3: '#857a64', acc: '#d6b270', gA: '#f6e2b0', gB: '#a87c34', ink: '#1b1407', r: '22px' },
  teal: { bg: '#050c0c', surf: '#11211f', line: 'rgba(64,224,200,.22)', text: '#e8f5f2', text3: '#61807a', acc: '#2fd6be', gA: '#b4fff2', gB: '#119983', ink: '#02201c', r: '26px' },
  felt: { bg: '#0a1710', surf: '#162e20', line: 'rgba(236,222,186,.24)', text: '#f4ecd8', text3: '#86816b', acc: '#e6d2a0', gA: '#fff6dc', gB: '#b89a5c', ink: '#1d1a0f', r: '10px' },
  light: { bg: '#f6f2f1', surf: '#ffffff', line: 'rgba(90,20,20,.19)', text: '#1f1010', text3: '#9c8686', acc: '#a31c1c', gA: '#cc3a3a', gB: '#6e0a0a', ink: '#fff6f6', r: '20px' },
};
const normTheme = m => (m === 'dark' || !THEMES[m]) ? 'violet' : m;
let themeMode = normTheme(localStorage.getItem('zona-theme'));

const swatchBg = k => {
  const v = THEMES[k];
  if (k === 'violet') return `linear-gradient(135deg, ${v.acc}, ${v.gB})`;
  return `linear-gradient(135deg, ${v.bg} 0 48%, ${v.acc} 52% 100%)`;
};
function swatchesHTML() {
  return Object.keys(THEMES).map(k => `<button type="button" class="swatch ${k === themeMode ? 'active' : ''}" data-theme-pick="${k}" title="${t('theme.' + k)}" aria-label="${t('theme.' + k)}" style="background:${swatchBg(k)}"></button>`).join('');
}
function themeCardsHTML() {
  return Object.keys(THEMES).map(k => {
    const v = THEMES[k];
    const prev = `radial-gradient(ellipse 80% 90% at 50% 0%, color-mix(in srgb, ${v.acc} 32%, transparent), transparent 70%), ${v.bg}`;
    return `
      <button type="button" class="theme-card ${k === themeMode ? 'active' : ''}" data-theme-pick="${k}">
        <span class="theme-prev" style="border-radius:${v.r};background:${prev}">
          <span class="theme-prev-t" style="color:${v.text}">Aa 12:40</span>
          <span class="theme-prev-bar" style="background:${v.surf};border-color:${v.line}"><i style="background:${v.acc};box-shadow:0 0 10px ${v.acc}"></i><i style="background:${v.text3}"></i></span>
          <span class="theme-prev-btn" style="background:linear-gradient(180deg, ${v.gA}, ${v.acc} 60%, ${v.gB});color:${v.ink}">${t('tile.start')}</span>
        </span>
        <span class="theme-info"><b>${t('theme.' + k)}</b><small>${t('theme.' + k + 'Desc')}</small></span>
        <span class="material-symbols-outlined theme-check">check_circle</span>
      </button>`;
  }).join('');
}
function renderThemePickers() {
  $('#login-swatches').innerHTML = swatchesHTML();
  $('#nav-swatches').innerHTML = swatchesHTML();
  $('#theme-grid').innerHTML = themeCardsHTML();
  $('#login-theme-name').textContent = t('theme.' + themeMode);
  $('#nav-theme-name').textContent = t('theme.' + themeMode);
  $('#theme-count').textContent = t('theme.count').replace('{n}', Object.keys(THEMES).length);
}
function applyTheme() {
  document.documentElement.dataset.theme = themeMode;
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.content = THEMES[themeMode].bg;
  renderThemePickers();
}
function setTheme(m) {
  themeMode = normTheme(m);
  try { localStorage.setItem('zona-theme', themeMode); } catch { /* xotira yopiq */ }
  applyTheme();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-theme-pick]');
  if (b) setTheme(b.dataset.themePick);
});

function applyStaticLang() {
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
}

function setLang(l) {
  currentLang = l;
  localStorage.setItem('zona-lang', l);
  document.documentElement.lang = l;
  applyStaticLang();
  setAuthMode(authMode);
  $$('#lang-seg [data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  renderThemePickers(); updateSoundUI();
  renderHome(); renderZones(); renderProducts(); renderAccess();
  if (!$('#view-history').hidden) renderHistory();
  if (currentPanel && sessions[currentPanel]) renderPanel();
  if (startTable) renderStartSheet();
}
$('#lang-seg').addEventListener('click', e => {
  const b = e.target.closest('[data-lang]');
  if (b) setLang(b.dataset.lang);
});

/* ---------------- Ovozli signal (WebAudio — fayl kerak emas) ---------------- */
let soundEnabled = localStorage.getItem('zona-sound') !== '0';
let audioCtx = null;
function ensureAudio() {
  try {
    if (!audioCtx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) audioCtx = new AC(); }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  } catch { /* ovoz yo'q */ }
  return audioCtx;
}
function tone(f, t0, d, vol) {
  const ac = audioCtx, o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(f, t0);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
  o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + d + 0.05);
}
/* Vaqt tugadi — qo'ng'iroq */
function soundAlarm(force) {
  if (!force && !soundEnabled) return;
  const ac = ensureAudio(); if (!ac) return;
  const t0 = ac.currentTime + 0.03;
  [0, 0.55, 1.1].forEach(k => { tone(1046.5, t0 + k, 0.5, 0.22); tone(1568, t0 + k, 0.35, 0.07); tone(784, t0 + k + 0.2, 0.6, 0.18); });
}
/* 5 daqiqa qoldi — qisqa signal */
function soundPing() {
  if (!soundEnabled) return;
  const ac = ensureAudio(); if (!ac) return;
  const t0 = ac.currentTime + 0.03;
  tone(1318.5, t0, 0.6, 0.14); tone(1975.5, t0 + 0.12, 0.5, 0.06);
}
/* Sessiya yakunlandi */
function soundChime() {
  if (!soundEnabled) return;
  const ac = ensureAudio(); if (!ac) return;
  const t0 = ac.currentTime + 0.03;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, t0 + i * 0.09, 0.7, 0.12));
}
function updateSoundUI() {
  $('#sound-ic').textContent = soundEnabled ? 'volume_up' : 'volume_off';
  $('#sound-toggle').classList.toggle('on', soundEnabled);
  $('#sound-toggle').title = t(soundEnabled ? 'sound.on' : 'sound.off');
  $('#sound-switch').setAttribute('aria-checked', String(soundEnabled));
}
function setSound(v) {
  soundEnabled = v;
  try { localStorage.setItem('zona-sound', v ? '1' : '0'); } catch { /* xotira yopiq */ }
  updateSoundUI();
  if (v) { ensureAudio(); setTimeout(soundPing, 30); }
  toast(t(v ? 'sound.on' : 'sound.off'), v ? 'volume_up' : 'volume_off');
}
/* Brauzer ovozni faqat foydalanuvchi bosgandan keyin ruxsat beradi */
document.addEventListener('pointerdown', () => { if (soundEnabled) ensureAudio(); }, { passive: true });
$('#sound-toggle').addEventListener('click', () => setSound(!soundEnabled));
$('#sound-switch').addEventListener('click', () => setSound(!soundEnabled));
$('#sound-test').addEventListener('click', () => soundAlarm(true));

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Ikonalar shrifti yuklanishini kutish — aks holda so'zlar ko'rinib qoladi (FOUT) */
if (document.fonts && document.fonts.load) {
  document.fonts.load('16px "Material Symbols Outlined"')
    .then(() => document.body.classList.add('fonts-loaded'))
    .catch(() => document.body.classList.add('fonts-loaded'));
  setTimeout(() => document.body.classList.add('fonts-loaded'), 3000);
} else {
  document.body.classList.add('fonts-loaded');
}

/* ---------------- Supabase ---------------- */
const SUPABASE_URL = 'https://cscjdmvchnxpqhnlietl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzY2pkbXZjaG54cHFobmxpZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2OTY5NTcsImV4cCI6MjEwMjI3Mjk1N30.r5zmmqDgMQsWHwqYiyzi1GpwnTEX8lG102UPXJ9v03c';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* Qurilma soati noto'g'ri bo'lsa ham taymer to'g'ri ishlashi uchun server vaqti bilan farq */
let clockSkew = 0;
const nowMs = () => Date.now() + clockSkew;
function syncClock(serverIso) {
  const t = Date.parse(serverIso);
  if (!isNaN(t)) clockSkew = t - Date.now();
}

/* ---------------- Ma'lumotlar ---------------- */
const state = { zones: [] };

/* Faol sessiyalar: tableId -> sessiya (bazadan yuklanadi) */
const sessions = {};

/* ---------------- Bazaga yozish (API) ---------------- */
async function apiAddZone(name) {
  const { data, error } = await sb.from('zones').insert({ name, sort_order: state.zones.length }).select().single();
  if (error) throw error;
  state.zones.push({ id: String(data.id), name: data.name, tables: [], products: [] });
}
async function apiUpdateZone(z, name) {
  const { error } = await sb.from('zones').update({ name }).eq('id', z.id);
  if (error) throw error;
  z.name = name;
}
async function apiDeleteZone(z) {
  const { error } = await sb.from('zones').delete().eq('id', z.id);
  if (error) throw error;
  state.zones = state.zones.filter(x => x.id !== z.id);
  Object.keys(sessions).forEach(tid => { if (!findTable(tid)) delete sessions[tid]; });
}
async function apiAddTable(zone, name, tariff, type) {
  const { data, error } = await sb.from('tables').insert({ zone_id: zone.id, name, tariff, sport: type, sort_order: zone.tables.length }).select().single();
  if (error) throw error;
  zone.tables.push({ id: String(data.id), name: data.name, tariff: Number(data.tariff), type: data.sport });
}
async function apiUpdateTable(tab, name, tariff, type) {
  const { error } = await sb.from('tables').update({ name, tariff, sport: type }).eq('id', tab.id);
  if (error) throw error;
  tab.name = name; tab.tariff = tariff; tab.type = type;
}
async function apiDeleteTable(tab, zone) {
  const { error } = await sb.from('tables').delete().eq('id', tab.id);
  if (error) throw error;
  zone.tables = zone.tables.filter(x => x.id !== tab.id);
  delete sessions[tab.id];
  delete lastStatus[tab.id];
}
async function apiAddProduct(zone, name, price, icon = 'local_cafe') {
  const { data, error } = await sb.from('products').insert({ zone_id: zone.id, name, price, icon, sold: 0, sort_order: zone.products.length }).select().single();
  if (error) throw error;
  zone.products.push({ id: String(data.id), name: data.name, price: Number(data.price), icon: data.icon, sold: data.sold });
}
async function apiUpdateProduct(p, name, price, icon = p.icon) {
  const { error } = await sb.from('products').update({ name, price, icon }).eq('id', p.id);
  if (error) throw error;
  p.name = name; p.price = price; p.icon = icon;
}
async function apiDeleteProduct(zone, p) {
  const { error } = await sb.from('products').delete().eq('id', p.id);
  if (error) throw error;
  zone.products = zone.products.filter(x => x.id !== p.id);
}
async function apiStartSession(tab, mode, rate, duration) {
  const { data, error } = await sb.from('sessions').insert({ table_id: tab.id, mode, rate, duration_sec: mode === 'countdown' ? duration : null }).select().single();
  if (error) throw error;
  syncClock(data.start_time);
  sessions[tab.id] = { id: String(data.id), mode, tableId: tab.id, rate, start: Date.parse(data.start_time), duration: data.duration_sec || undefined, products: [] };
}
async function apiExtendSession(s, addSec) {
  const { data, error } = await sb.rpc('extend_session', { p_session_id: Number(s.id), p_add_sec: addSec });
  if (error) throw error;
  s.duration = data;
}
async function apiDeleteSession(s) {
  const { error } = await sb.from('sessions').delete().eq('id', s.id);
  if (error) throw error;
  delete sessions[s.tableId];
  delete lastStatus[s.tableId];
}
async function apiFinishSession(s) {
  const { error } = await sb.rpc('finish_session', { p_session_id: Number(s.id) });
  if (error) throw error;
  delete sessions[s.tableId];
  delete lastStatus[s.tableId];
}
/* delta: +N qo'shish, -N ayirish. Server atomar hisoblaydi (bir vaqtda bosilsa ham dublikat bo'lmaydi) */
async function apiAddSessionProduct(s, pid, delta) {
  const { error } = await sb.rpc('add_session_product', { p_session_id: Number(s.id), p_product_id: Number(pid), p_delta: delta });
  if (error) throw error;
}

/* Supabase xatosini foydalanuvchiga tushunarli matnga aylantirish */
function errText(err) {
  const m = (err && (err.message || err.error_description)) || String(err);
  if (err && err.code === '23505' && /sessions_one_active/.test(m)) return t('err.tableBusy');
  if (err && err.code === 'P0002') return t('err.sessionGone');
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return t('net.title');
  return 'Supabase xatosi: ' + m;
}

/* ---------------- Bazadan yuklash + Realtime ---------------- */
let loadSeq = 0;
async function loadData() {
  const seq = ++loadSeq;
  try {
    const [zr, sr] = await Promise.all([
      sb.from('zones')
        .select('id, name, sort_order, tables(id, name, sport, tariff, sort_order), products(id, name, price, icon, sold, sort_order)')
        .order('sort_order', { foreignTable: 'tables' })
        .order('sort_order', { foreignTable: 'products' })
        .order('sort_order'),
      /* faqat faol sessiyalar va ularning mahsulotlari — tarix hajmiga bog'liq emas */
      sb.from('sessions').select('id, mode, rate, start_time, duration_sec, table_id, session_products(product_id, quantity)').is('end_time', null),
    ]);
    if (zr.error) throw zr.error;
    if (sr.error) throw sr.error;
    if (seq !== loadSeq) return; /* eskirgan javob */
    state.zones = (zr.data || []).map(z => ({
      id: String(z.id), name: z.name,
      tables: (z.tables || []).map(t => ({ id: String(t.id), name: t.name, tariff: Number(t.tariff), type: t.sport })),
      products: (z.products || []).map(p => ({ id: String(p.id), name: p.name, price: Number(p.price), icon: p.icon, sold: p.sold })),
    }));
    Object.keys(sessions).forEach(k => delete sessions[k]);
    (sr.data || []).forEach(s => {
      const obj = {
        id: String(s.id), mode: s.mode, tableId: String(s.table_id),
        rate: s.rate != null ? Number(s.rate) : undefined,
        start: Date.parse(s.start_time), duration: s.duration_sec || undefined,
        products: (s.session_products || []).map(r => ({ pid: String(r.product_id), qty: r.quantity })),
      };
      sessions[obj.tableId] = obj;
      lastStatus[obj.tableId] = statusOf(obj);
    });

    const focusInSheet = document.activeElement && document.activeElement.closest && document.activeElement.closest('#sheet');
    renderHome(); renderZones(); renderProducts();
    if (currentPanel) {
      if (sessions[currentPanel]) { if (!focusInSheet) renderPanel(); }
      else closeSheet();
    }
    loadHistory(); /* bugungi tushum (bosh ekrandagi statistika) */
  } catch (err) {
    toastErr(errText(err));
  }
}

let reloadTimer = null;
function onRemoteChange() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => { if (accessInfo && accessInfo.has_access) loadData(); }, 300);
}
let dbChannel = null;
function setupRealtime() {
  if (dbChannel) return;
  dbChannel = sb.channel('zona-db')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'zones' }, onRemoteChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, onRemoteChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, onRemoteChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, onRemoteChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'session_products' }, onRemoteChange)
    /* admin ruxsat bersa/olsa — darhol */
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_access' }, () => refreshAccess())
    .subscribe();
}
function teardownRealtime() {
  if (!dbChannel) return;
  sb.removeChannel(dbChannel);
  dbChannel = null;
}


/* ---------------- Yordamchilar ---------------- */
const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* Pul: "36 100 so'm" — raqamlar orasida bo'linmaydigan bo'shliq (qatorga bo'linib ketmasin) */
const fmtNum = n => Math.round(n || 0).toLocaleString('en-US').replace(/,/g, '\u00a0');
const fmtMoney = n => fmtNum(n) + '\u00a0' + cur();
const moneyHTML = n => `${fmtNum(n)}<small>${cur()}</small>`;
const pad = n => String(n).padStart(2, '0');

/* Narx inputlar uchun: "1 000", "23 000", "4 500 000" */
const fmtIn = n => Number(n).toLocaleString('en-US').replace(/,/g, ' ');
const parseIn = v => parseFloat(String(v).replace(/[^\d]/g, '')) || NaN;
function bindMoneyInput(input) {
  input.addEventListener('input', () => {
    const digits = input.value.replace(/[^\d]/g, '');
    input.value = digits ? fmtIn(digits) : '';
  });
}

function fmtTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
function fmtDur(sec) {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} ${t('time.min')}`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} ${t('time.hour')} ${r} ${t('time.min')}` : `${h} ${t('time.hour')}`;
}
const findZone = tid => state.zones.find(z => z.tables.some(t => t.id === tid));
const findTable = tid => state.zones.flatMap(z => z.tables).find(t => t.id === tid);
const productById = (zid, pid) => { const z = state.zones.find(x => x.id === zid); return z ? z.products.find(p => p.id === pid) : undefined; };

function sessionSeconds(s, now = nowMs()) {
  const elapsed = (now - s.start) / 1000;
  if (s.mode === 'stopwatch') return { elapsed, remaining: null, overtime: 0 };
  const remaining = s.duration - elapsed;
  if (remaining > 0) return { elapsed, remaining, overtime: 0 };
  return { elapsed, remaining: 0, overtime: -remaining };
}
function sessionPrice(s, now = nowMs()) {
  const sec = sessionSeconds(s, now);
  const tab = findTable(s.tableId);
  const tariff = s.rate ?? (tab ? tab.tariff : 0);
  if (s.mode === 'countdown' && sec.remaining > 0) return s.duration / 3600 * tariff;
  return sec.elapsed / 3600 * tariff;
}
function productSum(s) {
  const zone = findZone(s.tableId);
  if (!zone) return 0;
  return s.products.reduce((sum, e) => {
    const p = productById(zone.id, e.pid);
    return sum + (p ? p.price * e.qty : 0);
  }, 0);
}
function statusOf(s, now = nowMs()) {
  if (s.mode === 'stopwatch') return 'busy';
  const { remaining } = sessionSeconds(s, now);
  if (remaining > 0) return remaining <= 300 ? 'ending' : 'busy';
  return 'expired';
}

/* ---------------- Toast ---------------- */
function toast(msg, icon = 'check_circle', color = '') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-ic"${color ? ` style="--tc:${color}"` : ''}><span class="material-symbols-outlined">${escH(icon)}</span></span><span class="toast-text"></span>`;
  el.querySelector('.toast-text').textContent = msg;
  const box = $('#toasts');
  box.appendChild(el);
  while (box.children.length > 4) box.firstElementChild.remove();
  setTimeout(() => { el.classList.add('toast--out'); setTimeout(() => el.remove(), 300); }, 3200);
}
const toastErr = msg => toast(msg, 'error', 'var(--danger)');

/* ---------------- Sheet / Alert ---------------- */
let currentPanel = null;
let panelEdit = false;
let panelSearch = '';
let sheetCloseT = null;

function openSheet(html) {
  clearTimeout(sheetCloseT);
  const ov = $('#sheet');
  ov.classList.remove('closing');
  $('#sheet-body').innerHTML = html;
  ov.hidden = false;
  $$('#sheet-body .sheet-close, #sheet-body .sheet-handle').forEach(b => b.addEventListener('click', closeSheet));
  /* Enter — asosiy tugma (Saqlash / Boshlash) */
  $$('#sheet-body input:not([type=search])').forEach(i => i.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); $('#sheet-body .sheet-actions .btn--gold')?.click(); }
  }));
}
function closeSheet() {
  currentPanel = null; panelEdit = false; panelSearch = ''; startTable = null;
  const ov = $('#sheet');
  if (ov.hidden || ov.classList.contains('closing')) return;
  ov.classList.add('closing');
  clearTimeout(sheetCloseT);
  sheetCloseT = setTimeout(() => { ov.hidden = true; ov.classList.remove('closing'); }, 320);
}
let alertSeq = 0;
function openAlert(html) {
  alertSeq++;
  const box = $('#alert-body');
  box.classList.remove('pop-out');
  box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
  box.innerHTML = html;
  $('#alert').hidden = false;
}
function closeAlert() {
  const alert = $('#alert');
  if (alert.hidden) return;
  const box = $('#alert-body');
  const seq = alertSeq;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (seq !== alertSeq) return; /* shu orada yangi oyna ochildi */
    box.classList.remove('pop-out');
    alert.hidden = true;
  };
  box.classList.add('pop-out');
  box.addEventListener('animationend', e => { if (e.target === box) finish(); }, { once: true });
  /* animatsiya ishlamasa ham (reduced motion, eski brauzer) oyna albatta yopilsin */
  setTimeout(finish, 260);
}

$('#sheet').addEventListener('click', e => { if (e.target === $('#sheet')) closeSheet(); });
$('#alert').addEventListener('click', e => { if (e.target === $('#alert')) closeAlert(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#alert').hidden) closeAlert(); else closeSheet(); } });

/* ---------------- Login ---------------- */
const loginForm = $('#login-form');

function showFieldError(id, msg) {
  const input = $(`#${id}`);
  input.classList.add('input-error');
  input.closest('.field').querySelector('.field-error').textContent = msg;
}
function clearFieldErrors() {
  $$('.field input').forEach(i => i.classList.remove('input-error'));
  $$('.field-error').forEach(el => el.textContent = '');
  $('#login-error').hidden = true;
}

$('#eye-toggle').addEventListener('click', () => {
  const p = $('#login-password');
  p.type = p.type === 'password' ? 'text' : 'password';
});

$('#eye-toggle-confirm').addEventListener('click', () => {
  const p = $('#login-confirm');
  p.type = p.type === 'password' ? 'text' : 'password';
});

let authMode = 'login';

function resetLoginBtn() {
  const btn = $('#login-btn');
  btn.disabled = false;
  btn.querySelector('.spinner').hidden = true;
  btn.querySelector('.btn-label').textContent = t('login.btn');
}

function setAuthMode(mode) {
  authMode = mode;
  $('#login-error').hidden = true;
  $('#confirm-field').hidden = mode !== 'signup';
  const label = $('#login-btn').querySelector('.btn-label');
  const toggleLabel = $('#mode-toggle-label');
  const toggleIc = $('#mode-toggle-ic');
  const title = $('#login-mode-title');
  title.dataset.i18n = mode === 'signup' ? 'login.signupBtn' : 'login.btn';
  title.textContent = t(title.dataset.i18n);
  const sub = $('#login-mode-sub');
  sub.dataset.i18n = mode === 'signup' ? 'login.subSignup' : 'login.subLogin';
  sub.textContent = t(sub.dataset.i18n);
  if (mode === 'signup') {
    label.textContent = t('login.signupBtn');
    label.dataset.i18n = 'login.signupBtn';
    $('#login-btn').setAttribute('aria-label', t('login.signupBtn'));
    toggleLabel.textContent = t('login.btn');
    toggleLabel.dataset.i18n = 'login.btn';
    toggleIc.textContent = 'login';
    $('#login-error').dataset.i18n = 'login.userExists';
  } else {
    label.textContent = t('login.btn');
    label.dataset.i18n = 'login.btn';
    $('#login-btn').setAttribute('aria-label', t('login.btn'));
    toggleLabel.textContent = t('login.signupBtn');
    toggleLabel.dataset.i18n = 'login.signupBtn';
    toggleIc.textContent = 'person_add';
    $('#login-error').dataset.i18n = 'login.error';
  }
}

$('#mode-toggle').addEventListener('click', () => setAuthMode(authMode === 'login' ? 'signup' : 'login'));

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  clearFieldErrors();
  const signup = authMode === 'signup';
  const u = $('#login-username').value.trim();
  const p = $('#login-password').value;
  let ok = true;
  if (!u) { showFieldError('login-username', t('err.required')); ok = false; }
  if (!p) { showFieldError('login-password', t('err.required')); ok = false; }
  if (signup) {
    const c = $('#login-confirm').value;
    if (!c) { showFieldError('login-confirm', t('err.required')); ok = false; }
    else if (c !== p) { showFieldError('login-confirm', t('login.passMismatch')); ok = false; }
  }
  if (!ok) return;

  const btn = $('#login-btn');
  const label = btn.querySelector('.btn-label');
  btn.disabled = true;
  label.textContent = t(signup ? 'login.signupBtnBusy' : 'login.btnBusy');
  btn.querySelector('.spinner').hidden = false;

  try {
    const { error, data } = signup
      ? await sb.auth.signUp({ email: u, password: p })
      : await sb.auth.signInWithPassword({ email: u, password: p });
    if (error) throw error;
    if (signup && !data.session) {
      btn.disabled = false;
      label.textContent = t('login.signupBtn');
      btn.querySelector('.spinner').hidden = true;
      $('#login-error').dataset.i18n = 'login.checkEmail';
      $('#login-error').textContent = t('login.checkEmail');
      $('#login-error').hidden = false;
    }
  } catch (err) {
    btn.disabled = false;
    label.textContent = t(signup ? 'login.signupBtn' : 'login.btn');
    btn.querySelector('.spinner').hidden = true;
    $('#login-error').hidden = false;
    const m = err && err.message ? err.message : t('login.error');
    if (/already registered|already been registered|already exists/i.test(m)) {
      $('#login-error').textContent = t('login.userExists');
    } else if (/at least 6/i.test(m)) {
      $('#login-error').textContent = t('login.passTooShort');
    } else if (/banned|disabled|blocked/i.test(m)) {
      $('#login-error').textContent = t('login.banned');
    } else {
      $('#login-error').textContent = signup ? m : t('login.error');
    }
  }
});

/* ---------------- Auth ---------------- */
let currentUser = null;
let appUserId = null; /* ilova qaysi foydalanuvchi uchun ochilgan */

/* Kirish ekranidagi 3D stol sichqonchaga ergashadi */
$('#view-login').addEventListener('mousemove', e => {
  if (reduceMotion()) return;
  const a = $('#art-table');
  const x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
  a.style.setProperty('--px', (x * 12).toFixed(2) + 'deg');
  a.style.setProperty('--py', (y * -10).toFixed(2) + 'deg');
});

function enterApp() {
  /* Supabase tab qayta faollashganda ham SIGNED_IN yuboradi — o'sha foydalanuvchi uchun ilovani qayta ochmaymiz */
  if (currentUser && appUserId === currentUser.id) return;
  appUserId = currentUser ? currentUser.id : null;
  $('#view-login').hidden = true;
  document.body.classList.add('in-app');
  $('#bottom-nav').hidden = false;
  closeSheet(); closeAlert();
  renderProfile();
  loginForm.reset();
  resetLoginBtn();
  showView('home');
  refreshAccess(true);
  setupRealtime();
}

function exitToLogin() {
  appUserId = null;
  accessInfo = null;
  closeSheet(); closeAlert();
  teardownRealtime();
  state.zones = [];
  Object.keys(sessions).forEach(k => delete sessions[k]);
  histSessions = []; histDays = [];
  $('#blocked-overlay').hidden = true;
  $('#access-overlay').hidden = true;
  $('#trial-banner').hidden = true;
  $('#bottom-nav').hidden = true;
  document.body.classList.remove('in-app');
  VIEWS.forEach(x => { $(`#view-${x}`).hidden = true; });
  $('#view-login').hidden = false;
  $('#login-error').hidden = true;
  setAuthMode('login');
  resetLoginBtn();
}

sb.auth.onAuthStateChange((evt, session) => {
  if (evt === 'SIGNED_IN' || evt === 'INITIAL_SESSION') {
    if (!session) return;
    currentUser = session.user;
    /* onAuthStateChange ichida Supabase so'rovlarini kutish deadlock beradi — keyingi tickda */
    setTimeout(enterApp, 0);
  } else if (evt === 'USER_UPDATED' && session) {
    currentUser = session.user;
  } else if (evt === 'SIGNED_OUT') {
    currentUser = null;
    exitToLogin();
  }
});

/* ---------------- Ruxsat (admin tasdig'i) ---------------- */
let accessInfo = null;

function daysLeft(iso) {
  const ms = Date.parse(iso) - nowMs();
  return Math.max(0, Math.ceil(ms / 86400000));
}

function renderAccess() {
  const a = accessInfo;
  const overlay = $('#access-overlay');
  const banner = $('#trial-banner');
  if (!a || !currentUser) { overlay.hidden = true; banner.hidden = true; return; }
  if (a.banned) { overlay.hidden = true; banner.hidden = true; showBlocked(true); return; }
  showBlocked(false);
  if (a.has_access) {
    overlay.hidden = true;
    if (a.status === 'pending' && a.trial_until) {
      banner.hidden = false;
      $('#trial-banner-text').textContent = t('access.trialLeft').replace('{n}', daysLeft(a.trial_until));
    } else banner.hidden = true;
    return;
  }
  banner.hidden = true;
  const rejected = a.status === 'rejected';
  $('#access-ic').textContent = rejected ? 'block' : 'hourglass_top';
  $('#access-ic-wrap').className = 'sys-alert-ic ' + (rejected ? 'sys-alert-ic--danger' : 'sys-alert-ic--warn');
  $('#access-title').textContent = t(rejected ? 'access.rejectedTitle' : 'access.pendingTitle');
  /* trial_until yo'q — yangi hisob, admin hali sinovni boshlamagan */
  $('#access-text').textContent = rejected ? t('access.rejectedText')
    : a.trial_until ? t('access.pendingText')
    : t('access.newText').replace('{n}', a.trial_days || 7);
  $('#access-email').textContent = currentUser.email || '';
  overlay.hidden = false;
}

/* Ruxsat holatini serverdan olish. Birinchi kirishda so'rov shu yerda (yoki signup trigger'ida) yaratiladi. */
let accessBusy = false;
async function refreshAccess(forceLoad = false) {
  if (!currentUser || accessBusy) return;
  accessBusy = true;
  try {
    const { data, error } = await sb.rpc('request_access');
    if (error) {
      /* foydalanuvchi o'chirilgan (FK xatosi) yoki sessiya yaroqsiz — chiqarib yuboramiz */
      if (error.code === '23503' || error.code === '42501' || error.status === 401 || error.status === 403) {
        await sb.auth.signOut();
      }
      return;
    }
    if (!data) return;
    if (data.server_time) syncClock(data.server_time);
    const had = accessInfo && accessInfo.has_access;
    accessInfo = data;
    renderAccess();
    if (data.has_access && (forceLoad || !had)) loadData();
  } catch { /* tarmoq xatosi — keyingi urinishda */ }
  finally { accessBusy = false; }
}

/* ---------------- Navigatsiya ---------------- */
const VIEWS = ['home', 'zones', 'history', 'products', 'profile'];
let enterT = null;

function showView(v) {
  const changed = $(`#view-${v}`).hidden;
  VIEWS.forEach(x => { $(`#view-${x}`).hidden = x !== v; });
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === v));
  $('#nav-indicator').style.transform = `translateY(${VIEWS.indexOf(v) * 52}px)`;
  if (changed) {
    /* kirish animatsiyasi faqat bo'lim ochilganda (qayta chizishda takrorlanmaydi) */
    const el = $(`#view-${v}`);
    $$('.view.entering').forEach(x => x.classList.remove('entering'));
    void el.offsetWidth;
    el.classList.add('entering');
    clearTimeout(enterT);
    enterT = setTimeout(() => el.classList.remove('entering'), 1400);
    try { window.scrollTo(0, 0); } catch { /* eski brauzer */ }
  }
  if (v === 'home') { renderHome(); if (changed) countUp('#stat-today', todayTotal()); }
  if (v === 'zones') renderZones();
  if (v === 'history') { renderHistory(); loadHistory(); if (changed) countUp('#hist-today', todayTotal()); }
  if (v === 'products') renderProducts();
}

$('#bottom-nav').addEventListener('click', e => {
  const btn = e.target.closest('.nav-btn');
  if (btn) showView(btn.dataset.tab);
});
$$('[data-nav]').forEach(b => b.addEventListener('click', () => showView(b.dataset.nav)));
$('#first-table-btn').addEventListener('click', () => showView('zones'));

/* Raqamni 0 dan sanab chiqish (bosh ekran / tarix ochilganda). Animatsiya paytida qiymat yangilansa — maqsad yangilanadi */
const countRaf = {}, countTarget = {};
function countUp(sel, value) {
  const el = $(sel);
  if (!el || reduceMotion() || !value) return;
  cancelAnimationFrame(countRaf[sel]);
  countTarget[sel] = value;
  const t0 = performance.now();
  const step = now => {
    const p = Math.min(1, (now - t0) / 1200);
    const cur = $(sel);
    if (cur) cur.textContent = fmtNum(countTarget[sel] * (1 - Math.pow(1 - p, 3)));
    if (p < 1) countRaf[sel] = requestAnimationFrame(step);
    else delete countRaf[sel];
  };
  countRaf[sel] = requestAnimationFrame(step);
}
function setCount(sel, value) {
  countTarget[sel] = value;
  if (countRaf[sel]) return; /* animatsiya o'zi yetib boradi */
  const el = $(sel);
  if (el) el.textContent = fmtNum(value);
}

/* ---------------- Sana nomlari ---------------- */
const MONTH_NAMES = {
  uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
};
/* "23 сентября" — ruscha sana qaratqich kelishigida */
const MONTH_GEN_RU = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const WEEKDAYS = {
  uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
};
const WEEKDAYS_SHORT = {
  uz: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const monthKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const hm = d => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const dayMonth = d => currentLang === 'ru' ? `${d.getDate()} ${MONTH_GEN_RU[d.getMonth()]}` : `${d.getDate()} ${MONTH_NAMES[currentLang][d.getMonth()]}`;
const dayLabel = d => `${dayMonth(d)} ${d.getFullYear()}`;
const parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };

/* ---------------- Stol ko'rinishi (billiard / tennis) ---------------- */
const typeName = type => t(type === 'tennis' ? 'sport.tennis' : 'sport.billiard');
const typeKey = type => type === 'tennis' ? 'tennis' : 'billiard';
const seedDelay = id => '-' + ([...String(id)].reduce((a, ch) => a + ch.charCodeAt(0) * 7, 0) * 1.3 % 8.8).toFixed(2) + 's';
/* Kichik stol (ro'yxatlar uchun) */
const miniT = type => `<span class="mini-t mini-t--${typeKey(type)}"><i></i></span>`;
/* Stol (kartalar, xarita, sheet): faol billiardda sharlar yuradi, tennisda ralli */
function tableVis(type, active, size = '', seed = '') {
  const k = typeKey(type);
  const marks = k === 'tennis' ? '<i class="mt-net"></i><i class="mt-line"></i>' : [1, 2, 3, 4, 5, 6].map(n => `<i class="mt-pk p${n}"></i>`).join('');
  let fx = '';
  if (active && k === 'billiard') {
    fx = `<div class="balls" data-zbox="${size === 'sm' ? 7 : 8}">${[1, 2, 3, 4, 5].map(n => `<i class="b${n}" data-zb></i>`).join('')}</div>`;
  } else if (active) {
    fx = `<div class="rally" style="--rd:${seedDelay(seed)}"><div class="paddle paddle--l"><i class="grip"></i><i class="head"></i></div><div class="paddle paddle--r"><i class="grip"></i><i class="head"></i></div><div class="pong"><i></i></div></div>`;
  }
  return `<div class="mt mt--${k}${size ? ' mt--' + size : ''}"><div class="mt-rail"></div><div class="mt-felt"></div>${marks}${fx}</div>`;
}

/* ---------------- Sessiya holati yordamchilari ---------------- */
/* free | busy | ending | over — rang faqat shu holatni bildiradi */
function tileState(s, now = nowMs()) {
  if (!s) return 'free';
  const st = statusOf(s, now);
  return st === 'expired' ? 'over' : st === 'ending' ? 'ending' : 'busy';
}
const stateLabel = st => st === 'over' ? t('panel.timeOver') : st === 'ending' ? t('panel.ending') : st === 'busy' ? t('panel.active') : t('zones.statusFree');
function timerText(s, now = nowMs()) {
  const sec = sessionSeconds(s, now);
  return sec.overtime > 0 ? '+' + fmtTime(sec.overtime) : fmtTime(sec.remaining ?? sec.elapsed);
}
/* Taymer rejimida qolgan vaqt ulushi (%) — progress chizig'i uchun */
function progressPct(s, now = nowMs()) {
  if (s.mode !== 'countdown' || !s.duration) return null;
  const { remaining } = sessionSeconds(s, now);
  return Math.max(0, Math.min(100, remaining / s.duration * 100));
}
/* Halqa taymer: taymerda — qolgan ulush, sekundomerda — soniya aylanasi */
function dialPct(s, now = nowMs()) {
  if (s.mode === 'countdown') return statusOf(s, now) === 'expired' ? 100 : (progressPct(s, now) || 0);
  return (sessionSeconds(s, now).elapsed % 60) / 60 * 100;
}
const productCount = s => s.products.reduce((n, e) => n + e.qty, 0);
const liveTotal = (now = nowMs()) => Object.values(sessions).reduce((sum, s) => sum + sessionPrice(s, now) + productSum(s), 0);

/* ---------------- STOLLAR (asosiy ekran) ---------------- */
let activeFilter = 'all';
let searchQuery = '';
let homeZoneId = null;
let homeView = localStorage.getItem('zona-view') === 'map' ? 'map' : 'grid';
const mapMQ = window.matchMedia('(min-width: 1024px)');
const showMap = () => homeView === 'map' && mapMQ.matches;

function cardFor(tab, i = 0) {
  const s = sessions[tab.id];
  const st = tileState(s);
  const head = `
    <div class="tc-head">
      <div class="tc-title"><div class="tc-name">${escH(tab.name)}</div><div class="tc-sport">${typeName(tab.type)}</div></div>
      <span class="st-pill"><i></i>${stateLabel(st)}</span>
    </div>`;
  let foot;
  if (!s) {
    foot = `
      <div class="tc-row">
        <div class="tc-start"><span class="play"><span class="material-symbols-outlined">play_arrow</span></span><div><b>${t('tile.start')}</b><small>${t('tile.startSub')}</small></div></div>
        <div class="tc-rate"><b>${fmtMoney(tab.tariff)}</b><small>${t('tile.perHour')}</small></div>
      </div>`;
  } else {
    const label = st === 'over' ? t('panel.overtime') : s.mode === 'countdown' ? t('panel.timeLeft') : t('panel.timePassed');
    const pct = progressPct(s);
    const n = productCount(s);
    foot = `
      <div class="tc-row">
        <div>
          <div class="tc-label"><span class="material-symbols-outlined">${s.mode === 'countdown' ? 'hourglass_top' : 'timer'}</span>${label}</div>
          <div class="tc-timer" data-timer="${tab.id}">${timerText(s)}</div>
        </div>
        <div class="tc-right">
          ${n ? `<div class="tc-extra"><span class="material-symbols-outlined">local_cafe</span>${n}</div>` : ''}
          <div class="tc-sum" data-total-price="${tab.id}">${fmtMoney(sessionPrice(s) + productSum(s))}</div>
        </div>
      </div>
      ${pct !== null && st !== 'over' ? `<div class="progress"><i data-progress="${tab.id}" style="width:${pct.toFixed(1)}%"></i></div>` : ''}`;
  }
  return `
    <div class="table-card is-${st} st-${st}" role="button" tabindex="0" data-action="${s ? 'panel' : 'start'}" data-tid="${tab.id}" style="--i:${i}">
      <div class="tc">
        <div class="tc-light"></div>
        <div class="tc-cord"></div>
        <div class="tc-vis">${tableVis(tab.type, !!s, '', tab.id)}</div>
        <div class="tc-sheen"></div>
        ${head}
        <div class="tc-foot">${foot}</div>
      </div>
    </div>`;
}

/* Zal xaritasi / zona sxemasi uchun stollar joylashuvi (% da). 6 ta stol — 3×2 */
function layoutSlots(n) {
  if (!n) return [];
  const cols = n <= 3 ? n : n <= 6 ? 3 : n <= 8 ? 4 : n <= 15 ? 5 : 6;
  const rows = Math.ceil(n / cols);
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const inRow = r === rows - 1 ? n - r * cols : cols;
    const span = cols > 1 ? 52 : 0;
    const x0 = 44 - span / 2 * ((inRow - 1) / Math.max(1, cols - 1));
    const x = inRow > 1 ? x0 + c * (span / (cols - 1)) : 44;
    const y = rows > 1 ? 24 + r * (52 / (rows - 1)) : 50;
    out.push({ x, y });
  }
  return out;
}

function renderMap(zone, list) {
  const box = $('#table-map');
  if (!zone) { box.innerHTML = ''; return; }
  const tabs = zone.tables;
  const pos = layoutSlots(tabs.length);
  const sc = tabs.length > 15 ? .62 : tabs.length > 8 ? .78 : 1;
  const items = tabs.map((tab, i) => {
    const s = sessions[tab.id];
    const st = tileState(s);
    const w = Math.round((tab.type === 'tennis' ? 128 : 156) * sc), h = Math.round((tab.type === 'tennis' ? 72 : 82) * sc);
    const dim = list.includes(tab) ? '' : ' dim';
    return `
      <div class="map-t is-${st} st-${st}${dim}" data-action="${s ? 'panel' : 'start'}" data-tid="${tab.id}" role="button" tabindex="0"
        style="left:${pos[i].x.toFixed(2)}%;top:${pos[i].y.toFixed(2)}%;width:${w}px;height:${h}px;margin-left:${-w / 2}px;margin-top:${-h / 2}px">
        <div class="map-glow"></div>
        ${tableVis(tab.type, !!s, 'sm', tab.id)}
        <div class="billboard"><div class="map-chip"><i></i><b>${escH(tab.name)}</b><span${s ? ` data-timer="${tab.id}"` : ''}>${s ? timerText(s) : t('zones.statusFree')}</span></div></div>
      </div>`;
  }).join('');
  const prev = $('#map-plane');
  const keep = prev ? prev.getAttribute('style') || '' : '';
  box.innerHTML = `
    <div class="map" id="map-box">
      <div class="map-lamp"></div>
      <div class="map-plane" id="map-plane" style="${escH(keep)}">
        <div class="map-door"></div>
        ${items}
      </div>
      <div class="map-title"><b>${escH(zone.name)}</b><span>· ${t('map.click')}</span></div>
      <div class="map-hint"><span class="material-symbols-outlined">3d_rotation</span>${t('map.hint')}</div>
    </div>`;
}
$('#table-map').addEventListener('mousemove', e => {
  const pl = $('#map-plane'), box = $('#map-box');
  if (!pl || !box || reduceMotion()) return;
  const r = box.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  pl.style.setProperty('--rx', (50 - y * 10).toFixed(2) + 'deg');
  pl.style.setProperty('--rz', (x * 12).toFixed(2) + 'deg');
});
$('#table-map').addEventListener('mouseleave', () => {
  const pl = $('#map-plane');
  if (pl) { pl.style.removeProperty('--rx'); pl.style.removeProperty('--rz'); }
});

function currentZone() {
  if (!state.zones.length) return null;
  if (!state.zones.some(z => z.id === homeZoneId)) homeZoneId = state.zones[0].id;
  return state.zones.find(z => z.id === homeZoneId);
}
function zoneTables() {
  const z = currentZone();
  return z ? z.tables : [];
}

function visibleTables() {
  let list = zoneTables().filter(tab => {
    const has = !!sessions[tab.id];
    if (activeFilter === 'free') return !has;
    if (activeFilter === 'busy') return has;
    return true;
  });
  if (searchQuery) list = list.filter(tab => tab.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return list;
}

function updateLiveStat(now = nowMs()) {
  const live = liveTotal(now);
  const el = $('#stat-live');
  if (el) el.textContent = fmtNum(live);
  $('#nav-live').textContent = fmtMoney(live);
}
const todayTotal = () => histSessions.reduce((x, s) => x + finSummary(s).total, 0);
function renderTodayStat() {
  setCount('#stat-today', todayTotal());
  $('#stat-today-note').textContent = t('stats.doneN').replace('{n}', histSessions.length);
}

function renderHome() {
  const now = new Date();
  $('#home-date').textContent = `${WEEKDAYS[currentLang][now.getDay()]}, ${dayMonth(now)}`;

  const zone = currentZone();
  const tabsEl = $('#home-zone-tabs');
  if (state.zones.length > 1) {
    tabsEl.innerHTML = state.zones.map(z => {
      const busy = z.tables.filter(x => sessions[x.id]).length;
      return `<button class="zone-tab ${z.id === homeZoneId ? 'active' : ''}" data-htab="${z.id}">${escH(z.name)}${busy ? `<span class="cnt">${busy}</span>` : ''}</button>`;
    }).join('');
  } else if (zone) {
    tabsEl.innerHTML = `<div class="zone-chip"><span class="zone-chip-ic"><span class="material-symbols-outlined">location_on</span></span>${escH(zone.name)}</div>`;
  } else tabsEl.innerHTML = '';

  const all = state.zones.flatMap(z => z.tables);
  const busyAll = all.filter(x => sessions[x.id]).length;
  const active = Object.keys(sessions).length;
  $('#stat-busy').textContent = busyAll;
  $('#stat-total').textContent = `/ ${all.length}`;
  $('#busy-dots').innerHTML = all.map(x => `<i${sessions[x.id] ? ' class="on"' : ''}></i>`).join('');
  $('#stat-free-note').textContent = t('stats.freeN').replace('{n}', all.length - busyAll);
  $('#stat-live-note').textContent = t('stats.liveNote').replace('{n}', active);
  $('#nav-active').textContent = t('stats.activeN').replace('{n}', active);
  $('#nav-busy').hidden = !busyAll;
  $('#nav-busy').textContent = busyAll;
  updateLiveStat();
  renderTodayStat();

  const zt = zoneTables();
  const busyZone = zt.filter(x => sessions[x.id]).length;
  $('#cnt-all').textContent = zt.length;
  $('#cnt-busy').textContent = busyZone;
  $('#cnt-free').textContent = zt.length - busyZone;
  $$('#view-toggle [data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === homeView));

  const empty = all.length === 0;
  $('#home-empty').hidden = !empty;
  $('#home-stats').hidden = empty;
  $('#home-toolbar').hidden = empty;
  $('#search-input').closest('.search').hidden = empty;
  $('#view-toggle').hidden = empty;
  const list = visibleTables();
  const map = !empty && showMap();
  $('#table-grid').hidden = map;
  $('#table-map').hidden = !map;
  if (map) { $('#table-grid').innerHTML = ''; renderMap(zone, list); }
  else { $('#table-map').innerHTML = ''; $('#table-grid').innerHTML = list.map(cardFor).join(''); }
  $('#table-grid').classList.add('stagger');
  $('#home-nomatch').hidden = empty || map || list.length > 0;
  startBalls();
}

$('#home-zone-tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-htab]');
  if (!b) return;
  homeZoneId = b.dataset.htab;
  renderHome();
});
$('#filter-chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  $$('#filter-chips .chip').forEach(c => c.classList.toggle('active', c === chip));
  activeFilter = chip.dataset.filter;
  renderHome();
});
$('#search-input').addEventListener('input', e => { searchQuery = e.target.value.trim(); renderHome(); });
$('#search-input').addEventListener('keydown', e => { if (e.key === 'Escape') { e.target.value = ''; searchQuery = ''; renderHome(); } });
$('#view-toggle').addEventListener('click', e => {
  const b = e.target.closest('[data-view]');
  if (!b) return;
  homeView = b.dataset.view;
  try { localStorage.setItem('zona-view', homeView); } catch { /* xotira yopiq */ }
  renderHome();
});
/* Ekran torayib xarita yashirinsa — kartalarga qaytadi (va aksincha) */
mapMQ.addEventListener?.('change', () => { if (!$('#view-home').hidden) renderHome(); });

function onTableAction(e) {
  const card = e.target.closest('[data-action]');
  if (!card) return;
  const tab = findTable(card.dataset.tid);
  if (!tab) return;
  if (card.dataset.action === 'start') openStartSheet(tab);
  else openPanel(tab);
}
function onTableKey(e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-action]')) { e.preventDefault(); e.target.click(); }
}
$('#table-grid').addEventListener('click', onTableAction);
$('#table-map').addEventListener('click', onTableAction);
$('#table-grid').addEventListener('keydown', onTableKey);
$('#table-map').addEventListener('keydown', onTableKey);

/* Kartalarni sichqoncha bilan qiyshaytirish (3D) — faqat sichqonchali qurilmada */
function bindTilt(container, sel) {
  container.addEventListener('mousemove', e => {
    const el = e.target.closest(sel);
    if (!el || !finePointer() || reduceMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateX(${((.5 - y) * 12).toFixed(2)}deg) rotateY(${((x - .5) * 14).toFixed(2)}deg) translateZ(8px)`;
    el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    el.style.setProperty('--go', '1');
  });
  container.addEventListener('mouseout', e => {
    const el = e.target.closest(sel);
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    el.style.transform = '';
    el.style.setProperty('--go', '0');
  });
}
bindTilt($('#table-grid'), '.tc');

/* Faol billiard stollarida sharlar (oddiy fizika: devor va bir-biriga urilish) */
let ballsRaf = 0;
const ballState = new WeakMap();
function startBalls() {
  if (ballsRaf) return;
  let last = performance.now();
  const frame = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const boxes = document.querySelectorAll('[data-zbox]');
    if (!boxes.length) { ballsRaf = 0; return; }
    const still = reduceMotion();
    boxes.forEach(box => {
      const r = +box.dataset.zbox / 2, bw = box.clientWidth, bh = box.clientHeight;
      if (!bw) return;
      const els = box.querySelectorAll('[data-zb]');
      let st = ballState.get(box);
      if (!st || st.n !== els.length) {
        const bs = [];
        els.forEach(() => {
          let x, y, k = 0;
          do { x = r + Math.random() * (bw - 2 * r); y = r + Math.random() * (bh - 2 * r); k++; }
          while (k < 40 && bs.some(b => Math.hypot(b.x - x, b.y - y) < 2 * r + 2));
          const a = Math.random() * 6.283, sp = 38 + Math.random() * 34;
          bs.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp });
        });
        st = { n: els.length, bs };
        ballState.set(box, st);
      }
      const bs = st.bs;
      if (!still) {
        bs.forEach(b => {
          b.x += b.vx * dt; b.y += b.vy * dt;
          if (b.x < r) { b.x = r; b.vx = Math.abs(b.vx); } else if (b.x > bw - r) { b.x = bw - r; b.vx = -Math.abs(b.vx); }
          if (b.y < r) { b.y = r; b.vy = Math.abs(b.vy); } else if (b.y > bh - r) { b.y = bh - r; b.vy = -Math.abs(b.vy); }
        });
        for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
          const a = bs[i], b = bs[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .001;
          if (d < 2 * r) {
            const nx = dx / d, ny = dy / d, o = (2 * r - d) / 2;
            a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o;
            const pv = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (pv > 0) { a.vx -= pv * nx; a.vy -= pv * ny; b.vx += pv * nx; b.vy += pv * ny; }
          }
        }
      }
      els.forEach((el, i) => { el.style.transform = `translate3d(${(bs[i].x - r).toFixed(2)}px,${(bs[i].y - r).toFixed(2)}px,0)`; });
    });
    ballsRaf = requestAnimationFrame(frame);
  };
  ballsRaf = requestAnimationFrame(frame);
}

/* Sheet sarlavhasi: kichik ustki yozuv, katta nom, yopish tugmasi */
function sheetHead(title, eyebrow, icon = '', small = false) {
  return `
    <div class="sheet-handle"></div>
    <header class="sheet-head">
      ${icon ? `<span class="sheet-head-ic">${icon}</span>` : ''}
      <div class="sheet-head-text">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
        <div class="sheet-title${small ? ' sheet-title--sm' : ''}">${title}</div>
      </div>
      <button class="sheet-close" aria-label="${t('common.cancel')}"><span class="material-symbols-outlined">close</span></button>
    </header>`;
}
const msIcon = name => `<span class="material-symbols-outlined">${escH(name)}</span>`;
const stage = (type, small = false) => `<div class="stage${small ? ' stage--sm' : ''}"><div class="stage-float"><div class="stage-t">${tableVis(type, false, 'lg')}</div></div></div>`;

/* ---------------- SESSIYANI BOSHLASH ---------------- */
let startTable = null;
let startMode = 'stopwatch';
let startDuration = 3600;
let startRateDraft = null;
const DURATION_PRESETS = [1800, 3600, 5400, 7200, 10800];
const presetLabel = sec => sec % 3600 === 0 ? `${sec / 3600} ${t('time.hour')}`
  : sec > 3600 && sec % 1800 === 0 ? `${(sec / 3600).toLocaleString(currentLang === 'en' ? 'en-US' : 'ru-RU')} ${t('time.hour')}`
  : `${sec / 60} ${t('start.minutes')}`;

function openStartSheet(tab) {
  startTable = tab;
  startMode = 'stopwatch';
  startDuration = 3600;
  startRateDraft = null;
  renderStartSheet();
}

function startEstimate() {
  const rate = parseIn(startRateDraft ?? fmtIn(startTable.tariff));
  return startMode === 'countdown' && rate > 0 ? rate * startDuration / 3600 : null;
}

function renderStartSheet() {
  const tab = startTable;
  if (!tab) return;
  const zone = findZone(tab.id);
  const rateVal = startRateDraft ?? fmtIn(tab.tariff);
  const est = startEstimate();

  const mc = (mode, icon, name, hint) => `
    <button class="mode-card ${startMode === mode ? 'active' : ''}" data-mode="${mode}">
      <span class="mode-ic">${msIcon(icon)}</span><b>${name}</b><small>${hint}</small>
      <span class="material-symbols-outlined mode-check">check_circle</span>
    </button>`;
  openSheet(`
    ${sheetHead(escH(tab.name), `${t('start.title')} · ${escH(zone.name)}`)}
    <div class="sheet-content">
      ${stage(tab.type)}
      <div class="mode-cards" id="mode-seg">
        ${mc('stopwatch', 'timer', t('start.stopwatch'), t('start.stopwatchHint'))}
        ${mc('countdown', 'hourglass_top', t('start.timer'), t('start.timerHint'))}
      </div>

      ${startMode === 'countdown' ? `
        <div class="eyebrow sec-label">${t('start.duration')}</div>
        <div class="duration-box">
          <button class="step-btn" data-step="-900" aria-label="−15 ${t('start.minutes')}">${msIcon('remove')}</button>
          <div class="duration-val">${fmtDur(startDuration)}</div>
          <button class="step-btn" data-step="900" aria-label="+15 ${t('start.minutes')}">${msIcon('add')}</button>
        </div>
        <div class="presets">
          ${DURATION_PRESETS.map(p => `<button class="preset ${p === startDuration ? 'active' : ''}" data-preset="${p}">${presetLabel(p)}</button>`).join('')}
        </div>` : ''}

      <div class="eyebrow sec-label">${t('start.hourly')}</div>
      <div class="field">
        <div class="affix">
          <input id="start-rate" class="input input--big" type="text" inputmode="numeric" value="${escH(rateVal)}" aria-label="${t('start.hourly')}">
          <span class="affix-text">${cur()}</span>
        </div>
        <span class="field-error" id="err-rate"></span>
      </div>
      ${est !== null ? `<div class="estimate"><span>${t('start.estimate')}</span><b id="start-est">${fmtMoney(est)}</b></div>` : ''}
    </div>
    <footer class="sheet-actions">
      <button class="btn btn--gold btn--xl" id="start-confirm"><span class="shine"></span><span class="material-symbols-outlined ms-fill">play_arrow</span>${t('start.btn')}</button>
    </footer>
  `);

  const rateInput = $('#start-rate');
  bindMoneyInput(rateInput);
  rateInput.addEventListener('input', () => {
    startRateDraft = rateInput.value;
    const e2 = startEstimate();
    if ($('#start-est') && e2 !== null) $('#start-est').textContent = fmtMoney(e2);
  });
  const rerender = () => { startRateDraft = rateInput.value; renderStartSheet(); };
  $$('#mode-seg [data-mode]').forEach(b => b.addEventListener('click', () => { startMode = b.dataset.mode; rerender(); }));
  $$('#sheet-body [data-step]').forEach(b => b.addEventListener('click', () => {
    startDuration = Math.min(172800, Math.max(900, startDuration + +b.dataset.step));
    rerender();
  }));
  $$('#sheet-body [data-preset]').forEach(b => b.addEventListener('click', () => { startDuration = +b.dataset.preset; rerender(); }));

  $('#start-confirm').addEventListener('click', async () => {
    const rate = parseIn(rateInput.value);
    const errEl = $('#err-rate');
    if (!rateInput.value || isNaN(rate) || rate <= 0) {
      rateInput.classList.add('input-error');
      errEl.textContent = t('err.rate');
      return;
    }
    rateInput.classList.remove('input-error');
    errEl.textContent = '';
    const btn = $('#start-confirm');
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      await apiStartSession(tab, startMode, rate, startMode === 'countdown' ? startDuration : undefined);
      lastStatus[tab.id] = statusOf(sessions[tab.id]);
      closeSheet();
      startTable = null;
      renderHome(); renderZones();
      toast(`${tab.name}: ${t('toast.sessionStarted')}`, 'play_circle');
    } catch (err) {
      btn.disabled = false;
      toastErr(errText(err));
      if (err && err.code === '23505') { closeSheet(); loadData(); }
    }
  });
}

/* ---------------- FAOL SESSIYA PANELI ---------------- */
function openPanel(tab) {
  currentPanel = tab.id;
  panelEdit = false;
  panelSearch = '';
  renderPanel();
}

function renderPanel() {
  const s = sessions[currentPanel];
  if (!s) { closeSheet(); return; }
  const tab = findTable(currentPanel);
  const zone = findZone(currentPanel);
  /* qayta chizishda aylantirish joyi saqlansin (mahsulot qo'shganda tepaga sakramasin) */
  const prevScroll = $('#sheet-body .sheet-content')?.scrollTop || 0;
  const st = tileState(s);
  const timePrice = sessionPrice(s);
  const total = timePrice + productSum(s);
  const rate = s.rate ?? tab.tariff;
  const cd = s.mode === 'countdown';
  const label = st === 'over' ? t('panel.overtime') : cd ? t('panel.timeLeft') : t('panel.timePassed');
  const startAt = new Date(s.start);

  const prodRows = s.products.map(e => {
    const p = productById(zone.id, e.pid);
    if (!p) return '';
    return `
      <div class="bill-row">
        <span class="bill-ic">${msIcon(p.icon || 'local_cafe')}</span>
        <div class="bill-main">
          <div class="bill-name">${escH(p.name)}</div>
          <div class="bill-sub">${fmtMoney(p.price)} × ${e.qty}</div>
        </div>
        <div class="stepper">
          <button data-dec="${p.id}" aria-label="−1">${msIcon('remove')}</button>
          <span class="qty">${e.qty}</span>
          <button data-inc="${p.id}" aria-label="+1">${msIcon('add')}</button>
        </div>
        <span class="bill-amt">${fmtMoney(p.price * e.qty)}</span>
      </div>`;
  }).join('');

  openSheet(`
    ${sheetHead(escH(tab.name), `${escH(zone.name)} · ${cd ? t('start.timer') : t('start.stopwatch')}`)}
    <div class="sheet-content">
      <div class="dial-wrap st-${st}">
        <div class="dial">
          <div class="dial-dash"></div>
          <div class="dial-track"></div>
          <div class="dial-glow"><div class="dial-ring" data-dial="${tab.id}" style="--p:${dialPct(s).toFixed(2)}%"></div></div>
          <div class="dial-core"></div>
          <div class="dial-inner">
            <span class="st-tag"><i></i>${stateLabel(st)}</span>
            <div class="dial-time" data-timer="${tab.id}">${timerText(s)}</div>
            <div class="dial-label">${label}</div>
          </div>
        </div>
        <div class="times">
          <span>${t('panel.startedAt')} <b>${hm(startAt)}</b></span>
          <span>${t('panel.endsAt')} <b>${cd ? hm(new Date(s.start + s.duration * 1000)) : t('panel.open')}</b></span>
        </div>
        ${cd ? `
          <div class="extend">
            <button data-extend="900">+15 ${t('start.minutes')}</button>
            <button data-extend="1800">+30 ${t('start.minutes')}</button>
            <button data-extend="3600">+1 ${t('time.hour')}</button>
          </div>` : ''}
      </div>

      <div class="eyebrow sec-label" style="margin-top:28px">${t('panel.bill')}</div>
      <div class="bill">
        <div class="bill-row">
          <span class="bill-ic bill-ic--acc">${msIcon('schedule')}</span>
          <div class="bill-main">
            <div class="bill-name">${t('panel.sessionTime')}</div>
            <div class="bill-sub">${cd ? fmtDur(s.duration) + ' · ' : ''}${fmtMoney(rate)} ${t('panel.perHour')}</div>
          </div>
          <span class="bill-amt" data-price="${tab.id}">${fmtMoney(timePrice)}</span>
        </div>
        ${prodRows || `<div class="bill-empty">${t('panel.noProducts')}</div>`}
      </div>

      <div class="eyebrow sec-label" style="margin-top:28px">${t('panel.addProduct')}</div>
      ${zone.products.length > 6 ? `
        <label class="pick-search">
          ${msIcon('search')}
          <input id="prod-search" type="search" placeholder="${t('panel.searchPh')}" autocomplete="off" value="${escH(panelSearch)}">
        </label>` : ''}
      <div class="pick-grid" id="prod-search-results">${panelSearchHTML(zone, s)}</div>

      <div class="danger-zone">
        <button class="btn-link-danger" id="cancel-btn">${msIcon('delete')}${t('panel.cancelSession')}</button>
      </div>
    </div>
    <footer class="sheet-actions">
      <div class="pay-total"><div class="eyebrow">${t('panel.total')}</div><b class="shimmer" data-total-price="${tab.id}">${fmtMoney(total)}</b></div>
      <button class="btn btn--gold btn--xl" id="finish-btn"><span class="shine"></span><span class="material-symbols-outlined ms-fill">check_circle</span>${t('panel.finish')}</button>
    </footer>
  `);
  const sc = $('#sheet-body .sheet-content');
  if (sc && prevScroll) sc.scrollTop = prevScroll;

  $('#prod-search')?.addEventListener('input', e => {
    panelSearch = e.target.value.trim().toLowerCase();
    $('#prod-search-results').innerHTML = panelSearchHTML(zone, sessions[currentPanel] || s);
  });
  $$('#sheet-body [data-inc]').forEach(b => b.addEventListener('click', () => { addToSession(currentPanel, b.dataset.inc, 1); renderPanel(); }));
  $$('#sheet-body [data-dec]').forEach(b => b.addEventListener('click', () => { addToSession(currentPanel, b.dataset.dec, -1); renderPanel(); }));
  $$('#sheet-body [data-extend]').forEach(b => b.addEventListener('click', async () => {
    const s2 = sessions[currentPanel];
    if (!s2 || s2.mode !== 'countdown') return;
    const add = +b.dataset.extend;
    s2.duration += add;
    lastStatus[s2.tableId] = statusOf(s2);
    renderPanel(); renderHome();
    try { await apiExtendSession(s2, add); }
    catch (err) { s2.duration -= add; toastErr(errText(err)); loadData(); }
    if (currentPanel === s2.tableId && sessions[currentPanel]) renderPanel();
  }));
  $('#finish-btn').addEventListener('click', finishConfirm);
  $('#cancel-btn').addEventListener('click', cancelConfirm);
}

/* Mahsulot tugmalari — bitta bosish = +1 (delegatsiya: qidiruvdan keyin ham ishlaydi) */
$('#sheet-body').addEventListener('click', e => {
  const b = e.target.closest('[data-pick]');
  if (!b || !currentPanel) return;
  addToSession(currentPanel, b.dataset.pick, 1);
  renderPanel();
  renderHome();
});

async function addToSession(tid, pid, delta = 1) {
  const s = sessions[tid];
  if (!s) return;
  const e = s.products.find(x => x.pid === pid);
  if (!e && delta <= 0) return;
  if (e) {
    e.qty += delta;
    if (e.qty <= 0) s.products = s.products.filter(x => x !== e);
  } else {
    s.products.push({ pid, qty: delta });
  }
  try { await apiAddSessionProduct(s, pid, delta); }
  catch (err) { toastErr(errText(err)); loadData(); }
}

function panelSearchHTML(zone, s) {
  const q = panelSearch;
  const list = q
    ? zone.products.filter(p => p.name.toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name))
    : zone.products.slice().sort((a, b) => (b.sold || 0) - (a.sold || 0));
  if (!zone.products.length) return `<div class="pick-empty">${t('products.none')}</div>`;
  if (!list.length) return `<div class="pick-empty">${t('panel.noProduct')}</div>`;
  return list.map(p => {
    const inOrder = s ? (s.products.find(e => e.pid === p.id) || {}).qty : 0;
    return `
      <button class="pick${inOrder ? ' in' : ''}" data-pick="${p.id}">
        <span class="pick-ic">${msIcon(p.icon || 'local_cafe')}</span>
        <span class="pick-text"><span class="pick-name">${escH(p.name)}</span><span class="pick-price">${fmtMoney(p.price)}</span></span>
        ${inOrder ? `<span class="pick-qty">${inOrder}</span>` : ''}
      </button>`;
  }).join('');
}

/* ---------------- YAKUNLASH / BEKOR QILISH ---------------- */
function finishConfirm() {
  const s = sessions[currentPanel];
  if (!s) return;
  const tab = findTable(currentPanel);
  const timePrice = sessionPrice(s);
  const prod = productSum(s);
  const sec = sessionSeconds(s);
  const rate = s.rate ?? (tab ? tab.tariff : 0);
  const mode = s.mode === 'countdown' ? `${t('start.timer')} · ${fmtDur(s.duration)}` : t('start.stopwatch');
  openAlert(`
    <div class="receipt-wrap">
      <div class="receipt">
        <div class="receipt-head">
          <div class="alert-ic">${msIcon('point_of_sale')}</div>
          <div class="alert-title">${t('finish.title')}</div>
          <div class="alert-sub">${escH(tab ? tab.name : '')} · ${mode}</div>
        </div>
        <div class="receipt-rows">
          <div class="receipt-row"><span>${t('finish.time')}</span><b>${fmtTime(sec.elapsed)}</b></div>
          <div class="receipt-row"><span>${t('finish.rate')}</span><b>${fmtMoney(rate)} ${t('panel.perHour')}</b></div>
          <div class="receipt-row"><span>${t('finish.tableTime')}</span><b>${fmtMoney(timePrice)}</b></div>
          <div class="receipt-row"><span>${t('finish.products')}</span><b>${fmtMoney(prod)}</b></div>
          <div class="receipt-sep"></div>
          <div class="receipt-total"><span>${t('finish.total')}</span><span>${fmtMoney(timePrice + prod)}</span></div>
        </div>
      </div>
    </div>
    <div class="modal-btns">
      <button class="btn btn--ghost" id="abort-finish">${t('common.cancel')}</button>
      <button class="btn btn--gold" id="ok-finish"><span class="shine"></span>${t('finish.confirm')}</button>
    </div>
  `);
  $('#abort-finish').addEventListener('click', closeAlert);
  $('#ok-finish').addEventListener('click', async e => {
    const s2 = sessions[currentPanel];
    if (!s2 || e.currentTarget.disabled) return;
    e.currentTarget.disabled = true;
    const sum = sessionPrice(s2) + productSum(s2);
    try { await apiFinishSession(s2); }
    catch (err) {
      toastErr(errText(err));
      closeAlert();
      if (err && err.code === 'P0002') { closeSheet(); loadData(); }
      return;
    }
    closeSheet();
    renderHome(); renderZones(); loadHistory();
    showDone(sum);
  });
}

/* "Sessiya yakunlandi" — chek summasi, qo'ng'iroqcha, 2.6 soniyadan so'ng o'zi yopiladi */
function showDone(sum) {
  openAlert(`
    <div class="modal-card done-card">
      <div class="done-glow"></div>
      <div class="done-ic"><i class="rip"></i><i class="rip"></i><div class="core"><span class="material-symbols-outlined">check</span></div></div>
      <div class="done-title">${t('done.title')}</div>
      <div class="done-sum shimmer">${fmtMoney(sum)}</div>
      <div class="done-note">${t('done.note')}</div>
    </div>
  `);
  soundChime();
  const seq = alertSeq;
  setTimeout(() => { if (seq === alertSeq) closeAlert(); }, 2600);
}

function cancelConfirm() {
  const s = sessions[currentPanel];
  if (!s) return;
  const tab = findTable(currentPanel);
  openAlert(`
    <div class="modal-card modal-card--danger">
      <div class="alert-ic alert-ic--danger">${msIcon('delete')}</div>
      <div class="alert-title">${t('cancel.title')}</div>
      <p class="alert-text">${t('cancel.warn')}</p>
      <div class="alert-btns">
        <button class="btn btn--ghost" id="abort-cancel">${t('cancel.no')}</button>
        <button class="btn btn--danger" id="ok-cancel">${t('cancel.yes')}</button>
      </div>
    </div>
  `);
  $('#abort-cancel').addEventListener('click', closeAlert);
  $('#ok-cancel').addEventListener('click', async e => {
    const s2 = sessions[currentPanel];
    if (!s2 || e.currentTarget.disabled) return;
    e.currentTarget.disabled = true;
    try { await apiDeleteSession(s2); }
    catch (err) { toastErr(errText(err)); closeAlert(); return; }
    closeAlert(); closeSheet();
    renderHome(); renderZones();
    toast(`${tab ? tab.name + ': ' : ''}${t('toast.sessionCancelled')}`, 'delete', 'var(--danger)');
  });
}

/* O'chirishni tasdiqlash (zona / stol / mahsulot) */
function confirmDelete(name, warn, onOk) {
  openAlert(`
    <div class="modal-card modal-card--danger">
      <div class="alert-ic alert-ic--danger">${msIcon('delete')}</div>
      <div class="alert-title">'${escH(name)}'${t('confirm.deleteTitle')}</div>
      <p class="alert-text">${t('confirm.irreversible')}</p>
      ${warn ? `<div class="alert-warn-box">${warn}</div>` : ''}
      <div class="alert-btns">
        <button class="btn btn--ghost" id="cancel-del">${t('common.cancel')}</button>
        <button class="btn btn--danger" id="confirm-del" ${warn ? 'disabled' : ''}>${t('common.delete')}</button>
      </div>
    </div>
  `);
  $('#cancel-del').addEventListener('click', closeAlert);
  $('#confirm-del').addEventListener('click', async e => {
    const btn = e.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      await onOk();
      closeAlert(); closeSheet();
      toast(t('common.deleted'), 'delete', 'var(--danger)');
    } catch (err) { btn.disabled = false; toastErr(errText(err)); }
  });
}

/* Saqlash tugmasi: ikki marta bosilsa ham bitta so'rov */
function bindSave(btnSel, validate, save) {
  $(btnSel).addEventListener('click', async e => {
    const btn = e.currentTarget;
    const vals = validate();
    if (!vals || btn.disabled) return;
    btn.disabled = true;
    try {
      await save(vals);
      closeSheet();
      toast(t('common.saved'));
    } catch (err) { btn.disabled = false; toastErr(errText(err)); }
  });
}
function markError(input, msg) {
  input.classList.toggle('input-error', !!msg);
  const err = input.closest('.field').querySelector('.field-error');
  if (err) err.textContent = msg || '';
  return !msg;
}

/* ---------------- ZONALAR ---------------- */
function renderZones() {
  const list = $('#zones-table-list');
  if (!state.zones.length) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">${msIcon('grid_view')}</span>
        <p class="empty-title">${t('zones.empty')}</p>
        <p class="empty-text">${t('zones.emptyText')}</p>
      </div>`;
    return;
  }
  list.classList.add('stagger');
  list.innerHTML = state.zones.map((zone, zi) => {
    const busy = zone.tables.filter(x => sessions[x.id]).length;
    const pos = layoutSlots(zone.tables.length);
    const dots = zone.tables.map((tab, i) => {
      const st = tileState(sessions[tab.id]);
      const w = tab.type === 'tennis' ? 30 : 36, h = tab.type === 'tennis' ? 17 : 20;
      return `<span class="zone-dot mini-t--${typeKey(tab.type)} st-${st}${st !== 'free' ? ' on' : ''}" style="left:${pos[i].x.toFixed(2)}%;top:${pos[i].y.toFixed(2)}%;width:${w}px;height:${h}px;margin-left:${-w / 2}px;margin-top:${-h / 2}px"><i></i></span>`;
    }).join('');
    return `
      <div class="card zone-card" style="--i:${zi}">
        <div class="zone-map">
          <div class="zone-dots">${dots}</div>
          <div class="zone-info">
            <div class="zone-info-text">
              <div class="zone-name">${escH(zone.name)}</div>
              <div class="zone-meta">${t('zones.meta').replace('{t}', zone.tables.length).replace('{b}', busy)}</div>
            </div>
            <button class="icon-btn" data-edit-zone="${zone.id}" title="${t('panel.edit')}" aria-label="${t('panel.edit')}">${msIcon('edit')}</button>
          </div>
        </div>
        ${zone.tables.map(tab => {
          const st = tileState(sessions[tab.id]);
          return `
            <button class="t-row" data-edit-table="${tab.id}">
              ${miniT(tab.type)}
              <span class="row-text"><b>${escH(tab.name)}</b><small>${typeName(tab.type)} · ${fmtMoney(tab.tariff)} ${t('panel.perHour')}</small></span>
              <span class="st-tag st-${st}"><i></i>${stateLabel(st)}</span>
              <span class="material-symbols-outlined row-chevron">chevron_right</span>
            </button>`;
        }).join('')}
        <button class="zone-add" data-add-table="${zone.id}">${msIcon('add')}${t('zones.addTable')}</button>
      </div>`;
  }).join('');
}

$('#zones-table-list').addEventListener('click', e => {
  const ez = e.target.closest('[data-edit-zone]');
  const et = e.target.closest('[data-edit-table]');
  const at = e.target.closest('[data-add-table]');
  if (ez) openZoneModal(state.zones.find(x => x.id === ez.dataset.editZone));
  else if (et) openTableModal(findTable(et.dataset.editTable));
  else if (at) openTableModal(null, at.dataset.addTable);
});
$('#add-zone-btn').addEventListener('click', () => openZoneModal(null));
$('#first-table-btn').addEventListener('click', () => {
  showView('zones');
  if (!state.zones.length) openZoneModal(null);
});

function zoneHasActiveSession(z) {
  return z.tables.some(x => sessions[x.id]);
}

function refreshAll() { renderHome(); renderZones(); renderProducts(); }

const delBtn = id => `<button class="btn btn--danger-soft" id="${id}" title="${t('modal.delete')}" aria-label="${t('modal.delete')}">${msIcon('delete')}</button>`;
const saveBtn = id => `<button class="btn btn--gold" id="${id}">${t('modal.save')}</button>`;

function openZoneModal(z) {
  const isEdit = !!z;
  openSheet(`
    ${sheetHead(isEdit ? t('modal.editZone') : t('modal.newZone'), isEdit ? escH(z.name) : t('zones.title'), '', true)}
    <div class="sheet-content">
      <div class="field">
        <label for="zone-name">${t('modal.zoneName')}</label>
        <input id="zone-name" maxlength="80" value="${isEdit ? escH(z.name) : ''}" placeholder="${t('modal.zonePh')}" autocomplete="off">
        <span class="field-error"></span>
      </div>
      <p class="hint">${t('zones.hint')}</p>
    </div>
    <footer class="sheet-actions">
      ${isEdit ? delBtn('del-zone') : ''}
      ${saveBtn('save-zone')}
    </footer>
  `);
  const input = $('#zone-name');
  if (!isEdit) setTimeout(() => input.focus(), 50);
  bindSave('#save-zone', () => {
    const name = input.value.trim();
    return markError(input, name ? '' : t('err.required')) && { name };
  }, async ({ name }) => {
    if (isEdit) await apiUpdateZone(z, name);
    else await apiAddZone(name);
    refreshAll();
  });
  if (isEdit) $('#del-zone').addEventListener('click', () => {
    confirmDelete(z.name, zoneHasActiveSession(z) ? t('confirm.zoneActive') : '', async () => {
      await apiDeleteZone(z);
      refreshAll();
    });
  });
}

function openTableModal(tab, presetZoneId) {
  const isEdit = !!tab;
  const zone = tab ? findZone(tab.id) : state.zones.find(x => x.id === presetZoneId) || state.zones[0];
  if (!zone) return;
  let tableType = isEdit ? (tab.type || 'billiard') : 'billiard';
  /* turini almashtirganda kiritilgan qiymatlar yo'qolmasin */
  const draft = { name: isEdit ? tab.name : '', tariff: isEdit ? fmtIn(tab.tariff) : '' };

  const render = () => {
    openSheet(`
      ${sheetHead(isEdit ? t('modal.editTable') : t('modal.newTable'), escH(zone.name), '', true)}
      <div class="sheet-content">
        ${stage(tableType, true)}
        <div class="eyebrow sec-label" style="margin-top:22px">${t('modal.type')}</div>
        <div class="type-cards" id="type-seg">
          <button class="type-card ${tableType === 'billiard' ? 'active' : ''}" data-type="billiard">${miniT('billiard')}${t('sport.billiard')}</button>
          <button class="type-card ${tableType === 'tennis' ? 'active' : ''}" data-type="tennis">${miniT('tennis')}${t('sport.tennis')}</button>
        </div>
        <div class="field" style="margin-top:22px">
          <label for="table-name">${t('modal.tableName')}</label>
          <input id="table-name" maxlength="80" value="${escH(draft.name)}" placeholder="${t('modal.tablePh')}" autocomplete="off">
          <span class="field-error"></span>
        </div>
        <div class="field">
          <label for="table-tariff">${t('modal.tariff')}</label>
          <div class="affix">
            <input id="table-tariff" type="text" inputmode="numeric" value="${escH(draft.tariff)}" placeholder="${t('modal.tariffPh')}">
            <span class="affix-text">${cur()}</span>
          </div>
          <span class="field-error"></span>
        </div>
      </div>
      <footer class="sheet-actions">
        ${isEdit ? delBtn('del-table') : ''}
        ${saveBtn('save-table')}
      </footer>
    `);
    $$('#type-seg [data-type]').forEach(b => b.addEventListener('click', () => {
      draft.name = $('#table-name').value;
      draft.tariff = $('#table-tariff').value;
      tableType = b.dataset.type;
      render();
    }));
    const nameInput = $('#table-name');
    const tariffInput = $('#table-tariff');
    bindMoneyInput(tariffInput);
    if (!isEdit && !draft.name) setTimeout(() => nameInput.focus(), 50);
    bindSave('#save-table', () => {
      const name = nameInput.value.trim();
      const tariff = parseIn(tariffInput.value);
      const ok1 = markError(nameInput, name ? '' : t('err.required'));
      const ok2 = markError(tariffInput, (!tariffInput.value || isNaN(tariff) || tariff < 0) ? t('err.number') : '');
      return ok1 && ok2 && { name, tariff };
    }, async ({ name, tariff }) => {
      if (isEdit) await apiUpdateTable(tab, name, tariff, tableType);
      else await apiAddTable(zone, name, tariff, tableType);
      renderHome(); renderZones();
    });
    if (isEdit) $('#del-table').addEventListener('click', () => {
      confirmDelete(tab.name, sessions[tab.id] ? t('confirm.tableActive') : '', async () => {
        await apiDeleteTable(tab, zone);
        renderHome(); renderZones();
      });
    });
  };
  render();
}

/* ---------------- MAHSULOTLAR ---------------- */
const PRODUCT_ICONS = ['local_cafe', 'emoji_food_beverage', 'coffee', 'local_bar', 'sports_bar', 'liquor', 'wine_bar', 'water_drop',
  'local_drink', 'icecream', 'fastfood', 'lunch_dining', 'local_pizza', 'bakery_dining', 'cookie', 'cake', 'tapas', 'restaurant', 'smoking_rooms', 'shopping_bag'];
let productZoneId = null;

function renderProducts() {
  const tabs = $('#prod-tabs');
  const list = $('#products-list');
  if (!state.zones.length) {
    tabs.innerHTML = '';
    list.innerHTML = `<div class="empty-state"><span class="empty-icon">${msIcon('local_cafe')}</span><p class="empty-title">${t('products.empty')}</p></div>`;
    return;
  }
  if (!state.zones.some(z => z.id === productZoneId)) productZoneId = state.zones[0].id;
  tabs.innerHTML = state.zones.length < 2 ? '' : state.zones.map(z =>
    `<button class="zone-tab ${z.id === productZoneId ? 'active' : ''}" data-pzone="${z.id}">${escH(z.name)}</button>`).join('');

  const zone = state.zones.find(z => z.id === productZoneId);
  const maxSold = Math.max(1, ...zone.products.map(p => p.sold || 0));
  list.classList.add('stagger');
  list.innerHTML = zone.products.length ? zone.products.map((p, i) => `
    <div class="prod-wrap" style="--i:${i}">
      <button class="prod-tile" data-edit-product="${p.id}">
        <span class="tc-sheen"></span>
        <span class="prod-top">
          <span class="prod-ic">${msIcon(p.icon || 'local_cafe')}</span>
          ${(p.sold || 0) === maxSold && p.sold > 0 ? `<span class="top-pill"><span class="material-symbols-outlined">star</span>${t('products.top')}</span>` : ''}
        </span>
        <span class="prod-name">${escH(p.name)}</span>
        <span class="prod-price">${fmtMoney(p.price)}</span>
        <span class="prod-sold">
          <small>${t('products.sold').replace('{n}', p.sold || 0)}</small>
          <span class="meter"><i style="width:${((p.sold || 0) / maxSold * 100).toFixed(1)}%"></i></span>
        </span>
      </button>
    </div>`).join('') + `
    <button class="prod-add" data-add-product style="--i:${zone.products.length}"><span>${msIcon('add')}</span>${t('products.newTile')}</button>` : `
    <div class="empty-state">
      <span class="empty-icon">${msIcon('local_cafe')}</span>
      <p class="empty-title">${t('products.none')}</p>
      <p class="empty-text">${t('products.noneText')}</p>
    </div>`;
}

$('#prod-tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-pzone]');
  if (!b) return;
  productZoneId = b.dataset.pzone;
  renderProducts();
});
function addProductClick() {
  const zone = state.zones.find(z => z.id === productZoneId) || state.zones[0];
  if (!zone) { toast(t('products.empty'), 'info', 'var(--warn)'); showView('zones'); return; }
  openProductModal(zone, null);
}
$('#products-list').addEventListener('click', e => {
  if (e.target.closest('[data-add-product]')) { addProductClick(); return; }
  const b = e.target.closest('[data-edit-product]');
  if (!b) return;
  const zone = state.zones.find(z => z.id === productZoneId);
  openProductModal(zone, zone.products.find(x => x.id === b.dataset.editProduct));
});
$('#add-product-btn').addEventListener('click', addProductClick);
bindTilt($('#products-list'), '.prod-tile');

function openProductModal(zone, p) {
  const isEdit = !!p;
  let icon = (p && p.icon) || 'local_cafe';
  const eyebrow = t('panel.menu') + (state.zones.length > 1 ? ' · ' + escH(zone.name) : '');
  openSheet(`
    ${sheetHead(isEdit ? t('modal.editProduct') : t('modal.newProduct'), eyebrow, msIcon(icon), true)}
    <div class="sheet-content">
      <div class="field">
        <label for="prod-name">${t('modal.prodName')}</label>
        <input id="prod-name" maxlength="80" value="${isEdit ? escH(p.name) : ''}" placeholder="${t('modal.prodNamePh')}" autocomplete="off">
        <span class="field-error"></span>
      </div>
      <div class="field">
        <label for="prod-price">${t('modal.prodPrice')}</label>
        <div class="affix">
          <input id="prod-price" type="text" inputmode="numeric" value="${isEdit ? fmtIn(p.price) : ''}" placeholder="${t('modal.prodPricePh')}">
          <span class="affix-text">${cur()}</span>
        </div>
        <span class="field-error"></span>
      </div>
      <div class="eyebrow sec-label" style="margin-top:22px">${t('modal.icon')}</div>
      <div class="icon-grid" id="icon-grid">
        ${PRODUCT_ICONS.map(i => `<button class="icon-opt ${i === icon ? 'active' : ''}" data-icon="${i}" aria-label="${i}">${msIcon(i)}</button>`).join('')}
      </div>
    </div>
    <footer class="sheet-actions">
      ${isEdit ? delBtn('del-prod') : ''}
      ${saveBtn('save-prod')}
    </footer>
  `);
  $('#icon-grid').addEventListener('click', e => {
    const b = e.target.closest('[data-icon]');
    if (!b) return;
    icon = b.dataset.icon;
    $$('#icon-grid .icon-opt').forEach(x => x.classList.toggle('active', x === b));
    $('#sheet-body .sheet-head-ic').innerHTML = msIcon(icon);
  });
  const nameInput = $('#prod-name');
  const priceInput = $('#prod-price');
  bindMoneyInput(priceInput);
  if (!isEdit) setTimeout(() => nameInput.focus(), 50);
  bindSave('#save-prod', () => {
    const name = nameInput.value.trim();
    const price = parseIn(priceInput.value);
    const ok1 = markError(nameInput, name ? '' : t('err.required'));
    const ok2 = markError(priceInput, (!priceInput.value || isNaN(price) || price < 0) ? t('err.number') : '');
    return ok1 && ok2 && { name, price };
  }, async ({ name, price }) => {
    if (isEdit) await apiUpdateProduct(p, name, price, icon);
    else await apiAddProduct(zone, name, price, icon);
    renderProducts();
  });
  if (isEdit) $('#del-prod').addEventListener('click', () => {
    confirmDelete(p.name, '', async () => {
      await apiDeleteProduct(zone, p);
      renderProducts();
    });
  });
}

/* ---------------- PROFIL ---------------- */
function openProfileModal() {
  openAlert(`
    <div class="modal-card">
      <div class="alert-ic">${msIcon('person')}</div>
      <div class="alert-title">${t('profile.edit')}</div>
      <div class="alert-fields">
        <div class="field">
          <label for="profile-name-input">${t('profile.name')}</label>
          <input id="profile-name-input" maxlength="60" value="${escH($('#profile-name').textContent)}">
          <span class="field-error"></span>
        </div>
        <div class="field">
          <label for="profile-login-input">${t('login.username')}</label>
          <input id="profile-login-input" value="${escH((currentUser && currentUser.email) || '')}" disabled>
        </div>
      </div>
      <div class="alert-btns">
        <button class="btn btn--ghost" id="cancel-profile">${t('common.cancel')}</button>
        <button class="btn btn--gold" id="save-profile">${t('modal.save')}</button>
      </div>
    </div>
  `);
  const nameInput = $('#profile-name-input');
  $('#cancel-profile').addEventListener('click', closeAlert);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#save-profile').click(); } });
  $('#save-profile').addEventListener('click', async e => {
    const name = nameInput.value.trim();
    if (!markError(nameInput, name ? '' : t('err.required'))) return;
    const btn = e.currentTarget;
    btn.disabled = true;
    const { data, error } = await sb.auth.updateUser({ data: { name } });
    if (error) { btn.disabled = false; toastErr(errText(error)); return; }
    if (data && data.user) currentUser = data.user;
    renderProfile();
    closeAlert();
    toast(t('common.saved'));
  });
}

function renderProfile() {
  const email = (currentUser && currentUser.email) || '';
  const name = (currentUser && currentUser.user_metadata && currentUser.user_metadata.name) || email.split('@')[0];
  const initial = (name || email || '?').trim().charAt(0) || '?';
  $('#profile-name').textContent = name || '—';
  $('#profile-login').textContent = email;
  $('#profile-avatar').textContent = initial;
  $('#nav-avatar').textContent = initial;
  $('#nav-user-name').textContent = name || '—';
  $('#nav-user').textContent = email;
}

$('#edit-profile-btn').addEventListener('click', openProfileModal);

function logoutConfirm() {
  openAlert(`
    <div class="modal-card">
      <div class="alert-ic">${msIcon('logout')}</div>
      <div class="alert-title">${t('profile.logoutTitle')}</div>
      <div class="alert-btns">
        <button class="btn btn--ghost" id="abort-logout">${t('common.cancel')}</button>
        <button class="btn btn--danger" id="ok-logout">${t('profile.logoutBtn')}</button>
      </div>
    </div>
  `);
  $('#abort-logout').addEventListener('click', closeAlert);
  $('#ok-logout').addEventListener('click', async () => {
    closeAlert(); closeSheet();
    await sb.auth.signOut();
  });
}
$('#logout-btn').addEventListener('click', logoutConfirm);
$('#nav-logout').addEventListener('click', logoutConfirm);

/* ---------------- TARIX ---------------- */
let histSessions = []; /* bugungi yakunlangan sessiyalar (batafsil) */
let histDays = [];     /* o'tgan kunlar jami (serverda hisoblanadi) */
let histDay = '';
let histBarKey = '';   /* diagrammada tanlangan kun */

function finSummary(s) {
  const start = new Date(s.start_time);
  const end = new Date(s.end_time);
  const elapsed = Math.max(0, (end - start) / 1000);
  const rate = Number(s.rate ?? s.tables?.tariff ?? 0);
  const dur = Number(s.duration_sec) || 0;
  const billSec = (s.mode === 'countdown' && elapsed <= dur) ? dur : elapsed;
  const timePrice = rate * billSec / 3600;
  const prod = (s.session_products || []).reduce((sum, sp) => {
    const price = sp.price != null ? Number(sp.price) : Number(sp.products?.price ?? 0);
    return sum + (sp.quantity || 0) * price;
  }, 0);
  return { timePrice, prod, total: timePrice + prod, elapsed };
}

let histBusy = false;
let histAgain = false; /* yuklash paytida yana so'ralsa — tugagach qayta yuklanadi */
async function loadHistory() {
  if (!currentUser || !(accessInfo && accessInfo.has_access)) return;
  if (histBusy) { histAgain = true; return; }
  histBusy = true;
  try {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'UTC';
    /* kunlik jamlar (butun tarix bo'yicha) — faqat Tarix ochiq bo'lsa; bosh ekranga bugungi sessiyalar yetarli */
    const withDays = !$('#view-history').hidden;
    const [today, days] = await Promise.all([
      sb.from('sessions')
        .select('id, mode, rate, start_time, end_time, duration_sec, table_id, tables(name, tariff, sport), session_products(quantity, price, products(price))')
        .gte('end_time', dayStart.toISOString())
        .order('end_time', { ascending: false }),
      withDays ? sb.rpc('history_days', { p_tz: tz }) : Promise.resolve({ data: null, error: null }),
    ]);
    if (today.error) throw today.error;
    if (days.error) throw days.error;
    histSessions = today.data || [];
    const todayKey = dayKey(now);
    if (days.data) histDays = days.data.filter(d => d.day !== todayKey).map(d => ({
      key: d.day, date: parseDay(d.day), time: Number(d.time_sum) || 0, prod: Number(d.prod_sum) || 0,
      total: (Number(d.time_sum) || 0) + (Number(d.prod_sum) || 0),
    }));
    histDay = todayKey;
    renderTodayStat();
    if (!$('#view-history').hidden) renderHistory();
  } catch (err) {
    toastErr(errText(err));
  } finally {
    histBusy = false;
    if (histAgain) { histAgain = false; loadHistory(); }
  }
}

const mlnShort = v => v >= 1e6 ? (v / 1e6).toFixed(1).replace('.', currentLang === 'en' ? '.' : ',') + (currentLang === 'ru' ? ' млн' : currentLang === 'en' ? 'M' : ' mln')
  : v >= 1e3 ? Math.round(v / 1e3) + (currentLang === 'ru' ? ' тыс' : 'k') : fmtNum(v);

/* So'nggi 7 kun: bugun — oltin ustun; tanlangan kun qiymati tepada */
function weekChartHTML(todayTotal) {
  const now = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = dayKey(d);
    const total = i === 0 ? todayTotal : ((histDays.find(x => x.key === key) || {}).total || 0);
    days.push({ d, key, total, today: i === 0 });
  }
  const max = Math.max(...days.map(x => x.total), 1);
  if (!days.some(x => x.key === histBarKey)) histBarKey = days[6].key;
  const sel = days.find(x => x.key === histBarKey);
  const sum = days.reduce((a, x) => a + x.total, 0);
  return `
    <div class="card chart-card anim">
      <div class="chart-head">
        <div><div class="eyebrow">${t('history.week')}</div><div class="chart-sel">${sel.today ? t('history.today') : `${WEEKDAYS[currentLang][sel.d.getDay()]}, ${dayMonth(sel.d)}`}</div></div>
        <div class="chart-val">${fmtMoney(sel.total)}</div>
      </div>
      <div class="bars" role="list">
        ${days.map((x, i) => `
          <button class="bar ${x.today ? 'is-today' : ''} ${x.key === histBarKey ? 'is-sel' : ''}" data-bar="${x.key}" role="listitem" style="--i:${i}"
            aria-label="${dayLabel(x.d)}: ${fmtMoney(x.total)}">
            <span class="bar-val">${mlnShort(x.total)}</span>
            <span class="bar-col" style="height:${Math.max(8, Math.round(x.total / max * 170))}px"></span>
            <span class="bar-lbl">${x.today ? t('history.today') : WEEKDAYS_SHORT[currentLang][x.d.getDay()]}</span>
          </button>`).join('')}
      </div>
      <div class="bars-foot"><span>${t('history.weekTotal')}</span><b>${fmtMoney(sum)}</b></div>
    </div>`;
}

let histOpenMonth = null; /* ochiq oy (standart — eng so'nggi) */
function renderHistory() {
  const body = $('#history-body');
  const now = new Date();
  const sums = histSessions.map(finSummary);
  const tTime = sums.reduce((a, x) => a + x.timePrice, 0);
  const tProd = sums.reduce((a, x) => a + x.prod, 0);
  const tTotal = tTime + tProd;
  const tPct = tTotal ? (tTime / tTotal * 100).toFixed(1) + '%' : '50%';

  let html = `
    <div class="hist-top">
      <div class="card hist-hero anim">
        <div class="stat-topline"></div>
        <div class="ring ring--1"></div><div class="ring ring--2"></div><div class="ring-glow"></div>
        <div class="eyebrow">${t('stats.today')} · ${dayMonth(now)}</div>
        <div class="hist-hero-val"><span class="big shimmer" id="hist-today">${fmtNum(tTotal)}</span><span class="cur">${cur()}</span></div>
        <div class="split"><div class="a" style="width:${tPct}"></div><div class="b"></div></div>
        <div class="mini-stats">
          <div class="mini-stat"><div class="mini-stat-l"><i></i>${t('history.tablesTotal')}</div><b>${fmtMoney(tTime)}</b></div>
          <div class="mini-stat"><div class="mini-stat-l"><i class="b"></i>${t('history.productsTotal')}</div><b>${fmtMoney(tProd)}</b></div>
          <div class="mini-stat"><div class="mini-stat-l">${msIcon('receipt_long')}${t('history.sessions')}</div><b>${histSessions.length}</b></div>
        </div>
      </div>
      ${weekChartHTML(tTotal)}
    </div>`;

  html += `<div class="sec-head"><h2 class="h2">${t('history.todaySessions')}</h2><span>${histSessions.length ? histSessions.length : ''}</span></div><div class="list">`;
  if (histSessions.length) {
    html += histSessions.map((s, i) => {
      const f = sums[i];
      return `
        <div class="hist-row">
          ${miniT(s.tables?.sport)}
          <div class="row-text"><b>${escH(s.tables?.name || '—')}</b><small>${hm(new Date(s.start_time))} – ${hm(new Date(s.end_time))} · ${fmtDur(f.elapsed)}</small></div>
          <div class="prod-cell">${f.prod ? `<span class="prod-pill">${msIcon('local_bar')}${fmtMoney(f.prod)}</span>` : ''}</div>
          <span class="total">${fmtMoney(f.total)}</span>
        </div>`;
    }).join('');
  } else {
    html += `<div class="list-empty">${t('history.noToday')}</div>`;
  }
  html += '</div>';

  if (histDays.length) {
    const byMonth = new Map();
    for (const d of histDays) {
      const mk = monthKey(d.date);
      if (!byMonth.has(mk)) byMonth.set(mk, []);
      byMonth.get(mk).push(d);
    }
    const keys = [...byMonth.keys()].sort().reverse();
    if (histOpenMonth === null) histOpenMonth = keys[0];
    html += `<div class="sec-head"><h2 class="h2">${t('history.past')}</h2></div><div class="list">`;
    keys.forEach(mk => {
      const [y, m] = mk.split('-').map(Number);
      const open = mk === histOpenMonth;
      const days = byMonth.get(mk).sort((a, b) => b.key.localeCompare(a.key));
      const dmax = Math.max(1, ...days.map(d => d.total));
      html += `<div class="hist-month-wrap">
        <button class="hist-month ${open ? 'open' : ''}" data-mk="${mk}">
          <span class="m-name">${MONTH_NAMES[currentLang][m - 1]} ${y}</span>
          <span class="m-count">${t('history.dayCount').replace('{n}', days.length)}</span>
          <b>${fmtMoney(days.reduce((a, d) => a + d.total, 0))}</b>
          ${msIcon('expand_more')}
        </button>`;
      if (open) {
        html += '<div class="hist-month-body">' + days.map(d => `
          <div class="hist-day-row">
            <span>${WEEKDAYS_SHORT[currentLang][d.date.getDay()]}, ${dayMonth(d.date)}</span>
            <span class="split-txt">${t('history.split').replace('{a}', fmtMoney(d.time)).replace('{b}', fmtMoney(d.prod))}</span>
            <span class="dbar"><i style="width:${(d.total / dmax * 100).toFixed(1)}%"></i></span>
            <b>${fmtMoney(d.total)}</b>
          </div>`).join('') + '</div>';
      }
      html += '</div>';
    });
    html += '</div>';
  }
  body.innerHTML = html;
  if (countRaf['#hist-today']) countTarget['#hist-today'] = tTotal;
}

$('#history-body').addEventListener('click', e => {
  const bar = e.target.closest('[data-bar]');
  if (bar) { histBarKey = bar.dataset.bar; renderHistory(); return; }
  const mb = e.target.closest('.hist-month');
  if (mb) { histOpenMonth = histOpenMonth === mb.dataset.mk ? '' : mb.dataset.mk; renderHistory(); }
});

setInterval(() => {
  if (!currentUser) return;
  const k = dayKey(new Date());
  if (k !== histDay) { histDay = k; loadHistory(); renderHome(); return; }
  if (!$('#view-history').hidden) loadHistory();
}, 30000);

/* ---------------- TAYMER DVIGATELI ---------------- */
let lastStatus = {};

let lastAlarmAt = 0;
function tick() {
  const now = nowMs();
  let needRender = false;
  let anyOver = false;

  Object.keys(sessions).forEach(tid => {
    const s = sessions[tid];
    const st = statusOf(s, now);
    if (st === 'expired') anyOver = true;
    if (lastStatus[tid] !== st) {
      const prev = lastStatus[tid];
      const tab = findTable(tid);
      const name = tab ? tab.name : '';
      if (prev && st === 'expired') {
        if (navigator.vibrate) navigator.vibrate(400);
        toast(t('alarm.over').replace('{t}', name), 'alarm', 'var(--danger)');
      } else if (prev === 'busy' && st === 'ending') {
        soundPing();
        toast(t('alarm.ending').replace('{t}', name), 'hourglass_bottom', 'var(--warn)');
      }
      lastStatus[tid] = st;
      needRender = true;
    }
  });
  /* vaqti tugagan stol bor ekan — har 3.5 soniyada qo'ng'iroq (yakunlanmaguncha) */
  if (anyOver && currentUser && now - lastAlarmAt >= 3500) { lastAlarmAt = now; soundAlarm(); }
  if (needRender) {
    renderHome();
    if (currentPanel && sessions[currentPanel]) renderPanel();
  }

  $$('[data-timer]').forEach(el => {
    const s = sessions[el.dataset.timer];
    if (s) el.textContent = timerText(s, now);
  });
  $$('[data-price]').forEach(el => {
    const s = sessions[el.dataset.price];
    if (s) el.textContent = fmtMoney(sessionPrice(s, now));
  });
  $$('[data-total-price]').forEach(el => {
    const s = sessions[el.dataset.totalPrice];
    if (s) el.textContent = fmtMoney(sessionPrice(s, now) + productSum(s));
  });
  $$('[data-progress]').forEach(el => {
    const s = sessions[el.dataset.progress];
    const pct = s && progressPct(s, now);
    if (pct != null) el.style.width = pct.toFixed(1) + '%';
  });
  $$('[data-dial]').forEach(el => {
    const s = sessions[el.dataset.dial];
    if (s) el.style.setProperty('--p', dialPct(s, now).toFixed(2) + '%');
  });
  if (currentUser) updateLiveStat(now);
}

setInterval(tick, 1000);

/* ---------------- Blok va internet holati ---------------- */
const blockedOverlay = $('#blocked-overlay');
const netOverlay = $('#net-overlay');

function showBlocked(v) { blockedOverlay.hidden = !v; }
function showNet(v) { netOverlay.hidden = !v; }

/* Blok / ruxsat holati: 30 sekundda bir + ilova ochilganda (realtime bo'lsa darhol) */
const checkBlockStatus = () => refreshAccess();

/* Internet aloqasi nazorati: istalgan javob keldi = internet bor,
   faqat tarmoq xatosi (reject) = yo'q. no-cors — CORS/status kodlari muhim emas */
let lastOnline = null;

async function probeNet() {
  let online;
  try {
    await fetch(SUPABASE_URL + '/auth/v1/health', { method: 'GET', cache: 'no-store', mode: 'no-cors' });
    online = true;
  } catch {
    online = false;
  }
  if (online === lastOnline) return;
  lastOnline = online;
  showNet(!online);
  if (online && currentUser) refreshAccess(true);
}

window.addEventListener('offline', () => { lastOnline = false; showNet(true); });
window.addEventListener('online', () => probeNet());
$('#blocked-retry').addEventListener('click', checkBlockStatus);
$('#access-retry').addEventListener('click', () => refreshAccess());
$('#access-logout').addEventListener('click', () => sb.auth.signOut());
$('#net-retry').addEventListener('click', probeNet);
setInterval(checkBlockStatus, 30000);
setInterval(probeNet, 8000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { checkBlockStatus(); probeNet(); }
});

/* ---------------- Boshlang'ich holat ---------------- */
applyStaticLang();
applyTheme();
updateSoundUI();
document.documentElement.lang = currentLang;
$$('#lang-seg [data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
renderHome();
tick();
probeNet();

(async () => {
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      currentUser = session.user;
      enterApp();
    }
  } catch (err) {
    toastErr(errText(err));
  }
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
