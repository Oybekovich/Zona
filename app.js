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
    'app.title': 'Asosiy oyna', 'search.tablePh': 'Stol nomi...',
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
    'theme.title': 'Ko\'rinish', 'theme.light': 'Kun', 'theme.dark': 'Tun',
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
    'app.title': 'Main Floor', 'search.tablePh': 'Table name...',
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
    'theme.title': 'Appearance', 'theme.light': 'Day', 'theme.dark': 'Night',
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
    'app.title': 'Основной зал', 'search.tablePh': 'Название стола...',
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
    'theme.title': 'Оформление', 'theme.light': 'День', 'theme.dark': 'Ночь',
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
  },
};
let currentLang = localStorage.getItem('zona-lang') || 'uz';
const cur = () => I18N[currentLang]['cur'];
const t = k => (I18N[currentLang] && I18N[currentLang][k]) || I18N.uz[k] || k;

/* ---------------- Tun / Kun rejimi ---------------- */
let themeMode = localStorage.getItem('zona-theme') || 'dark';

function applyTheme() {
  document.documentElement.dataset.theme = themeMode;
  $$('#theme-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === themeMode));
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.content = themeMode === 'dark' ? '#0e1013' : '#f3f4f6';
}

function setTheme(m) {
  themeMode = m;
  localStorage.setItem('zona-theme', m);
  applyTheme();
}

$('#theme-seg')?.addEventListener('click', e => {
  const b = e.target.closest('[data-theme]');
  if (b) setTheme(b.dataset.theme);
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
  const sel = $('#lang-select');
  if (sel) sel.value = l;
  renderHome(); renderZones(); renderProducts(); renderAccess();
  if (!$('#view-history').hidden) renderHistory();
  if (currentPanel && sessions[currentPanel]) renderPanel();
  if (startTable) renderStartSheet();
}

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
    toast(errText(err));
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
function toast(msg, cls) {
  const t = document.createElement('div');
  t.className = 'toast' + (cls ? ' ' + cls : '');
  t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('toast--out'); setTimeout(() => t.remove(), 300); }, 2600);
}

/* ---------------- Sheet / Alert ---------------- */
let currentPanel = null;
let panelEdit = false;
let panelSearch = '';

function openSheet(html) {
  $('#sheet-body').innerHTML = html;
  $('#sheet').hidden = false;
  $$('.sheet-close').forEach(b => b.addEventListener('click', closeSheet));
  /* Enter — asosiy tugma (Saqlash / Boshlash) */
  $$('#sheet-body input:not([type=search])').forEach(i => i.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); $('#sheet-body .sheet-actions .btn--primary')?.click(); }
  }));
}
function closeSheet() { $('#sheet').hidden = true; currentPanel = null; panelEdit = false; panelSearch = ''; startTable = null; }
function openAlert(html) { $('#alert-body').innerHTML = html; $('#alert').hidden = false; }
function closeAlert() {
  const alert = $('#alert');
  if (alert.hidden) return;
  const box = $('#alert-body');
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    box.classList.remove('pop-out');
    alert.hidden = true;
  };
  box.classList.add('pop-out');
  box.addEventListener('animationend', e => { if (e.target === box) finish(); });
  /* animatsiya ishlamasa ham (reduced motion, eski brauzer) oyna albatta yopilsin */
  setTimeout(finish, 260);
}

$('#sheet').addEventListener('click', e => { if (e.target === $('#sheet')) closeSheet(); });
$('#alert').addEventListener('click', e => { if (e.target === $('#alert')) closeAlert(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSheet(); closeAlert(); } });

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

function enterApp() {
  /* Supabase tab qayta faollashganda ham SIGNED_IN yuboradi — o'sha foydalanuvchi uchun ilovani qayta ochmaymiz */
  if (currentUser && appUserId === currentUser.id) return;
  appUserId = currentUser ? currentUser.id : null;
  $('#view-login').hidden = true;
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

function showView(v) {
  VIEWS.forEach(x => { $(`#view-${x}`).hidden = x !== v; });
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === v));
  if (v === 'home') renderHome();
  if (v === 'zones') renderZones();
  if (v === 'history') { renderHistory(); loadHistory(); }
  if (v === 'products') renderProducts();
}

$('#bottom-nav').addEventListener('click', e => {
  const btn = e.target.closest('.nav-btn');
  if (btn) showView(btn.dataset.tab);
});
$$('[data-nav]').forEach(b => b.addEventListener('click', () => showView(b.dataset.nav)));
$$('.back-btn').forEach(b => b.addEventListener('click', () => showView('profile')));
$('#first-table-btn').addEventListener('click', () => showView('zones'));

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

