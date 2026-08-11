/* ============ Zone Manager — Frontend (Stitch uslub) ============ */
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* Ikonalar shrifti yuklanishini kutish — aks holda so'zlar ko'rinib qoladi (FOUT) */
if (document.fonts && document.fonts.load) {
  document.fonts.load('16px "Material Symbols Outlined"')
    .then(() => document.body.classList.add('fonts-loaded'))
    .catch(() => document.body.classList.add('fonts-loaded'));
  setTimeout(() => document.body.classList.add('fonts-loaded'), 3000);
} else {
  document.body.classList.add('fonts-loaded');
}

/* ---------------- Ma'lumotlar ---------------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const state = {
  zones: [
    {
      id: 'z1', name: 'Asosiy floor',
      tables: [
        { id: 't1', name: 'Stol 01', tariff: 25000 },
        { id: 't2', name: 'Stol 02', tariff: 25000 },
        { id: 't3', name: 'Stol 03', tariff: 25000 },
        { id: 't4', name: 'Stol 04', tariff: 30000 },
        { id: 't5', name: 'Stol 05', tariff: 30000 },
        { id: 't6', name: 'Stol 06', tariff: 20000 },
      ],
      products: [
        { id: 'p1', name: 'Ko\'k choy', price: 3500, icon: 'emoji_food_beverage', sold: 210 },
        { id: 'p2', name: 'Suv', price: 5000, icon: 'water_drop', sold: 180 },
        { id: 'p3', name: 'Hunarmand pivosi', price: 20000, icon: 'sports_bar', sold: 145 },
        { id: 'p4', name: 'Nachos Grande', price: 20000, icon: 'restaurant', sold: 89 },
        { id: 'p5', name: 'Pepsi', price: 12000, icon: 'local_bar', sold: 96 },
        { id: 'p6', name: 'Kofe', price: 10000, icon: 'coffee', sold: 77 },
      ],
    },
  ],
};

/* Faol sessiyalar: tableId -> sessiya (demo holatlar oldindan to'ldirilgan) */
const NOW = Date.now();
const sessions = {};
sessions.t2 = { mode: 'stopwatch', tableId: 't2', start: NOW - (42 * 60 + 15) * 1000, products: [{ pid: 'p1', qty: 2 }] };
sessions.t3 = { mode: 'countdown', tableId: 't3', start: NOW - (3600 - 299) * 1000, duration: 3600, products: [] };
sessions.t6 = { mode: 'countdown', tableId: 't6', start: NOW - (3600 + 452) * 1000, duration: 3600, products: [{ pid: 'p2', qty: 1 }] };

/* Statistika — olib tashlandi */

/* ---------------- Yordamchilar ---------------- */
const fmtMoney = n => Math.round(n).toLocaleString('en-US') + ' so\'m';
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
  if (m < 60) return `${m} daqiqa`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} soat ${r} daqiqa` : `${h} soat`;
}
const findZone = tid => state.zones.find(z => z.tables.some(t => t.id === tid));
const findTable = tid => state.zones.flatMap(z => z.tables).find(t => t.id === tid);
const productById = (zid, pid) => state.zones.find(z => z.id === zid).products.find(p => p.id === pid);

function sessionSeconds(s, now = Date.now()) {
  const elapsed = (now - s.start) / 1000;
  if (s.mode === 'stopwatch') return { elapsed, remaining: null, overtime: 0 };
  const remaining = s.duration - elapsed;
  if (remaining > 0) return { elapsed, remaining, overtime: 0 };
  return { elapsed, remaining: 0, overtime: -remaining };
}
function sessionPrice(s, now = Date.now()) {
  const sec = sessionSeconds(s, now);
  const tariff = s.rate ?? findTable(s.tableId).tariff;
  if (s.mode === 'countdown' && sec.remaining > 0) return s.duration / 3600 * tariff;
  return sec.elapsed / 3600 * tariff;
}
function productSum(s) {
  return s.products.reduce((sum, e) => {
    const p = productById(findZone(s.tableId).id, e.pid);
    return sum + (p ? p.price * e.qty : 0);
  }, 0);
}
function statusOf(s, now = Date.now()) {
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
let panelShowAll = false;

function openSheet(html) {
  $('#sheet-body').innerHTML = html;
  $('#sheet').hidden = false;
  $$('.sheet-close').forEach(b => b.addEventListener('click', closeSheet));
}
function closeSheet() { $('#sheet').hidden = true; currentPanel = null; panelEdit = false; panelShowAll = false; }
function openAlert(html) { $('#alert-body').innerHTML = html; $('#alert').hidden = false; }
function closeAlert() { $('#alert').hidden = true; }

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

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  clearFieldErrors();
  const u = $('#login-username').value.trim();
  const p = $('#login-password').value;
  let ok = true;
  if (!u) { showFieldError('login-username', 'Bu maydon to\'ldirilishi shart'); ok = false; }
  if (!p) { showFieldError('login-password', 'Bu maydon to\'ldirilishi shart'); ok = false; }
  if (!ok) return;

  const btn = $('#login-btn');
  btn.disabled = true;
  btn.querySelector('.btn-label').textContent = 'Kirish...';
  btn.querySelector('.spinner').hidden = false;

  setTimeout(() => {
    btn.disabled = false;
    btn.querySelector('.btn-label').textContent = 'Kirish';
    btn.querySelector('.spinner').hidden = true;
    if (u === 'admin' && p === '1234') {
      $('#view-login').hidden = true;
      $('#bottom-nav').hidden = false;
      $('#profile-name').textContent = u === 'admin' ? 'Admin' : u;
      $('#profile-login').textContent = u;
      loginForm.reset();
      showView('home');
    } else {
      $('#login-error').hidden = false;
    }
  }, 700);
});

$('#forgot-link').addEventListener('click', () => {
  toast('Bu demo versiya: parol — 1234');
});

$('#demo-btn').addEventListener('click', () => {
  clearFieldErrors();
  $('#login-username').value = 'admin';
  $('#login-password').value = '1234';
  loginForm.requestSubmit();
});

/* ---------------- Navigatsiya ---------------- */
const VIEWS = ['home', 'zones', 'profile', 'products'];

function showView(v) {
  VIEWS.forEach(x => { $(`#view-${x}`).hidden = x !== v; });
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === v));
  if (v === 'home') renderHome();
  if (v === 'zones') renderZones();
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

