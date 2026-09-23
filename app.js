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
    'filter.all': 'Barchasi', 'filter.free': 'Bo\'sh', 'filter.busy': 'Band', 'filter.repair': 'Ta\'mirlashda',
    'home.empty': 'Hali stol qo\'shilmagan', 'home.firstTable': 'Birinchi stolni qo\'shish',
    'nav.home': 'Asosiy', 'nav.zones': 'Zonalar', 'nav.history': 'Tarix', 'nav.products': 'Mahsulotlar', 'nav.profile': 'Profil',
    'history.title': 'Tarix', 'history.today': 'Bugun', 'history.empty': 'Hali yakunlangan sessiya yo\'q',
    'history.time': 'Vaqt', 'history.tableTime': 'Stol', 'history.products': 'Mahsulot', 'history.total': 'Jami',
    'history.tablesTotal': 'Stollardan', 'history.productsTotal': 'Mahsulotlardan', 'history.dayTotal': 'Kun jami',
    'zones.title': 'Zonalar', 'zones.add': '+ Yangi zona qo\'shish', 'zones.empty': 'Hali zona yo\'q — birinchi zonani qo\'shing',
    'zones.tables': 'stol', 'zones.statusBusy': 'Band', 'zones.statusFree': 'Bo\'sh', 'zones.addTable': 'Yangi stol qo\'shish',
    'products.title': 'Mahsulotlar', 'products.add': '+ Yangi mahsulot qo\'shish', 'products.empty': 'Avval zona qo\'shing',
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
    'start.duration': 'Davomiylikni belgilash', 'start.minutes': 'daqiqa', 'start.hourly': 'Soatlik narx', 'start.btn': 'Sessiyani boshlash',
    'time.hour': 'soat', 'time.min': 'daqiqa',
    'panel.addProduct': 'Mahsulot qo\'shish', 'panel.searchPh': 'Mahsulot qidirish...', 'panel.noProduct': 'Mahsulot topilmadi',
    'panel.order': 'Joriy buyurtma', 'panel.done': 'Bajarildi', 'panel.edit': 'Tahrirlash',
    'panel.sessionTime': 'Sessiya vaqti', 'panel.tariff': 'Tarif', 'panel.perHour': '/ soat', 'panel.total': 'Jami',
    'panel.finish': 'Sessiyani yakunlash va to\'lash', 'panel.cancelSession': 'Sessiyani bekor qilish',
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
    'repair.hint': 'Xizmatdan vaqtincha chiqarilgan',
    'block.title': 'Hisob bloklangan', 'block.text': 'Hisobingiz administrator tomonidan bloklangan. Blok olib tashlanganda bu oyna avtomatik yo\'qoladi.', 'block.retry': 'Qayta tekshirish',
    'net.title': 'Internet bilan muammo', 'net.text': 'Internet aloqasi yo\'q. Aloqa tiklanganda avtomatik davom etadi.', 'net.retry': 'Qayta urinish',
    'theme.title': 'Ko\'rinish', 'theme.light': 'Kun', 'theme.dark': 'Tun',
    'err.tableBusy': 'Bu stolda allaqachon faol sessiya bor', 'err.sessionGone': 'Sessiya allaqachon yakunlangan yoki o\'chirilgan',
    'modal.repair': 'Ta\'mirlashda (vaqtincha ishlamaydi)', 'modal.repairBusy': 'Faol sessiya bor — avval uni yakunlang',
    'access.trialLeft': 'Sinov muddati: {n} kun qoldi · admin tasdig\'i kutilmoqda',
    'access.pendingTitle': 'Admin tasdig\'i kutilmoqda', 'access.pendingText': 'So\'rovingiz administratorga yuborildi. To\'lovdan so\'ng admin ruxsat beradi va ilova umrbod ochiladi. Ruxsat berilishi bilan bu oyna avtomatik yo\'qoladi.',
    'access.rejectedTitle': 'Ruxsat berilmagan', 'access.rejectedText': 'Administrator bu hisobga ruxsat bermagan. Batafsil ma\'lumot uchun administrator bilan bog\'laning.',
    'access.retry': 'Qayta tekshirish', 'access.logout': 'Chiqish',
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
    'filter.all': 'All', 'filter.free': 'Free', 'filter.busy': 'Busy', 'filter.repair': 'Repair',
    'home.empty': 'No tables yet', 'home.firstTable': 'Add the first table',
    'nav.home': 'Home', 'nav.zones': 'Zones', 'nav.history': 'History', 'nav.products': 'Products', 'nav.profile': 'Profile',
    'history.title': 'History', 'history.today': 'Today', 'history.empty': 'No finished sessions yet',
    'history.time': 'Time', 'history.tableTime': 'Table', 'history.products': 'Products', 'history.total': 'Total',
    'history.tablesTotal': 'Tables', 'history.productsTotal': 'Products', 'history.dayTotal': 'Day total',
    'zones.title': 'Zones', 'zones.add': '+ Add new zone', 'zones.empty': 'No zones yet — add the first one',
    'zones.tables': 'tables', 'zones.statusBusy': 'Busy', 'zones.statusFree': 'Free', 'zones.addTable': 'Add new table',
    'products.title': 'Products', 'products.add': '+ Add new product', 'products.empty': 'Add a zone first',
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
    'start.duration': 'Set duration', 'start.minutes': 'min', 'start.hourly': 'Hourly rate', 'start.btn': 'Start session',
    'time.hour': 'h', 'time.min': 'min',
    'panel.addProduct': 'Add product', 'panel.searchPh': 'Search products...', 'panel.noProduct': 'No products found',
    'panel.order': 'Current order', 'panel.done': 'Done', 'panel.edit': 'Edit',
    'panel.sessionTime': 'Session time', 'panel.tariff': 'Rate', 'panel.perHour': '/ hour', 'panel.total': 'Total',
    'panel.finish': 'Finish and pay', 'panel.cancelSession': 'Cancel session',
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
    'repair.hint': 'Temporarily out of service',
    'block.title': 'Account blocked', 'block.text': 'Your account has been blocked by the administrator. This window will disappear automatically once the block is lifted.', 'block.retry': 'Check again',
    'net.title': 'Connection problem', 'net.text': 'No internet connection. It will continue automatically once the connection is restored.', 'net.retry': 'Try again',
    'theme.title': 'Appearance', 'theme.light': 'Day', 'theme.dark': 'Night',
    'err.tableBusy': 'This table already has an active session', 'err.sessionGone': 'The session was already finished or deleted',
    'modal.repair': 'Under repair (temporarily unavailable)', 'modal.repairBusy': 'Active session — finish it first',
    'access.trialLeft': 'Trial: {n} days left · waiting for admin approval',
    'access.pendingTitle': 'Waiting for admin approval', 'access.pendingText': 'Your request has been sent to the administrator. After payment the admin approves it and the app is unlocked for life. This window disappears automatically once approved.',
    'access.rejectedTitle': 'Access not granted', 'access.rejectedText': 'The administrator has not granted access to this account. Please contact the administrator.',
    'access.retry': 'Check again', 'access.logout': 'Log out',
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
    'filter.all': 'Все', 'filter.free': 'Свободные', 'filter.busy': 'Занятые', 'filter.repair': 'На ремонте',
    'home.empty': 'Столы ещё не добавлены', 'home.firstTable': 'Добавить первый стол',
    'nav.home': 'Главная', 'nav.zones': 'Зоны', 'nav.history': 'История', 'nav.products': 'Товары', 'nav.profile': 'Профиль',
    'history.title': 'История', 'history.today': 'Сегодня', 'history.empty': 'Завершённых сессий пока нет',
    'history.time': 'Время', 'history.tableTime': 'Стол', 'history.products': 'Товары', 'history.total': 'Итого',
    'history.tablesTotal': 'Столы', 'history.productsTotal': 'Товары', 'history.dayTotal': 'Итог дня',
    'zones.title': 'Зоны', 'zones.add': '+ Добавить новую зону', 'zones.empty': 'Зон ещё нет — добавьте первую',
    'zones.tables': 'стол.', 'zones.statusBusy': 'Занят', 'zones.statusFree': 'Свободен', 'zones.addTable': 'Добавить новый стол',
    'products.title': 'Товары', 'products.add': '+ Добавить новый товар', 'products.empty': 'Сначала добавьте зону',
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
    'start.duration': 'Установить длительность', 'start.minutes': 'мин', 'start.hourly': 'Тариф за час', 'start.btn': 'Начать сессию',
    'time.hour': 'ч', 'time.min': 'мин',
    'panel.addProduct': 'Добавить товар', 'panel.searchPh': 'Поиск товаров...', 'panel.noProduct': 'Товары не найдены',
    'panel.order': 'Текущий заказ', 'panel.done': 'Готово', 'panel.edit': 'Изменить',
    'panel.sessionTime': 'Время сессии', 'panel.tariff': 'Тариф', 'panel.perHour': '/ час', 'panel.total': 'Итого',
    'panel.finish': 'Завершить и оплатить', 'panel.cancelSession': 'Отменить сессию',
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
    'repair.hint': 'Временно выведен из эксплуатации',
    'block.title': 'Аккаунт заблокирован', 'block.text': 'Ваш аккаунт заблокирован администратором. Это окно исчезнет автоматически после снятия блокировки.', 'block.retry': 'Проверить снова',
    'net.title': 'Проблема с интернетом', 'net.text': 'Нет подключения к интернету. Работа продолжится автоматически после восстановления связи.', 'net.retry': 'Повторить',
    'theme.title': 'Оформление', 'theme.light': 'День', 'theme.dark': 'Ночь',
    'err.tableBusy': 'На этом столе уже есть активная сессия', 'err.sessionGone': 'Сессия уже завершена или удалена',
    'modal.repair': 'На ремонте (временно недоступен)', 'modal.repairBusy': 'Есть активная сессия — сначала завершите её',
    'access.trialLeft': 'Пробный период: осталось {n} дн. · ожидается подтверждение администратора',
    'access.pendingTitle': 'Ожидается подтверждение', 'access.pendingText': 'Ваш запрос отправлен администратору. После оплаты администратор подтвердит доступ, и приложение откроется навсегда. Это окно исчезнет автоматически.',
    'access.rejectedTitle': 'Доступ не предоставлен', 'access.rejectedText': 'Администратор не предоставил доступ этому аккаунту. Свяжитесь с администратором.',
    'access.retry': 'Проверить снова', 'access.logout': 'Выйти',
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
async function apiAddTable(zone, name, tariff, type, repair) {
  const { data, error } = await sb.from('tables').insert({ zone_id: zone.id, name, tariff, sport: type, repair, sort_order: zone.tables.length }).select().single();
  if (error) throw error;
  zone.tables.push({ id: String(data.id), name: data.name, tariff: Number(data.tariff), type: data.sport, repair: !!data.repair });
}
async function apiUpdateTable(tab, name, tariff, type, repair) {
  const { error } = await sb.from('tables').update({ name, tariff, sport: type, repair }).eq('id', tab.id);
  if (error) throw error;
  tab.name = name; tab.tariff = tariff; tab.type = type; tab.repair = repair;
}
async function apiDeleteTable(tab, zone) {
  const { error } = await sb.from('tables').delete().eq('id', tab.id);
  if (error) throw error;
  zone.tables = zone.tables.filter(x => x.id !== tab.id);
  delete sessions[tab.id];
  delete lastStatus[tab.id];
}
async function apiAddProduct(zone, name, price) {
  const { data, error } = await sb.from('products').insert({ zone_id: zone.id, name, price, icon: 'local_bar', sold: 0, sort_order: zone.products.length }).select().single();
  if (error) throw error;
  zone.products.push({ id: String(data.id), name: data.name, price: Number(data.price), icon: data.icon, sold: data.sold });
}
async function apiUpdateProduct(p, name, price) {
  const { error } = await sb.from('products').update({ name, price }).eq('id', p.id);
  if (error) throw error;
  p.name = name; p.price = price;
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
        .select('id, name, sort_order, tables(id, name, sport, tariff, repair, sort_order), products(id, name, price, icon, sold, sort_order)')
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
      tables: (z.tables || []).map(t => ({ id: String(t.id), name: t.name, tariff: Number(t.tariff), type: t.sport, repair: !!t.repair })),
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
const fmtMoney = n => Math.round(n).toLocaleString('en-US') + ' ' + cur();
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
let dialogQty = 1;

function openSheet(html) {
  $('#sheet-body').innerHTML = html;
  $('#sheet').hidden = false;
  $$('.sheet-close').forEach(b => b.addEventListener('click', closeSheet));
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
  $('#access-text').textContent = t(rejected ? 'access.rejectedText' : 'access.pendingText');
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
  if (v === 'history') loadHistory();
  if (v === 'products') renderProducts();
}

$('#bottom-nav').addEventListener('click', e => {
  const btn = e.target.closest('.nav-btn');
  if (btn) showView(btn.dataset.tab);
});
$$('[data-nav]').forEach(b => b.addEventListener('click', () => showView(b.dataset.nav)));
$$('.back-btn').forEach(b => b.addEventListener('click', () => showView('profile')));
$('#first-table-btn').addEventListener('click', () => showView('zones'));

/* ---------------- ASOSIY EKRAN ---------------- */
let activeFilter = 'all';
let searchQuery = '';
let homeZoneId = null;

const RING_C = r => 2 * Math.PI * r;

function cardFor(tab) {
  const isTt = tab.type === 'tennis';
  const coverCls = isTt ? 'card-cover card-cover--tt' : 'card-cover';
  const cardCls = isTt ? ' card--tt' : '';
  if (tab.repair) {
    return `
      <div class="table-card card-repair${cardCls}">
        <div class="${coverCls}"></div>
        <div class="card-body">
          <div class="card-info">
            <span class="table-name">${escH(tab.name)}</span>
            <span class="free-hint">${t('repair.hint')}</span>
          </div>
        </div>
      </div>`;
  }
  const s = sessions[tab.id];
  if (!s) {
    return `
      <div class="table-card card-free${cardCls}" data-action="start" data-tid="${tab.id}">
        <div class="${coverCls}"></div>
        <div class="card-body">
          <span class="table-name table-name--lg">${escH(tab.name)}</span>
        </div>
      </div>`;
  }
  const st = statusOf(s);
  const sec = sessionSeconds(s);
  const cls = st === 'ending' ? 'card-ending' : 'card-busy';
  const label = st === 'expired' ? t('panel.overtime') : s.mode === 'countdown' ? t('panel.timeLeft') : t('panel.timePassed');
  const timerText = sec.overtime > 0 ? '+' + fmtTime(sec.overtime) : fmtTime(sec.remaining ?? sec.elapsed);
  return `
    <div class="table-card ${cls}${cardCls}" data-action="panel" data-tid="${tab.id}">
      <div class="${coverCls}"></div>
      <div class="card-body">
        <div class="card-info">
          <span class="table-name">${escH(tab.name)}</span>
          <span class="card-price" data-price="${tab.id}">${fmtMoney(sessionPrice(s))}</span>
        </div>
        <div class="timer-wrap">
          ${s.mode === 'countdown' && st !== 'expired'
            ? `<svg class="ring ring--${st === 'ending' ? 'amber' : 'red'}" viewBox="-52 -52 104 104" data-ring="${tab.id}" data-radius="46"><circle class="ring-circle" cx="0" cy="0" r="46" stroke-width="6" stroke="#dee4e1"/></svg>` : ''}
          <div class="timer" data-timer="${tab.id}">${timerText}</div>
          <span class="timer-label">${label}</span>
        </div>
      </div>
    </div>`;
}

function visibleTables() {
  let list = [];
  state.zones.forEach(z => {
    if (homeZoneId && z.id !== homeZoneId) return;
    z.tables.forEach(t => list.push({ ...t, zone: z }));
  });
  list = list.filter(t => {
    const has = !!sessions[t.id];
    if (t.repair) return activeFilter === 'all' || activeFilter === 'repair';
    if (activeFilter === 'free') return !has;
    if (activeFilter === 'busy') return has;
    if (activeFilter === 'repair') return false;
    return true;
  });
  if (searchQuery) list = list.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return list;
}

function renderHome() {
  const tabs = $('#home-zone-tabs');
  if (state.zones.length > 1) {
    if (!state.zones.some(z => z.id === homeZoneId)) homeZoneId = state.zones[0].id;
    tabs.hidden = false;
    tabs.innerHTML = state.zones.map(z =>
      `<button class="seg-btn ${z.id === homeZoneId ? 'active' : ''}" data-htab="${z.id}">${escH(z.name)}</button>`).join('');
    $$('#home-zone-tabs .seg-btn').forEach(b => b.addEventListener('click', () => {
      homeZoneId = b.dataset.htab;
      renderHome();
    }));
  } else {
    tabs.hidden = true;
    homeZoneId = null;
  }
  const total = state.zones.reduce((n, z) => n + z.tables.length, 0);
  $('#home-empty').hidden = total !== 0;
  $('#table-grid').innerHTML = visibleTables().map(t => cardFor(t)).join('');
}

$('#filter-chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  $$('#filter-chips .chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  activeFilter = chip.dataset.filter;
  renderHome();
});
$('#search-toggle').addEventListener('click', () => {
  const inp = $('#search-input');
  inp.hidden = !inp.hidden;
  if (!inp.hidden) inp.focus();
});
$('#search-input').addEventListener('input', e => { searchQuery = e.target.value; renderHome(); });

