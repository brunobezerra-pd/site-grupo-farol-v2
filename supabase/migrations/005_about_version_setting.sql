insert into public.site_settings (key, value)
values ('about_version', 'v1')
on conflict (key) do nothing;
