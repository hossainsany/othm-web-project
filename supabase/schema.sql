-- Local Bakery Co. Supabase schema
-- Run this file in the Supabase dashboard: SQL Editor -> New query -> Run.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  available boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists menu_items_category_name_key
  on public.menu_items (category, name);

create index if not exists menu_items_public_order_idx
  on public.menu_items (available, category, sort_order);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Keep updated_at accurate
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at
  before update on public.contact_messages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.menu_items enable row level security;
alter table public.contact_messages enable row level security;

-- The public site may read available menu items, but only signed-in staff can
-- create, update or delete them.
drop policy if exists "Public menu items are readable" on public.menu_items;
create policy "Public menu items are readable"
  on public.menu_items for select
  to anon, authenticated
  using (available = true);

drop policy if exists "Authenticated users manage menu items" on public.menu_items;
create policy "Authenticated users manage menu items"
  on public.menu_items for all
  to authenticated
  using (true)
  with check (true);

-- Anyone may send a contact message. Only signed-in staff can read, update or
-- delete messages.
drop policy if exists "Anyone can send a contact message" on public.contact_messages;
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "Authenticated users read contact messages" on public.contact_messages;
create policy "Authenticated users read contact messages"
  on public.contact_messages for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users update contact messages" on public.contact_messages;
create policy "Authenticated users update contact messages"
  on public.contact_messages for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users delete contact messages" on public.contact_messages;
create policy "Authenticated users delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on table public.menu_items to anon;
grant insert on table public.contact_messages to anon;
grant select, insert, update, delete on table public.menu_items to authenticated;
grant select, insert, update, delete on table public.contact_messages to authenticated;

-- ---------------------------------------------------------------------------
-- Seed menu (safe to re-run)
-- ---------------------------------------------------------------------------

insert into public.menu_items (category, name, description, price, sort_order, available)
values
  ('Bread', 'Country sourdough', 'Our signature loaf, with a crisp crust and soft center.', 7.00, 1, true),
  ('Bread', 'Seeded whole wheat', 'A hearty loaf with sunflower, flax and sesame seeds.', 7.50, 2, true),
  ('Bread', 'French baguette', 'Golden, crackly crust. A good friend to any soup.', 4.00, 3, true),
  ('Bread', 'Rosemary focaccia', 'Olive oil, fresh rosemary and a sprinkle of sea salt.', 5.00, 4, true),
  ('Pastries', 'Butter croissant', 'Flaky layers, cultured butter and nothing extra.', 3.50, 1, true),
  ('Pastries', 'Cinnamon bun', 'Soft swirls of cinnamon with vanilla icing.', 4.00, 2, true),
  ('Pastries', 'Blueberry muffin', 'Juicy blueberries and a crumbly sugar top.', 3.25, 3, true),
  ('Pastries', 'Pain au chocolat', 'Buttery pastry wrapped around dark chocolate.', 4.00, 4, true),
  ('Cakes', 'Chocolate cake slice', 'Rich cocoa sponge with a silky chocolate frosting.', 5.50, 1, true),
  ('Cakes', 'Carrot cake slice', 'Gently spiced, with walnuts and cream cheese frosting.', 7.50, 2, true)
on conflict (category, name) do nothing;

-- Ask PostgREST to refresh its schema cache after creating the tables.
notify pgrst, 'reload schema';