$('#table-grid').addEventListener('click', e => {
  const card = e.target.closest('[data-action]');
  if (!card) return;
  const t = findTable(card.dataset.tid);
  if (card.dataset.action === 'start') openStartSheet(t);
  else openPanel(t);
});

$('#lang-select').addEventListener('change', e => setLang(e.target.value));

/* ---------------- SESSIYANI BOSHLASH OYNASI ---------------- */
let startTable = null;
let startMode = 'stopwatch';
let startDuration = 2700;

function openStartSheet(t) {
  startTable = t;
  startMode = 'stopwatch';
  startDuration = 2700;
  renderStartSheet();
}

function renderStartSheet() {
  const tab = startTable;
  if (!tab) return;
  const zone = findZone(tab.id);
  const mode = startMode;
  const duration = startDuration;

  openSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div>
        <div class="sheet-title">${t('start.title')}</div>
        <div class="sheet-sub">${escH(tab.name)} · ${escH(zone.name)}</div>
      </div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="sheet-content">
      <div class="segmented" id="mode-seg">
        <button class="seg-btn ${mode === 'stopwatch' ? 'active' : ''}" data-mode="stopwatch">${t('start.stopwatch')}</button>
        <button class="seg-btn ${mode === 'countdown' ? 'active' : ''}" data-mode="countdown">${t('start.timer')}</button>
      </div>

      ${mode === 'countdown' ? `
        <div class="sheet-section">
          <div class="sheet-section-title">${t('start.duration')}</div>
          <div class="duration-stepper">
            <button class="step-btn" data-step="-900"><span class="material-symbols-outlined">remove</span></button>
            <div class="duration-val">${Math.round(duration / 60)} <span>${t('start.minutes')}</span></div>
            <button class="step-btn" data-step="900"><span class="material-symbols-outlined">add</span></button>
          </div>
          <div class="quick-chips">
            <button class="chip" data-add="900">+15 ${t('start.minutes')}</button>
            <button class="chip" data-add="1800">+30 ${t('start.minutes')}</button>
            <button class="chip" data-add="3600">+1 ${t('time.hour')}</button>
          </div>
        </div>` : ''}

      <div class="sheet-section">
        <div class="sheet-section-title">${t('start.hourly')} (${cur()})</div>
        <input id="start-rate" type="text" inputmode="numeric" value="${fmtIn(tab.tariff)}" class="rate-input" aria-label="${t('start.hourly')}">
        <span class="field-error" id="err-rate"></span>
      </div>
    </div>
    <div class="sheet-actions">
      <button class="btn btn--primary btn--block btn--lg" id="start-confirm">
        <span class="material-symbols-outlined">play_arrow</span> ${t('start.btn')}
      </button>
    </div>
  `);

  bindMoneyInput($('#start-rate'));

  $$('#mode-seg .seg-btn').forEach(b => b.addEventListener('click', () => { startMode = b.dataset.mode; renderStartSheet(); }));
  $$('[data-step]').forEach(b => b.addEventListener('click', () => {
    startDuration = Math.min(172800, Math.max(900, startDuration + +b.dataset.step));
    renderStartSheet();
  }));
  $$('[data-add]').forEach(b => b.addEventListener('click', () => {
    startDuration = Math.min(172800, startDuration + +b.dataset.add);
    renderStartSheet();
  }));
  $('#start-confirm').addEventListener('click', async () => {
    const rateInput = $('#start-rate');
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
  renderPanel();
}


function renderPanel() {
  const s = sessions[currentPanel];
  if (!s) { closeSheet(); return; }
  const tab = findTable(currentPanel);
  const zone = findZone(currentPanel);
  const st = statusOf(s);
  const sec = sessionSeconds(s);
  const timePrice = sessionPrice(s);
  const total = timePrice + productSum(s);

  const label = st === 'expired' ? t('panel.overtime') : s.mode === 'countdown' ? t('panel.timeLeft') : t('panel.timePassed');
  const orbTimer = sec.overtime > 0 ? '+' + fmtTime(sec.overtime) : fmtTime(sec.remaining ?? sec.elapsed);
  const orbCls = st === 'ending' ? 'card-ending' : '';
  const badge = st === 'expired' ? t('panel.timeOver') : st === 'ending' ? t('panel.ending') : t('panel.active');
  const badgeCls = st === 'ending' ? 'badge--ending' : 'badge--busy';

  const timeSub = s.mode === 'countdown' ? `(${fmtDur(s.duration)})` : `(${fmtDur(sec.elapsed)})`;
  const rate = s.rate ?? tab.tariff;
  const timeRow = `
    <div class="order-row order-row--time">
      <div class="order-name">${t('panel.sessionTime')} ${timeSub}
        <span class="sub">${t('panel.tariff')}: ${fmtMoney(rate)} ${t('panel.perHour')}</span>
      </div>
      <div class="order-amount" data-price="${tab.id}">${fmtMoney(timePrice)}</div>
    </div>`;

  const prodRows = s.products.map(e => {
    const p = productById(zone.id, e.pid);
    if (!p) return '';
    return `
      <div class="order-row">
        <div class="order-name">${escH(p.name)}
          <span class="sub">${e.qty} x ${fmtMoney(p.price)}</span>
        </div>
        <div class="order-amount">${fmtMoney(p.price * e.qty)}</div>
        ${panelEdit ? `
          <div class="order-actions">
            <div class="stepper-sm">
              <button data-dec="${p.id}">−</button>
              <span class="qty">${e.qty}</span>
              <button data-inc="${p.id}">+</button>
            </div>
            <button class="add-mini" data-remove="${p.id}" title="${t('common.delete')}" style="background:var(--error-container);color:var(--on-error-container)"><span class="material-symbols-outlined">delete</span></button>
          </div>` : `<span class="order-qty">×${e.qty}</span>`}
      </div>`;
  }).join('');

  openSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div>
        <div class="sheet-title">${escH(tab.name)}</div>
        <div class="sheet-sub">${escH(zone.name)} · ${fmtMoney(tab.tariff)} ${t('panel.perHour')}</div>
      </div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>

    <div class="sheet-content">
      <div class="timer-orb-card ${orbCls}">
        <span class="orb-badge ${badgeCls}">${badge}</span>
        <div class="timer-orb">
          ${s.mode === 'countdown' && st !== 'expired'
            ? `<svg class="ring ring--${st === 'ending' ? 'amber' : 'red'}" viewBox="-52 -52 104 104" data-ring="${tab.id}" data-radius="46"><circle class="ring-circle" cx="0" cy="0" r="46" stroke-width="4" stroke="#dee4e1"/></svg>` : ''}
          <div class="orb-inner">
            <div class="orb-timer" data-timer="${tab.id}">${orbTimer}</div>
            <div class="orb-label" data-orb-label="${tab.id}">${label}</div>
          </div>
        </div>
        ${s.mode === 'countdown' ? `
          <div class="orb-btns">
            <button class="btn btn--ghost btn--sm" data-extend="900">+15 ${t('start.minutes')}</button>
            <button class="btn btn--ghost btn--sm" data-extend="1800">+30 ${t('start.minutes')}</button>
          </div>` : ''}
      </div>

      <div class="sheet-section">
        <div class="sheet-section-title">${t('panel.addProduct')}</div>
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input id="prod-search" type="text" class="search-input" placeholder="${t('panel.searchPh')}" autocomplete="off" value="${escH(panelSearch)}">
        </div>
        <div class="prod-pick-list" id="prod-search-results">${panelSearchHTML(zone)}</div>
      </div>

      <div class="sheet-section">
        <div class="sheet-section-title">
          ${t('panel.order')}
          ${panelEdit
            ? `<button class="link" id="done-edit">${t('panel.done')}</button>`
            : `<button class="link" id="toggle-edit"><span class="material-symbols-outlined" style="font-size:16px">edit</span> ${t('panel.edit')}</button>`}
        </div>
        <div class="order-list">${timeRow}${prodRows}</div>
        <div class="order-total">
          <span>${t('panel.total')}:</span><b data-total-price="${tab.id}">${fmtMoney(total)}</b>
        </div>
      </div>
    </div>

    <div class="sheet-actions">
      <button class="btn btn--danger btn--block btn--lg" id="finish-btn">${t('panel.finish')}</button>
      <button class="btn btn--ghost btn--block" id="cancel-btn">${t('panel.cancelSession')}</button>
    </div>
  `);

  $('#prod-search').addEventListener('input', e => {
    panelSearch = e.target.value.trim().toLowerCase();
    $('#prod-search-results').innerHTML = panelSearchHTML(zone);
    bindProductPicks();
  });
  bindProductPicks();
  $('#toggle-edit')?.addEventListener('click', () => { panelEdit = true; renderPanel(); });
  $('#done-edit')?.addEventListener('click', () => { panelEdit = false; renderPanel(); });
  $$('[data-inc]').forEach(b => b.addEventListener('click', () => { addToSession(currentPanel, b.dataset.inc, 1); renderPanel(); }));
  $$('[data-dec]').forEach(b => b.addEventListener('click', () => { addToSession(currentPanel, b.dataset.dec, -1); renderPanel(); }));
  $$('[data-remove]').forEach(b => b.addEventListener('click', () => { removeFromSession(currentPanel, b.dataset.remove); renderPanel(); }));
  $$('[data-extend]').forEach(b => b.addEventListener('click', async () => {
    const s2 = sessions[currentPanel];
    if (!s2 || s2.mode !== 'countdown') return;
    const add = +b.dataset.extend;
    s2.duration += add;
    renderPanel();
    try { await apiExtendSession(s2, add); }
    catch (err) { s2.duration -= add; toast(errText(err)); loadData(); }
    if (currentPanel === s2.tableId && sessions[currentPanel]) renderPanel();
  }));
  $('#finish-btn').addEventListener('click', finishConfirm);
  $('#cancel-btn').addEventListener('click', cancelConfirm);
}

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
async function removeFromSession(tid, pid) {
  const s = sessions[tid];
  if (!s) return;
  const e = s.products.find(x => x.pid === pid);
  if (!e) return;
  s.products = s.products.filter(x => x !== e);
  try { await apiAddSessionProduct(s, pid, -e.qty); }
  catch (err) { toast(errText(err)); loadData(); }
}

