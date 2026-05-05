create extension if not exists pgcrypto;

create table if not exists public.talents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  photo_url text,
  photo_pending boolean default false,
  instagram_url text,
  tiktok_url text,
  featured boolean default false,
  categories text[] default '{}',
  followers_range text,
  civil_status text,
  has_children boolean,
  dietary_restriction text,
  has_pet text,
  location text,
  birth_date date,
  gender text,
  lgbtqia boolean,
  of_age boolean,
  created_at timestamptz default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  logo_url text not null,
  sort_order integer,
  created_at timestamptz default now()
);

create table if not exists public.image_slots (
  id uuid primary key default gen_random_uuid(),
  slot_key text unique not null,
  image_url text,
  enabled boolean default true,
  label text,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

create or replace function public.keepalive()
returns integer
language sql
security definer
set search_path = public
as $$
  select 1;
$$;

alter table public.talents enable row level security;
alter table public.partners enable row level security;
alter table public.image_slots enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public read" on public.talents;
create policy "public read"
on public.talents for select
using (true);

drop policy if exists "authenticated insert" on public.talents;
create policy "authenticated insert"
on public.talents for insert
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update" on public.talents;
create policy "authenticated update"
on public.talents for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete" on public.talents;
create policy "authenticated delete"
on public.talents for delete
using (auth.role() = 'authenticated');

drop policy if exists "public read" on public.partners;
create policy "public read"
on public.partners for select
using (true);

drop policy if exists "authenticated insert" on public.partners;
create policy "authenticated insert"
on public.partners for insert
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update" on public.partners;
create policy "authenticated update"
on public.partners for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete" on public.partners;
create policy "authenticated delete"
on public.partners for delete
using (auth.role() = 'authenticated');

drop policy if exists "public read" on public.image_slots;
create policy "public read"
on public.image_slots for select
using (true);

drop policy if exists "authenticated insert" on public.image_slots;
create policy "authenticated insert"
on public.image_slots for insert
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update" on public.image_slots;
create policy "authenticated update"
on public.image_slots for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete" on public.image_slots;
create policy "authenticated delete"
on public.image_slots for delete
using (auth.role() = 'authenticated');

drop policy if exists "public read" on public.site_settings;
create policy "public read"
on public.site_settings for select
using (true);

drop policy if exists "authenticated insert" on public.site_settings;
create policy "authenticated insert"
on public.site_settings for insert
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update" on public.site_settings;
create policy "authenticated update"
on public.site_settings for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete" on public.site_settings;
create policy "authenticated delete"
on public.site_settings for delete
using (auth.role() = 'authenticated');

insert into public.image_slots (slot_key, image_url, enabled, label)
values
  ('about_image', '', true, 'About image'),
  ('hero_bg', '', true, 'Hero background')
on conflict (slot_key) do update
set
  image_url = excluded.image_url,
  enabled = excluded.enabled,
  label = excluded.label;

insert into public.site_settings (key, value)
values
  ('hero_button_enabled', 'true'),
  ('hero_button_label', ''),
  ('hero_button_url', ''),
  ('marquee_count', '12'),
  ('talents_button_enabled', 'true'),
  ('contact_button_label', ''),
  ('contact_button_url', ''),
  ('seo_title', ''),
  ('seo_description', ''),
  ('og_title', ''),
  ('og_description', ''),
  ('og_image_url', ''),
  ('script_head', ''),
  ('script_body', ''),
  ('script_footer', '')
on conflict (key) do update
set value = excluded.value;
