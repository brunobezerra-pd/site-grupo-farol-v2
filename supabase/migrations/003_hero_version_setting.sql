insert into public.site_settings (key, value)
values ('hero_version', 'v1')
on conflict (key) do nothing;