function panelSearchHTML(zone) {
  const q = panelSearch;
  const list = q
    ? zone.products.filter(p => p.name.toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name))
    : zone.products.slice().sort((a, b) => b.sold - a.sold).slice(0, 4);
  if (!list.length) return '<div class="prod-pick-empty">' + t('panel.noProduct') + '</div>';
  return list.map(p => `
    <button class="prod-pick" data-pick="${p.id}">
      <span class="quick-icon"><span class="material-symbols-outlined">${escH(p.icon || 'local_bar')}</span></span>
      <span class="pp-name">${escH(p.name)}</span>
      <span class="pp-price">${fmtMoney(p.price)}</span>
    </button>`).join('');
}

function bindProductPicks() {
  $$('[data-pick]').forEach(b => b.addEventListener('click', () => {
    const p = productById(findZone(currentPanel).id, b.dataset.pick);
    if (p) openProductDialog(p);
  }));
}

function openProductDialog(p) {
  dialogQty = 1;
  openAlert(`
    <button class="alert-close" id="qty-close"><span class="material-symbols-outlined">close</span></button>
    <div class="alert-title">${escH(p.name)}</div>
    <div class="alert-sub">${fmtMoney(p.price)} ${t('panel.dona')}</div>
    <div class="qty-stepper">
      <button class="qty-btn" id="qty-dec">−</button>
      <span class="qty-num" id="qty-num">1</span>
      <button class="qty-btn" id="qty-inc">+</button>
    </div>
    <div class="alert-btns">
      <button class="btn btn--primary" id="qty-add">${t('dialog.add')}</button>
    </div>
  `);
  $('#qty-close').addEventListener('click', closeAlert);
  $('#qty-dec').addEventListener('click', () => {
    if (dialogQty > 1) { dialogQty--; $('#qty-num').textContent = dialogQty; }
  });
  $('#qty-inc').addEventListener('click', () => {
    dialogQty++; $('#qty-num').textContent = dialogQty;
  });
  $('#qty-add').addEventListener('click', async () => {
    closeAlert();
    renderPanel();
    await addToSession(currentPanel, p.id, dialogQty);
    toast(`${p.name} ${t('dialog.added')}`);
  });
}

