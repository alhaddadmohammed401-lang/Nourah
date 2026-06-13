-- Module 4: routines
-- Cached Gemini output keyed by (user_id, scan_id). Each scan gets one routine; if the
-- user re-scans, a new routine is generated. AM/PM steps stored as JSONB so the
-- structured Gemini output lands intact.

create table public.routines (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  scan_id     uuid not null references public.scans(id) on delete cascade,
  am_steps    jsonb not null,
  pm_steps    jsonb not null,
  skin_band   public.score_band not null,
  is_premium  boolean not null default false,
  created_at  timestamptz not null default now(),

  unique (user_id, scan_id)
);

create index routines_user_created_idx on public.routines (user_id, created_at desc);

alter table public.routines enable row level security;

create policy "routines_select_own"
  on public.routines for select
  using (auth.uid() = user_id);

-- Inserts only happen from the routine-generate edge function (service role).
-- No client-facing INSERT/UPDATE/DELETE policies.
