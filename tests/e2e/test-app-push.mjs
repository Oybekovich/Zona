// E2E: mijoz ilovasi bildirishnomalari — obuna RPC (RLS), pg_cron yig'uvchi (5 daqiqa / vaqt tugadi / sinov),
// ruxsat trigger'i → pg_net → admin /api/push/app-notify → Web Push (shifrlangan, qurilma tilida) → ilova SW
import http from 'node:http';
import { createECDH, randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import pg from 'pg';
import { chromium, wire, check, summary, q, sleep, APP, ADMIN, db } from './lib.mjs';
const require = createRequire(import.meta.url);
const ece = require('http_ece');
pg.types.setTypeParser(20, Number); pg.types.setTypeParser(1700, Number);

const pool = new pg.Pool({ connectionString: 'postgres://postgres@127.0.0.1:54329/postgres', max: 5 });
async function as(uid, sql, p) {
  const c = await pool.connect();
  try {
    await c.query('begin');
    await c.query(uid ? 'set local role authenticated' : 'set local role anon');
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(uid ? { sub: uid, role: 'authenticated' } : { role: 'anon' })]);
    const r = await c.query(sql, p);
    await c.query('commit');
    return r.rows;
  } catch (e) { await c.query('rollback'); throw e; } finally { c.release(); }
}
const fails = async fn => { try { await fn(); return false; } catch { return true; } };

/* Soxta push service: har bir qurilma (endpoint) uchun alohida kalit, kelganini shifrdan chiqaradi */
const received = [];
let replyStatus = 201;
const devices = {};
const pushSrv = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const dev = devices[req.url];
    try {
      const plain = ece.decrypt(Buffer.concat(chunks), { version: 'aes128gcm', privateKey: dev.ecdh, authSecret: dev.auth });
      received.push({ path: req.url, ttl: req.headers.ttl, payload: JSON.parse(plain.toString()) });
    } catch (e) { received.push({ path: req.url, error: e.message }); }
    res.writeHead(replyStatus); res.end();
  });
});
await new Promise(r => pushSrv.listen(0, '127.0.0.1', r));
function device(name) {
  const ecdh = createECDH('prime256v1'); ecdh.generateKeys();
  const auth = randomBytes(16);
  const path = `/push/${name}-${Date.now()}`;
  devices[path] = { ecdh, auth };
  return { endpoint: `http://127.0.0.1:${pushSrv.address().port}${path}`, path, p256dh: ecdh.getPublicKey('base64url'), auth: auth.toString('base64url') };
}
const save = (uid, d, lang = 'uz', tz = 'Asia/Tashkent') =>
  as(uid, 'select public.save_push_subscription($1, $2, $3, $4, $5, $6)', [d.endpoint, d.p256dh, d.auth, lang, tz, 'test-ua']);
const collect = async () => (await q('select private.app_push_collect() as ev'))[0].ev;
const notify = (events, secret = 'test-push-secret') => fetch(ADMIN + 'api/push/app-notify', {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'x-push-secret': secret }, body: JSON.stringify({ events }),
});

const tag = Date.now();
const mkUser = async (email, status = 'approved') => {
  const [{ id }] = await q('insert into auth.users (email) values ($1) returning id', [email]);
  await q(`update user_access set status = $2, trial_until = case when $2 = 'pending' then now() + interval '7 days' end where user_id = $1`, [id, status]);
  return id;
};
const A = await mkUser(`pa${tag}@t.uz`);
const B = await mkUser(`pb${tag}@t.uz`);
await q(`update private.push_config set app_url = '', secret = 'test-push-secret' where id = 1`);
await q('delete from net._calls');

console.log('1) Subscription RPC + RLS');
const dA = device('a'), dA2 = device('a2'), dB = device('b');
check(await fails(() => as(null, 'select public.save_push_subscription($1,$2,$3)', [dA.endpoint, dA.p256dh, dA.auth])), 'anon cannot subscribe');
check(await fails(() => save(A, { ...dA, endpoint: 'ftp://x' })), 'invalid endpoint rejected');
check(await fails(() => as(A, `insert into public.app_push_subscriptions (endpoint, owner_id, p256dh, auth) values ('https://x', $1, 'k', 'a')`, [A])), 'direct insert blocked (RPC only)');
await save(A, dA, 'uz'); await save(A, dA2, 'ru', 'Europe/Moscow'); await save(B, dB, 'en', 'Not/AZone');
const rowsA = await as(A, 'select endpoint, lang, tz from public.app_push_subscriptions');
check(rowsA.length === 2 && rowsA.every(r => r.endpoint.includes('/push/a')), 'owner sees only own devices (RLS)');
check((await q('select tz from app_push_subscriptions where endpoint = $1', [dB.endpoint]))[0].tz === 'Asia/Tashkent', 'invalid time zone falls back to Asia/Tashkent');
await save(B, dA2, 'ru', 'Europe/Moscow');
check((await q('select owner_id from app_push_subscriptions where endpoint = $1', [dA2.endpoint]))[0].owner_id === B, 'same device re-saved by another account moves to that account');
await save(A, dA2, 'ru', 'Europe/Moscow');
await as(B, 'select public.delete_push_subscription($1)', [dA.endpoint]);
check((await q('select count(*)::int n from app_push_subscriptions where endpoint = $1', [dA.endpoint]))[0].n === 1, 'cannot delete another account\'s device');

