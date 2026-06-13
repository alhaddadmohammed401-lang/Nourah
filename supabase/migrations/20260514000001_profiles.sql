-- Module 1: profiles
-- One row per auth.users row. Holds the onboarding answers (skin type, concerns) and
-- display fields (name, phone, locale). Auto-created on user signup via trigger so the
-- app can always select a profile row immediately after auth.

create type public.skin_type as enum ('oily', 'dry', 'combination', 'normal', 'sensitive');
create type public.app_locale as enum ('ar', 'en');

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  phone       text,
  skin_type   public.skin_type,
  concerns    text[] not null default '{}',
  locale      public.app_locale not null default 'ar',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index profiles_created_at_idx on public.profiles (created_at desc);

-- Trigger: bump updated_at on every UPDATE
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.tg_set_updated_at();

-- Trigger: create an empty profile row whenever a new auth user is inserted.
-- Reads name/phone from raw_user_meta_data so the existing signUp() call (which writes
-- to user_metadata) keeps working without code changes.
create or replace function public.tg_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.tg_handle_new_user();

-- RLS: owners only.
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No INSERT policy: rows are only ever created by the on_auth_user_created trigger
-- (which runs as security definer). Direct client inserts are not allowed.
-- No DELETE policy: profiles are cleaned up by the ON DELETE CASCADE from auth.users.
