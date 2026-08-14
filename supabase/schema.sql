-- Zone Manager — Supabase sxemasi (Postgres)
-- Idempotent: qayta ishga tushirish mumkin.

create table if not exists public.zones (
  id bigint generated always as identity primary key,
  name text not null,
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

create table if not exists public.sessions (
  id bigint generated always as identity primary key,
  table_id bigint not null references public.tables(id) on delete cascade,
  mode text not null default 'stopwatch',
  rate numeric,
  start_time timestamptz not null default now(),
  duration_sec int,
  created_at timestamptz not null default now()
);

create table if not exists public.session_products (
  id bigint generated always as identity primary key,
  session_id bigint not null references public.sessions(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  quantity int not null default 1,
  price numeric,
  created_at timestamptz not null default now()
);

-- RLS: faqat tizimga kirgan foydalanuvchilar
alter table public.zones enable row level security;
alter table public.tables enable row level security;
alter table public.products enable row level security;
alter table public.sessions enable row level security;
alter table public.session_products enable row level security;

drop policy if exists "auth_all_zones" on public.zones;
create policy "auth_all_zones" on public.zones for all to authenticated using (true) with check (true);
drop policy if exists "auth_all_tables" on public.tables;
create policy "auth_all_tables" on public.tables for all to authenticated using (true) with check (true);
drop policy if exists "auth_all_products" on public.products;
create policy "auth_all_products" on public.products for all to authenticated using (true) with check (true);
drop policy if exists "auth_all_sessions" on public.sessions;
create policy "auth_all_sessions" on public.sessions for all to authenticated using (true) with check (true);
drop policy if exists "auth_all_session_products" on public.session_products;
create policy "auth_all_session_products" on public.session_products for all to authenticated using (true) with check (true);

-- Realtime
alter publication supabase_realtime add table public.zones;
alter publication supabase_realtime add table public.tables;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.session_products;

-- Seed: Asosiy floor, 2 billiard + 2 tennis stol, 6 mahsulot (faqat baza bo'sh bo'lsa)
do $$
begin
  if not exists (select 1 from public.zones) then
    insert into public.zones (name, sort_order) values ('Asosiy floor', 0);
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