console.log('2) Collector: 5 minutes left / time is up');
const [{ id: zA }] = await q(`insert into zones (name, owner_id) values ('Asosiy zal', $1) returning id`, [A]);
const [{ id: tA }] = await q(`insert into tables (zone_id, name, sport, tariff) values ($1, 'Stol 03', 'billiard', 30000) returning id`, [zA]);
const [{ id: pA }] = await q(`insert into products (zone_id, name, price) values ($1, 'Choy', 6000) returning id`, [zA]);
const [{ id: sA }] = await q(`insert into sessions (table_id, mode, rate, start_time, duration_sec) values ($1, 'countdown', 30000, now() - interval '57 minutes', 3600) returning id`, [tA]);
await q(`insert into session_products (session_id, product_id, quantity, price) values ($1, $2, 2, 6000)`, [sA, pA]);
const [{ id: zB }] = await q(`insert into zones (name, owner_id) values ('B zal', $1) returning id`, [B]);
const [{ id: tB }] = await q(`insert into tables (zone_id, name, tariff) values ($1, 'B1', 20000) returning id`, [zB]);
await q(`insert into sessions (table_id, mode, rate, start_time, duration_sec) values ($1, 'countdown', 20000, now() - interval '20 minutes', 3600)`, [tB]);
const [{ id: uNo }] = [{ id: await mkUser(`pn${tag}@t.uz`) }];
const [{ id: zN }] = await q(`insert into zones (name, owner_id) values ('N', $1) returning id`, [uNo]);
const [{ id: tN }] = await q(`insert into tables (zone_id, name, tariff) values ($1, 'N1', 20000) returning id`, [zN]);
const [{ id: sN }] = await q(`insert into sessions (table_id, mode, rate, start_time, duration_sec) values ($1, 'countdown', 20000, now() - interval '58 minutes', 3600) returning id`, [tN]);
let ev = await collect();
const endA = ev.filter(e => e.type === 'ending');
check(endA.length === 1 && endA[0].session_id === sA && endA[0].table === 'Stol 03' && endA[0].zone === 'Asosiy zal', 'ending event for the session with 3 min left (only owner with devices)');
check(endA[0].products === 12000 && endA[0].rate === 30000 && endA[0].duration_sec === 3600, 'event carries rate, duration and product total');
check((await q('select warned_at from sessions where id = $1', [sN]))[0].warned_at === null, 'owner without devices: session not marked');
check((await collect()).length === 0, 'second tick: nothing repeated');
await q(`update sessions set start_time = now() - interval '61 minutes' where id = $1`, [sA]);
ev = await collect();
check(ev.length === 1 && ev[0].type === 'over' && ev[0].session_id === sA, 'time is up → one "over" event');
check((await collect()).length === 0, 'over is not repeated');
await as(A, 'select public.extend_session($1, 900)', [sA]);
await q(`update sessions set start_time = now() - interval '72 minutes' where id = $1`, [sA]);
ev = await collect();
check(ev.length === 1 && ev[0].type === 'ending' && ev[0].duration_sec === 4500, 'after +15 min: new "5 minutes left" for the extended end');
await q(`update sessions set start_time = now() - interval '3 hours' where id = $1`, [sA]);
await q(`update sessions set over_notified_at = null where id = $1`, [sA]);
check((await collect()).length === 0, 'long-expired session (>10 min) is not notified (no spam after downtime)');
await q(`update sessions set end_time = now() where id = $1`, [sA]);

