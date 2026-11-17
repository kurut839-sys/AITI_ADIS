-- Run this file once in the Supabase SQL Editor.

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  experience text not null,
  specialty text not null,
  description text not null default '',
  photo_path text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  description text not null default '',
  photo_path text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.site_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

alter table public.site_admins enable row level security;
alter table public.teachers enable row level security;
alter table public.certificates enable row level security;

grant select on public.teachers, public.certificates to anon, authenticated;
grant insert, update, delete on public.teachers, public.certificates to authenticated;
grant select, insert, delete on public.site_admins to authenticated;

drop policy if exists "Published content and admins can read teachers" on public.teachers;
create policy "Published content and admins can read teachers"
  on public.teachers for select to anon, authenticated
  using (published or public.is_site_admin());

drop policy if exists "Admins can insert teachers" on public.teachers;
create policy "Admins can insert teachers"
  on public.teachers for insert to authenticated
  with check (public.is_site_admin());

drop policy if exists "Admins can update teachers" on public.teachers;
create policy "Admins can update teachers"
  on public.teachers for update to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "Admins can delete teachers" on public.teachers;
create policy "Admins can delete teachers"
  on public.teachers for delete to authenticated
  using (public.is_site_admin());

drop policy if exists "Published content and admins can read certificates" on public.certificates;
create policy "Published content and admins can read certificates"
  on public.certificates for select to anon, authenticated
  using (published or public.is_site_admin());

drop policy if exists "Admins can insert certificates" on public.certificates;
create policy "Admins can insert certificates"
  on public.certificates for insert to authenticated
  with check (public.is_site_admin());

drop policy if exists "Admins can update certificates" on public.certificates;
create policy "Admins can update certificates"
  on public.certificates for update to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "Admins can delete certificates" on public.certificates;
create policy "Admins can delete certificates"
  on public.certificates for delete to authenticated
  using (public.is_site_admin());

drop policy if exists "Admins can view administrators" on public.site_admins;
create policy "Admins can view administrators"
  on public.site_admins for select to authenticated
  using (public.is_site_admin());

drop policy if exists "Admins can appoint administrators" on public.site_admins;
create policy "Admins can appoint administrators"
  on public.site_admins for insert to authenticated
  with check (public.is_site_admin());

drop policy if exists "Admins can remove administrators" on public.site_admins;
create policy "Admins can remove administrators"
  on public.site_admins for delete to authenticated
  using (public.is_site_admin());

create or replace function public.prevent_last_site_admin_removal()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.site_admins) <= 1 then
    raise exception 'At least one site administrator must remain';
  end if;
  return old;
end;
$$;

drop trigger if exists keep_one_site_admin on public.site_admins;
create trigger keep_one_site_admin
  before delete on public.site_admins
  for each row execute function public.prevent_last_site_admin_removal();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

grant select on storage.objects to anon, authenticated;
grant insert, update, delete on storage.objects to authenticated;
grant usage on schema storage to anon, authenticated;

drop policy if exists "Public can view site media" on storage.objects;
create policy "Public can view site media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media');

drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and public.is_site_admin())
  with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and public.is_site_admin());

-- Bootstrap the first administrator only after their account exists in Auth:
-- insert into public.site_admins (user_id) values ('AUTH_USER_UUID');
-- Future administrator transfers are managed from /admin.
