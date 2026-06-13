-- Module 6: subscriptions
-- One row per user, updated by the revenuecat-webhook edge function. The frontend reads
-- `is_premium` to gate routine premium content and any future paid features.

create table public.subscriptions (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  revenuecat_user_id   text,
  is_premium           boolean not null default false,
  entitlement          text,            -- "pro_monthly", "pro_annual", etc.
  expires_at           timestamptz,
  last_event           text,            -- RevenueCat event type that produced the current state
  updated_at           timestamptz not null default now()
);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.tg_set_updated_at();

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Writes happen exclusively from the revenuecat-webhook edge function (service role).