/* ---------------- YAKUNLASH / BEKOR QILISH ---------------- */
function finishConfirm() {
  const s = sessions[currentPanel];
  if (!s) return;
  const timePrice = sessionPrice(s);
  const prod = productSum(s);
  const sec = sessionSeconds(s);
  openAlert(`
    <div class="alert-title">${t('finish.title')}</div>
    <div class="alert-breakdown">
      <div class="ab-row"><span>${t('finish.time')}</span><b>${fmtTime(sec.elapsed)}</b></div>
      <div class="ab-row"><span>${t('finish.tableTime')}</span><b>${fmtMoney(timePrice)}</b></div>
      <div class="ab-row"><span>${t('finish.products')}</span><b>${fmtMoney(prod)}</b></div>
      <div class="ab-total"><span>${t('finish.total')}</span><span>${fmtMoney(timePrice + prod)}</span></div>
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
    <div class="alert-title">${t('cancel.title')}</div>
    <p class="alert-text alert-text--warn">${t('cancel.warn')}</p>
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

/* ---------------- ZONALAR ---------------- */
let openZoneId = null;

function zoneStatus(tab) {
  return sessions[tab.id]
    ? { cls: 'busy', txt: t('zones.statusBusy') }
    : { cls: 'free', txt: t('zones.statusFree') };
}

function renderZones() {
  if (!state.zones.length) {
    $('#zone-tabs').innerHTML = '';
    $('#zones-table-list').innerHTML = '<div class="empty-state"><p>' + t('zones.empty') + '</p></div>';
    return;
  }
  if (!state.zones.some(z => z.id === openZoneId)) openZoneId = state.zones[0].id;

  $('#zone-tabs').innerHTML = state.zones.map(z =>
    `<button class="seg-btn ${z.id === openZoneId ? 'active' : ''}" data-ztab="${z.id}">${escH(z.name)}</button>`).join('');
  $$('#zone-tabs .seg-btn').forEach(b => b.addEventListener('click', () => {
    openZoneId = b.dataset.ztab;
    renderZones();
  }));

  const zone = state.zones.find(z => z.id === openZoneId);
  $('#zones-table-list').innerHTML = `
    <div class="zone-block" style="margin-top:14px">
      <div class="zone-head">
        <span class="zone-name">${escH(zone.name)}</span>
        <span class="zone-count">${zone.tables.length} ${t('zones.tables')}</span>
        <button class="icon-btn" data-edit-zone="${zone.id}" title="${t('panel.edit')}"><span class="material-symbols-outlined" style="font-size:20px">edit</span></button>
      </div>
      <div class="zone-body" style="display:block;padding:0 18px 16px">
        ${zone.tables.map(tab => {
          const s = zoneStatus(tab);
          return `
            <div class="table-row">
              <span class="status-dot ${s.cls}"></span>
              <span class="table-row-name">${escH(tab.name)}</span>
              <span class="status-text ${s.cls}">${s.txt}</span>
              <button class="icon-btn" data-edit-table="${tab.id}" title="${t('panel.edit')}" style="width:36px;height:36px"><span class="material-symbols-outlined" style="font-size:20px">edit</span></button>
            </div>`;
        }).join('')}
        <button class="link-add" data-add-table="${zone.id}"><span class="material-symbols-outlined" style="font-size:18px">add</span> ${t('zones.addTable')}</button>
      </div>
    </div>`;
}

$('#zones-table-list').addEventListener('click', e => {
  const ez = e.target.closest('[data-edit-zone]');
  const et = e.target.closest('[data-edit-table]');
  const at = e.target.closest('[data-add-table]');
  if (ez) {
    openZoneModal(state.zones.find(x => x.id === ez.dataset.editZone));
  } else if (et) {
    openTableModal(findTable(et.dataset.editTable));
  } else if (at) {
    openTableModal(null, state.zones.find(x => x.id === at.dataset.addTable).id);
  }
});
$('#add-zone-btn').addEventListener('click', () => openZoneModal(null));

function zoneHasActiveSession(z) {
  return z.tables.some(t => sessions[t.id]);
}

function openZoneModal(z) {
  const isEdit = !!z;
  openSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div class="sheet-title">${isEdit ? t('modal.editZone') : t('modal.newZone')}</div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="sheet-content">
      <div class="field">
        <label>${t('modal.zoneName')}</label>
        <input id="zone-name" value="${isEdit ? escH(z.name) : ''}" placeholder="${t('modal.zonePh')}">
        <span class="field-error"></span>
      </div>
      <button class="btn btn--primary btn--block" id="save-zone">${t('modal.save')}</button>
      ${isEdit ? `<button class="btn btn--danger-ghost btn--block" id="del-zone" style="margin-top:10px">${t('modal.deleteZone')}</button>` : ''}
    </div>
  `);
  const input = $('#zone-name');
  $('#save-zone').addEventListener('click', async e => {
    const name = input.value.trim();
    if (!name) { input.classList.add('input-error'); input.nextElementSibling.textContent = t('err.required'); return; }
    const btn = e.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      if (isEdit) await apiUpdateZone(z, name);
      else await apiAddZone(name);
      closeSheet(); renderHome(); renderZones(); renderProducts();
      toast(t('common.saved'));
    } catch (err) { btn.disabled = false; toast(errText(err)); }
  });
  if (isEdit) $('#del-zone').addEventListener('click', () => {
    const active = zoneHasActiveSession(z);
    openAlert(`
      <div class="alert-title">'${escH(z.name)}'${t('confirm.deleteTitle')}</div>
      <p class="alert-text">${t('confirm.irreversible')}</p>
      ${active ? `<div class="alert-warn-box alert-warn-box--danger">${t('confirm.zoneActive')}</div>` : ''}
      <div class="alert-btns">
        <button class="btn btn--ghost" id="cancel-del">${t('common.cancel')}</button>
        <button class="btn btn--danger" id="confirm-del" ${active ? 'disabled' : ''}>${t('common.delete')}</button>
      </div>
    `);
    $('#cancel-del').addEventListener('click', closeAlert);
    $('#confirm-del').addEventListener('click', async () => {
      try {
        await apiDeleteZone(z);
        if (openZoneId === z.id) openZoneId = state.zones[0] ? state.zones[0].id : null;
        closeAlert(); closeSheet();
        renderHome(); renderZones(); renderProducts();
        toast(t('common.deleted'));
      } catch (err) { toast(errText(err)); }
    });
  });
}