/* ---------------- Stol turi belgisi ---------------- */
/* billiard — 8-shar, tennis — raketka (Material Symbols'da yo'q, shuning uchun SVG) */
function typeIcon(type) {
  if (type === 'tennis') {
    /* raketka (dastasi pastga-chapga) + koptok */
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.6 15.4 4.3 19.7" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/><circle cx="13.6" cy="10.4" r="7.3" fill="currentColor"/><circle cx="20" cy="19.6" r="2.4" fill="currentColor" opacity=".6"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.6" fill="currentColor"/><circle cx="12" cy="10.8" r="4.5" fill="var(--surface)"/><circle cx="12" cy="9.05" r="1.35" fill="none" stroke="currentColor" stroke-width="1.35"/><circle cx="12" cy="12.3" r="1.8" fill="none" stroke="currentColor" stroke-width="1.35"/></svg>';
}
const typeName = type => type === 'tennis' ? 'Tennis' : 'Billiard';

/* ---------------- Sessiya holati yordamchilari ---------------- */
/* free | busy | ending | over — rang faqat shu holatni bildiradi */
function tileState(s, now = nowMs()) {
  if (!s) return 'free';
  const st = statusOf(s, now);
  return st === 'expired' ? 'over' : st === 'ending' ? 'ending' : 'busy';
}
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
const productCount = s => s.products.reduce((n, e) => n + e.qty, 0);
const liveTotal = (now = nowMs()) => Object.values(sessions).reduce((sum, s) => sum + sessionPrice(s, now) + productSum(s), 0);

/* ---------------- STOLLAR (asosiy ekran) ---------------- */
let activeFilter = 'all';
let searchQuery = '';
let homeZoneId = null;

function cardFor(tab) {
  const s = sessions[tab.id];
  const typeCls = tab.type === 'tennis' ? ' tc--tennis' : '';
  if (!s) {
    return `
      <div class="table-card is-free${typeCls}" role="button" tabindex="0" data-action="start" data-tid="${tab.id}">
        <div class="tc-cover"></div>
        <div class="tc-head">
          <span class="tc-name">${escH(tab.name)}</span>
          <span class="tc-pill">${t('zones.statusFree')}</span>
        </div>
        <div class="tc-main">
          <span class="tc-start"><span class="tc-play"><span class="material-symbols-outlined">play_arrow</span></span>${t('tile.start')}</span>
        </div>
        <div class="tc-foot"><span class="tc-rate">${fmtMoney(tab.tariff)} ${t('panel.perHour')}</span></div>
      </div>`;
  }
  const st = tileState(s);
  const pill = st === 'over' ? t('panel.timeOver') : st === 'ending' ? t('panel.ending') : t('panel.active');
  const label = st === 'over' ? t('panel.overtime') : s.mode === 'countdown' ? t('panel.timeLeft') : t('panel.timePassed');
  const pct = progressPct(s);
  const n = productCount(s);
  return `
    <div class="table-card is-${st}${typeCls}" role="button" tabindex="0" data-action="panel" data-tid="${tab.id}">
      <div class="tc-cover"></div>
      <div class="tc-head">
        <span class="tc-name">${escH(tab.name)}</span>
        <span class="tc-pill">${pill}</span>
        <span class="material-symbols-outlined tc-mode" title="${s.mode === 'countdown' ? t('start.timer') : t('start.stopwatch')}">${s.mode === 'countdown' ? 'hourglass_top' : 'timer'}</span>
      </div>
      <div class="tc-main">
        <div class="tc-timer" data-timer="${tab.id}">${timerText(s)}</div>
        <div class="tc-label">${label}</div>
      </div>
      <div class="tc-foot">
        <span class="tc-sum" data-total-price="${tab.id}">${fmtMoney(sessionPrice(s) + productSum(s))}</span>
        ${n ? `<span class="tc-extra"><span class="material-symbols-outlined">local_cafe</span>${n}</span>` : ''}
      </div>
      ${pct !== null && st !== 'over' ? `<div class="progress"><i data-progress="${tab.id}" style="width:${pct.toFixed(1)}%"></i></div>` : ''}
    </div>`;
}

function zoneTables() {
  return state.zones.filter(z => !homeZoneId || z.id === homeZoneId).flatMap(z => z.tables);
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
  const el = $('#stat-live');
  if (el) el.innerHTML = moneyHTML(liveTotal(now));
}
function renderTodayStat() {
  const el = $('#stat-today');
  if (el) el.innerHTML = moneyHTML(histSessions.reduce((x, s) => x + finSummary(s).total, 0));
}

function renderHome() {
  const now = new Date();
  $('#home-date').textContent = `${WEEKDAYS[currentLang][now.getDay()]}, ${dayMonth(now)}`;

  const tabs = $('#home-zone-tabs');
  if (state.zones.length > 1) {
    if (!state.zones.some(z => z.id === homeZoneId)) homeZoneId = state.zones[0].id;
    tabs.hidden = false;
    tabs.innerHTML = state.zones.map(z => {
      const busy = z.tables.filter(x => sessions[x.id]).length;
      return `<button class="seg-btn ${z.id === homeZoneId ? 'active' : ''}" data-htab="${z.id}">${escH(z.name)}${busy ? `<span class="seg-count">${busy}</span>` : ''}</button>`;
    }).join('');
  } else {
    tabs.hidden = true;
    homeZoneId = null;
  }

  const all = state.zones.flatMap(z => z.tables);
  const busyAll = all.filter(x => sessions[x.id]).length;
  $('#stat-busy').innerHTML = `${busyAll}<small class="keep">/ ${all.length}</small>`;
  updateLiveStat();
  renderTodayStat();

  const zt = zoneTables();
  const busyZone = zt.filter(x => sessions[x.id]).length;
  $('#cnt-all').textContent = zt.length;
  $('#cnt-busy').textContent = busyZone;
  $('#cnt-free').textContent = zt.length - busyZone;

  const empty = all.length === 0;
  $('#home-empty').hidden = !empty;
  $('#search-toggle').hidden = empty;
  $('#home-stats').hidden = empty;
  $('#filter-chips').closest('.toolbar').hidden = empty;
  const list = visibleTables();
  $('#table-grid').innerHTML = list.map(cardFor).join('');
  $('#home-nomatch').hidden = empty || list.length > 0;
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
function closeSearch() {
  $('#search-bar').hidden = true;
  $('#search-input').value = '';
  searchQuery = '';
  renderHome();
}
$('#search-toggle').addEventListener('click', () => {
  const bar = $('#search-bar');
  if (!bar.hidden) { closeSearch(); return; }
  bar.hidden = false;
  $('#search-input').focus();
});
$('#search-clear').addEventListener('click', closeSearch);
$('#search-input').addEventListener('input', e => { searchQuery = e.target.value.trim(); renderHome(); });
$('#search-input').addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

$('#table-grid').addEventListener('click', e => {
  const card = e.target.closest('[data-action]');
  if (!card) return;
  const tab = findTable(card.dataset.tid);
  if (!tab) return;
  if (card.dataset.action === 'start') openStartSheet(tab);
  else openPanel(tab);
});
$('#table-grid').addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.table-card')) { e.preventDefault(); e.target.click(); }
});

