// ab-collect — public, write-only event collector for the A/B/C test.
//
// Called from the static landing pages (GitHub Pages) by anonymous
// visitors, so the endpoint itself is necessarily public. Defense:
//   - write-only: it can INSERT, never SELECT
//   - strict allowlist validation on every field
//   - service-role key lives only in this function's env, never shipped
//   - CORS locked to the configured site origin, not "*"
//   - no PII accepted or stored (variant + anon sid + type only)
//
// Required env (set via `supabase secrets set`):
//   SB_URL                 - https://<ref>.supabase.co
//   SB_SERVICE_ROLE_KEY    - service_role key (server-only)
//   ALLOWED_ORIGIN         - e.g. https://william.github.io

const SB_URL = Deno.env.get("SB_URL")!;
const SB_SERVICE_ROLE_KEY = Deno.env.get("SB_SERVICE_ROLE_KEY")!;
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "";

const VARIANTS = new Set(["A", "B", "C"]);
const EVENT_TYPES = new Set(["impression", "conversion"]);
const SID_RE = /^[A-Za-z0-9_-]{8,64}$/;

function corsHeaders(origin: string | null): HeadersInit {
  // ALLOWED_ORIGIN may be a comma-separated list (e.g. during a domain
  // cutover). Echo the caller's origin only if it's in the set.
  const allowed = ALLOWED_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
  const allow = origin && allowed.includes(origin) ? origin : (allowed[0] ?? "");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405, headers: cors });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400, headers: cors });
  }

  const { type, variant, sid } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof type !== "string" || !EVENT_TYPES.has(type) ||
    typeof variant !== "string" || !VARIANTS.has(variant) ||
    typeof sid !== "string" || !SID_RE.test(sid)
  ) {
    // Generic message — never reflect input back.
    return new Response("invalid event", { status: 400, headers: cors });
  }

  // Insert via PostgREST with the service-role key. on_conflict +
  // ignore-duplicates makes a reloaded impression a no-op (the unique
  // partial index dedupes it server-side).
  const res = await fetch(`${SB_URL}/rest/v1/ab_events`, {
    method: "POST",
    headers: {
      "apikey": SB_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SB_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify({ variant, event_type: type, session_id: sid }),
  });

  if (!res.ok && res.status !== 409) {
    // 409 = duplicate impression, which is the desired no-op.
    console.error("ab-collect insert failed", res.status);
    return new Response("upstream error", { status: 502, headers: cors });
  }

  return new Response(null, { status: 204, headers: cors });
});