function openTableModal(tab, presetZoneId) {
  const isEdit = !!tab;
  const zone = tab ? findZone(tab.id) : state.zones.find(x => x.id === presetZoneId) || state.zones[0];
  let tableType = isEdit ? (tab.type || 'billiard') : 'billiard';
  /* turini almashtirganda kiritilgan qiymatlar yo'qolmasin */
  const draft = { name: isEdit ? tab.name : '', tariff: isEdit ? fmtIn(tab.tariff) : '', repair: isEdit ? !!tab.repair : false };
  const busy = isEdit && !!sessions[tab.id];

  const render = () => {
    openSheet(`
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div class="sheet-title">${isEdit ? t('modal.editTable') : t('modal.newTable')}</div>
        <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="sheet-content">
        <div class="segmented" id="type-seg">
          <button class="seg-btn ${tableType === 'billiard' ? 'active' : ''}" data-type="billiard">Billiard</button>
          <button class="seg-btn ${tableType === 'tennis' ? 'active' : ''}" data-type="tennis">Tennis</button>
        </div>
        <div class="sheet-sub" style="margin:-6px 0 14px;color:var(--text-muted)">${escH(zone.name)}</div>
        <div class="field">
          <label>${t('modal.tableName')}</label>
          <input id="table-name" value="${escH(draft.name)}" placeholder="${t('modal.tablePh')}">
          <span class="field-error"></span>
        </div>
        <div class="field">
          <label>${t('modal.tariff')} (${cur()})</label>
          <input id="table-tariff" type="text" inputmode="numeric" value="${escH(draft.tariff)}" placeholder="${t('modal.tariffPh')}">
          <span class="field-error"></span>
        </div>
        <label class="repair-toggle${busy ? ' is-disabled' : ''}">
          <input type="checkbox" id="table-repair" ${draft.repair ? 'checked' : ''} ${busy && !draft.repair ? 'disabled' : ''}>
          <span class="material-symbols-outlined">build</span>
          <span>${t('modal.repair')}</span>
        </label>
        ${busy && !draft.repair ? `<div class="repair-note">${t('modal.repairBusy')}</div>` : ''}
        <button class="btn btn--primary btn--block" id="save-table">${t('modal.save')}</button>
        ${isEdit ? `<button class="btn btn--danger-ghost btn--block" id="del-table" style="margin-top:10px">${t('modal.deleteTable')}</button>` : ''}
      </div>
    `);

    $$('#type-seg .seg-btn').forEach(b => b.addEventListener('click', () => {
      draft.name = $('#table-name').value;
      draft.tariff = $('#table-tariff').value;
      draft.repair = $('#table-repair').checked;
      tableType = b.dataset.type;
      render();
    }));
    bindTableForm(tab, zone, isEdit, () => tableType);
  };
  render();
}