$('#lang-select').addEventListener('change', e => setLang(e.target.value));

/* Sheet ichidagi karta sarlavhasi */
function sheetHead(icon, title, sub) {
  return `
    <div class="sheet-handle"></div>
    <header class="sheet-head">
      <span class="sheet-head-ic">${icon}</span>
      <div class="sheet-head-text">
        <div class="sheet-title">${title}</div>
        ${sub ? `<div class="sheet-sub">${sub}</div>` : ''}
      </div>
      <button class="sheet-close" aria-label="${t('common.cancel')}"><span class="material-symbols-outlined">close</span></button>
    </header>`;
}
const msIcon = name => `<span class="material-symbols-outlined">${escH(name)}</span>`;

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

  openSheet(`
    ${sheetHead(typeIcon(tab.type), escH(tab.name), `${t('start.title')} · ${escH(zone.name)}`)}
    <div class="sheet-content">
      <div class="mode-cards" id="mode-seg">
        <button class="mode-card ${startMode === 'stopwatch' ? 'active' : ''}" data-mode="stopwatch">
          ${msIcon('timer')}<b>${t('start.stopwatch')}</b><small>${t('start.stopwatchHint')}</small>
        </button>
        <button class="mode-card ${startMode === 'countdown' ? 'active' : ''}" data-mode="countdown">
          ${msIcon('hourglass_top')}<b>${t('start.timer')}</b><small>${t('start.timerHint')}</small>
        </button>
      </div>

      ${startMode === 'countdown' ? `
        <p class="section-title">${t('start.duration')}</p>
        <div class="duration-box">
          <button class="step-btn" data-step="-900" aria-label="−15 ${t('start.minutes')}">${msIcon('remove')}</button>
          <div class="duration-val">${fmtDur(startDuration)}</div>
          <button class="step-btn" data-step="900" aria-label="+15 ${t('start.minutes')}">${msIcon('add')}</button>
        </div>
        <div class="presets">
          ${DURATION_PRESETS.map(p => `<button class="preset ${p === startDuration ? 'active' : ''}" data-preset="${p}">${presetLabel(p)}</button>`).join('')}
        </div>` : ''}

      <p class="section-title">${t('start.hourly')}</p>
      <div class="affix">
        <input id="start-rate" class="input" type="text" inputmode="numeric" value="${escH(rateVal)}" aria-label="${t('start.hourly')}">
        <span class="affix-text">${cur()}</span>
      </div>
      <span class="field-error" id="err-rate"></span>
      ${est !== null ? `<div class="estimate"><span>${t('start.estimate')}</span><b id="start-est">${fmtMoney(est)}</b></div>` : ''}
    </div>
    <footer class="sheet-actions">
      <button class="btn btn--primary btn--lg" id="start-confirm"><span class="material-symbols-outlined ms-fill">play_arrow</span>${t('start.btn')}</button>
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
      toast(t('toast.sessionStarted'));
    } catch (err) {
      btn.disabled = false;
      toast(errText(err));
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
  const pct = progressPct(s);

  const pill = st === 'over' ? `<span class="pill pill--danger pill--dot">${t('panel.timeOver')}</span>`
    : st === 'ending' ? `<span class="pill pill--warn pill--dot">${t('panel.ending')}</span>`
    : `<span class="pill pill--accent pill--dot">${t('panel.active')}</span>`;
  const label = st === 'over' ? t('panel.overtime') : s.mode === 'countdown' ? t('panel.timeLeft') : t('panel.timePassed');
  const startAt = new Date(s.start);
  const times = s.mode === 'countdown'
    ? `<div class="hero-times"><span>${t('panel.startedAt')} <b>${hm(startAt)}</b></span><span>${t('panel.endsAt')} <b>${hm(new Date(s.start + s.duration * 1000))}</b></span></div>`
    : `<div class="hero-times hero-times--single"><span>${t('panel.startedAt')} <b>${hm(startAt)}</b></span></div>`;

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
    ${sheetHead(typeIcon(tab.type), escH(tab.name), `${escH(zone.name)} · ${s.mode === 'countdown' ? t('start.timer') : t('start.stopwatch')}`)}
    <div class="sheet-content">
      <div class="timer-hero is-${st}">
        ${pill}
        <div class="hero-timer" data-timer="${tab.id}">${timerText(s)}</div>
        <div class="hero-label">${label}</div>
        ${pct !== null && st !== 'over' ? `<div class="progress"><i data-progress="${tab.id}" style="width:${pct.toFixed(1)}%"></i></div>` : ''}
        ${times}
        ${s.mode === 'countdown' ? `
          <div class="hero-actions">
            <button class="btn btn--sm" data-extend="900">+15 ${t('start.minutes')}</button>
            <button class="btn btn--sm" data-extend="1800">+30 ${t('start.minutes')}</button>
            <button class="btn btn--sm" data-extend="3600">+1 ${t('time.hour')}</button>
          </div>` : ''}
      </div>

      <p class="section-title">${t('panel.bill')}</p>
      <div class="bill">
        <div class="bill-row">
          <span class="bill-ic">${msIcon('schedule')}</span>
          <div class="bill-main">
            <div class="bill-name">${t('panel.sessionTime')}</div>
            <div class="bill-sub">${s.mode === 'countdown' ? fmtDur(s.duration) + ' · ' : ''}${fmtMoney(rate)} ${t('panel.perHour')}</div>
          </div>
          <span class="bill-amt" data-price="${tab.id}">${fmtMoney(timePrice)}</span>
        </div>
        ${prodRows || `<div class="bill-empty">${t('panel.noProducts')}</div>`}
      </div>

      <p class="section-title">${t('panel.addProduct')}</p>
      ${zone.products.length > 6 ? `
        <label class="pick-search">
          ${msIcon('search')}
          <input id="prod-search" type="search" placeholder="${t('panel.searchPh')}" autocomplete="off" value="${escH(panelSearch)}">
        </label>` : ''}
      <div class="pick-grid" id="prod-search-results">${panelSearchHTML(zone, s)}</div>

      <div class="danger-zone">
        <button class="btn btn--link-danger" id="cancel-btn">${msIcon('delete')}${t('panel.cancelSession')}</button>
      </div>
    </div>
    <footer class="sheet-actions">
      <div class="pay-total"><span>${t('panel.total')}</span><b data-total-price="${tab.id}">${fmtMoney(total)}</b></div>
      <button class="btn btn--primary btn--lg" id="finish-btn">${msIcon('check_circle')}${t('panel.finish')}</button>
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
    catch (err) { s2.duration -= add; toast(errText(err)); loadData(); }
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
  catch (err) { toast(errText(err)); loadData(); }
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
      <button class="pick" data-pick="${p.id}">
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
  openAlert(`
    <div class="alert-ic">${msIcon('point_of_sale')}</div>
    <div class="alert-title">${t('finish.title')}</div>
    <div class="alert-sub">${escH(tab ? tab.name : '')}</div>
    <div class="receipt">
      <div class="receipt-row"><span>${t('finish.time')}</span><b>${fmtTime(sec.elapsed)}</b></div>
      <div class="receipt-row"><span>${t('finish.tableTime')}</span><b>${fmtMoney(timePrice)}</b></div>
      <div class="receipt-row"><span>${t('finish.products')}</span><b>${fmtMoney(prod)}</b></div>
      <div class="receipt-total"><span>${t('finish.total')}</span><span>${fmtMoney(timePrice + prod)}</span></div>
    </div>
    <div class="alert-btns">
      <button class="btn btn--ghost" id="abort-finish">${t('common.cancel')}</button>
      <button class="btn btn--primary" id="ok-finish">${t('finish.confirm')}</button>
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
      toast(errText(err));
      closeAlert();
      if (err && err.code === 'P0002') { closeSheet(); loadData(); }
      return;
    }
    closeAlert(); closeSheet();
    renderHome(); renderZones(); loadHistory();
    toast(`${t('toast.sessionEnded')} — ${fmtMoney(sum)}`);
  });
}

