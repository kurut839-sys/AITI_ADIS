# Вход администратора через Google

1. Создайте проект Supabase. Выполните supabase/schema.sql в SQL Editor.
2. В корне проекта создайте .env.local на основе .env.example. Укажите Supabase URL и publishable key. Перезапустите npm run dev. Не используйте service_role key во фронтенде.
3. В Google Cloud → Google Auth Platform настройте Branding и Audience. В режиме Testing добавьте свой Gmail в Test users. Создайте OAuth Client типа Web application.
4. В Authorized JavaScript origins добавьте http://127.0.0.1:5173 и origin опубликованного сайта (без пути /AITI_ADIS/).
5. В Supabase Authentication → Sign In / Providers → Google скопируйте Callback URL. Добавьте его в Google OAuth Client → Authorized redirect URIs. Обычно это https://PROJECT_ID.supabase.co/auth/v1/callback.
6. Включите Google provider в Supabase и сохраните Google Client ID и Client Secret в настройках провайдера. Client Secret не добавляйте в код сайта. Достаточно scopes openid, email, profile; доступ к письмам Gmail не требуется.
7. В Supabase Authentication → URL Configuration добавьте Redirect URLs:
   - http://127.0.0.1:5173/AITI_ADIS/admin
   - http://localhost:5173/AITI_ADIS/admin (если используете localhost)
   - https://ВАШ-ДОМЕН/AITI_ADIS/admin (адрес опубликованного сайта)
   В Site URL укажите адрес опубликованного сайта. Если используете localhost, добавьте также http://localhost:5173 в Google Authorized JavaScript origins.
8. Откройте http://127.0.0.1:5173/AITI_ADIS/admin и нажмите «Войти через Google». После входа отобразится UUID аккаунта.
9. Первого администратора назначает владелец Supabase: выполните в SQL Editor показанный на экране SQL с UUID своего аккаунта. Затем нажмите «Проверить права доступа».
10. Во вкладках «Преподаватели» и «Сертификаты» меняйте данные, загружайте фото и нажимайте «Опубликовать». Других администраторов можно назначить во вкладке «Администраторы» после их первого входа.

Вход через Google сам по себе не выдаёт права редактирования. Политики RLS из schema.sql защищают данные и загрузку файлов.

Хостинг должен отдавать index.html при открытии /AITI_ADIS/admin.

Официальная инструкция: https://supabase.com/docs/guides/auth/social-login/auth-google