function bindTableForm(tab, zone, isEdit, getType) {
  const nameInput = $('#table-name');
  const tariffInput = $('#table-tariff');
  bindMoneyInput(tariffInput);
  $('#save-table').addEventListener('click', async e => {
    const name = nameInput.value.trim();
    const tariff = parseIn(tariffInput.value);
    const repair = $('#table-repair').checked;
    let ok = true;
    if (!name) { nameInput.classList.add('input-error'); nameInput.nextElementSibling.textContent = t('err.required'); ok = false; }
    else nameInput.classList.remove('input-error');
    if (!tariffInput.value || isNaN(tariff) || tariff < 0) {
      tariffInput.classList.add('input-error'); tariffInput.nextElementSibling.textContent = t('err.number'); ok = false;
    } else tariffInput.classList.remove('input-error');
    if (!ok) return;
    const btn = e.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      if (isEdit) await apiUpdateTable(tab, name, tariff, getType(), repair);
      else await apiAddTable(zone, name, tariff, getType(), repair);
      closeSheet(); renderHome(); renderZones();
      toast(t('common.saved'));
    } catch (err) { btn.disabled = false; toast(errText(err)); }
  });
  if (isEdit) $('#del-table').addEventListener('click', () => {
    const active = !!sessions[tab.id];
    openAlert(`
      <div class="alert-title">'${escH(tab.name)}'${t('confirm.deleteTitle')}</div>
      <p class="alert-text">${t('confirm.irreversible')}</p>
      ${active ? `<div class="alert-warn-box alert-warn-box--danger">${t('confirm.tableActive')}</div>` : ''}
      <div class="alert-btns">
        <button class="btn btn--ghost" id="cancel-del">${t('common.cancel')}</button>
        <button class="btn btn--danger" id="confirm-del" ${active ? 'disabled' : ''}>${t('common.delete')}</button>
      </div>
    `);
    $('#cancel-del').addEventListener('click', closeAlert);
    $('#confirm-del').addEventListener('click', async () => {
      try {
        await apiDeleteTable(tab, zone);
        closeAlert(); closeSheet();
        renderHome(); renderZones();
        toast(t('common.deleted'));
      } catch (err) { toast(errText(err)); }
    });
  });
}

