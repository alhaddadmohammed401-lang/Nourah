-- Async scan pipeline.
-- YouCam Skin Analysis takes 30–90s, longer than is comfortable for a synchronous edge
-- function. We now insert a 'pending' scan row up front, return it immediately, and
-- update it once the scan-status function confirms YouCam is done.

create type public.scan_status as enum ('pending', 'complete', 'failed');

alter table public.scans
  add column status      public.scan_status not null default 'complete',
  add column task_id     text,
  add column error       text;

-- Existing rows were synchronous and successful. Leave them as 'complete' (the default).
-- Index on (user_id, status) lets the polling hook quickly find pending scans.
create index scans_user_status_idx on public.scans (user_id, status)
  where status = 'pending';

-- Relax the not-null constraints on score columns so a pending row can be inserted
-- before YouCam has returned any numbers. Scores get filled in when status flips to
-- 'complete'. The CHECK constraints stay in place — they're skipped for NULL values.
alter table public.scans
  alter column hydration_score    drop not null,
  alter column pores_score        drop not null,
  alter column pigmentation_score drop not null,
  alter column acne_count         drop not null,
  alter column overall_score      drop not null,
  alter column band               drop not null,
  alter column routine_type       drop not null;
