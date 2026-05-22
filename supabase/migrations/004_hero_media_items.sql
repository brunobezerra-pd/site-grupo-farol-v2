create table if not exists public.hero_media_items (
  id uuid primary key default gen_random_uuid(),
  placement text not null check (placement in ('carousel', 'mobile')),
  media_type text not null check (media_type in ('image', 'video_file', 'video_url', 'embed')),
  source_url text,
  embed_code text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint hero_media_items_source_check check (
    (media_type = 'embed' and embed_code is not null and source_url is null)
    or
    (media_type <> 'embed' and source_url is not null and embed_code is null)
  )
);

create unique index if not exists hero_media_items_single_mobile
on public.hero_media_items (placement)
where placement = 'mobile';

drop trigger if exists set_hero_media_items_updated_at on public.hero_media_items;
create trigger set_hero_media_items_updated_at
before update on public.hero_media_items
for each row
execute function public.set_updated_at();

alter table public.hero_media_items enable row level security;

drop policy if exists "public read" on public.hero_media_items;
create policy "public read"
on public.hero_media_items for select
using (true);

drop policy if exists "authenticated insert" on public.hero_media_items;
create policy "authenticated insert"
on public.hero_media_items for insert
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update" on public.hero_media_items;
create policy "authenticated update"
on public.hero_media_items for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete" on public.hero_media_items;
create policy "authenticated delete"
on public.hero_media_items for delete
using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('hero-media', 'hero-media', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "authenticated upload hero media" on storage.objects;
create policy "authenticated upload hero media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'hero-media');

drop policy if exists "authenticated update hero media" on storage.objects;
create policy "authenticated update hero media"
on storage.objects for update
to authenticated
using (bucket_id = 'hero-media')
with check (bucket_id = 'hero-media');

drop policy if exists "authenticated delete hero media" on storage.objects;
create policy "authenticated delete hero media"
on storage.objects for delete
to authenticated
using (bucket_id = 'hero-media');
