create policy "authenticated upload site assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('talent-photos', 'partner-logos', 'image-slots', 'og-images')
);

create policy "authenticated update site assets"
on storage.objects for update
to authenticated
using (
  bucket_id in ('talent-photos', 'partner-logos', 'image-slots', 'og-images')
)
with check (
  bucket_id in ('talent-photos', 'partner-logos', 'image-slots', 'og-images')
);

create policy "authenticated delete site assets"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('talent-photos', 'partner-logos', 'image-slots', 'og-images')
);
