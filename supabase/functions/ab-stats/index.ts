// ab-stats — read-only, token-gated aggregate endpoint for the dashboard.
//
// Returns ONLY per-variant counts (never raw rows). Auth is a single
// shared bearer token compared in constant time with a length check
// first, so the comparison can't leak the token via timing.
//
// Required env (set via `supabase secrets set`):
//   SB_URL                 - https://<ref>.supabase.co
//   SB_SERVICE_ROLE_KEY    - service_role key (server-only)
//   AB_STATS_TOKEN         - long random string; entered in dashboard.html
//   ALLOWED_ORIGIN         - e.g. https://william.github.io

const SB_URL = Deno.env.get("SB_URL")!;
const SB_SERVICE_ROLE_KEY = Deno.env.get("SB_SERVICE_ROLE_KEY")!;
const AB_STATS_TOKEN = Deno.env.get("AB_STATS_TOKEN") ?? "";
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "";

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = ALLOWED_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
  const allow = origin && allowed.includes(origin) ? origin : (allowed[0] ?? "");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

// Length check THEN constant-time byte compare. Both operands are hashed
// to a fixed width first so the equality loop itself is length-independent.
async function tokenMatches(presented: string): Promise<boolean> {
  if (!AB_STATS_TOKEN || presented.length !== AB_STATS_TOKEN.length) {
    return false;
  }
  const enc = new TextEncoder();
  const a = new Uint8Array(
    await crypto.subtle.digest("SHA-256", enc.encode(presented)),
  );
  const b = new Uint8Array(
    await crypto.subtle.digest("SHA-256", enc.encode(AB_STATS_TOKEN)),
  );
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== "GET") {
    return new Response("method not allowed", { status: 405, headers: cors });
  }

  const auth = req.headers.get("authorization") ?? "";
  const presented = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!(await tokenMatches(presented))) {
    return new Response("unauthorized", { status: 401, headers: cors });
  }

  const res = await fetch(
    `${SB_URL}/rest/v1/ab_event_counts?select=variant,impressions,conversions`,
    {
      headers: {
        "apikey": SB_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SB_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (!res.ok) {
    console.error("ab-stats query failed", res.status);
    return new Response("upstream error", { status: 502, headers: cors });
  }

  const rows = await res.json();
  return new Response(JSON.stringify({ counts: rows }), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
