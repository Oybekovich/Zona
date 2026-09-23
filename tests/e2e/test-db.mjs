// DB-level tests: access gate, RLS isolation, RPC correctness (runs against local Postgres)
import pg from 'pg';
import { check, summary } from './lib.mjs';
pg.types.setTypeParser(20, Number); pg.types.setTypeParser(1700, Number);
const pool = new pg.Pool({ connectionString: 'postgres://postgres@127.0.0.1:54329/postgres', max: 30 });
const su = async (sql, p) => (await pool.query(sql, p)).rows;
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
const err = async (fn) => { try { await fn(); return null; } catch (e) { return e; } };
const mkUser = async (email) => (await su(`insert into auth.users (email) values ($1) returning id`, [email]))[0].id;

const tag = Date.now();
const A = await mkUser(`a${tag}@t.uz`), B = await mkUser(`b${tag}@t.uz`);

console.log('1) New user → pending request with trial');
const [acc] = await su('select status, trial_until - requested_at as d from user_access where user_id=$1', [A]);
check(acc.status === 'pending', 'signup creates pending access request');
check(acc.d.days === 30, `trial = 30 days (got ${JSON.stringify(acc.d)})`);
const ra = await as(A, 'select public.request_access() r');
check(ra[0].r.status === 'pending' && ra[0].r.has_access === true, 'request_access(): pending + has_access during trial');
check(!!(await err(() => as(null, 'select public.request_access()'))), 'anon cannot call request_access');

console.log('2) Trial user can work; isolation between tenants');
const [za] = await as(A, `insert into zones (name) values ('A zona') returning id`);
const [ta] = await as(A, `insert into tables (zone_id, name, tariff) values ($1, 'T1', 36000) returning id`, [za.id]);
const [pa] = await as(A, `insert into products (zone_id, name, price) values ($1, 'Choy', 5000) returning id`, [za.id]);
await su(`update user_access set status='approved' where user_id=$1`, [B]);
const [zb] = await as(B, `insert into zones (name) values ('B zona') returning id`);
const [pb] = await as(B, `insert into products (zone_id, name, price) values ($1, 'B mahsulot', 1) returning id`, [zb.id]);
check((await as(B, 'select * from zones')).every(z => z.id !== za.id), 'B cannot see A zones');
check(!!(await err(() => as(B, `insert into tables (zone_id, name) values ($1, 'hack')`, [za.id]))), 'B cannot insert into A zone');

console.log('3) Sessions RPCs');
const [s] = await as(A, `insert into sessions (table_id, mode, rate, duration_sec) values ($1, 'countdown', 36000, 2700) returning id`, [ta.id]);
const dupErr = await err(() => as(A, `insert into sessions (table_id, mode) values ($1, 'stopwatch')`, [ta.id]));
check(dupErr && dupErr.code === '23505', 'second active session on same table rejected (23505)');
const [{ d }] = await as(A, 'select public.extend_session($1, 900) d', [s.id]);
check(d === 3600, 'extend_session +15 min persists (2700 → 3600)');
await Promise.all(Array.from({ length: 25 }, () => as(A, 'select public.add_session_product($1, $2, 1)', [s.id, pa.id])));
const sp = await su('select quantity, price from session_products where session_id=$1', [s.id]);
check(sp.length === 1 && sp[0].quantity === 25, `25 concurrent adds → 1 row qty 25 (got ${sp.length} rows, qty ${sp[0]?.quantity})`);
check(sp[0].price === 5000, 'price frozen server-side from product');
const [{ q }] = await as(A, 'select public.add_session_product($1, $2, -5) q', [s.id, pa.id]);
check(q === 20, 'negative delta decrements');
check(!!(await err(() => as(A, 'select public.add_session_product($1, $2, 1)', [s.id, pb.id]))), 'cannot add other tenant product');
check(!!(await err(() => as(B, 'select public.add_session_product($1, $2, 1)', [s.id, pa.id]))), 'B cannot modify A session');
await su(`update sessions set start_time = now() - interval '50 minutes' where id=$1`, [s.id]);
const [{ r: fin }] = await as(A, 'select public.finish_session($1) r', [s.id]);
check(!!fin.end_time, 'finish_session sets server end_time');
const [{ sold }] = await su('select sold from products where id=$1', [pa.id]);
check(sold === 20, `products.sold incremented by 20 (got ${sold})`);
check(!!(await err(() => as(A, 'select public.finish_session($1)', [s.id]))), 'double finish rejected');
const hist = await as(A, `select * from public.history_days('Asia/Tashkent')`);
// countdown 60 min, finished at 50 → billed full 60 min: 36000 + 20*5000
check(hist.length === 1 && Math.round(hist[0].time_sum) === 36000 && hist[0].prod_sum === 100000, `history_days totals (time ${hist[0]?.time_sum}, prod ${hist[0]?.prod_sum})`);
check((await as(B, `select * from public.history_days('UTC')`)).length === 0, 'history isolated per tenant');

console.log('4) Access gate');
await su(`update user_access set trial_until = now() - interval '1 second' where user_id=$1`, [A]);
check((await as(A, 'select * from zones')).length === 0, 'trial expired → cannot read data');
check(!!(await err(() => as(A, `insert into zones (name) values ('x')`))), 'trial expired → cannot write');
const r2 = await as(A, 'select public.request_access() r');
check(r2[0].r.has_access === false && r2[0].r.status === 'pending', 'request_access reports locked pending state');
await su(`update user_access set status='approved', decided_at=now() where user_id=$1`, [A]);
check((await as(A, 'select * from zones')).length === 1, 'approved (lifetime) → data visible even after trial');
await su(`update auth.users set banned_until = now() + interval '1 day' where id=$1`, [A]);
check((await as(A, 'select * from zones')).length === 0, 'banned user blocked at DB level immediately');
await su(`update auth.users set banned_until = null where id=$1`, [A]);
await su(`update user_access set status='rejected' where user_id=$1`, [A]);
check((await as(A, 'select * from zones')).length === 0, 'rejected → no access');
check(!!(await err(() => as(A, `update user_access set status='approved' where user_id=$1`, [A]))), 'user cannot self-approve');
check(!!(await err(() => as(A, `insert into user_access (user_id, status) values ($1,'approved') on conflict (user_id) do update set status='approved'`, [A]))), 'user cannot upsert own access');
check(!!(await err(() => as(A, 'select * from app_settings'))), 'app_settings not readable by clients');
check((await as(B, 'select * from user_access')).every(r => r.user_id === B), 'user sees only own access row');
check(!!(await err(() => as(A, 'select * from private.admin_login_attempts'))), 'private schema not reachable');

console.log('5) trial_days setting');
await su(`update app_settings set value='0' where key='trial_days'`);
const C = await mkUser(`c${tag}@t.uz`);
check((await as(C, 'select public.request_access() r'))[0].r.has_access === false, 'trial_days=0 → approval required before any use');
await su(`update app_settings set value='30' where key='trial_days'`);

await su('delete from auth.users where id = any($1)', [[A, B, C]]);
await pool.end();
process.exit(summary() ? 1 : 0);
