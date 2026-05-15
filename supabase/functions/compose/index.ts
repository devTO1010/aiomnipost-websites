// compose — public live-demo endpoint. Turns a marketing brief into one
// post per requested platform via the Anthropic API.
//
// Public + unauthenticated (anonymous landing-page traffic), so it spends
// money on every call. Defenses:
//   - strict input caps (brand/brief length, platform allowlist)
//   - per-visitor rate limit (SID + hour bucket)
//   - hard global daily cap → past it, serve canned posts (no API spend)
//   - server-owned system prompt (client can't inject a huge prompt)
//   - OPENROUTER_API_KEY server-only; CORS locked to the site origin
//   - PII-free: only an opaque sid + counts are ever stored
//
// Model is served via OpenRouter (OpenAI-compatible chat completions).
//
// Required env (supabase secrets set):
//   SB_URL, SB_SERVICE_ROLE_KEY, ALLOWED_ORIGIN, OPENROUTER_API_KEY

const SB_URL = Deno.env.get("SB_URL")!;
const SB_SERVICE_ROLE_KEY = Deno.env.get("SB_SERVICE_ROLE_KEY")!;
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "";
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")!;

const MODEL = "anthropic/claude-sonnet-4.6";
const PER_SID_HOURLY_LIMIT = 5;
const GLOBAL_DAILY_LIMIT = 500;

const ALL_PLATFORMS = ["facebook", "instagram", "linkedin", "tiktok"] as const;
type Platform = typeof ALL_PLATFORMS[number];
const TONES = new Set(["Friendly", "Bold", "Witty", "Authoritative", "Playful"]);
const SID_RE = /^[A-Za-z0-9_-]{8,64}$/;

const PLATFORM_RULES: Record<Platform, string> = {
  facebook: "60–90 words, warm and conversational. End with a soft call to action. No hashtags.",
  instagram: "1–2 punchy lines, lowercase voice, then 3–5 relevant hashtags on a new line.",
  linkedin: "100–140 words, professional but human. Lead with a hook. Line breaks for rhythm. 2–3 hashtags at the very end only.",
  tiktok: "10–25 words, casual energy, 3–4 trending-style hashtags at the end. One emoji max.",
};

function corsHeaders(origin: string | null): HeadersInit {
  const allow = origin && origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

async function bump(scope: string, bucket: string): Promise<number> {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/compose_bump`, {
    method: "POST",
    headers: {
      "apikey": SB_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SB_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_scope: scope, p_bucket: bucket }),
  });
  if (!res.ok) throw new Error(`bump failed ${res.status}`);
  return (await res.json()) as number;
}

// Zero-API-spend fallback when the daily cap is hit (or the model errors).
function cannedPosts(brand: string, brief: string, platforms: Platform[]) {
  const first = brief.split(/[.!?\n]/)[0].trim().slice(0, 140) || brief.slice(0, 140);
  const out: Record<string, string> = {};
  for (const p of platforms) {
    if (p === "facebook") out[p] = `${first}. We'd love for you to be part of it — learn more from ${brand}.`;
    else if (p === "instagram") out[p] = `${first.toLowerCase()}\n\n#${brand.toLowerCase().replace(/[^a-z0-9]+/g, "")} #newdrop #comingsoon`;
    else if (p === "linkedin") out[p] = `${first}.\n\nWe've been working on this for a while at ${brand}, and we're excited to finally share it.\n\nMore soon.`;
    else out[p] = `${first.toLowerCase()} 🔥 #${brand.toLowerCase().replace(/[^a-z0-9]+/g, "")} #fyp`;
  }
  return out;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return new Response("method not allowed", { status: 405, headers: cors });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) ?? {};
  } catch {
    return new Response("bad request", { status: 400, headers: cors });
  }

  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const brief = typeof body.brief === "string" ? body.brief.trim() : "";
  const tone = typeof body.tone === "string" ? body.tone : "";
  const sid = typeof body.sid === "string" ? body.sid : "";
  const reqPlatforms = Array.isArray(body.platforms) ? body.platforms : [];

  const platforms = ALL_PLATFORMS.filter((p) => reqPlatforms.includes(p));

  if (
    brand.length < 1 || brand.length > 80 ||
    brief.length < 4 || brief.length > 600 ||
    !TONES.has(tone) ||
    platforms.length < 1 ||
    !SID_RE.test(sid)
  ) {
    return new Response("invalid input", { status: 400, headers: cors });
  }

  const now = new Date().toISOString();
  const hourBucket = now.slice(0, 13);
  const dayBucket = now.slice(0, 10);

  // Per-visitor limit first (cheap abuse stop).
  let sidCount: number, globalCount: number;
  try {
    sidCount = await bump(`sid:${sid}`, hourBucket);
    globalCount = await bump("global", dayBucket);
  } catch {
    return new Response("upstream error", { status: 502, headers: cors });
  }

  if (sidCount > PER_SID_HOURLY_LIMIT) {
    return new Response(
      JSON.stringify({ error: "rate_limited", retry_in: "an hour" }),
      { status: 429, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  // Hard daily ceiling — degrade gracefully, never run up the bill.
  if (globalCount > GLOBAL_DAILY_LIMIT) {
    return new Response(
      JSON.stringify({ posts: cannedPosts(brand, brief, platforms), degraded: true }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  const system =
    "You are a senior social media copywriter. Given a brand, a brief, and a tone, " +
    "write ONE original post per requested platform. Match each platform's native voice " +
    "and the requested tone exactly. Never invent facts not in the brief. Output only the " +
    "requested JSON object — no commentary, no markdown.";

  const userText =
    `Brand: ${brand}\nTone: ${tone}\nBrief: ${brief}\n\nPlatforms and rules:\n` +
    platforms.map((p) => `- ${p}: ${PLATFORM_RULES[p]}`).join("\n");

  const schema = {
    type: "object",
    properties: Object.fromEntries(platforms.map((p) => [p, { type: "string" }])),
    required: platforms,
    additionalProperties: false,
  };

  try {
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": ALLOWED_ORIGIN,
        "X-Title": "AI OmniPost",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userText },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "posts", strict: true, schema },
        },
      }),
    });

    if (!aiRes.ok) {
      console.error("openrouter error", aiRes.status);
      return new Response(
        JSON.stringify({ posts: cannedPosts(brand, brief, platforms), degraded: true }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const data = await aiRes.json();
    const choice = data.choices?.[0];
    const raw = choice?.message?.content;
    if (choice?.message?.refusal || typeof raw !== "string" || !raw.trim()) {
      return new Response(
        JSON.stringify({ posts: cannedPosts(brand, brief, platforms), degraded: true }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    // Defensive parse: strict json_schema should return clean JSON, but
    // tolerate code fences / prose if a route ignores the format hint.
    let json = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "");
    const s = json.indexOf("{"), e = json.lastIndexOf("}");
    if (s >= 0 && e > s) json = json.slice(s, e + 1);
    const posts = JSON.parse(json);

    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("compose failed", err);
    return new Response(
      JSON.stringify({ posts: cannedPosts(brand, brief, platforms), degraded: true }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
