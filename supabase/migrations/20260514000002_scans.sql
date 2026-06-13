-- Module 2: scans
-- Stores face-scan results. Schema mirrors the ScanResult type in services/scanService.ts
-- so the frontend can `select *` and use the row directly.

create type public.pores_score as enum ('small', 'medium', 'large');
create type public.score_band as enum ('green', 'amber', 'red');
create type public.routine_type as enum ('oily', 'dry', 'combination');

create table public.scans (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  hydration_score     int  not null check (hydration_score between 0 and 100),
  pores_score         public.pores_score not null,
  pigmentation_score  int  not null check (pigmentation_score between 0 and 100),
  acne_count          int  not null check (acne_count >= 0),
  overall_score       int  not null check (overall_score between 0 and 100),
  band                public.score_band not null,
  gcc_flags           text[] not null default '{}',
  routine_type        public.routine_type not null,
  image_path          text,                          -- storage key in scan-images bucket; null if no image was uploaded
  created_at          timestamptz not null default now()
);

-- "latest scan for user" is the hottest query.
create index scans_user_created_idx on public.scans (user_id, created_at desc);

alter table public.scans enable row level security;

create policy "scans_select_own"
  on public.scans for select
  using (auth.uid() = user_id);

-- Direct INSERT from the client is allowed (lets us seed test data during dev). The
-- scan-analyze edge function uses the service role anyway and bypasses RLS.
create policy "scans_insert_own"
  on public.scans for insert
  with check (auth.uid() = user_id);

-- No UPDATE/DELETE policies: scans are immutable history.
