-- A/B/C landing-page test counter.
-- Deliberately PII-free: stores only the variant, the event type, an
-- anonymous per-browser id, and a timestamp. No email, no IP, no UA.
-- Lead capture (if ever wanted) belongs in a separate, RLS-guarded table.

create table if not exists public.ab_events (
  id          bigint generated always as identity primary key,
  variant     text        not null check (variant in ('A', 'B', 'C')),
  event_type  text        not null check (event_type in ('impression', 'conversion')),
  session_id  text        not null check (char_length(session_id) between 8 and 64),
  created_at  timestamptz not null default now()
);

-- One impression row per (session, variant) — a reload must not inflate the
-- denominator. Conversions are intentionally not deduped here; a visitor
-- clicking signup twice is still one conversion, deduped client-side by sid.
create unique index if not exists ab_events_one_impression_per_session
  on public.ab_events (session_id, variant)
  where event_type = 'impression';

create index if not exists ab_events_variant_type_idx
  on public.ab_events (variant, event_type);

-- RLS on, zero policies = default-deny for anon/auth roles. The only writer
-- and reader is the service_role key, used exclusively inside the
-- ab-collect / ab-stats Edge Functions. The public anon key can never
-- touch this table directly.
alter table public.ab_events enable row level security;

-- Aggregated counts the dashboard reads (via the service-role-backed
-- ab-stats function). Returns one row per variant, zero-filled.
create or replace view public.ab_event_counts as
with arms as (select unnest(array['A', 'B', 'C']) as variant)
select
  arms.variant,
  count(e.*) filter (where e.event_type = 'impression') as impressions,
  count(e.*) filter (where e.event_type = 'conversion') as conversions
from arms
left join public.ab_events e on e.variant = arms.variant
group by arms.variant
order by arms.variant;
