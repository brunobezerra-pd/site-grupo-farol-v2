create table if not exists public.talent_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  color text not null default '#d1d362',
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists set_talent_categories_updated_at on public.talent_categories;
create trigger set_talent_categories_updated_at
before update on public.talent_categories
for each row
execute function public.set_updated_at();

alter table public.talent_categories enable row level security;

drop policy if exists "public read" on public.talent_categories;
create policy "public read"
on public.talent_categories for select
using (true);

drop policy if exists "authenticated insert" on public.talent_categories;
create policy "authenticated insert"
on public.talent_categories for insert
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update" on public.talent_categories;
create policy "authenticated update"
on public.talent_categories for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete" on public.talent_categories;
create policy "authenticated delete"
on public.talent_categories for delete
using (auth.role() = 'authenticated');

insert into public.talent_categories (name, color, sort_order)
select category_name, '#d1d362', row_number() over (order by lower(category_name)) - 1
from (
  select distinct trim(category_name) as category_name
  from public.talents
  cross join unnest(coalesce(categories, '{}')) as category_name
  where trim(category_name) <> ''
) categories
on conflict (name) do nothing;
