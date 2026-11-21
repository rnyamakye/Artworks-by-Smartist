# Applying patch 03 (admin hardening + Next.js upgrade)

Order matters.

1. **Give your real admin account the role** (SQL editor, your real admin email), then sign out and back in:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'YOUR_ADMIN_EMAIL';
   ```
   The email fallback being removed may be the only thing making you admin today.
2. **Run** `20261120000000_admin_hardening_v2.sql` (SQL editor or `supabase db push`). It refuses to run if no user has the role.
3. **Code:** from the repo root: `git apply 03-admin-hardening-and-next-upgrade.patch && npm ci`
4. **Supabase dashboard:** turn OFF "Allow new users to sign up"; set a 12+ character minimum password.
5. **Rotate the password** of the old admin account if it was ever `password123`.
6. Redeploy, then log in at /8392-admin and check: add an artwork, view messages, open Commissions.

Notes
- The commission form inserts columns (name, email, subject, ...) that your migrations don't create, so your live database has drifted from the repo. Export the live schema (`supabase db pull`) so migrations can reproduce it.
- Run the migration on a Supabase branch or copy first if you can; I tested against a reconstruction of your schema, not the live database.
