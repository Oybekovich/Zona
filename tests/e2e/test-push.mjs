// E2E: admin bildirishnomalari — DB trigger (pg_net stub) → /api/push/notify → Web Push (shifrlangan) → SW
import http from 'node:http';
import { createECDH, randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { chromium, newPage, wire, check, summary, q, sleep, APP, ADMIN, db } from './lib.mjs';
const require = createRequire(import.meta.url);
const ece = require('http_ece');

const tag = Date.now();
const login = async () => (await (await fetch(ADMIN + 'api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'testadmin', password: 'testpass123' }) })).json()).token;
const token = await login();
const api = (path, opts = {}) => fetch(ADMIN + 'api' + path, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, ...(opts.headers || {}) } });

/* Soxta "push service": kelgan xabarlarni shifrdan chiqarib saqlaydi */
const ua = createECDH('prime256v1'); ua.generateKeys();
const authSecret = randomBytes(16);
const received = [];
let replyStatus = 201;
const pushSrv = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    try {
      const plain = ece.decrypt(Buffer.concat(chunks), { version: 'aes128gcm', privateKey: ua, authSecret });
      received.push({ auth: req.headers.authorization, ttl: req.headers.ttl, payload: JSON.parse(plain.toString()) });
    } catch (e) { received.push({ error: e.message }); }
    res.writeHead(replyStatus); res.end();
  });
});
await new Promise(r => pushSrv.listen(0, '127.0.0.1', r));
const endpoint = `http://127.0.0.1:${pushSrv.address().port}/push/${tag}`;
const sub = { endpoint, keys: { p256dh: ua.getPublicKey('base64url'), auth: authSecret.toString('base64url') } };

await q('delete from private.push_subscriptions');
await q('delete from net._calls');

console.log('1) Server endpoints');
check((await fetch(ADMIN + 'api/push/key')).status === 401, 'push API requires admin token');
const key = await (await api('/push/key')).json();
check(key.enabled && key.publicKey.length === 87, 'public VAPID key served');
check((await api('/push/subscribe', { method: 'POST', body: JSON.stringify({ endpoint: 'ftp://x', keys: {} }) })).status === 400, 'invalid subscription rejected');
check((await api('/push/subscribe', { method: 'POST', body: JSON.stringify(sub) })).status === 200, 'subscription saved');
check((await q('select count(*)::int n from private.push_subscriptions'))[0].n === 1, 'one row in private.push_subscriptions');
const t = await (await api('/push/test', { method: 'POST' })).json();
await sleep(200);
check(t.sent === 1 && received.at(-1)?.payload?.title === 'Sinov bildirishnomasi', 'test push delivered and decrypts (RFC 8291)');
check(/^vapid t=.+, k=/.test(received.at(-1).auth), 'VAPID Authorization header present');

