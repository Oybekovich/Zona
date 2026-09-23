// Minimal local Supabase emulator for tests: GoTrue (auth) + PostgREST (rest/rpc) subset
// over a real local Postgres with real RLS. Not production code.
import http from 'node:http';
import crypto from 'node:crypto';
import pg from 'pg';

const PORT = Number(process.env.MOCK_PORT || 54321);
const DB = process.env.DB_URL || 'postgres://postgres@127.0.0.1:54329/postgres';
const SECRET = 'local-test-jwt-secret';
const JWT_TTL = Number(process.env.JWT_TTL || 3600);

pg.types.setTypeParser(20, v => Number(v));
const pool = new pg.Pool({ connectionString: DB, max: 10 });

/* ---------- JWT ---------- */
const b64u = b => Buffer.from(b).toString('base64url');
function signJwt(payload) {
  const h = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = b64u(JSON.stringify(payload));
  const s = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64url');
  return `${h}.${p}.${s}`;
}
function decodeJwt(tok) {
  try {
    const [h, p, s] = tok.split('.');
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
    // prod anon key is signed with the real secret — accept it by role only
    if (payload.role === 'anon') return payload;
    const exp = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64url');
    if (exp !== s) return null;
    if (payload.exp && payload.exp * 1000 < Date.now()) return { expired: true };
    return payload;
  } catch { return null; }
}

