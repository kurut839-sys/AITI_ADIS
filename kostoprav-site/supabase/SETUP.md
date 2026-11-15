# Supabase setup

1. In the Supabase SQL Editor for this project, run [`schema.sql`](./schema.sql).
2. Open `/admin` on the site and create the first owner's personal account. Confirm the email if Supabase requests it.
3. Copy the account UUID shown on the access-not-assigned screen. As the project owner, run this once in the SQL Editor, replacing the placeholder with that UUID:

   ```sql
   insert into public.site_admins (user_id)
   values ('AUTH_USER_UUID');
   ```

4. Return to `/admin` and choose **Проверить права доступа**. The first owner can now add, edit, publish, and delete teachers and certificates.
5. To transfer access, the new owner creates a separate account at `/admin` and confirms their email. In **Администраторы**, the current owner adds the new account's UUID. After the new owner verifies access, sign in as the new owner and remove the previous owner from the administrator list. The database prevents removing the last administrator.

The browser uses only the Supabase publishable key from `.env.local`; never put a `service_role` key in frontend code. Row-level security limits content changes and media uploads to administrator accounts. Public pages can read only published content and public images.

For deployment, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the hosting provider's environment settings and rebuild the site. Configure the host's SPA fallback so direct requests to `/admin` serve `index.html`.

In Supabase Auth URL Configuration, allow the site's origin and the `/admin` redirect URL for both local development and the deployed site. Configure email delivery/verification in Supabase Auth before handing the panel to the site owner.
