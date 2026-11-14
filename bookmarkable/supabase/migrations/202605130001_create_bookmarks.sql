create extension if not exists pgcrypto;

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  description text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.bookmarks enable row level security;

create policy "Bookmarks are readable by owner"
  on public.bookmarks
  for select
  using (auth.uid() = user_id);

create policy "Bookmarks are insertable by owner"
  on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

create policy "Bookmarks are updatable by owner"
  on public.bookmarks
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Bookmarks are deletable by owner"
  on public.bookmarks
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_bookmarks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_bookmarks_updated_at on public.bookmarks;

create trigger set_bookmarks_updated_at
before update on public.bookmarks
for each row
execute function public.set_bookmarks_updated_at();
