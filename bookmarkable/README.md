# Bookmarkable

A React Native + Expo + Expo Router bookmarks app backed by Supabase Auth and Postgres.

## Features

- Home, login, and register screens
- Protected bookmarks area
- View, add, edit, and delete bookmark flows
- Responsive layout for phones and desktop web
- Local Supabase migration for the `bookmarks` table and RLS policies

## Setup

1. Install dependencies.

   ```bash
   npm install
   ```

2. Create a local env file from [.env.example](.env.example) with your Supabase URL and anon key.

3. Apply the migration in [supabase/migrations/202605130001_create_bookmarks.sql](supabase/migrations/202605130001_create_bookmarks.sql) to your Supabase project.

4. Start the app.

   ```bash
   npm run web
   ```

## Supabase

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

The app stores session data with AsyncStorage on native and localStorage on web.

## Scripts

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