const RING_C = r => 2 * Math.PI * r;

function cardFor(t) {
  if (t.repair) {
    return `
      <div class="table-card card-repair">
        <div class="card-cover"></div>
        <div class="card-body">
          <div class="card-info">
            <span class="table-name">${t.name}</span>
            <span class="free-hint">Xizmatdan vaqtincha chiqarilgan</span>
          </div>
        </div>
      </div>`;
  }
  const s = sessions[t.id];
  if (!s) {
    return `
      <div class="table-card card-free" data-action="start" data-tid="${t.id}">
        <div class="card-cover"></div>
        <div class="card-body">
          <span class="table-name table-name--lg">${t.name}</span>
        </div>
      </div>`;
  }
  const st = statusOf(s);
  const sec = sessionSeconds(s);
  const cls = st === 'ending' ? 'card-ending' : 'card-busy';
  const label = st === 'expired' ? 'Qo\'shimcha vaqt' : s.mode === 'countdown' ? 'Qolgan vaqt' : 'O\'tgan vaqt';
  const timerText = sec.overtime > 0 ? '+' + fmtTime(sec.overtime) : fmtTime(sec.remaining ?? sec.elapsed);
  return `
    <div class="table-card ${cls}" data-action="panel" data-tid="${t.id}">
      <div class="card-cover"></div>
      <div class="card-body">
        <div class="card-info">
          <span class="table-name">${t.name}</span>
          <span class="card-price" data-price="${t.id}">${fmtMoney(sessionPrice(s))}</span>
        </div>
        <div class="timer-wrap">
          ${s.mode === 'countdown' && st !== 'expired'
            ? `<svg class="ring ring--${st === 'ending' ? 'amber' : 'red'}" viewBox="-52 -52 104 104" data-ring="${t.id}" data-radius="46"><circle class="ring-circle" cx="0" cy="0" r="46" stroke-width="6" stroke="#dee4e1"/></svg>` : ''}
          <div class="timer" data-timer="${t.id}">${timerText}</div>
          <span class="timer-label">${label}</span>
        </div>
      </div>
    </div>`;
}