const [{ id: s5 }] = await q(`insert into sessions (table_id, mode, rate, start_time, duration_sec) values ($1, 'countdown', 30000, now() - interval '1 minute', 300) returning id`, [tA]);
check((await collect()).length === 0, '5-minute timer: no "5 minutes left" right after start');
await q(`update sessions set start_time = now() - interval '6 minutes' where id = $1`, [s5]);
ev = await collect();
check(ev.length === 1 && ev[0].type === 'over' && ev[0].session_id === s5, '5-minute timer: "time is up" still sent');
await q(`update sessions set end_time = now() where id = $1`, [s5]);

console.log('3) Trial ending + access granted');
await q(`update user_access set status = 'pending', trial_until = now() + interval '20 hours', trial_warned_at = null where user_id = $1`, [A]);
ev = await collect();
check(ev.length === 1 && ev[0].type === 'trial_ending' && ev[0].owner_id === A, 'trial ends within 1 day → one trial_ending event');
check((await collect()).length === 0, 'trial warning not repeated');
await q(`update private.push_config set app_url = $1 where id = 1`, [ADMIN + 'api/push/app-notify']);
await q('delete from net._calls');
await q(`update user_access set status = 'pending', trial_until = null where user_id = $1`, [B]);
await q('delete from net._calls');
await q(`update user_access set trial_until = now() + interval '7 days', decided_at = now() where user_id = $1`, [B]);
let calls = await q('select url, body, headers from net._calls order by id');
check(calls.length === 1 && calls[0].url.endsWith('/api/push/app-notify') && calls[0].headers['x-push-secret'] === 'test-push-secret'
  && calls[0].body.events[0].type === 'access' && calls[0].body.events[0].owner_id === B, 'admin starts trial → immediate access event via pg_net');
await q(`update user_access set status = 'approved' where user_id = $1`, [B]);
calls = await q('select body from net._calls order by id');
check(calls.length === 2 && calls[1].body.events[0].status === 'approved', 'admin approves for life → access event');
await q(`update user_access set note = 'x' where user_id = $1`, [B]);
check((await q('select count(*)::int n from net._calls'))[0].n === 2, 'unrelated update → no notification');
await q(`update private.push_config set app_url = '' where id = 1`);
await q(`insert into sessions (table_id, mode, rate, start_time, duration_sec) values ($1, 'countdown', 30000, now() - interval '58 minutes', 3600)`, [tA]);
await q('delete from net._calls');
await q('select private.app_push_tick()');
check((await q('select count(*)::int n from net._calls'))[0].n === 0 && (await q(`select count(*)::int n from sessions where table_id = $1 and end_time is null and warned_at is not null`, [tA]))[0].n === 0,
  'hook URL not configured → tick does nothing and marks nothing');
await q(`update private.push_config set app_url = $1 where id = 1`, [ADMIN + 'api/push/app-notify']);
await q('select private.app_push_tick()');
calls = await q('select body from net._calls');
check(calls.length === 1 && calls[0].body.events.length === 1 && calls[0].body.events[0].type === 'ending', 'tick posts collected events to admin server');

console.log('4) Admin server: exact text in device language, delivery, cleanup');
check((await fetch(ADMIN + 'api/push/app-key')).status === 200 && (await (await fetch(ADMIN + 'api/push/app-key')).json()).publicKey.length === 87, 'public app key served without admin token');
check((await notify([], 'wrong')).status === 401, 'wrong secret → 401');
const start = new Date(Date.now() - 57 * 60000).toISOString(), end = new Date(Date.now() + 3 * 60000).toISOString();
const evEnding = { type: 'ending', owner_id: A, session_id: 77, table: 'Stol 03', zone: 'Asosiy zal', start, ends_at: end, duration_sec: 3600, rate: 30000, products: 12000 };
received.length = 0;
let r = await (await notify([evEnding])).json();
await sleep(300);
const uzMsg = received.find(x => x.path === dA.path)?.payload, ruMsg = received.find(x => x.path === dA2.path)?.payload;
check(r.sent === 2 && received.length === 2, 'sent to both of owner\'s devices, not to other accounts');
const hmT = (iso, tz) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date(iso));
check(uzMsg && uzMsg.title === '⏳ Stol 03: 5 daqiqa qoldi' && uzMsg.body.includes('Asosiy zal') && uzMsg.body.includes(hmT(end, 'Asia/Tashkent'))
  && uzMsg.body.includes('42 000 so\'m') && uzMsg.body.includes('1 soat') && uzMsg.tag === 'session-77', 'uz text: table, zone, end time (Tashkent), duration, total with products');
