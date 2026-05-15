# AI OmniPost — A/B/C landing page test

Static, GitHub Pages-friendly A/B/C test with a **self-owned counter** in
Supabase. No third-party analytics. One dashboard shows views → signups →
conversion rate per theme.

## Files

| File | Role |
|---|---|
| `index.html` | Splitter — random + sticky per browser via `localStorage`, redirects with `?variant=A\|B\|C` |
| `editorial.html` | Variant A — Editorial Light |
| `studio.html` | Variant B — Studio Dark |
| `bazaar.html` | Variant C — Bazaar |
| `dashboard.html` | Token-gated results table (views / signups / rate per variant) |
| `src/ab-config.js` | Public function URLs (safe to commit; no secrets) |
| `src/ab.js` | Fires one impression per session; exposes the conversion hook |
| `src/app.jsx` | Variant link-stamping + signup-click conversion capture |
| `supabase/migrations/0001_ab_events.sql` | `ab_events` table, constraints, RLS, counts view |
| `supabase/functions/ab-collect/` | Public write-only collector (validated) |
| `supabase/functions/ab-stats/` | Token-gated aggregate reader |

All three variant pages share the same `src/*` — themes differ only by CSS.
One integration point covers all three.

## How it works

1. Visitor hits `index.html`. JS picks A/B/C uniformly at random the first
   time, stores it in `localStorage`, and redirects with `?variant=X`.
   Return visits reuse the stored bucket — same visitor, same theme always.
2. On the variant page, `src/ab.js` fires **one `impression`** per browser
   session to the `ab-collect` Edge Function (reloads don't double-count;
   the DB also dedupes as a backstop).
3. Clicking any "Start free / Create account / signup" CTA records **one
   attributed `conversion`** against that visitor's variant via a keepalive
   beacon, then the click proceeds normally to the real signup URL. No
   modal, no form, no email — nothing interrupts the visitor.
4. `dashboard.html` reads aggregated counts from `ab-stats` and shows the
   conversion rate per theme.

The counter stores **no PII** — only `variant`, `event_type`, an anonymous
per-browser id, and a timestamp. Nothing else is collected anywhere.

## Security model

- `ab-collect` is necessarily public (anonymous visitors) but **write-only**,
  strictly allowlist-validated, and backed by the service-role key which
  never leaves the function. CORS is locked to your site origin.
- `ab-stats` is **read-only**, returns only aggregates, and requires a
  bearer token compared in constant time (length check first).
- `ab_events` has RLS enabled with **zero policies** = default-deny. The
  anon key can never touch it. Only the Edge Functions (service role) can.
- No secret is committed. `src/ab-config.js` holds only public URLs; the
  dashboard token is entered at runtime and kept in `sessionStorage` only.

## One-time setup

Requires the [Supabase CLI](https://supabase.com/docs/guides/cli) and a
Supabase project (your existing one is fine — this adds one table).

```bash
# 1. Link the repo to your project
supabase link --project-ref <PROJECT_REF>

# 2. Apply the migration (creates ab_events + counts view)
supabase db push

# 3. Set function secrets (server-only — never in the repo)
supabase secrets set \
  SB_URL="https://<PROJECT_REF>.supabase.co" \
  SB_SERVICE_ROLE_KEY="<service_role key from dashboard → API>" \
  ALLOWED_ORIGIN="https://<your-username>.github.io" \
  AB_STATS_TOKEN="$(openssl rand -hex 24)"
# ^ save the AB_STATS_TOKEN value — you type it into dashboard.html

# 4. Deploy the two functions
supabase functions deploy ab-collect --no-verify-jwt
supabase functions deploy ab-stats   --no-verify-jwt
```

`--no-verify-jwt` is required: visitors are anonymous, so these functions
do their own auth (write-only validation / bearer token) instead of
Supabase's JWT gate.

Then edit **`src/ab-config.js`** and replace `<PROJECT_REF>` in both URLs
with your project ref. Commit and push — GitHub Pages serves the static
files; the functions run on Supabase.

> If your GitHub Pages URL is a project page
> (`username.github.io/repo`), set `ALLOWED_ORIGIN` to the origin only —
> `https://username.github.io` (no path). Custom domain → use that.

## QA — force a specific variant

Append `?force=A` (or `B`, `C`) to the splitter URL:

```
https://<your-site>/?force=B
```

Bypasses random selection and the stored bucket. Impressions/conversions
from a forced session still count — clear `localStorage` before a real run.

## Viewing results

Open `dashboard.html`, paste the `AB_STATS_TOKEN` you generated, and load.
Per variant you get: views, signups, and conversion rate, with the leading
arm highlighted.

```
Variant   Views   Signups   Conv. rate
A         1,204     38        3.16%
B         1,187     51        4.30%   ← leading
C         1,196     29        2.42%
```

## How long to run it

- Aim for **~100+ conversions per arm** before drawing any conclusion.
- The leading-arm highlight is directional, not a verdict — early gaps are
  noisy and routinely flip.
- Resist calling a winner in week one.

## Cleanup after the test

1. Replace `index.html`'s body with a `<meta http-equiv="refresh">` to the
   winning file (or rename the winner to `index.html`).
2. Delete the two losing variant files.
3. Optionally `drop table public.ab_events;` once you've archived the data,
   and remove the two Edge Functions.
