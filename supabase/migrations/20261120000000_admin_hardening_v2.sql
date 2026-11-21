-- ============================================================================
-- Admin hardening v2
--  1. is_admin(): remove the hardcoded-email fallbacks; pin search_path
--  2. Constrain visitor inserts (contact, newsletter, testimonials, commissions)
--  3. Give the real admin access to commissions, orders and the invoices bucket
--  4. Limit size/type of uploads to the images bucket
--
-- BEFORE RUNNING: your admin account must carry the role in app_metadata
-- (the email fallback this removes may be the only thing making you admin):
--
--   update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
--   where email = 'YOUR_ADMIN_EMAIL';
--
-- then sign out and back in. This file refuses to run if no such user exists.
-- ============================================================================

do $$
begin
  if not exists (select 1 from auth.users where raw_app_meta_data ->> 'role' = 'admin') then
    raise exception 'No user has app_metadata role=admin. Set it on your admin account first (see top of file), or you will lose admin access.';
  end if;
end $$;

-- 1. is_admin(): service role, the app_metadata role claim, or a row in public.admins by user id.
--    No email matching: emails are not a safe identity.
create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select auth.role()) = 'service_role' then
    return true;
  end if;
  if coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin' then
    return true;
  end if;
  return exists (select 1 from public.admins a where a.id = (select auth.uid()));
end;
$$;

-- 2. Visitor inserts: constrained, never able to set moderation/status fields
drop policy if exists "Anyone can send contact messages" on public.contact_messages;
create policy "Anyone can send contact messages" on public.contact_messages
  for insert with check (
    status = 'unread'
    and char_length(name) between 1 and 200
    and char_length(email) between 3 and 320
    and char_length(message) between 1 and 5000
    and (subject is null or char_length(subject) <= 300)
  );

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (
    char_length(email) between 3 and 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

drop policy if exists "Anyone can submit a testimonial" on public.testimonials;
create policy "Anyone can submit a testimonial" on public.testimonials
  for insert with check (
    coalesce(approved, false) = false
    and coalesce(status, 'pending') = 'pending'
    and char_length(coalesce(text, '')) between 1 and 2000
    and char_length(coalesce(name, '')) between 1 and 200
  );

drop policy if exists "Anyone can submit a commission" on public.commissions;
create policy "Anyone can submit a commission" on public.commissions
  for insert with check (status = 'pending' and user_id is null);

-- 3. Real admin access (these were service_role-only, so the admin pages could not read/write them)
drop policy if exists "Admins can manage commissions" on public.commissions;
create policy "Admins can manage commissions" on public.commissions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can upload invoices" on storage.objects;
drop policy if exists "Admins can manage invoices" on storage.objects;
create policy "Admins can manage invoices" on storage.objects
  for all using (bucket_id = 'invoices' and public.is_admin())
  with check (bucket_id = 'invoices' and public.is_admin());

-- 4. Upload limits for the public images bucket
update storage.buckets
set file_size_limit = 10485760,  -- 10 MB
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif']
where id = 'images';