function visibleTables() {
  let list = [];
  state.zones.forEach(z => z.tables.forEach(t => list.push({ ...t, zone: z })));
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

$('#more-btn').addEventListener('click', () => {
  const activeCount = Object.keys(sessions).length;
  const total = state.zones.reduce((n, z) => n + z.tables.length, 0);
  openSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div>
        <div class="sheet-title">Asosiy Floor</div>
        <div class="sheet-sub">Filial ma'lumotlari</div>
      </div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="sheet-content">
      <div class="bento">
        <div class="bento-card"><p class="bento-label">Stollar</p><p class="bento-value">${total} ta</p></div>
        <div class="bento-card"><p class="bento-label">Faol sessiyalar</p><p class="bento-value">${activeCount} ta</p></div>
      </div>
      <div class="sheet-actions" style="border-top:none;padding:16px 0 0">
        <button class="btn btn--primary btn--block" id="menu-zones"><span class="material-symbols-outlined">grid_view</span> Zonalar</button>
        <button class="btn btn--ghost btn--block" id="menu-products"><span class="material-symbols-outlined">local_bar</span> Mahsulotlar</button>
      </div>
    </div>
  `);
  $('#menu-zones').addEventListener('click', () => { closeSheet(); showView('zones'); });
  $('#menu-products').addEventListener('click', () => { closeSheet(); showView('products'); });
});

/* ---------------- SESSIYANI BOSHLASH OYNASI ---------------- */
function openStartSheet(t) {
  const zone = findZone(t.id);
  let mode = 'stopwatch';
  let duration = 2700;

  const render = () => {
    openSheet(`
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <div class="sheet-title">Sessiyani boshlash</div>
          <div class="sheet-sub">${t.name} · ${zone.name}</div>
        </div>
        <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="sheet-content">
        <div class="segmented" id="mode-seg">
          <button class="seg-btn ${mode === 'stopwatch' ? 'active' : ''}" data-mode="stopwatch">Sekundomer</button>
          <button class="seg-btn ${mode === 'countdown' ? 'active' : ''}" data-mode="countdown">Taymer</button>
        </div>

        ${mode === 'countdown' ? `
          <div class="sheet-section">
            <div class="sheet-section-title">Davomiylikni belgilash</div>
            <div class="duration-stepper">
              <button class="step-btn" data-step="-900"><span class="material-symbols-outlined">remove</span></button>
              <div class="duration-val">${Math.round(duration / 60)} <span>daqiqa</span></div>
              <button class="step-btn" data-step="900"><span class="material-symbols-outlined">add</span></button>
            </div>
            <div class="quick-chips">
              <button class="chip" data-add="900">+15d</button>
              <button class="chip" data-add="1800">+30d</button>
              <button class="chip" data-add="3600">+1soat</button>
            </div>
          </div>` : ''}

        <div class="sheet-section">
          <div class="sheet-section-title">Soatlik narx (so'm)</div>
          <input id="start-rate" type="text" inputmode="numeric" value="${fmtIn(t.tariff)}" class="rate-input" aria-label="Soatlik narx">
          <span class="field-error" id="err-rate"></span>
        </div>
      </div>
      <div class="sheet-actions">
        <button class="btn btn--primary btn--block btn--lg" id="start-confirm">
          <span class="material-symbols-outlined">play_arrow</span> Sessiyani boshlash
        </button>
      </div>
    `);

    bindMoneyInput($('#start-rate'));

    $$('#mode-seg .seg-btn').forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; render(); }));
    $$('[data-step]').forEach(b => b.addEventListener('click', () => {
      duration = Math.min(172800, Math.max(900, duration + +b.dataset.step));
      render();
    }));
    $$('[data-add]').forEach(b => b.addEventListener('click', () => {
      duration = Math.min(172800, duration + +b.dataset.add);
      render();
    }));
    $('#start-confirm').addEventListener('click', () => {
      const rateInput = $('#start-rate');
      const rate = parseIn(rateInput.value);
      const errEl = $('#err-rate');
      if (!rateInput.value || isNaN(rate) || rate <= 0) {
        rateInput.classList.add('input-error');
        errEl.textContent = 'To\'g\'ri narx kiriting';
        return;
      }
      rateInput.classList.remove('input-error');
      errEl.textContent = '';
      sessions[t.id] = { mode, tableId: t.id, rate, start: Date.now(), duration: mode === 'countdown' ? duration : undefined, products: [] };
      lastStatus[t.id] = statusOf(sessions[t.id]);
      closeSheet();
      renderHome(); renderZones();
      toast('Sessiya boshlandi');
    });
  };
  render();
}

/* ---------------- FAOL SESSIYA PANELI ---------------- */
function openPanel(t) {
  currentPanel = t.id;
  panelEdit = false;
  panelShowAll = false;
  renderPanel();
}

const PRODUCT_ICONS = {};

function renderPanel() {
  const s = sessions[currentPanel];
  if (!s) { closeSheet(); return; }
  const t = findTable(currentPanel);
  const zone = findZone(currentPanel);
  const st = statusOf(s);
  const sec = sessionSeconds(s);
  const timePrice = sessionPrice(s);
  const total = timePrice + productSum(s);
  const top = zone.products.slice().sort((a, b) => b.sold - a.sold).slice(0, 4);

  const label = st === 'expired' ? 'Qo\'shimcha vaqt' : s.mode === 'countdown' ? 'Qolgan vaqt' : 'O\'tgan vaqt';
  const orbTimer = sec.overtime > 0 ? '+' + fmtTime(sec.overtime) : fmtTime(sec.remaining ?? sec.elapsed);
  const orbCls = st === 'ending' ? 'card-ending' : '';
  const badge = st === 'expired' ? 'Vaqt tugadi' : st === 'ending' ? 'Yaqin tugaydi' : 'Faol';
  const badgeCls = st === 'ending' ? 'badge--ending' : 'badge--busy';

  const timeSub = s.mode === 'countdown' ? `(${fmtDur(s.duration)})` : `(${fmtDur(sec.elapsed)})`;
  const rate = s.rate ?? t.tariff;
  const timeRow = `
    <div class="order-row order-row--time">
      <div class="order-name">Sessiya vaqti ${timeSub}
        <span class="sub">Tarif: ${fmtMoney(rate)} / soat</span>
      </div>
      <div class="order-amount" data-price="${t.id}">${fmtMoney(timePrice)}</div>
    </div>`;

  const prodRows = s.products.map(e => {
    const p = productById(zone.id, e.pid);
    if (!p) return '';
    return `
      <div class="order-row">
        <div class="order-name">${p.name}
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
            <button class="add-mini" data-remove="${p.id}" title="O'chirish" style="background:var(--error-container);color:var(--on-error-container)"><span class="material-symbols-outlined">delete</span></button>
          </div>` : `<span class="order-qty">×${e.qty}</span>`}
      </div>`;
  }).join('');

  openSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div>
        <div class="sheet-title">${t.name}</div>
        <div class="sheet-sub">${zone.name} · ${fmtMoney(t.tariff)}/soat</div>
      </div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>

    <div class="sheet-content">
      <div class="timer-orb-card ${orbCls}">
        <span class="orb-badge ${badgeCls}">${badge}</span>
        <div class="timer-orb">
          ${s.mode === 'countdown' && st !== 'expired'
            ? `<svg class="ring ring--${st === 'ending' ? 'amber' : 'red'}" viewBox="-52 -52 104 104" data-ring="${t.id}" data-radius="46"><circle class="ring-circle" cx="0" cy="0" r="46" stroke-width="4" stroke="#dee4e1"/></svg>` : ''}
          <div class="orb-inner">
            <div class="orb-timer" data-timer="${t.id}">${orbTimer}</div>
            <div class="orb-label" data-orb-label="${t.id}">${label}</div>
          </div>
        </div>
        ${s.mode === 'countdown' ? `
          <div class="orb-btns">
            <button class="btn btn--ghost btn--sm" data-extend="900">+15 daq</button>
            <button class="btn btn--ghost btn--sm" data-extend="1800">+30 daq</button>
          </div>` : ''}
      </div>

      <div class="sheet-section">
        <div class="sheet-section-title">
          Tezkor qo'shish
          <button class="link" id="toggle-all"><span class="material-symbols-outlined" style="font-size:16px">menu_book</span> Barcha mahsulotlar</button>
        </div>
        <div class="quick-grid">
          ${top.map(p => `
            <button class="quick-item" data-quick="${p.id}">
              <span class="quick-icon"><span class="material-symbols-outlined">${p.icon || 'local_bar'}</span></span>
              <span><span class="quick-name">${p.name}</span><br><span class="quick-price">${fmtMoney(p.price)}</span></span>
              <span class="add-ic material-symbols-outlined">add</span>
            </button>`).join('')}
        </div>
        ${panelShowAll ? `
          <div class="all-products">
            ${zone.products.map(p => `
              <div class="prod-row">
                <span class="pr-name">${p.name}</span>
                <span class="pr-price">${fmtMoney(p.price)}</span>
                <button class="add-mini" data-quick="${p.id}"><span class="material-symbols-outlined">add</span></button>
              </div>`).join('')}
          </div>` : ''}
      </div>

      <div class="sheet-section">
        <div class="sheet-section-title">
          Joriy buyurtma
          ${panelEdit
            ? '<button class="link" id="done-edit">Bajarildi</button>'
            : '<button class="link" id="toggle-edit"><span class="material-symbols-outlined" style="font-size:16px">edit</span> Tahrirlash</button>'}
        </div>
        <div class="order-list">${timeRow}${prodRows}</div>
        <div class="order-total">
          <span>Jami:</span><b data-total-price="${t.id}">${fmtMoney(total)}</b>
        </div>
      </div>
    </div>

    <div class="sheet-actions">
      <button class="btn btn--danger btn--block btn--lg" id="finish-btn">Sessiyani yakunlash va to'lash</button>
      <button class="btn btn--ghost btn--block" id="cancel-btn">Sessiyani bekor qilish</button>
    </div>
  `);

  $$('[data-quick]').forEach(b => b.addEventListener('click', () => {
    const p = productById(zone.id, b.dataset.quick);
    addToSession(currentPanel, p.id);
    toast(`${p.name} qo'shildi`);
    renderPanel();
  }));
  $('#toggle-all')?.addEventListener('click', () => { panelShowAll = !panelShowAll; renderPanel(); });
  $('#toggle-edit')?.addEventListener('click', () => { panelEdit = true; renderPanel(); });
  $('#done-edit')?.addEventListener('click', () => { panelEdit = false; renderPanel(); });
  $$('[data-inc]').forEach(b => b.addEventListener('click', () => { addToSession(currentPanel, b.dataset.inc, 1); renderPanel(); }));
  $$('[data-dec]').forEach(b => b.addEventListener('click', () => { addToSession(currentPanel, b.dataset.dec, -1); renderPanel(); }));
  $$('[data-remove]').forEach(b => b.addEventListener('click', () => { removeFromSession(currentPanel, b.dataset.remove); renderPanel(); }));
  $$('[data-extend]').forEach(b => b.addEventListener('click', () => {
    const s2 = sessions[currentPanel];
    if (s2 && s2.mode === 'countdown') s2.duration += +b.dataset.extend;
    renderPanel();
  }));
  $('#finish-btn').addEventListener('click', finishConfirm);
  $('#cancel-btn').addEventListener('click', cancelConfirm);
}