/* ---------- helpers ---------- */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  'Access-Control-Expose-Headers': 'Content-Range, X-Total-Count',
};
function send(res, code, body, extra = {}) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', ...CORS, ...extra });
  res.end(body === undefined ? '' : (typeof body === 'string' ? body : JSON.stringify(body)));
}
async function readBody(req) {
  let s = '';
  for await (const c of req) s += c;
  return s ? JSON.parse(s) : {};
}
const qi = s => '"' + String(s).replace(/"/g, '""') + '"';

/* ---------- GoTrue ---------- */
const refreshTokens = new Map();
async function userJson(id) {
  const { rows } = await pool.query('select * from auth.users where id = $1', [id]);
  const u = rows[0];
  if (!u) return null;
  return {
    id: u.id, aud: 'authenticated', role: 'authenticated', email: u.email,
    email_confirmed_at: u.email_confirmed_at, confirmed_at: u.email_confirmed_at,
    last_sign_in_at: u.last_sign_in_at, app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: u.raw_user_meta_data || {}, identities: [], created_at: u.created_at, updated_at: u.updated_at,
    ...(u.banned_until ? { banned_until: u.banned_until } : {}), is_anonymous: false,
  };
}
async function sessionFor(id) {
  const user = await userJson(id);
  const now = Math.floor(Date.now() / 1000);
  const access_token = signJwt({ sub: id, role: 'authenticated', aud: 'authenticated', email: user.email, iat: now, exp: now + JWT_TTL, session_id: crypto.randomUUID() });
  const refresh_token = crypto.randomBytes(16).toString('hex');
  refreshTokens.set(refresh_token, id);
  return { access_token, token_type: 'bearer', expires_in: JWT_TTL, expires_at: now + JWT_TTL, refresh_token, user };
}
async function isBanned(id) {
  const { rows } = await pool.query('select banned_until > now() as b from auth.users where id = $1', [id]);
  return rows[0] && rows[0].b;
}

async function handleAuth(req, res, url) {
  const p = url.pathname.replace('/auth/v1', '');
  if (p === '/health') return send(res, 200, { name: 'GoTrue', version: 'mock' });
  if (p === '/settings') return send(res, 200, { external: { email: true }, mailer_autoconfirm: true });
  if (req.method === 'POST' && p === '/signup') {
    const { email, password } = await readBody(req);
    if (!password || password.length < 6) return send(res, 422, { code: 422, error_code: 'weak_password', msg: 'Password should be at least 6 characters.' });
    const ex = await pool.query('select 1 from auth.users where lower(email) = lower($1)', [email]);
    if (ex.rowCount) return send(res, 422, { code: 422, error_code: 'user_already_exists', msg: 'User already registered' });
    const { rows } = await pool.query(`insert into auth.users (email, encrypted_password, email_confirmed_at, last_sign_in_at)
      values (lower($1), extensions.crypt($2, extensions.gen_salt('bf')), now(), now()) returning id`, [email, password]);
    return send(res, 200, await sessionFor(rows[0].id));
  }
  if (req.method === 'POST' && p === '/token') {
    const gt = url.searchParams.get('grant_type');
    const body = await readBody(req);
    let id;
    if (gt === 'password') {
      const { rows } = await pool.query(`select id from auth.users where lower(email) = lower($1) and encrypted_password = extensions.crypt($2, encrypted_password)`, [body.email, body.password]);
      if (!rows[0]) return send(res, 400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
      id = rows[0].id;
    } else if (gt === 'refresh_token') {
      id = refreshTokens.get(body.refresh_token);
      if (!id) return send(res, 400, { code: 400, error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token: Refresh Token Not Found' });
      refreshTokens.delete(body.refresh_token);
      const ex = await pool.query('select 1 from auth.users where id = $1', [id]);
      if (!ex.rowCount) return send(res, 400, { code: 400, error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token: Refresh Token Not Found' });
    } else return send(res, 400, { msg: 'unsupported grant' });
    if (await isBanned(id)) return send(res, 400, { code: 400, error_code: 'user_banned', msg: 'User is banned' });
    await pool.query('update auth.users set last_sign_in_at = now() where id = $1', [id]);
    return send(res, 200, await sessionFor(id));
  }
  const claims = decodeJwt((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
  if (p === '/user' && req.method === 'GET') {
    if (!claims || claims.expired || !claims.sub) return send(res, 401, { code: 401, error_code: 'bad_jwt', msg: 'invalid JWT' });
    const u = await userJson(claims.sub);
    if (!u) return send(res, 403, { code: 403, error_code: 'user_not_found', msg: 'User from sub claim in JWT does not exist' });
    return send(res, 200, u);
  }
  if (p === '/user' && req.method === 'PUT') {
    if (!claims || claims.expired || !claims.sub) return send(res, 401, { code: 401, error_code: 'bad_jwt', msg: 'invalid JWT' });
    const body = await readBody(req);
    if (body.data) await pool.query(`update auth.users set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || $2::jsonb, updated_at = now() where id = $1`, [claims.sub, JSON.stringify(body.data)]);
    return send(res, 200, await userJson(claims.sub));
  }
  if (p === '/logout') return send(res, 204);
  return send(res, 404, { msg: 'not found ' + p });
}

/* ---------- PostgREST ---------- */
let FKS = [];
async function loadFks() {
  const { rows } = await pool.query(`
    select cl.relname as tbl, a.attname as col, rcl.relname as ref, ra.attname as refcol
    from pg_constraint c
    join pg_class cl on cl.oid = c.conrelid join pg_namespace n on n.oid = cl.relnamespace
    join pg_class rcl on rcl.oid = c.confrelid join pg_namespace rn on rn.oid = rcl.relnamespace
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
    join pg_attribute ra on ra.attrelid = c.confrelid and ra.attnum = c.confkey[1]
    where c.contype = 'f' and n.nspname = 'public' and rn.nspname = 'public'`);
  FKS = rows;
}

function splitTop(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function parseSelect(s) {
  return splitTop(s || '*').map(item => {
    const m = item.match(/^(?:([\w]+):)?([\w*]+)(?:!\w+)?(?:\((.*)\))?$/s);
    if (!m) throw Object.assign(new Error('bad select ' + item), { status: 400 });
    const [, alias, name, inner] = m;
    return inner !== undefined ? { rel: name, alias: alias || name, children: parseSelect(inner) } : { col: name, alias: alias || name };
  });
}

function parseOrder(v, a) {
  return v.split(',').map(part => {
    const [col, dir, nulls] = part.split('.');
    return `${a}.${qi(col)} ${dir === 'desc' ? 'desc' : 'asc'}${nulls === 'nullsfirst' ? ' nulls first' : nulls === 'nullslast' ? ' nulls last' : ''}`;
  }).join(', ');
}

function filterSql(col, raw, a, params) {
  let neg = false, v = raw;
  if (v.startsWith('not.')) { neg = true; v = v.slice(4); }
  const i = v.indexOf('.');
  const op = v.slice(0, i), val = v.slice(i + 1);
  const c = `${a}.${qi(col)}`;
  let sql;
  const ph = x => { params.push(x); return '$' + params.length; };
  switch (op) {
    case 'eq': sql = `${c} = ${ph(val)}`; break;
    case 'neq': sql = `${c} <> ${ph(val)}`; break;
    case 'gt': sql = `${c} > ${ph(val)}`; break;
    case 'gte': sql = `${c} >= ${ph(val)}`; break;
    case 'lt': sql = `${c} < ${ph(val)}`; break;
    case 'lte': sql = `${c} <= ${ph(val)}`; break;
    case 'like': sql = `${c}::text like ${ph(val.replace(/\*/g, '%'))}`; break;
    case 'ilike': sql = `${c}::text ilike ${ph(val.replace(/\*/g, '%'))}`; break;
    case 'is': sql = `${c} is ${val === 'null' ? 'null' : val === 'true' ? 'true' : 'false'}`; break;
    case 'in': {
      const items = val.replace(/^\(|\)$/g, '').split(',').filter(Boolean).map(x => x.replace(/^"|"$/g, ''));
      sql = items.length ? `${c}::text = any(${ph(items)}::text[])` : 'false'; break;
    }
    default: throw Object.assign(new Error('unsupported op ' + op), { status: 400 });
  }
  return neg ? `not (${sql})` : sql;
}

let aliasN = 0;
function buildSelect(table, nodes, a, opts) {
  const cols = nodes.map(n => {
    if (n.col === '*') return `${a}.*`;
    if (n.col) return `${a}.${qi(n.col)} as ${qi(n.alias)}`;
    const b = 'a' + (++aliasN);
    const child = FKS.find(f => f.tbl === n.rel && f.ref === table);
    const parent = FKS.find(f => f.tbl === table && f.ref === n.rel);
    const sub = opts.sub[n.rel] || {};
    if (child) {
      const inner = buildSelect(n.rel, n.children, b, { sub: {} });
      const ord = sub.order ? ` order by ${parseOrder(sub.order, b)}` : '';
      return `(select coalesce(json_agg(x), '[]'::json) from (select ${inner} from public.${qi(n.rel)} ${b} where ${b}.${qi(child.col)} = ${a}.${qi(child.refcol)}${ord}) x) as ${qi(n.alias)}`;
    }
    if (parent) {
      const inner = buildSelect(n.rel, n.children, b, { sub: {} });
      return `(select row_to_json(x) from (select ${inner} from public.${qi(n.rel)} ${b} where ${b}.${qi(parent.refcol)} = ${a}.${qi(parent.col)}) x) as ${qi(n.alias)}`;
    }
    throw Object.assign(new Error(`no relationship ${table} -> ${n.rel}`), { status: 400, code: 'PGRST200' });
  });
  return cols.join(', ');
}

const RESERVED = new Set(['select', 'order', 'limit', 'offset', 'columns', 'on_conflict']);
function whereFrom(url, a, params) {
  const w = [];
  for (const [k, v] of url.searchParams) {
    if (RESERVED.has(k) || k.includes('.')) continue;
    w.push(filterSql(k, v, a, params));
  }
  return w.length ? ' where ' + w.join(' and ') : '';
}

async function withRole(claims, fn) {
  const client = await pool.connect();
  try {
    await client.query('begin');
    const role = claims && claims.role === 'authenticated' ? 'authenticated' : 'anon';
    await client.query(`set local role ${role}`);
    await client.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims || { role: 'anon' })]);
    const r = await fn(client);
    await client.query('commit');
    return r;
  } catch (e) {
    await client.query('rollback').catch(() => {});
    throw e;
  } finally { client.release(); }
}

function pgErr(res, e) {
  const map = { '42501': 403, '23505': 409, '23503': 409, '23502': 400, '22P02': 400, 'P0001': 400, '42883': 404, 'PGRST116': 406 };
  const status = e.status || map[e.code] || 400;
  send(res, status, { code: e.code || 'PGRST', message: e.message, details: e.detail || null, hint: e.hint || null });
}

async function handleRest(req, res, url) {
  const claims = decodeJwt((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
  if (claims && claims.expired) return send(res, 401, { code: 'PGRST303', message: 'JWT expired' });
  const parts = url.pathname.replace('/rest/v1/', '').split('/');
  const wantObject = (req.headers.accept || '').includes('vnd.pgrst.object');
  const prefer = req.headers.prefer || '';
  try {
    if (parts[0] === 'rpc') {
      const fn = parts[1];
      const args = req.method === 'GET' ? Object.fromEntries(url.searchParams) : await readBody(req);
      const keys = Object.keys(args);
      const { rows: meta } = await pool.query(`select p.proretset, t.typtype from pg_proc p join pg_namespace n on n.oid=p.pronamespace join pg_type t on t.oid=p.prorettype where n.nspname='public' and p.proname=$1`, [fn]);
      if (!meta[0]) throw Object.assign(new Error('function not found'), { status: 404, code: 'PGRST202' });
      const argSql = keys.map((k, i) => `${qi(k)} => $${i + 1}`).join(', ');
      const vals = keys.map(k => (args[k] !== null && typeof args[k] === 'object') ? JSON.stringify(args[k]) : args[k]);
      const sql = meta[0].proretset || meta[0].typtype === 'c'
        ? `select coalesce(json_agg(t), '[]'::json) as j from public.${qi(fn)}(${argSql}) t`
        : `select to_json(public.${qi(fn)}(${argSql})) as j`;
      const out = await withRole(claims, c => c.query(sql, vals));
      let j = out.rows[0].j;
      if (meta[0].typtype === 'c' && !meta[0].proretset && Array.isArray(j)) j = j[0] ?? null;
      return send(res, 200, JSON.stringify(j ?? null));
    }
    const table = parts[0];
    const a = 'a0';
    const sub = {};
    for (const [k, v] of url.searchParams) {
      const m = k.match(/^(\w+)\.(order|limit)$/);
      if (m) { sub[m[1]] = sub[m[1]] || {}; sub[m[1]][m[2]] = v; }
    }
    const sel = parseSelect(url.searchParams.get('select') || '*');
    const params = [];
    if (req.method === 'GET' || req.method === 'HEAD') {
      const where = whereFrom(url, a, params);
      const ord = url.searchParams.get('order') ? ' order by ' + parseOrder(url.searchParams.get('order'), a) : '';
      const lim = url.searchParams.get('limit') ? ` limit ${Number(url.searchParams.get('limit'))}` : ` limit ${Number(process.env.MAX_ROWS || 1000)}`;
      const off = url.searchParams.get('offset') ? ` offset ${Number(url.searchParams.get('offset'))}` : '';
      const sql = `select coalesce(json_agg(t), '[]'::json) as j from (select ${buildSelect(table, sel, a, { sub })} from public.${qi(table)} ${a}${where}${ord}${lim}${off}) t`;
      const out = await withRole(claims, c => c.query(sql, params));
      const rows = out.rows[0].j;
      if (wantObject) {
        if (rows.length !== 1) return send(res, 406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: `The result contains ${rows.length} rows`, hint: null });
        return send(res, 200, rows[0]);
      }
      return send(res, 200, rows, { 'Content-Range': `0-${Math.max(rows.length - 1, 0)}/*` });
    }
    let sql;
    if (req.method === 'POST') {
      const body = await readBody(req);
      const arr = Array.isArray(body) ? body : [body];
      const keys = [...new Set(arr.flatMap(o => Object.keys(o)))];
      const cols = keys.map(qi).join(', ');
      params.push(JSON.stringify(arr));
      const onConflict = url.searchParams.get('on_conflict');
      let conflict = '';
      if (prefer.includes('resolution=merge-duplicates')) {
        const tgt = onConflict ? onConflict.split(',').map(qi).join(', ') : 'id';
        const upd = keys.filter(k => !(onConflict || 'id').split(',').includes(k)).map(k => `${qi(k)} = excluded.${qi(k)}`).join(', ');
        conflict = ` on conflict (${tgt}) do ${upd ? 'update set ' + upd : 'nothing'}`;
      } else if (prefer.includes('resolution=ignore-duplicates')) {
        conflict = ` on conflict do nothing`;
      }
      sql = `insert into public.${qi(table)} as ${a} (${cols}) select ${cols} from json_populate_recordset(null::public.${qi(table)}, $1)${conflict} returning ${buildSelect(table, sel, a, { sub })}`;
    } else if (req.method === 'PATCH') {
      const body = await readBody(req);
      params.push(JSON.stringify(body));
      const sets = Object.keys(body).map(k => `${qi(k)} = (json_populate_record(null::public.${qi(table)}, $1)).${qi(k)}`).join(', ');
      sql = `update public.${qi(table)} ${a} set ${sets}${whereFrom(url, a, params)} returning ${buildSelect(table, sel, a, { sub })}`;
    } else if (req.method === 'DELETE') {
      sql = `delete from public.${qi(table)} ${a}${whereFrom(url, a, params)} returning ${buildSelect(table, sel, a, { sub })}`;
    } else return send(res, 405, { message: 'method' });
    const out = await withRole(claims, c => c.query(`with r as (${sql}) select coalesce(json_agg(r), '[]'::json) as j from r`, params));
    const rows = out.rows[0].j;
    if (!prefer.includes('return=representation')) return send(res, req.method === 'POST' ? 201 : 204);
    if (wantObject) {
      if (rows.length !== 1) return send(res, 406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: `The result contains ${rows.length} rows`, hint: null });
      return send(res, req.method === 'POST' ? 201 : 200, rows[0]);
    }
    return send(res, req.method === 'POST' ? 201 : 200, rows);
  } catch (e) {
    if (process.env.MOCK_DEBUG) console.error('REST error', req.method, url.href, e.message);
    return pgErr(res, e);
  }
}

/* ---------- Management API (admin panel) ---------- */
async function handleMgmt(req, res) {
  const { query } = await readBody(req);
  const client = await pool.connect();
  try {
    const r = await client.query(query);
    const last = Array.isArray(r) ? r[r.length - 1] : r;
    send(res, 201, last.rows || []);
  } catch (e) {
    send(res, 400, { message: `Failed to run sql query: ERROR: ${e.message}` });
  } finally { client.release(); }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  if (req.method === 'OPTIONS') return send(res, 204);
  try {
    if (url.pathname.startsWith('/auth/v1')) return await handleAuth(req, res, url);
    if (url.pathname.startsWith('/rest/v1/')) return await handleRest(req, res, url);
    if (url.pathname.match(/^\/v1\/projects\/[^/]+\/database\/query$/)) return await handleMgmt(req, res);
    if (url.pathname === '/__reload') { await loadFks(); return send(res, 200, { ok: true }); }
    send(res, 404, { message: 'not found' });
  } catch (e) {
    console.error(e);
    send(res, 500, { message: e.message });
  }
});

await loadFks();
server.listen(PORT, '127.0.0.1', () => console.log('mock supabase on', PORT));