function cancelConfirm() {
  const s = sessions[currentPanel];
  if (!s) return;
  openAlert(`
    <div class="alert-ic alert-ic--danger">${msIcon('delete')}</div>
    <div class="alert-title">${t('cancel.title')}</div>
    <p class="alert-text">${t('cancel.warn')}</p>
    <div class="alert-btns">
      <button class="btn btn--ghost" id="abort-cancel">${t('cancel.no')}</button>
      <button class="btn btn--danger" id="ok-cancel">${t('cancel.yes')}</button>
    </div>
  `);
  $('#abort-cancel').addEventListener('click', closeAlert);
  $('#ok-cancel').addEventListener('click', async e => {
    const s2 = sessions[currentPanel];
    if (!s2 || e.currentTarget.disabled) return;
    e.currentTarget.disabled = true;
    try { await apiDeleteSession(s2); }
    catch (err) { toast(errText(err)); closeAlert(); return; }
    closeAlert(); closeSheet();
    renderHome(); renderZones();
    toast(t('toast.sessionCancelled'));
  });
}

/* O'chirishni tasdiqlash (zona / stol / mahsulot) */
function confirmDelete(name, warn, onOk) {
  openAlert(`
    <div class="alert-ic alert-ic--danger">${msIcon('delete')}</div>
    <div class="alert-title">'${escH(name)}'${t('confirm.deleteTitle')}</div>
    <p class="alert-text">${t('confirm.irreversible')}</p>
    ${warn ? `<div class="alert-warn-box alert-warn-box--danger">${warn}</div>` : ''}
    <div class="alert-btns">
      <button class="btn btn--ghost" id="cancel-del">${t('common.cancel')}</button>
      <button class="btn btn--danger" id="confirm-del" ${warn ? 'disabled' : ''}>${t('common.delete')}</button>
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
      toast(t('common.deleted'));
    } catch (err) { btn.disabled = false; toast(errText(err)); }
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
    } catch (err) { btn.disabled = false; toast(errText(err)); }
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
  list.innerHTML = state.zones.map(zone => {
    const busy = zone.tables.filter(x => sessions[x.id]).length;
    return `
      <div class="zone-card">
        <div class="zone-card-head">
          <span class="zone-ic">${msIcon('grid_view')}</span>
          <div class="zone-meta">
            <b>${escH(zone.name)}</b>
            <span>${zone.tables.length} ${t('zones.tables')}${busy ? ' · ' + t('zones.busyCount').replace('{n}', busy) : ''}</span>
          </div>
          <button class="icon-btn" data-edit-zone="${zone.id}" title="${t('panel.edit')}" aria-label="${t('panel.edit')}">${msIcon('edit')}</button>
        </div>
        ${zone.tables.map(tab => {
          const isBusy = !!sessions[tab.id];
          return `
            <button class="t-row" data-edit-table="${tab.id}">
              <span class="t-type">${typeIcon(tab.type)}</span>
              <span class="row-text"><b>${escH(tab.name)}</b><small>${typeName(tab.type)} · ${fmtMoney(tab.tariff)} ${t('panel.perHour')}</small></span>
              <span class="pill pill--dot ${isBusy ? 'pill--accent' : 'pill--free'}">${isBusy ? t('zones.statusBusy') : t('zones.statusFree')}</span>
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

function openZoneModal(z) {
  const isEdit = !!z;
  openSheet(`
    ${sheetHead(msIcon('grid_view'), isEdit ? t('modal.editZone') : t('modal.newZone'), isEdit ? escH(z.name) : '')}
    <div class="sheet-content">
      <div class="field">
        <label for="zone-name">${t('modal.zoneName')}</label>
        <input id="zone-name" maxlength="80" value="${isEdit ? escH(z.name) : ''}" placeholder="${t('modal.zonePh')}" autocomplete="off">
        <span class="field-error"></span>
      </div>
    </div>
    <footer class="sheet-actions">
      ${isEdit ? `<button class="btn btn--danger-soft btn--lg" id="del-zone">${msIcon('delete')}</button>` : ''}
      <button class="btn btn--primary btn--lg" id="save-zone">${t('modal.save')}</button>
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
      ${sheetHead(typeIcon(tableType), isEdit ? t('modal.editTable') : t('modal.newTable'), escH(zone.name))}
      <div class="sheet-content">
        <div class="segmented" id="type-seg">
          <button class="seg-btn ${tableType === 'billiard' ? 'active' : ''}" data-type="billiard"><span class="seg-svg">${typeIcon('billiard')}</span>Billiard</button>
          <button class="seg-btn ${tableType === 'tennis' ? 'active' : ''}" data-type="tennis"><span class="seg-svg">${typeIcon('tennis')}</span>Tennis</button>
        </div>
        <div class="field" style="margin-top:16px">
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
        ${isEdit ? `<button class="btn btn--danger-soft btn--lg" id="del-table">${msIcon('delete')}</button>` : ''}
        <button class="btn btn--primary btn--lg" id="save-table">${t('modal.save')}</button>
      </footer>
    `);
    $$('#type-seg .seg-btn').forEach(b => b.addEventListener('click', () => {
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
    tabs.hidden = true;
    list.innerHTML = `<li class="empty-state"><span class="empty-icon">${msIcon('local_cafe')}</span><p class="empty-title">${t('products.empty')}</p></li>`;
    return;
  }
  if (!state.zones.some(z => z.id === productZoneId)) productZoneId = state.zones[0].id;
  tabs.hidden = state.zones.length < 2;
  tabs.innerHTML = state.zones.map(z =>
    `<button class="seg-btn ${z.id === productZoneId ? 'active' : ''}" data-pzone="${z.id}">${escH(z.name)}</button>`).join('');

  const zone = state.zones.find(z => z.id === productZoneId);
  list.innerHTML = zone.products.map(p => `
    <li>
      <button class="list-row" data-edit-product="${p.id}">
        <span class="row-ic prod-ic">${msIcon(p.icon || 'local_cafe')}</span>
        <span class="row-text"><b>${escH(p.name)}</b><small>${t('products.sold').replace('{n}', p.sold || 0)}</small></span>
        <span class="row-value">${fmtMoney(p.price)}</span>
        <span class="material-symbols-outlined row-chevron">chevron_right</span>
      </button>
    </li>`).join('') || `
    <li class="empty-state">
      <span class="empty-icon">${msIcon('local_cafe')}</span>
      <p class="empty-title">${t('products.none')}</p>
      <p class="empty-text">${t('products.noneText')}</p>
    </li>`;
}

$('#prod-tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-pzone]');
  if (!b) return;
  productZoneId = b.dataset.pzone;
  renderProducts();
});
$('#products-list').addEventListener('click', e => {
  const b = e.target.closest('[data-edit-product]');
  if (!b) return;
  const zone = state.zones.find(z => z.id === productZoneId);
  openProductModal(zone, zone.products.find(x => x.id === b.dataset.editProduct));
});
$('#add-product-btn').addEventListener('click', () => {
  const zone = state.zones.find(z => z.id === productZoneId) || state.zones[0];
  if (!zone) { toast(t('products.empty')); showView('zones'); return; }
  openProductModal(zone, null);
});

function openProductModal(zone, p) {
  const isEdit = !!p;
  let icon = (p && p.icon) || 'local_cafe';
  openSheet(`
    ${sheetHead(msIcon(icon), isEdit ? t('modal.editProduct') : t('modal.newProduct'), escH(zone.name))}
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
      <span class="field-label">${t('modal.icon')}</span>
      <div class="icon-grid" id="icon-grid">
        ${PRODUCT_ICONS.map(i => `<button class="icon-opt ${i === icon ? 'active' : ''}" data-icon="${i}" aria-label="${i}">${msIcon(i)}</button>`).join('')}
      </div>
    </div>
    <footer class="sheet-actions">
      ${isEdit ? `<button class="btn btn--danger-soft btn--lg" id="del-prod">${msIcon('delete')}</button>` : ''}
      <button class="btn btn--primary btn--lg" id="save-prod">${t('modal.save')}</button>
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
      <button class="btn btn--primary" id="save-profile">${t('modal.save')}</button>
    </div>
  `);
  const nameInput = $('#profile-name-input');
  $('#cancel-profile').addEventListener('click', closeAlert);
  $('#save-profile').addEventListener('click', async e => {
    const name = nameInput.value.trim();
    if (!markError(nameInput, name ? '' : t('err.required'))) return;
    const btn = e.currentTarget;
    btn.disabled = true;
    const { data, error } = await sb.auth.updateUser({ data: { name } });
    if (error) { btn.disabled = false; toast(errText(error)); return; }
    if (data && data.user) currentUser = data.user;
    renderProfile();
    closeAlert();
    toast(t('common.saved'));
  });
}

function renderProfile() {
  const email = (currentUser && currentUser.email) || '';
  const name = (currentUser && currentUser.user_metadata && currentUser.user_metadata.name) || email.split('@')[0];
  $('#profile-name').textContent = name || '—';
  $('#profile-login').textContent = email;
  $('#profile-avatar').textContent = (name || email || '?').trim().charAt(0) || '?';
  $('#nav-user').textContent = name || email;
}

$('#edit-profile-btn').addEventListener('click', openProfileModal);

$('#logout-btn').addEventListener('click', () => {
  openAlert(`
    <div class="alert-ic alert-ic--danger">${msIcon('logout')}</div>
    <div class="alert-title">${t('profile.logoutTitle')}</div>
    <div class="alert-btns">
      <button class="btn btn--ghost" id="abort-logout">${t('common.cancel')}</button>
      <button class="btn btn--danger" id="ok-logout">${t('profile.logoutBtn')}</button>
    </div>
  `);
  $('#abort-logout').addEventListener('click', closeAlert);
  $('#ok-logout').addEventListener('click', async () => {
    closeAlert(); closeSheet();
    await sb.auth.signOut();
  });
});

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
    toast(errText(err));
  } finally {
    histBusy = false;
    if (histAgain) { histAgain = false; loadHistory(); }
  }
}

/* So'nggi 7 kun: bitta qator, bugun — aksent rangda; bosilgan kun qiymati pastda ko'rinadi */
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
    <div class="list-card chart-card">
      <div class="chart-head">
        <div><span class="chart-title">${t('history.week')}</span><span class="chart-sel">${sel.today ? t('history.today') : `${WEEKDAYS[currentLang][sel.d.getDay()]}, ${dayMonth(sel.d)}`}</span></div>
        <b>${fmtMoney(sel.total)}</b>
      </div>
      <div class="bars" role="list">
        ${days.map(x => `
          <button class="bar ${x.today ? 'is-today' : ''} ${x.key === histBarKey ? 'is-sel' : ''}" data-bar="${x.key}" role="listitem"
            aria-label="${dayLabel(x.d)}: ${fmtMoney(x.total)}">
            <i style="height:${Math.max(3, Math.round(x.total / max * 88))}px"></i>
            <span>${WEEKDAYS_SHORT[currentLang][x.d.getDay()]}</span>
          </button>`).join('')}
      </div>
      <div class="bars-foot"><span>${t('history.weekTotal')}</span><b>${fmtMoney(sum)}</b></div>
    </div>`;
}

function renderHistory() {
  const body = $('#history-body');
  const now = new Date();
  const sums = histSessions.map(finSummary);
  const tTime = sums.reduce((a, x) => a + x.timePrice, 0);
  const tProd = sums.reduce((a, x) => a + x.prod, 0);
  const tTotal = tTime + tProd;

  let html = `
    <div class="hist-top">
    <div class="hist-hero">
      <div class="hist-hero-label">${t('stats.today')} · ${dayMonth(now)}</div>
      <div class="hist-hero-value">${fmtNum(tTotal)}<small>${cur()}</small></div>
      <div class="hist-hero-grid">
        <div><span>${t('history.tablesTotal')}</span><b>${fmtMoney(tTime)}</b></div>
        <div><span>${t('history.productsTotal')}</span><b>${fmtMoney(tProd)}</b></div>
        <div><span>${t('history.sessions')}</span><b>${histSessions.length}</b></div>
      </div>
    </div>`;

  html += `${weekChartHTML(tTotal)}</div>`;

  html += `<p class="section-title">${t('history.todaySessions')}${histSessions.length ? `<b>${histSessions.length}</b>` : ''}</p>`;
  if (histSessions.length) {
    html += '<div class="list-card">' + histSessions.map((s, i) => {
      const f = sums[i];
      const extra = f.prod ? ` · ${t('history.products')} ${fmtMoney(f.prod)}` : '';
      return `
        <div class="list-row">
          <span class="row-ic">${typeIcon(s.tables?.sport)}</span>
          <span class="row-text">
            <b>${escH(s.tables?.name || '—')}</b>
            <small>${hm(new Date(s.start_time))} – ${hm(new Date(s.end_time))} · ${fmtDur(f.elapsed)}${extra}</small>
          </span>
          <span class="row-value">${fmtMoney(f.total)}</span>
        </div>`;
    }).join('') + '</div>';
  } else {
    html += `<div class="list-card"><div class="empty-state empty-state--sm"><p class="empty-text">${t('history.noToday')}</p></div></div>`;
  }

  if (histDays.length) {
    const byMonth = new Map();
    for (const d of histDays) {
      const mk = monthKey(d.date);
      if (!byMonth.has(mk)) byMonth.set(mk, []);
      byMonth.get(mk).push(d);
    }
    const curMk = monthKey(now);
    html += `<p class="section-title">${t('history.past')}</p><div class="list-card">`;
    [...byMonth.keys()].sort().reverse().forEach(mk => {
      const [y, m] = mk.split('-').map(Number);
      const open = mk === curMk;
      const days = byMonth.get(mk).sort((a, b) => b.key.localeCompare(a.key));
      html += `<button class="hist-month ${open ? 'open' : ''}" data-mk="${mk}"><span>${MONTH_NAMES[currentLang][m - 1]} ${y}</span><b>${fmtMoney(days.reduce((a, d) => a + d.total, 0))}</b>${msIcon('expand_more')}</button>`;
      html += `<div class="hist-month-body" ${open ? '' : 'hidden'}>`;
      days.forEach(d => {
        html += `<button class="hist-day" data-dk="${d.key}"><span>${WEEKDAYS_SHORT[currentLang][d.date.getDay()]}, ${dayMonth(d.date)}</span><b>${fmtMoney(d.total)}</b>${msIcon('expand_more')}</button>`;
        html += `<div class="hist-day-body" hidden>
            <div class="hist-sum-row"><span>${t('history.tablesTotal')}</span><b>${fmtMoney(d.time)}</b></div>
            <div class="hist-sum-row"><span>${t('history.productsTotal')}</span><b>${fmtMoney(d.prod)}</b></div>
          </div>`;
      });
      html += '</div>';
    });
    html += '</div>';
  }
  body.innerHTML = html;
}

$('#history-body').addEventListener('click', e => {
  const bar = e.target.closest('[data-bar]');
  if (bar) { histBarKey = bar.dataset.bar; renderHistory(); return; }
  const mb = e.target.closest('.hist-month');
  if (mb) {
    const bodyEl = mb.nextElementSibling;
    mb.classList.toggle('open');
    bodyEl.hidden = !bodyEl.hidden;
    return;
  }
  const dbtn = e.target.closest('.hist-day');
  if (dbtn) {
    const bodyEl = dbtn.nextElementSibling;
    bodyEl.hidden = !bodyEl.hidden;
    dbtn.classList.toggle('open', !bodyEl.hidden);
  }
});

setInterval(() => {
  if (!currentUser) return;
  const k = dayKey(new Date());
  if (k !== histDay) { histDay = k; loadHistory(); renderHome(); return; }
  if (!$('#view-history').hidden) loadHistory();
}, 30000);

/* ---------------- TAYMER DVIGATELI ---------------- */
let lastStatus = {};

function tick() {
  const now = nowMs();
  let needRender = false;

  Object.keys(sessions).forEach(tid => {
    const s = sessions[tid];
    const st = statusOf(s, now);
    if (lastStatus[tid] !== st) {
      if (st === 'expired' && lastStatus[tid] && navigator.vibrate) navigator.vibrate(400);
      lastStatus[tid] = st;
      needRender = true;
    }
  });
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
  if (!$('#view-home').hidden) updateLiveStat(now);
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
applyTheme();
applyStaticLang();
const langSelect = $('#lang-select');
if (langSelect) langSelect.value = currentLang;
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
    toast(errText(err));
  }
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
