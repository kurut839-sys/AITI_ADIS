# IT ADIS

Сайт образовательного центра IT ADIS на React и Vite.

## Запуск

```sh
npm install
npm run dev
```

Для сборки production-версии выполните `npm run build`.

## Язык и тема

Язык интерфейса переключается кнопками **KG / RU**, а цветовая схема — кнопкой
с солнцем или луной. Выбранные настройки сохраняются в браузере.

## Supabase

Скопируйте `.env.example` в `.env` и укажите параметры проекта:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Для создания таблиц и хранилища выполните `supabase/schema.sql` в SQL Editor
вашего проекта Supabase.

## Вход через Google

Настройка: [supabase/GOOGLE_AUTH.md](supabase/GOOGLE_AUTH.md). Панель: /AITI_ADIS/admin.

## Индексация в Google

После публикации добавьте URL-prefix property
`https://kurut839-sys.github.io/AITI_ADIS/` в
[Google Search Console](https://search.google.com/search-console), подтвердите
владение сайтом и отправьте sitemap:
`https://kurut839-sys.github.io/AITI_ADIS/sitemap.xml`.

Google сам определяет сроки и позиции индексации; добавление sitemap не
гарантирует немедленное появление сайта в результатах поиска.