console.log('2) New client signup → DB hook → notify');
await q(`update private.push_config set url = $1, secret = 'test-push-secret' where id = 1`, [ADMIN + 'api/push/notify']);
const email = `push${tag}@t.uz`;
const browser = await chromium.launch({ channel: 'chromium' }); // to'liq Chromium (headless-shell bildirishnomalarni qo'llamaydi)
const { page: app } = await newPage(browser);
await app.goto(APP); await app.click('#mode-toggle');
await app.fill('#login-username', email); await app.fill('#login-password', 'secret123'); await app.fill('#login-confirm', 'secret123');
await app.click('#login-btn'); await app.waitForSelector('#bottom-nav:not([hidden])');
const calls = await q('select url, body, headers from net._calls order by id');
check(calls.length === 1 && calls[0].url.endsWith('/api/push/notify') && calls[0].headers['x-push-secret'] === 'test-push-secret', 'signup fires exactly one pg_net hook with secret');
const uid = (await q('select id from auth.users where email=$1', [email]))[0].id;
check(calls[0].body.user_id === uid, 'hook body carries user id');
// pg_net o'rniga — chaqiruvni admin serverga uzatamiz
const bad = await fetch(calls[0].url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-push-secret': 'wrong' }, body: JSON.stringify(calls[0].body) });
check(bad.status === 401, 'notify with wrong secret → 401');
const before = received.length;
const n = await fetch(calls[0].url, { method: 'POST', headers: calls[0].headers, body: JSON.stringify(calls[0].body) });
const nj = await n.json();
await sleep(200);
const pending = (await q(`select count(*)::int n from user_access where status='pending'`))[0].n;
check(n.status === 200 && nj.sent === 1 && received.length === before + 1, 'notify pushes to subscribed admin device');
const pl = received.at(-1).payload;
check(pl.title === "Yangi so'rov" && pl.body.includes(email) && pl.body.includes(`kutilayotgan: ${pending} ta`), 'payload has email and pending count in text');
const unseen = (await q(`select count(*)::int n from user_access where status='pending' and requested_at > coalesce((select seen_at from private.push_config where id = 1), '-infinity')`))[0].n;
check(unseen >= 1 && pl.count === unseen && nj.pending === pending, `badge count = unseen requests (${pl.count}), pending = ${nj.pending}`);
check((await api('/push/seen', { method: 'POST' })).status === 200, 'POST /api/push/seen ok');
check((await q('select seen_at from private.push_config where id = 1'))[0].seen_at !== null, 'seen_at stored');
await fetch(calls[0].url, { method: 'POST', headers: calls[0].headers, body: JSON.stringify(calls[0].body) });
await sleep(200);
check(received.at(-1).payload.count === 0 && received.at(-1).payload.body.includes(`kutilayotgan: ${pending} ta`), 'after seen: badge count 0, text still shows pending');
await q(`insert into auth.users (email) values ($1)`, [`later${tag}@t.uz`]);
await fetch(calls[0].url, { method: 'POST', headers: calls[0].headers, body: JSON.stringify(calls[0].body) });
await sleep(200);
check(received.at(-1).payload.count === 1, 'new request after seen → badge count 1');
const [{ id: uid2 }] = await q(`insert into auth.users (email) values ($1) returning id`, [`approved${tag}@t.uz`]);
await q('delete from user_access where user_id = $1', [uid2]);
const callsBefore = (await q('select count(*)::int n from net._calls'))[0].n;
await q(`insert into user_access (user_id, status) values ($1, 'approved')`, [uid2]);
check((await q('select count(*)::int n from net._calls'))[0].n === callsBefore, 'approved/rejected insert does not trigger a notification');
await q(`update private.push_config set url = 'http://127.0.0.1:1/unreachable' where id = 1`);
await q(`drop function net.http_post(text, jsonb, jsonb, jsonb, int)`);
await q(`create function net.http_post(url text, body jsonb default '{}', params jsonb default '{}', headers jsonb default '{}', timeout_milliseconds int default 5000) returns bigint language plpgsql as $$ begin raise exception 'boom'; end $$`);
let signupOk = true;
try { await q(`insert into auth.users (email) values ($1)`, [`boom${tag}@t.uz`]); } catch { signupOk = false; }
check(signupOk, 'hook failure does not break signup');
await q(`drop function net.http_post(text, jsonb, jsonb, jsonb, int)`);
await q(`create function net.http_post(url text, body jsonb default '{}', params jsonb default '{}', headers jsonb default '{}', timeout_milliseconds int default 5000) returns bigint language sql as $$ insert into net._calls (url, body, headers) values (url, body, headers) returning id $$`);

console.log('3) Expired subscription cleanup');
replyStatus = 410;
await api('/push/test', { method: 'POST' });
await sleep(200);
check((await q('select count(*)::int n from private.push_subscriptions'))[0].n === 0, '410 Gone → subscription removed');
replyStatus = 201;

console.log('4) Admin PWA: badge + service worker notification');
const context = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'allow' });
await wire(context);
await context.grantPermissions(['notifications'], { origin: ADMIN.replace(/\/$/, '') });
await context.addInitScript(() => {
  window.__badge = [];
  navigator.setAppBadge = n => { window.__badge.push(n); return Promise.resolve(); };
  navigator.clearAppBadge = () => { window.__badge.push(0); return Promise.resolve(); };
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(ADMIN);
await page.fill('#login-username', 'testadmin'); await page.fill('#login-password', 'testpass123'); await page.click('#login-btn');
await page.waitForSelector('.u-row'); await sleep(500);
check((await page.evaluate(() => window.__badge.at(-1))) === 0, 'opening the panel clears the app icon badge');
check((await q(`select seen_at > now() - interval '1 minute' as ok from private.push_config where id = 1`))[0].ok, 'opening the panel marks requests as seen on server');
check(await page.isVisible('#req-count'), 'in-app pending counter still shown');
await page.click('.nav-btn[data-sec=settings]'); await sleep(600);
await page.evaluate(() => navigator.serviceWorker.ready);
await page.click('.nav-btn[data-sec=users]'); await page.click('.nav-btn[data-sec=settings]'); await sleep(800);
const pushText = await page.textContent('#push-status');
check(await page.isVisible('#push-enable') && /O'chiq/.test(pushText), 'settings: notifications card offers "Yoqish" — ' + pushText);
await page.evaluate(() => navigator.serviceWorker.ready);
const cdp = await context.newCDPSession(page);
const regs = [];
cdp.on('ServiceWorker.workerRegistrationUpdated', e => regs.push(...e.registrations));
await cdp.send('ServiceWorker.enable');
await sleep(500);
const reg = regs.find(r => r.scopeURL.startsWith(ADMIN.replace(/\/$/, '')) && !r.isDeleted);
check(!!reg, 'admin service worker registered');
const getNotes = () => page.evaluate(async () => (await (await navigator.serviceWorker.ready).getNotifications()).map(n => ({ title: n.title, body: n.body, tag: n.tag })));
const setHidden = h => page.evaluate(h => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => h });
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => h ? 'hidden' : 'visible' });
  document.dispatchEvent(new Event('visibilitychange'));
}, h);
const deliver = () => cdp.send('ServiceWorker.deliverPushMessage', { origin: ADMIN.replace(/\/$/, ''), registrationId: reg.registrationId, data: JSON.stringify({ title: "Yangi so'rov", body: `${email} ro'yxatdan o'tdi`, count: 4, tag: 'requests' }) });
// Ilova fonda (ekranda emas): bildirishnoma pardada qoladi
await setHidden(true);
await deliver(); await sleep(800);
check((await getNotes()).some(n => n.title === "Yangi so'rov" && n.body.includes(email) && n.tag === 'requests'), 'SW shows notification on push while app is in background');
// Ilovaga qaytildi → o'qildi: bildirishnoma yopiladi, ikonkadagi son 0
await page.evaluate(() => { window.__badge.length = 0; });
await setHidden(false); await sleep(800);
check((await getNotes()).length === 0, 'returning to the app closes shown notifications');
check((await page.evaluate(() => window.__badge.at(-1))) === 0, 'returning to the app clears the icon badge');
// Ilova ochiq turganda push → ro'yxat yangilanadi va darhol o'qilgan bo'ladi
await deliver(); await sleep(800);
check((await getNotes()).length === 0 && (await page.textContent('#toast')).includes("Yangi so'rov keldi"), 'push while app is open: toast shown, notification auto-read');
check(errors.length === 0, 'no page errors: ' + JSON.stringify(errors.slice(0, 3)));

await browser.close(); pushSrv.close(); await db.end();
process.exit(summary() ? 1 : 0);