/* ---------------- MAHSULOTLAR ---------------- */
let productZoneId = state.zones[0] ? state.zones[0].id : null;

function renderProducts() {
  if (!state.zones.length) {
    $('#prod-tabs').innerHTML = '';
    $('#products-list').innerHTML = '<div class="empty-state"><p>' + t('products.empty') + '</p></div>';
    return;
  }
  if (!state.zones.some(z => z.id === productZoneId)) productZoneId = state.zones[0].id;
  $('#prod-tabs').innerHTML = state.zones.map(z =>
    `<button class="seg-btn ${z.id === productZoneId ? 'active' : ''}" data-pzone="${z.id}">${escH(z.name)}</button>`).join('');
  $$('#prod-tabs .seg-btn').forEach(b => b.addEventListener('click', () => {
    productZoneId = b.dataset.pzone;
    renderProducts();
  }));

  const zone = state.zones.find(z => z.id === productZoneId);
  $('#products-list').innerHTML = zone.products.map(p => `
    <li class="list-row product-row">
      <span class="list-row-left"><span class="material-symbols-outlined">${escH(p.icon || 'local_bar')}</span> <span class="product-name">${escH(p.name)}</span></span>
      <span class="product-price">${fmtMoney(p.price)}</span>
      <button class="icon-btn" data-edit-product="${p.id}" title="${t('panel.edit')}"><span class="material-symbols-outlined" style="font-size:20px">edit</span></button>
    </li>`).join('') || '<li class="empty-state" style="padding:30px"><p>' + t('products.none') + '</p></li>';
}

$('#products-list').addEventListener('click', e => {
  const b = e.target.closest('[data-edit-product]');
  if (!b) return;
  const zone = state.zones.find(z => z.id === productZoneId);
  openProductModal(zone, zone.products.find(x => x.id === b.dataset.editProduct));
});
$('#add-product-btn').addEventListener('click', () => {
  const zone = state.zones.find(z => z.id === productZoneId) || state.zones[0];
  openProductModal(zone, null);
});

function openProductModal(zone, p) {
  const isEdit = !!p;
  openSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div class="sheet-title">${isEdit ? t('modal.editProduct') : t('modal.newProduct')}</div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="sheet-content">
      <div class="sheet-sub" style="margin:-6px 0 14px;color:var(--text-muted)">${escH(zone.name)}</div>
      <div class="field">
        <label>${t('modal.prodName')}</label>
        <input id="prod-name" value="${isEdit ? escH(p.name) : ''}" placeholder="${t('modal.prodNamePh')}">
        <span class="field-error"></span>
      </div>
      <div class="field">
        <label>${t('modal.prodPrice')} (${cur()})</label>
        <input id="prod-price" type="text" inputmode="numeric" value="${isEdit ? fmtIn(p.price) : ''}" placeholder="${t('modal.prodPricePh')}">
        <span class="field-error"></span>
      </div>
      <button class="btn btn--primary btn--block" id="save-prod">${t('modal.save')}</button>
      ${isEdit ? `<button class="btn btn--danger-ghost btn--block" id="del-prod" style="margin-top:10px">${t('modal.deleteProduct')}</button>` : ''}
    </div>
  `);
  const nameInput = $('#prod-name');
  const priceInput = $('#prod-price');
  bindMoneyInput(priceInput);
  $('#save-prod').addEventListener('click', async e => {
    const name = nameInput.value.trim();
    const price = parseIn(priceInput.value);
    let ok = true;
    if (!name) { nameInput.classList.add('input-error'); nameInput.nextElementSibling.textContent = t('err.required'); ok = false; }
    else nameInput.classList.remove('input-error');
    if (!priceInput.value || isNaN(price) || price < 0) {
      priceInput.classList.add('input-error'); priceInput.nextElementSibling.textContent = t('err.number'); ok = false;
    } else priceInput.classList.remove('input-error');
    if (!ok) return;
    const btn = e.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      if (isEdit) await apiUpdateProduct(p, name, price);
      else await apiAddProduct(zone, name, price);
      closeSheet(); renderProducts();
      toast(t('common.saved'));
    } catch (err) { btn.disabled = false; toast(errText(err)); }
  });
  if (isEdit) $('#del-prod').addEventListener('click', () => {
    openAlert(`
      <div class="alert-title">'${escH(p.name)}'${t('confirm.deleteTitle')}</div>
      <p class="alert-text">${t('confirm.irreversible')}</p>
      <div class="alert-btns">
        <button class="btn btn--ghost" id="cancel-del">${t('common.cancel')}</button>
        <button class="btn btn--danger" id="confirm-del">${t('common.delete')}</button>
      </div>
    `);
    $('#cancel-del').addEventListener('click', closeAlert);
    $('#confirm-del').addEventListener('click', async () => {
      try {
        await apiDeleteProduct(zone, p);
        closeAlert(); closeSheet(); renderProducts();
        toast(t('common.deleted'));
      } catch (err) { toast(errText(err)); }
    });
  });
}

/* ---------------- CHIQISH ---------------- */
function openProfileModal() {
  openAlert(`
    <div class="alert-title">${t('profile.edit')}</div>
    <div class="alert-fields">
      <div class="field">
        <label>${t('profile.name')}</label>
        <input id="profile-name-input" maxlength="60" value="${escH($('#profile-name').textContent)}">
        <span class="field-error"></span>
      </div>
      <div class="field">
        <label>${t('login.username')}</label>
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
    if (!name) {
      nameInput.classList.add('input-error');
      nameInput.nextElementSibling.textContent = t('err.required');
      return;
    }
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
}

$('#edit-profile-btn').addEventListener('click', openProfileModal);