function addToSession(tid, pid, delta = 1) {
  const s = sessions[tid];
  if (!s) return;
  const e = s.products.find(x => x.pid === pid);
  if (e) {
    e.qty += delta;
    if (e.qty <= 0) s.products = s.products.filter(x => x.pid !== pid);
  } else if (delta > 0) s.products.push({ pid, qty: 1 });
}
function removeFromSession(tid, pid) {
  const s = sessions[tid];
  if (!s) return;
  s.products = s.products.filter(x => x.pid !== pid);
}

/* ---------------- YAKUNLASH / BEKOR QILISH ---------------- */
function finishConfirm() {
  const s = sessions[currentPanel];
  if (!s) return;
  const t = findTable(currentPanel);
  const timePrice = sessionPrice(s);
  const prod = productSum(s);
  openAlert(`
    <div class="alert-title">Sessiyani yakunlaysizmi?</div>
    <div class="alert-breakdown">
      <div class="ab-row"><span>Stol vaqti</span><b>${fmtMoney(timePrice)}</b></div>
      <div class="ab-row"><span>Mahsulotlar</span><b>${fmtMoney(prod)}</b></div>
      <div class="ab-total"><span>Jami</span><span>${fmtMoney(timePrice + prod)}</span></div>
    </div>
    <div class="alert-btns">
      <button class="btn btn--ghost" id="abort-finish">Bekor qilish</button>
      <button class="btn btn--primary" id="ok-finish">Tasdiqlash</button>
    </div>
  `);
  $('#abort-finish').addEventListener('click', closeAlert);
  $('#ok-finish').addEventListener('click', () => {
    const sum = timePrice + prod;
    delete sessions[currentPanel];
    delete lastStatus[currentPanel];
    closeAlert(); closeSheet();
    renderHome(); renderZones();
    toast(`Sessiya yakunlandi — ${fmtMoney(sum)}`);
  });
}

