-- Zone Manager — Supabase sxemasi (Postgres)
-- To'liq va idempotent: yangi loyihada ham, mavjud (prod) bazada ham qayta ishga tushirish xavfsiz.

/* ================= JADVALLAR ================= */

create table if not exists public.zones (
  id bigint generated always as identity primary key,
  name text not null,
  owner_id uuid default auth.uid() references auth.users(id) on delete cascade,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tables (
  id bigint generated always as identity primary key,
  zone_id bigint not null references public.zones(id) on delete cascade,
  name text not null,
  sport text not null default 'billiard',
  tariff numeric not null default 0,
  repair boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  zone_id bigint not null references public.zones(id) on delete cascade,
  name text not null,
  price numeric not null default 0,
  icon text not null default 'local_bar',
  sold int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Faol sessiya: end_time IS NULL. duration_sec — faqat taymer (countdown) rejimidagi muddat.
create table if not exists public.sessions (
  id bigint generated always as identity primary key,
  table_id bigint not null references public.tables(id) on delete cascade,
  mode text not null default 'stopwatch',
  rate numeric,
  start_time timestamptz not null default now(),
  duration_sec int,
  end_time timestamptz,
  created_at timestamptz not null default now()
);
alter table public.sessions add column if not exists end_time timestamptz;

create table if not exists public.session_products (
  id bigint generated always as identity primary key,
  session_id bigint not null references public.sessions(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  quantity int not null default 1,
  price numeric,
  created_at timestamptz not null default now()
);

/* Mijozga ruxsat: ro'yxatdan o'tganda 'pending' so'rov yaratiladi (admin panelga keladi).
   pending  — sinov muddati (trial_until) tugaguncha ishlaydi, keyin admin tasdig'ini kutadi
   approved — admin ruxsat bergan, umrbod ishlaydi
   rejected — admin rad etgan / ruxsatni olib qo'ygan */
create table if not exists public.user_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  trial_until timestamptz,
  decided_at timestamptz,
  note text
);

-- Global sozlamalar (faqat admin server o'zgartiradi). trial_days — standart 7 kun; 0 → tasdiqsiz umuman ishlamaydi.
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null
);
insert into public.app_settings (key, value) values ('trial_days', '7') on conflict (key) do nothing;

-- Admin panel login urinishlari (brute-force himoyasi). API orqali ko'rinmaydigan sxemada.
create schema if not exists private;
revoke all on schema private from public;
create table if not exists private.admin_login_attempts (
  ip text primary key,
  fails int not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

/* ================= MA'LUMOTLARNI TOZALASH (unique indekslardan oldin) ================= */

-- Bir sessiyada bir mahsulot bir necha qatorda bo'lsa — birlashtiriladi
with d as (
  select session_id, product_id, min(id) as keep_id, sum(quantity) as q
  from public.session_products group by 1, 2 having count(*) > 1
)
update public.session_products sp set quantity = d.q from d where sp.id = d.keep_id;
delete from public.session_products a using public.session_products b
  where a.session_id = b.session_id and a.product_id = b.product_id and a.id > b.id;

-- Bitta stolda bir nechta faol sessiya bo'lsa — eskilari yopiladi
update public.sessions s set end_time = now()
  where s.end_time is null
    and exists (select 1 from public.sessions s2 where s2.table_id = s.table_id and s2.end_time is null and s2.id > s.id);

/* ================= INDEKSLAR ================= */

create index if not exists zones_owner_id_idx on public.zones (owner_id);
create index if not exists tables_zone_id_idx on public.tables (zone_id);
create index if not exists products_zone_id_idx on public.products (zone_id);
create index if not exists sessions_table_id_idx on public.sessions (table_id);
create index if not exists sessions_end_time_idx on public.sessions (end_time);
create unique index if not exists sessions_one_active_per_table on public.sessions (table_id) where end_time is null;
create index if not exists session_products_product_id_idx on public.session_products (product_id);
create unique index if not exists session_products_session_product_key on public.session_products (session_id, product_id);

/* ================= RUXSAT FUNKSIYALARI ================= */

-- Joriy foydalanuvchi ilovadan foydalana oladimi (bloklanmagan + tasdiqlangan yoki sinov muddati tugamagan)
create or replace function public.has_access()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_access a
    join auth.users u on u.id = a.user_id
    where a.user_id = auth.uid()
      and (u.banned_until is null or u.banned_until <= now())
      and (a.status = 'approved' or (a.status = 'pending' and a.trial_until > now()))
  );
$$;

create or replace function public.trial_interval()
returns interval
language sql stable security definer
set search_path = ''
as $$
  select make_interval(days => greatest(coalesce(
    (select (s.value #>> '{}')::int from public.app_settings s where s.key = 'trial_days'), 7), 0));
$$;

-- Yangi foydalanuvchi → adminga so'rov (pending) + sinov muddati
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.user_access (user_id, status, trial_until)
  values (new.id, 'pending', now() + public.trial_interval())
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Ilova har kirishda chaqiradi: so'rov bo'lmasa yaratadi, holatni + server vaqtini qaytaradi
create or replace function public.request_access()
returns json
language plpgsql security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  r json;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  insert into public.user_access (user_id, status, trial_until)
  values (uid, 'pending', now() + public.trial_interval())
  on conflict (user_id) do nothing;
  select json_build_object(
    'status', a.status,
    'trial_until', a.trial_until,
    'requested_at', a.requested_at,
    'decided_at', a.decided_at,
    'banned', coalesce(u.banned_until > now(), false),
    'has_access', public.has_access(),
    'server_time', now()
  ) into r
  from public.user_access a join auth.users u on u.id = a.user_id
  where a.user_id = uid;
  return r;
end;
$$;

/* ================= SESSIYA FUNKSIYALARI (RLS bilan — security invoker) ================= */

-- Taymerni uzaytirish (atomar, bir necha qurilmada ham to'g'ri qo'shiladi)
create or replace function public.extend_session(p_session_id bigint, p_add_sec int)
returns int
language plpgsql
set search_path = ''
as $$
declare d int;
begin
  if p_add_sec is null or p_add_sec < 60 or p_add_sec > 86400 then
    raise exception 'invalid duration' using errcode = '22023';
  end if;
  update public.sessions
     set duration_sec = coalesce(duration_sec, 0) + p_add_sec
   where id = p_session_id and end_time is null and mode = 'countdown'
  returning duration_sec into d;
  if d is null then
    raise exception 'session not active' using errcode = 'P0002';
  end if;
  return d;
end;
$$;

-- Sessiyaga mahsulot qo'shish/ayirish (delta). Narx server tomonda muzlatiladi. Yangi miqdorni qaytaradi.
create or replace function public.add_session_product(p_session_id bigint, p_product_id bigint, p_delta int)
returns int
language plpgsql
set search_path = ''
as $$
declare q int;
begin
  if p_delta is null or p_delta = 0 or abs(p_delta) > 1000 then
    raise exception 'invalid quantity' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.sessions s
    join public.tables t on t.id = s.table_id
    join public.products p on p.zone_id = t.zone_id
    where s.id = p_session_id and s.end_time is null and p.id = p_product_id
  ) then
    raise exception 'session not active or product not in zone' using errcode = 'P0002';
  end if;
  if p_delta > 0 then
    insert into public.session_products as sp (session_id, product_id, quantity, price)
    select p_session_id, p.id, p_delta, p.price from public.products p where p.id = p_product_id
    on conflict (session_id, product_id) do update set quantity = sp.quantity + excluded.quantity
    returning sp.quantity into q;
  else
    update public.session_products sp set quantity = sp.quantity + p_delta
     where sp.session_id = p_session_id and sp.product_id = p_product_id
    returning sp.quantity into q;
    if q is not null and q <= 0 then
      delete from public.session_products sp where sp.session_id = p_session_id and sp.product_id = p_product_id;
      q := 0;
    end if;
  end if;
  return coalesce(q, 0);
end;
$$;

-- Sessiyani yakunlash: server vaqti bilan, sotilgan mahsulotlar hisoblagichini oshiradi
create or replace function public.finish_session(p_session_id bigint)
returns json
language plpgsql
set search_path = ''
as $$
declare e timestamptz;
begin
  update public.sessions set end_time = now()
   where id = p_session_id and end_time is null
  returning end_time into e;
  if e is null then
    raise exception 'session not active' using errcode = 'P0002';
  end if;
  update public.products p set sold = p.sold + x.q
    from (select product_id, sum(quantity)::int as q from public.session_products
           where session_id = p_session_id group by product_id) x
   where p.id = x.product_id;
  return json_build_object('id', p_session_id, 'end_time', e);
end;
$$;

-- Tarix: kunlik jamlar (server tomonda — 1000 qator chegarasiga bog'liq emas)
create or replace function public.history_days(p_tz text default 'UTC')
returns table (day date, time_sum numeric, prod_sum numeric, sessions int)
language sql stable
set search_path = ''
as $$
  with tz as (
    select coalesce((select name from pg_catalog.pg_timezone_names where name = p_tz limit 1), 'UTC') as name
  )
  select (s.end_time at time zone (select name from tz))::date as day,
    sum(coalesce(s.rate, t.tariff, 0) *
        (case when s.mode = 'countdown' and extract(epoch from s.end_time - s.start_time) <= coalesce(s.duration_sec, 0)
              then s.duration_sec
              else greatest(extract(epoch from s.end_time - s.start_time), 0) end) / 3600) as time_sum,
    sum(coalesce((select sum(sp.quantity * coalesce(sp.price, p.price, 0))
                    from public.session_products sp
                    left join public.products p on p.id = sp.product_id
                   where sp.session_id = s.id), 0)) as prod_sum,
    count(*)::int as sessions
  from public.sessions s
  left join public.tables t on t.id = s.table_id
  where s.end_time is not null
  group by 1
  order by 1 desc;
$$;

/* ================= HUQUQLAR ================= */

revoke all on function public.has_access() from public, anon;
revoke all on function public.trial_interval() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.request_access() from public, anon;
revoke all on function public.extend_session(bigint, int) from public, anon;
revoke all on function public.add_session_product(bigint, bigint, int) from public, anon;
revoke all on function public.finish_session(bigint) from public, anon;
revoke all on function public.history_days(text) from public, anon;
grant execute on function public.has_access() to authenticated;
grant execute on function public.request_access() to authenticated;
grant execute on function public.extend_session(bigint, int) to authenticated;
grant execute on function public.add_session_product(bigint, bigint, int) to authenticated;
grant execute on function public.finish_session(bigint) to authenticated;
grant execute on function public.history_days(text) to authenticated;

revoke all on public.app_settings from anon, authenticated;
revoke insert, update, delete, truncate on public.user_access from anon, authenticated;

-- Supabase advisor: event-trigger funksiyasi API orqali chaqirilmasin
do $$
begin
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'rls_auto_enable') then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

/* ================= RLS ================= */

alter table public.zones enable row level security;
alter table public.tables enable row level security;
alter table public.products enable row level security;
alter table public.sessions enable row level security;
alter table public.session_products enable row level security;
alter table public.user_access enable row level security;
alter table public.app_settings enable row level security;

-- Egasi: har bir zona o'z egasiga tegishli — boshqa foydalanuvchi ko'ra/o'zgartira olmaydi
drop policy if exists "auth_all_zones" on public.zones;
drop policy if exists "owner_zones" on public.zones;
create policy "owner_zones" on public.zones for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

drop policy if exists "auth_all_tables" on public.tables;
drop policy if exists "owner_tables" on public.tables;
create policy "owner_tables" on public.tables for all to authenticated
  using (exists (select 1 from public.zones z where z.id = tables.zone_id and z.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.zones z where z.id = tables.zone_id and z.owner_id = (select auth.uid())));

drop policy if exists "auth_all_products" on public.products;
drop policy if exists "owner_products" on public.products;
create policy "owner_products" on public.products for all to authenticated
  using (exists (select 1 from public.zones z where z.id = products.zone_id and z.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.zones z where z.id = products.zone_id and z.owner_id = (select auth.uid())));

drop policy if exists "auth_all_sessions" on public.sessions;
drop policy if exists "owner_sessions" on public.sessions;
create policy "owner_sessions" on public.sessions for all to authenticated
  using (exists (select 1 from public.tables t join public.zones z on z.id = t.zone_id where t.id = sessions.table_id and z.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.tables t join public.zones z on z.id = t.zone_id where t.id = sessions.table_id and z.owner_id = (select auth.uid())));

drop policy if exists "auth_all_session_products" on public.session_products;
drop policy if exists "owner_session_products" on public.session_products;
create policy "owner_session_products" on public.session_products for all to authenticated
  using (exists (select 1 from public.sessions s join public.tables t on t.id = s.table_id join public.zones z on z.id = t.zone_id where s.id = session_products.session_id and z.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.sessions s join public.tables t on t.id = s.table_id join public.zones z on z.id = t.zone_id where s.id = session_products.session_id and z.owner_id = (select auth.uid())));

-- Ruxsat darvozasi (RESTRICTIVE): tasdiqlanmagan / muddati o'tgan / bloklangan foydalanuvchi
-- hech bir jadvalni o'qiy ham, yoza ham olmaydi — frontendni chetlab o'tsa ham.
drop policy if exists "access_gate" on public.zones;
create policy "access_gate" on public.zones as restrictive for all to authenticated
  using ((select public.has_access())) with check ((select public.has_access()));
drop policy if exists "access_gate" on public.tables;
create policy "access_gate" on public.tables as restrictive for all to authenticated
  using ((select public.has_access())) with check ((select public.has_access()));
drop policy if exists "access_gate" on public.products;
create policy "access_gate" on public.products as restrictive for all to authenticated
  using ((select public.has_access())) with check ((select public.has_access()));
drop policy if exists "access_gate" on public.sessions;
create policy "access_gate" on public.sessions as restrictive for all to authenticated
  using ((select public.has_access())) with check ((select public.has_access()));
drop policy if exists "access_gate" on public.session_products;
create policy "access_gate" on public.session_products as restrictive for all to authenticated
  using ((select public.has_access())) with check ((select public.has_access()));

-- Foydalanuvchi faqat o'z ruxsat holatini ko'radi (o'zgartira olmaydi)
drop policy if exists "own_access_read" on public.user_access;
create policy "own_access_read" on public.user_access for select to authenticated
  using (user_id = (select auth.uid()));

/* ================= ADMIN BILDIRISHNOMALARI (Web Push) ================= */
-- Yangi mijoz so'rovi → pg_net → admin server /api/push/notify → admin telefoniga push + ikonkada son.

do $$
begin
  create extension if not exists pg_net;
exception when others then
  raise notice 'pg_net mavjud emas — push hook o''chiq (lokal muhit)';
end $$;

-- Admin qurilmalarining push obunalari (faqat admin server yozadi/o'qiydi)
create table if not exists private.push_subscriptions (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Hook manzili va maxfiy kaliti (qiymatlar deploy paytida yoziladi, repo'da saqlanmaydi)
create table if not exists private.push_config (
  id int primary key default 1 check (id = 1),
  url text not null default '',
  secret text not null default ''
);
insert into private.push_config (id) values (1) on conflict (id) do nothing;
-- Admin so'rovlarni oxirgi marta ko'rgan vaqt: ikonkadagi son = shundan keyingi yangi so'rovlar
alter table private.push_config add column if not exists seen_at timestamptz;

create or replace function public.notify_admin_new_request()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare cfg record;
begin
  select c.url, c.secret into cfg from private.push_config c where c.id = 1;
  if cfg.url is null or cfg.url = '' then
    return new;
  end if;
  begin
    perform net.http_post(
      url := cfg.url,
      body := jsonb_build_object('type', 'new_request', 'user_id', new.user_id),
      headers := jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', cfg.secret),
      timeout_milliseconds := 5000
    );
  exception when others then
    -- bildirishnoma yuborilmasa ham ro'yxatdan o'tish buzilmasin
    raise log 'notify_admin_new_request: %', sqlerrm;
  end;
  return new;
end;
$$;
revoke all on function public.notify_admin_new_request() from public, anon, authenticated;

drop trigger if exists on_access_request_notify on public.user_access;
create trigger on_access_request_notify
  after insert on public.user_access
  for each row when (new.status = 'pending')
  execute function public.notify_admin_new_request();

/* ================= REALTIME ================= */

do $$
declare t text;
begin
  foreach t in array array['zones', 'tables', 'products', 'sessions', 'session_products', 'user_access'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

/* ================= MAVJUD FOYDALANUVCHILAR ================= */

-- Ruxsat tizimi joriy qilinishidan oldin ro'yxatdan o'tganlar — tasdiqlangan (umrbod) hisoblanadi
insert into public.user_access (user_id, status, requested_at, decided_at, note)
select u.id, 'approved', u.created_at, now(), 'Ruxsat tizimidan oldingi mijoz'
from auth.users u
on conflict (user_id) do nothing;

/* ================= SEED (faqat baza bo'sh bo'lsa) ================= */

do $$
begin
  if not exists (select 1 from public.zones) and exists (select 1 from auth.users where email = 'admin@zona.uz') then
    insert into public.zones (name, owner_id, sort_order) values ('Asosiy floor', (select id from auth.users where email = 'admin@zona.uz' limit 1), 0);
    insert into public.tables (zone_id, name, sport, tariff, sort_order) values
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Stol 01', 'billiard', 25000, 0),
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Stol 02', 'billiard', 25000, 1),
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Stol 03', 'tennis', 30000, 2),
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Stol 04', 'tennis', 30000, 3);
    insert into public.products (zone_id, name, price, icon, sold, sort_order) values
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Ko''k choy', 3500, 'emoji_food_beverage', 210, 0),
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Suv', 5000, 'water_drop', 180, 1),
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Hunarmand pivosi', 20000, 'sports_bar', 145, 2),
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Nachos Grande', 20000, 'restaurant', 89, 3),
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Pepsi', 12000, 'local_bar', 96, 4),
      ((select id from public.zones where name = 'Asosiy floor' limit 1), 'Kofe', 10000, 'coffee', 77, 5);
  end if;
end $$;