$('#logout-btn').addEventListener('click', () => {
  openAlert(`
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
const MONTH_NAMES = {
  uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
};
let histSessions = []; /* bugungi yakunlangan sessiyalar (batafsil) */
let histDays = [];     /* o'tgan kunlar jami (serverda hisoblanadi) */
let histDay = '';

const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const monthKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const hm = d => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const dayLabel = d => `${d.getDate()} ${MONTH_NAMES[currentLang][d.getMonth()]} ${d.getFullYear()}`;
const parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };

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
  return { timePrice, prod, total: timePrice + prod };
}

let histBusy = false;
async function loadHistory() {
  if (!currentUser || !(accessInfo && accessInfo.has_access) || histBusy) return;
  histBusy = true;
  try {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'UTC';
    const [today, days] = await Promise.all([
      sb.from('sessions')
        .select('id, mode, rate, start_time, end_time, duration_sec, table_id, tables(name, tariff), session_products(quantity, price, products(price))')
        .gte('end_time', dayStart.toISOString())
        .order('end_time', { ascending: false }),
      sb.rpc('history_days', { p_tz: tz }),
    ]);
    if (today.error) throw today.error;
    if (days.error) throw days.error;
    histSessions = today.data || [];
    const todayKey = dayKey(now);
    histDays = (days.data || []).filter(d => d.day !== todayKey).map(d => ({
      key: d.day, date: parseDay(d.day), time: Number(d.time_sum) || 0, prod: Number(d.prod_sum) || 0,
      total: (Number(d.time_sum) || 0) + (Number(d.prod_sum) || 0),
    }));
    histDay = todayKey;
    renderHistory();
  } catch (err) {
    toast(errText(err));
  } finally { histBusy = false; }
}

function renderHistory() {
  const body = $('#history-body');
  if (!histSessions.length && !histDays.length) {
    body.innerHTML = '<div class="empty-state"><p>' + t('history.empty') + '</p></div>';
    return;
  }
  const now = new Date();
  const todaySessions = histSessions;

  let html = '';
  html += `<div class="hist-section-title">${t('history.today')} — ${dayLabel(now)}</div>`;
  if (todaySessions.length) html += renderToday(todaySessions);
  else html += '<div class="empty-state" style="padding:20px"><p>' + t('history.empty') + '</p></div>';

  if (histDays.length) {
    const byMonth = new Map();
    for (const d of histDays) {
      const mk = monthKey(d.date);
      if (!byMonth.has(mk)) byMonth.set(mk, []);
      byMonth.get(mk).push(d);
    }
    const curMk = monthKey(now);
    [...byMonth.keys()].sort().reverse().forEach(mk => {
      const [y, m] = mk.split('-').map(Number);
      const open = mk === curMk;
      html += `<button class="hist-month ${open ? 'open' : ''}" data-mk="${mk}">${MONTH_NAMES[currentLang][m - 1]} ${y}</button>`;
      html += `<div class="hist-month-body" ${open ? '' : 'hidden'}>`;
      byMonth.get(mk).sort((a, b) => b.key.localeCompare(a.key)).forEach(d => {
        html += `<button class="hist-day" data-dk="${d.key}"><span>${dayLabel(d.date)}</span><b>${fmtMoney(d.total)}</b></button>`;
        html += `<div class="hist-day-body" hidden>
          <div class="hist-day-sum">
            <div class="hist-sum-row"><span>${t('history.tablesTotal')}</span><b>${fmtMoney(d.time)}</b></div>
            <div class="hist-sum-row"><span>${t('history.productsTotal')}</span><b>${fmtMoney(d.prod)}</b></div>
            <div class="hist-sum-total"><span>${t('history.total')}</span><span>${fmtMoney(d.total)}</span></div>
          </div>
        </div>`;
      });
      html += '</div>';
    });
  }
  body.innerHTML = html;
}

function renderToday(list) {
  const byTable = new Map();
  for (const s of list) {
    const tid = String(s.table_id);
    if (!byTable.has(tid)) byTable.set(tid, { name: s.tables?.name || '—', sessions: [] });
    byTable.get(tid).sessions.push(s);
  }
  let html = '';
  for (const tb of byTable.values()) {
    let rows = '';
    for (const s of tb.sessions) {
      const sum = finSummary(s);
      rows += `<div class="hist-sess">
        <span class="hist-sess-time">${hm(new Date(s.start_time))} → ${hm(new Date(s.end_time))}</span>
        <span class="hist-sess-money">
          <i>${t('history.tableTime')}: ${fmtMoney(sum.timePrice)}</i>
          <i>${t('history.products')}: ${fmtMoney(sum.prod)}</i>
          <b>${t('history.total')}: ${fmtMoney(sum.total)}</b>
        </span>
      </div>`;
    }
    html += `<div class="hist-table">
      <div class="hist-table-head"><b>${escH(tb.name)}</b><span>${fmtMoney(tb.sessions.reduce((x, s) => x + finSummary(s).total, 0))}</span></div>
      ${rows}
    </div>`;
  }
  html += `<div class="hist-total-row"><span>${t('history.dayTotal')}</span><b>${fmtMoney(list.reduce((x, s) => x + finSummary(s).total, 0))}</b></div>`;
  return html;
}

$('#history-body').addEventListener('click', e => {
  const mb = e.target.closest('.hist-month');
  if (mb) {
    const bodyEl = mb.nextElementSibling;
    mb.classList.toggle('open');
    bodyEl.hidden = !bodyEl.hidden;
    return;
  }
  const db = e.target.closest('.hist-day');
  if (db) {
    const bodyEl = db.nextElementSibling;
    bodyEl.hidden = !bodyEl.hidden;
    db.classList.toggle('open', !bodyEl.hidden);
  }
});

setInterval(() => {
  if (!currentUser) return;
  const k = dayKey(new Date());
  if (k !== histDay) { histDay = k; loadHistory(); return; }
  if (!$('#view-history').hidden) loadHistory();
}, 30000);

/* ---------------- TAYMER DVIGATELI ---------------- */
let lastStatus = {};

function updateRings(now) {
  $$('[data-ring]').forEach(el => {
    const s = sessions[el.dataset.ring];
    if (!s || s.mode !== 'countdown') { el.hidden = true; return; }
    const sec = sessionSeconds(s, now);
    if (sec.remaining <= 0) { el.hidden = true; return; }
    el.hidden = false;
    const r = +el.dataset.radius || 46;
    const C = RING_C(r);
    const circ = el.querySelector('.ring-circle');
    circ.style.strokeDasharray = C.toFixed(2);
    circ.style.strokeDashoffset = (C * (1 - sec.remaining / s.duration)).toFixed(2);
  });
}

function tick() {
  const now = nowMs();
  let needRender = false;

  Object.keys(sessions).forEach(tid => {
    const s = sessions[tid];
    const st = statusOf(s, now);
    if (lastStatus[tid] !== st) {
      if (st === 'expired' && navigator.vibrate) navigator.vibrate(400);
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
    if (!s) return;
    const sec = sessionSeconds(s, now);
    el.textContent = sec.overtime > 0 ? '+' + fmtTime(sec.overtime) : fmtTime(sec.remaining ?? sec.elapsed);
  });
  $$('[data-price]').forEach(el => {
    const s = sessions[el.dataset.price];
    if (s) el.textContent = fmtMoney(sessionPrice(s, now));
  });
  $$('[data-total-price]').forEach(el => {
    const s = sessions[el.dataset.totalPrice];
    if (s) el.textContent = fmtMoney(sessionPrice(s, now) + productSum(s));
  });
  $$('[data-orb-label]').forEach(el => {
    const s = sessions[el.dataset.orbLabel];
    if (!s) return;
    const st = statusOf(s, now);
    el.textContent = st === 'expired' ? t('panel.overtime') : s.mode === 'countdown' ? t('panel.timeLeft') : t('panel.timePassed');
  });
  updateRings(now);
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
