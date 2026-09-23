// E2E: main app (Zona) against local Supabase emulator
import { chromium, newPage, check, summary, q, sleep, APP, db } from './lib.mjs';
const browser = await chromium.launch();
const email = `app${Date.now()}@t.uz`;
const uidOf = async e => (await q('select id from auth.users where email=$1', [e]))[0].id;
const XSS = '<img src=x onerror="window.__xss=1">';

async function signup(page, em, pw = 'secret123') {
  await page.goto(APP);
  await page.click('#mode-toggle');
  await page.fill('#login-username', em);
  await page.fill('#login-password', pw);
  await page.fill('#login-confirm', pw);
  await page.click('#login-btn');
  await page.waitForSelector('#bottom-nav:not([hidden])', { timeout: 8000 });
}

console.log('1) Signup → access request + trial banner');
const { page, context } = await newPage(browser);
await signup(page, email);
const uid = await uidOf(email);
const [acc] = await q('select status, trial_until > now() + interval \'29 days\' ok from user_access where user_id=$1', [uid]);
check(acc && acc.status === 'pending' && acc.ok, 'first signup creates pending request with 30-day trial');
await page.waitForSelector('#trial-banner:not([hidden])', { timeout: 5000 });
check(/30/.test(await page.textContent('#trial-banner-text')), 'trial banner shows 30 days left');
check(await page.isHidden('#access-overlay'), 'no lock overlay during trial');

console.log('2) CRUD with hostile names (XSS must not run)');
await page.click('.nav-btn[data-tab=zones]');
await page.click('#add-zone-btn');
await page.fill('#zone-name', XSS + 'Zal');
await page.dblclick('#save-zone');
await sleep(600);
check((await q('select count(*)::int n from zones where owner_id=$1', [uid]))[0].n === 1, 'double-click on save creates exactly one zone');
await page.click('[data-add-table]');
await page.fill('#table-name', XSS + 'Stol 1');
await page.fill('#table-tariff', '60000');
await page.click('#type-seg [data-type=tennis]');
check(await page.inputValue('#table-name') === XSS + 'Stol 1', 'switching table type keeps typed name');
await page.click('#save-table');
await sleep(400);
await page.click('[data-add-table]');
await page.fill('#table-name', 'Stol 2');
await page.fill('#table-tariff', '30000');
await page.check('#table-repair');
await page.click('#save-table');
await sleep(400);
await page.click('.nav-btn[data-tab=products]');
for (const [n, pr] of [[XSS + 'Choy', '5000'], ['Suv', '3000']]) {
  await page.click('#add-product-btn');
  await page.fill('#prod-name', n);
  await page.fill('#prod-price', pr);
  await page.click('#save-prod');
  await sleep(400);
}
await page.click('.nav-btn[data-tab=home]');
await sleep(300);
check(await page.evaluate(() => window.__xss !== 1), 'no XSS execution from names');
check(await page.locator('.table-card.card-repair').count() === 1, 'repair table rendered as out of service');
check((await page.textContent('#table-grid')).includes('<img'), 'hostile name shown as text');

console.log('3) Countdown session: extend persists, products atomic');
await page.click('.table-card[data-action=start]');
await page.click('#mode-seg [data-mode=countdown]');
await page.click('#start-confirm');
await sleep(600);
await page.click('.table-card[data-action=panel]');
await page.click('[data-extend="900"]');
await sleep(300);
await page.click('[data-extend="1800"]');
await sleep(800);
const dur = async () => (await q('select s.duration_sec d from sessions s join tables t on t.id=s.table_id join zones z on z.id=t.zone_id where z.owner_id=$1 and s.end_time is null', [uid]))[0].d;
check(await dur() === 2700 + 2700, `+15 and +30 saved to DB (${await dur()}s)`);
await page.reload();
await page.waitForSelector('.table-card[data-action=panel]');
check(await page.evaluate(() => Object.values(sessions)[0].duration) === 5400, 'extension survives reload');
await page.evaluate(async () => {
  const tid = Object.keys(sessions)[0];
  const pid = findZone(tid).products[0].id;
  await Promise.all([1, 2, 3, 4, 5].map(() => addToSession(tid, pid, 1)));
});
await sleep(600);
const sp = await q('select sp.quantity from session_products sp join sessions s on s.id=sp.session_id join tables t on t.id=s.table_id join zones z on z.id=t.zone_id where z.owner_id=$1', [uid]);
check(sp.length === 1 && sp[0].quantity === 5, `5 rapid adds → one row qty 5 (rows ${sp.length}, qty ${sp[0]?.quantity})`);

console.log('4) Second device cannot double-start same table');
const tid = await page.evaluate(() => Object.keys(sessions)[0]);
const { page: p2 } = await newPage(browser);
await p2.goto(APP);
await p2.fill('#login-username', email); await p2.fill('#login-password', 'secret123'); await p2.click('#login-btn');
await p2.waitForSelector('#bottom-nav:not([hidden])');
await p2.evaluate(t => { delete sessions[t]; renderHome(); }, tid); // simulate stale view
await p2.click(`.table-card[data-tid="${tid}"]`);
await p2.click('#start-confirm');
await sleep(800);
const toastTxt = await p2.textContent('#toasts');
check(/allaqachon faol/.test(toastTxt), 'stale device gets "table busy" message, no duplicate session');

