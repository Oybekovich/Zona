import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import pg from 'pg';
const require = createRequire(import.meta.url);
export const { chromium } = require('playwright');
pg.types.setTypeParser(20, v => Number(v));
export const db = new pg.Pool({ connectionString: 'postgres://postgres@127.0.0.1:54329/postgres', max: 3 });
export const q = async (sql, p) => (await db.query(sql, p)).rows;

const SB_JS = readFileSync(new URL('./node_modules/@supabase/supabase-js/dist/umd/supabase.js', import.meta.url));
export const APP = 'http://localhost:8000/';
export const ADMIN = 'http://localhost:8080/';

export async function wire(context, log = []) {
  await context.route(/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js/, r => r.fulfill({ status: 200, contentType: 'text/javascript', body: SB_JS }));
  await context.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await context.route(/cscjdmvchnxpqhnlietl\.supabase\.co/, async r => {
    const req = r.request();
    const u = new URL(req.url());
    if (u.pathname.startsWith('/realtime')) return r.abort();
    const target = 'http://127.0.0.1:54321' + u.pathname + u.search;
    const headers = { ...req.headers() };
    delete headers['host'];
    try {
      const resp = await fetch(target, { method: req.method(), headers, body: ['GET', 'HEAD'].includes(req.method()) ? undefined : req.postDataBuffer() });
      const body = Buffer.from(await resp.arrayBuffer());
      const h = Object.fromEntries(resp.headers);
      await r.fulfill({ status: resp.status, headers: h, body });
    } catch (e) { await r.abort(); }
  });
  return log;
}

export async function newPage(browser, opts = {}) {
  const context = await browser.newContext({ viewport: opts.viewport || { width: 420, height: 860 }, serviceWorkers: 'block' });
  await wire(context);
  const page = await context.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/realtime|websocket|ERR_FAILED|net::/i.test(m.text())) page.errors.push('console: ' + m.text()); });
  page.on('dialog', d => d.dismiss());
  return { context, page };
}

let fails = 0, passes = 0;
export function check(cond, msg) {
  if (cond) { passes++; console.log('  ✓ ' + msg); }
  else { fails++; console.log('  ✗ ' + msg); }
}
export function summary() { console.log(`\n${passes} passed, ${fails} failed`); return fails; }
export const sleep = ms => new Promise(r => setTimeout(r, ms));
