-- Rate-limit / spend-guard ledger for the live composer demo.
-- PII-free: stores only an opaque scope key + a time bucket + a count.
--   scope = 'sid:<anon session id>'  bucket = 'YYYY-MM-DDTHH'  (per-visitor/hour)
--   scope = 'global'                 bucket = 'YYYY-MM-DD'      (global/day cap)

create table if not exists public.compose_usage (
  scope      text        not null,
  bucket     text        not null,
  count      int         not null default 0,
  updated_at timestamptz not null default now(),
  primary key (scope, bucket)
);

-- RLS on, zero policies = default-deny. Only the compose Edge Function
-- (service role) touches this, via the atomic bump function below.
alter table public.compose_usage enable row level security;

-- Atomic increment-and-return. One round trip, concurrency-safe.
create or replace function public.compose_bump(p_scope text, p_bucket text)
returns int
language sql
as $$
  insert into public.compose_usage (scope, bucket, count)
  values (p_scope, p_bucket, 1)
  on conflict (scope, bucket)
    do update set count = public.compose_usage.count + 1, updated_at = now()
  returning count;
$$;