console.log('5) Finish → history; products.sold');
await page.click('.table-card[data-action=panel]');
await page.click('#finish-btn');
await page.dblclick('#ok-finish');
await sleep(800);
check((await q('select count(*)::int n from sessions s join tables t on t.id=s.table_id join zones z on z.id=t.zone_id where z.owner_id=$1 and end_time is not null', [uid]))[0].n === 1, 'session finished once (server end_time)');
check((await q('select sold from products p join zones z on z.id=p.zone_id where z.owner_id=$1 order by p.id limit 1', [uid]))[0].sold === 5, 'products.sold incremented');
await page.click('.nav-btn[data-tab=history]');
await sleep(800);
check((await page.textContent('#history-body')).includes('Stol 1'), 'history shows finished session today');

console.log('6) Large history (1100 old sessions) does not break app');
const [{ t1, p1 }] = await q('select t.id t1, p.id p1 from tables t join zones z on z.id=t.zone_id join products p on p.zone_id=z.id where z.owner_id=$1 order by t.id, p.id limit 1', [uid]);
await q(`with s as (insert into sessions (table_id, mode, rate, start_time, end_time) select $1, 'stopwatch', 3600, d - interval '1 hour', d from (select now() - (g || ' days')::interval - interval '1 hour' d from generate_series(1, 1100) g) x returning id)
  insert into session_products (session_id, product_id, quantity, price) select id, $2, 1, 1000 from s`, [t1, p1]);
await page.click('.nav-btn[data-tab=home]');
await page.click('.table-card[data-action=start]');
await page.click('#start-confirm');
await sleep(500);
await page.evaluate(async () => { const tid = Object.keys(sessions)[0]; await addToSession(tid, findZone(tid).products[1].id, 2); });
await page.reload();
await page.waitForSelector('.table-card[data-action=panel]');
await sleep(500);
check(await page.evaluate(() => Object.values(sessions)[0].products.reduce((a, e) => a + e.qty, 0)) === 2, 'active session products still loaded with >1000 history rows');
await page.click('.nav-btn[data-tab=history]');
await sleep(1500);
const monthsTotal = await page.evaluate(() => histDays.reduce((a, d) => a + d.total, 0));
check(Math.round(monthsTotal) === 1100 * (3600 + 1000), `history totals include all 1100 past sessions (${Math.round(monthsTotal)})`);

console.log('7) Trial expiry → locked; admin approval → unlocked (lifetime)');
await q(`update user_access set trial_until = now() - interval '1 minute' where user_id=$1`, [uid]);
await page.click('#access-retry').catch(() => {});
await page.evaluate(() => refreshAccess());
await page.waitForSelector('#access-overlay:not([hidden])', { timeout: 5000 });
check(/kutilmoqda/.test(await page.textContent('#access-title')), 'lock screen: waiting for admin approval');
const leaked = await page.evaluate(async () => (await sb.from('zones').select('*')).data.length);
check(leaked === 0, 'API returns no data while locked (RLS gate)');
await q(`update user_access set status='approved', decided_at=now() where user_id=$1`, [uid]);
await page.click('#access-retry');
await page.waitForSelector('#access-overlay', { state: 'hidden', timeout: 5000 });
check(await page.isHidden('#trial-banner'), 'approved → unlocked, no trial banner');
check(await page.locator('.table-card').count() === 2, 'data reloaded after approval');
await q(`update user_access set status='rejected' where user_id=$1`, [uid]);
await page.evaluate(() => refreshAccess());
await page.waitForSelector('#access-overlay:not([hidden])');
check(/berilmagan/.test(await page.textContent('#access-title')), 'rejected → "access not granted" screen');
await q(`update user_access set status='approved' where user_id=$1`, [uid]);
await page.evaluate(() => refreshAccess());

console.log('8) Profile name persists');
await page.click('.nav-btn[data-tab=profile]');
await page.click('#edit-profile-btn');
await page.fill('#profile-name-input', 'Ali Klub');
await page.click('#save-profile');
await sleep(500);
await page.reload();
await page.waitForSelector('#bottom-nav:not([hidden])');
check(await page.textContent('#profile-name') === 'Ali Klub', 'profile name saved to account');

console.log('9) Visibility change does not kick user back to Home');
await page.click('.nav-btn[data-tab=history]');
await page.evaluate(async () => { const { data } = await sb.auth.getSession(); sb.auth.onAuthStateChange(() => {}); window.__cb = data; });
await page.evaluate(() => { currentUser && enterApp(); });
check(await page.isVisible('#view-history'), 'repeated SIGNED_IN keeps current view');

console.log('10) Block');
await q(`update auth.users set banned_until = now() + interval '1 year' where id=$1`, [uid]);
await page.evaluate(() => refreshAccess());
await page.waitForSelector('#blocked-overlay:not([hidden])', { timeout: 5000 });
check(true, 'blocked overlay shown');
await q(`update auth.users set banned_until = null where id=$1`, [uid]);
await page.click('#blocked-retry');
await page.waitForSelector('#blocked-overlay', { state: 'hidden', timeout: 5000 });
check(true, 'unblock hides overlay');

console.log('11) Logout → login; login with wrong pw');
await page.click('.nav-btn[data-tab=profile]');
await page.click('#logout-btn'); await page.click('#ok-logout');
await page.waitForSelector('#view-login:not([hidden])');
await page.fill('#login-username', email); await page.fill('#login-password', 'wrongpass'); await page.click('#login-btn');
await page.waitForSelector('#login-error:not([hidden])');
check(/noto'g'ri/.test(await page.textContent('#login-error')), 'wrong password message');

const errs = [...page.errors, ...p2.errors].filter(e => !/404|Failed to load resource/.test(e));
check(errs.length === 0, 'no JS / CSP errors: ' + JSON.stringify(errs.slice(0, 5)));
await browser.close(); await db.end();
process.exit(summary() ? 1 : 0);