check(ruMsg && ruMsg.title.includes('осталось 5 минут') && ruMsg.body.includes(hmT(end, 'Europe/Moscow')) && ruMsg.body.includes('сум'), 'ru device gets Russian text in its own time zone');
check(received.find(x => x.path === dA.path).ttl === '300', 'ending alert expires after 5 minutes (TTL 300)');
received.length = 0;
await notify([{ ...evEnding, type: 'over', products: 0 }, { type: 'access', owner_id: B, status: 'pending', trial_until: new Date(Date.now() + 7 * 86400000).toISOString() }]);
await sleep(300);
const over = received.find(x => x.path === dA.path)?.payload, acc = received.find(x => x.path === dB.path)?.payload;
check(over && over.title === '🔔 Stol 03: vaqt tugadi' && over.requireInteraction === true && over.body.includes('30 000 so\'m'), 'over: "vaqt tugadi" with total, stays until tapped');
check(acc && acc.title === '✅ Trial started' && acc.body.includes('7 days'), 'access: trial started (en) with days');
await save(A, { ...device('evil'), endpoint: 'https://evil.example.com/x' });
received.length = 0;
r = await (await notify([evEnding])).json();
check(r.sent === 2, 'non push-service endpoint is skipped (no SSRF)');
replyStatus = 410;
r = await (await notify([evEnding])).json();
replyStatus = 201;
check(r.removed === 2 && (await q('select count(*)::int n from app_push_subscriptions where owner_id = $1 and endpoint like $2', [A, 'http://127.0.0.1%']))[0].n === 0, '410 Gone → expired devices removed');

console.log('5) App: service worker shows notification, settings UI');
const browser = await chromium.launch({ channel: 'chromium' });
const context = await browser.newContext({ viewport: { width: 420, height: 860 }, serviceWorkers: 'allow' });
await wire(context);
await context.grantPermissions(['notifications'], { origin: APP.replace(/\/$/, '') });
const key = (await (await fetch(ADMIN + 'api/push/app-key')).json()).publicKey;
await context.addInitScript(k => { window.__ZONA_VAPID_KEY = k; }, key);
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const email = `ui${tag}@t.uz`;
await page.goto(APP); await page.click('#mode-toggle');
await page.fill('#login-username', email); await page.fill('#login-password', 'secret123'); await page.fill('#login-confirm', 'secret123');
await page.click('#login-btn');
await page.waitForSelector('#access-overlay:not([hidden])');
check(await page.isVisible('#access-push'), 'pending screen offers "Tasdiqlanganda xabar olish"');
const uid = (await q('select id from auth.users where email = $1', [email]))[0].id;
await q(`update user_access set status = 'approved' where user_id = $1`, [uid]);
await page.evaluate(() => refreshAccess());
await page.waitForSelector('#access-overlay', { state: 'hidden' });
await sleep(500);
check(await page.isVisible('#push-banner'), 'home shows "enable notifications" banner');
await page.click('#push-banner-x');
check(await page.isHidden('#push-banner'), 'banner can be dismissed');
await page.click('.nav-btn[data-tab=profile]'); await sleep(300);
check(/5 daqiqa qoldi/.test(await page.textContent('#push-sub')) && (await page.getAttribute('#push-switch', 'aria-checked')) === 'false', 'profile: notification switch with explanation');
await page.evaluate(() => navigator.serviceWorker.ready);
const cdp = await context.newCDPSession(page);
const regs = [];
cdp.on('ServiceWorker.workerRegistrationUpdated', e => regs.push(...e.registrations));
await cdp.send('ServiceWorker.enable');
await sleep(500);
const reg = regs.find(x => x.scopeURL.startsWith(APP.replace(/\/$/, '')) && !x.isDeleted);
check(!!reg, 'app service worker registered');
await cdp.send('ServiceWorker.deliverPushMessage', { origin: APP.replace(/\/$/, ''), registrationId: reg.registrationId, data: JSON.stringify(over) });
await sleep(800);
const notes = await page.evaluate(async () => (await (await navigator.serviceWorker.ready).getNotifications()).map(n => ({ title: n.title, body: n.body, tag: n.tag, ri: n.requireInteraction })));
check(notes.some(n => n.title === '🔔 Stol 03: vaqt tugadi' && n.body.includes('Asosiy zal') && n.tag === 'session-77' && n.ri), 'SW displays the push as a system notification');
check(errors.length === 0, 'no page errors: ' + JSON.stringify(errors.slice(0, 3)));

await q(`update private.push_config set app_url = '' where id = 1`);
await browser.close(); pushSrv.close(); await pool.end(); await db.end();
process.exit(summary() ? 1 : 0);
