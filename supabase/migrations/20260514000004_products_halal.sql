-- Module 5: products & halal lookup
-- Two tables:
--   halal_ingredient_rules — curated blocklist/allowlist of skincare ingredients.
--   products_cache         — Open Food Facts results cached per barcode so repeat scans
--                            don't hit the upstream API.
-- Both are public-read; writes are service-role only (product-lookup edge function).

create type public.halal_verdict as enum ('halal', 'haram', 'doubtful', 'unknown');

create table public.halal_ingredient_rules (
  ingredient   text primary key,
  verdict      public.halal_verdict not null,
  reason       text,
  source       text,
  updated_at   timestamptz not null default now()
);

create trigger halal_ingredient_rules_set_updated_at
  before update on public.halal_ingredient_rules
  for each row execute function public.tg_set_updated_at();

create table public.products_cache (
  barcode              text primary key,
  name                 text,
  brand                text,
  ingredients          text[] not null default '{}',
  halal_verdict        public.halal_verdict not null default 'unknown',
  flagged_ingredients  text[] not null default '{}',
  fetched_at           timestamptz not null default now()
);

create index products_cache_fetched_at_idx on public.products_cache (fetched_at desc);

alter table public.halal_ingredient_rules enable row level security;
alter table public.products_cache enable row level security;

-- Anyone authenticated can read product data (it's not user-specific).
create policy "halal_rules_select_all"
  on public.halal_ingredient_rules for select
  using (auth.role() = 'authenticated');

create policy "products_cache_select_all"
  on public.products_cache for select
  using (auth.role() = 'authenticated');

-- No INSERT/UPDATE/DELETE policies; service role bypasses RLS for writes.