function cancelConfirm() {
  const s = sessions[currentPanel];
  if (!s) return;
  openAlert(`
    <div class="alert-title">Sessiyani bekor qilasizmi?</div>
    <p class="alert-text alert-text--warn">Bu amal qaytarilmaydi. Sessiya o'chiriladi va hisoblanmaydi.</p>
    <div class="alert-btns">
      <button class="btn btn--ghost" id="abort-cancel">Yo'q, qaytish</button>
      <button class="btn btn--danger" id="ok-cancel">Ha, bekor qilish</button>
    </div>
  `);
  $('#abort-cancel').addEventListener('click', closeAlert);
  $('#ok-cancel').addEventListener('click', () => {
    delete sessions[currentPanel];
    delete lastStatus[currentPanel];
    closeAlert(); closeSheet();
    renderHome(); renderZones();
    toast('Sessiya bekor qilindi');
  });
}

/* ---------------- ZONALAR ---------------- */
let openZoneId = 'z1';

function zoneStatus(t) {
  return sessions[t.id]
    ? { cls: 'busy', txt: 'Band' }
    : { cls: 'free', txt: 'Bo\'sh' };
}

function renderZones() {
  if (!state.zones.length) {
    $('#zone-tabs').innerHTML = '';
    $('#zones-table-list').innerHTML = '<div class="empty-state"><p>Hali zona yo\'q — birinchi zonani qo\'shing</p></div>';
    return;
  }
  if (!state.zones.some(z => z.id === openZoneId)) openZoneId = state.zones[0].id;

  $('#zone-tabs').innerHTML = state.zones.map(z =>
    `<button class="seg-btn ${z.id === openZoneId ? 'active' : ''}" data-ztab="${z.id}">${z.name}</button>`).join('');
  $$('#zone-tabs .seg-btn').forEach(b => b.addEventListener('click', () => {
    openZoneId = b.dataset.ztab;
    renderZones();
  }));

  const zone = state.zones.find(z => z.id === openZoneId);
  $('#zones-table-list').innerHTML = `
    <div class="zone-block" style="margin-top:14px">
      <div class="zone-head">
        <span class="zone-name">${zone.name}</span>
        <span class="zone-count">${zone.tables.length} stol</span>
        <button class="icon-btn" data-edit-zone="${zone.id}" title="Tahrirlash"><span class="material-symbols-outlined" style="font-size:20px">edit</span></button>
      </div>
      <div class="zone-body" style="display:block;padding:0 18px 16px">
        ${zone.tables.map(t => {
          const s = zoneStatus(t);
          return `
            <div class="table-row">
              <span class="status-dot ${s.cls}"></span>
              <span class="table-row-name">${t.name}</span>
              <span class="status-text ${s.cls}">${s.txt}</span>
              <button class="icon-btn" data-edit-table="${t.id}" title="Tahrirlash" style="width:36px;height:36px"><span class="material-symbols-outlined" style="font-size:20px">edit</span></button>
            </div>`;
        }).join('')}
        <button class="link-add" data-add-table="${zone.id}"><span class="material-symbols-outlined" style="font-size:18px">add</span> Yangi stol qo'shish</button>
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
      <div class="sheet-title">${isEdit ? 'Zonani tahrirlash' : 'Yangi zona'}</div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="sheet-content">
      <div class="field">
        <label>Zona nomi</label>
        <input id="zone-name" value="${isEdit ? z.name : ''}" placeholder="Masalan: Asosiy floor">
        <span class="field-error"></span>
      </div>
      <button class="btn btn--primary btn--block" id="save-zone">Saqlash</button>
      ${isEdit ? `<button class="btn btn--danger-ghost btn--block" id="del-zone" style="margin-top:10px">Zonani o'chirish</button>` : ''}
    </div>
  `);
  const input = $('#zone-name');
  $('#save-zone').addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) { input.classList.add('input-error'); input.nextElementSibling.textContent = 'Bu maydon to\'ldirilishi shart'; return; }
    if (isEdit) z.name = name;
    else state.zones.push({ id: uid(), name, tables: [], products: [] });
    closeSheet(); renderHome(); renderZones(); renderProducts();
    toast('Saqlandi');
  });
  if (isEdit) $('#del-zone').addEventListener('click', () => {
    const active = zoneHasActiveSession(z);
    openAlert(`
      <div class="alert-title">${z.name}ni o'chirasizmi?</div>
      <p class="alert-text">Bu amalni ortga qaytarib bo'lmaydi.</p>
      ${active ? '<div class="alert-warn-box alert-warn-box--danger">Diqqat: bu zonada faol sessiya bor. Avval sessiyalarni yakunlang.</div>' : ''}
      <div class="alert-btns">
        <button class="btn btn--ghost" id="cancel-del">Bekor qilish</button>
        <button class="btn btn--danger" id="confirm-del" ${active ? 'disabled' : ''}>O'chirish</button>
      </div>
    `);
    $('#cancel-del').addEventListener('click', closeAlert);
    $('#confirm-del').addEventListener('click', () => {
      state.zones = state.zones.filter(x => x.id !== z.id);
      if (openZoneId === z.id) openZoneId = state.zones[0] ? state.zones[0].id : null;
      closeAlert(); closeSheet();
      renderHome(); renderZones(); renderProducts();
      toast('O\'chirildi');
    });
  });
}

function openTableModal(t, presetZoneId) {
  const isEdit = !!t;
  const zone = t ? findZone(t.id) : state.zones.find(x => x.id === presetZoneId) || state.zones[0];
  openSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div class="sheet-title">${isEdit ? 'Stolni tahrirlash' : 'Yangi stol'}</div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="sheet-content">
      <div class="sheet-sub" style="margin:-6px 0 14px;color:var(--text-muted)">${zone.name}</div>
      <div class="field">
        <label>Stol nomi</label>
        <input id="table-name" value="${isEdit ? t.name : ''}" placeholder="Masalan: Stol 07">
        <span class="field-error"></span>
      </div>
      <div class="field">
        <label>Soatlik tarif (so'm)</label>
        <input id="table-tariff" type="text" inputmode="numeric" value="${isEdit ? fmtIn(t.tariff) : ''}" placeholder="Masalan: 25 000">
        <span class="field-error"></span>
      </div>
      <button class="btn btn--primary btn--block" id="save-table">Saqlash</button>
      ${isEdit ? `<button class="btn btn--danger-ghost btn--block" id="del-table" style="margin-top:10px">Stolni o'chirish</button>` : ''}
    </div>
  `);
  const nameInput = $('#table-name');
  const tariffInput = $('#table-tariff');
  bindMoneyInput(tariffInput);
  $('#save-table').addEventListener('click', () => {
    const name = nameInput.value.trim();
    const tariff = parseIn(tariffInput.value);
    let ok = true;
    if (!name) { nameInput.classList.add('input-error'); nameInput.nextElementSibling.textContent = 'Bu maydon to\'ldirilishi shart'; ok = false; }
    else nameInput.classList.remove('input-error');
    if (!tariffInput.value || isNaN(tariff) || tariff < 0) {
      tariffInput.classList.add('input-error'); tariffInput.nextElementSibling.textContent = 'To\'g\'ri son kiriting'; ok = false;
    } else tariffInput.classList.remove('input-error');
    if (!ok) return;
    if (isEdit) { t.name = name; t.tariff = tariff; }
    else zone.tables.push({ id: uid(), name, tariff });
    closeSheet(); renderHome(); renderZones();
    toast('Saqlandi');
  });
  if (isEdit) $('#del-table').addEventListener('click', () => {
    const active = !!sessions[t.id];
    openAlert(`
      <div class="alert-title">${t.name}ni o'chirasizmi?</div>
      <p class="alert-text">Bu amalni ortga qaytarib bo'lmaydi.</p>
      ${active ? '<div class="alert-warn-box alert-warn-box--danger">Diqqat: bu stolda faol sessiya bor. Avval sessiyani yakunlang.</div>' : ''}
      <div class="alert-btns">
        <button class="btn btn--ghost" id="cancel-del">Bekor qilish</button>
        <button class="btn btn--danger" id="confirm-del" ${active ? 'disabled' : ''}>O'chirish</button>
      </div>
    `);
    $('#cancel-del').addEventListener('click', closeAlert);
    $('#confirm-del').addEventListener('click', () => {
      zone.tables = zone.tables.filter(x => x.id !== t.id);
      delete sessions[t.id];
      closeAlert(); closeSheet();
      renderHome(); renderZones();
      toast('O\'chirildi');
    });
  });
}

/* ---------------- MAHSULOTLAR ---------------- */
let productZoneId = state.zones[0] ? state.zones[0].id : null;

function renderProducts() {
  if (!state.zones.length) {
    $('#prod-tabs').innerHTML = '';
    $('#products-list').innerHTML = '<div class="empty-state"><p>Avval zona qo\'shing</p></div>';
    return;
  }
  if (!state.zones.some(z => z.id === productZoneId)) productZoneId = state.zones[0].id;
  $('#prod-tabs').innerHTML = state.zones.map(z =>
    `<button class="seg-btn ${z.id === productZoneId ? 'active' : ''}" data-pzone="${z.id}">${z.name}</button>`).join('');
  $$('#prod-tabs .seg-btn').forEach(b => b.addEventListener('click', () => {
    productZoneId = b.dataset.pzone;
    renderProducts();
  }));

  const zone = state.zones.find(z => z.id === productZoneId);
  $('#products-list').innerHTML = zone.products.map(p => `
    <li class="list-row product-row">
      <span class="list-row-left"><span class="material-symbols-outlined">${p.icon || 'local_bar'}</span> <span class="product-name">${p.name}</span></span>
      <span class="product-price">${fmtMoney(p.price)}</span>
      <button class="icon-btn" data-edit-product="${p.id}" title="Tahrirlash"><span class="material-symbols-outlined" style="font-size:20px">edit</span></button>
    </li>`).join('') || '<li class="empty-state" style="padding:30px"><p>Hali mahsulot yo\'q</p></li>';
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
      <div class="sheet-title">${isEdit ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</div>
      <button class="sheet-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="sheet-content">
      <div class="sheet-sub" style="margin:-6px 0 14px;color:var(--text-muted)">${zone.name}</div>
      <div class="field">
        <label>Nomi</label>
        <input id="prod-name" value="${isEdit ? p.name : ''}" placeholder="Masalan: Ko'k choy">
        <span class="field-error"></span>
      </div>
      <div class="field">
        <label>Narxi (so'm)</label>
        <input id="prod-price" type="text" inputmode="numeric" value="${isEdit ? fmtIn(p.price) : ''}" placeholder="Masalan: 7 000">
        <span class="field-error"></span>
      </div>
      <button class="btn btn--primary btn--block" id="save-prod">Saqlash</button>
      ${isEdit ? `<button class="btn btn--danger-ghost btn--block" id="del-prod" style="margin-top:10px">Mahsulotni o'chirish</button>` : ''}
    </div>
  `);
  const nameInput = $('#prod-name');
  const priceInput = $('#prod-price');
  bindMoneyInput(priceInput);
  $('#save-prod').addEventListener('click', () => {
    const name = nameInput.value.trim();
    const price = parseIn(priceInput.value);
    let ok = true;
    if (!name) { nameInput.classList.add('input-error'); nameInput.nextElementSibling.textContent = 'Bu maydon to\'ldirilishi shart'; ok = false; }
    else nameInput.classList.remove('input-error');
    if (!priceInput.value || isNaN(price) || price < 0) {
      priceInput.classList.add('input-error'); priceInput.nextElementSibling.textContent = 'To\'g\'ri son kiriting'; ok = false;
    } else priceInput.classList.remove('input-error');
    if (!ok) return;
    if (isEdit) { p.name = name; p.price = price; }
    else zone.products.push({ id: uid(), name, price, icon: 'local_bar', sold: 0 });
    closeSheet(); renderProducts();
    toast('Saqlandi');
  });
  if (isEdit) $('#del-prod').addEventListener('click', () => {
    openAlert(`
      <div class="alert-title">${p.name}ni o'chirasizmi?</div>
      <p class="alert-text">Bu amalni ortga qaytarib bo'lmaydi.</p>
      <div class="alert-btns">
        <button class="btn btn--ghost" id="cancel-del">Bekor qilish</button>
        <button class="btn btn--danger" id="confirm-del">O'chirish</button>
      </div>
    `);
    $('#cancel-del').addEventListener('click', closeAlert);
    $('#confirm-del').addEventListener('click', () => {
      zone.products = zone.products.filter(x => x.id !== p.id);
      closeAlert(); closeSheet(); renderProducts();
      toast('O\'chirildi');
    });
  });
}

/* ---------------- CHIQISH ---------------- */
function openProfileModal() {
  openAlert(`
    <div class="alert-title">Profilni tahrirlash</div>
    <div class="alert-fields">
      <div class="field">
        <label>Ism</label>
        <input id="profile-name-input" value="${$('#profile-name').textContent}">
        <span class="field-error"></span>
      </div>
      <div class="field">
        <label>Login</label>
        <input id="profile-login-input" value="${$('#profile-login').textContent}">
        <span class="field-error"></span>
      </div>
    </div>
    <div class="alert-btns">
      <button class="btn btn--ghost" id="cancel-profile">Bekor qilish</button>
      <button class="btn btn--primary" id="save-profile">Saqlash</button>
    </div>
  `);
  const nameInput = $('#profile-name-input');
  const loginInput = $('#profile-login-input');
  $('#cancel-profile').addEventListener('click', closeAlert);
  $('#save-profile').addEventListener('click', () => {
    const name = nameInput.value.trim();
    const login = loginInput.value.trim();
    if (!name || !login) {
      toast('Ism va loginni kiriting');
      return;
    }
    $('#profile-name').textContent = name;
    $('#profile-login').textContent = login;
    closeAlert();
    toast('Saqlandi');
  });
}

$('#edit-profile-btn').addEventListener('click', openProfileModal);

$('#logout-btn').addEventListener('click', () => {
  openAlert(`
    <div class="alert-title">Tizimdan chiqasizmi?</div>
    <div class="alert-btns">
      <button class="btn btn--ghost" id="abort-logout">Bekor qilish</button>
      <button class="btn btn--danger" id="ok-logout">Chiqish</button>
    </div>
  `);
  $('#abort-logout').addEventListener('click', closeAlert);
  $('#ok-logout').addEventListener('click', () => {
    closeAlert(); closeSheet();
    $('#bottom-nav').hidden = true;
    VIEWS.forEach(x => { $(`#view-${x}`).hidden = true; });
    $('#view-login').hidden = false;
  });
});

/* ---------------- TAYMER DVIGATELI ---------------- */
let lastStatus = {};
Object.keys(sessions).forEach(tid => { lastStatus[tid] = statusOf(sessions[tid]); });

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
  const now = Date.now();
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
    el.textContent = st === 'expired' ? 'Qo\'shimcha vaqt' : s.mode === 'countdown' ? 'Qolgan vaqt' : 'O\'tgan vaqt';
  });
  updateRings(now);
}

setInterval(tick, 1000);

/* ---------------- Boshlang'ich holat ---------------- */
renderHome();
tick();
