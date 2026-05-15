/* Interactive demo: type a brief, pick a tone, hit Generate.
   Calls window.claude.complete to produce one platform-native post per
   target. Renders them inside real PlatformCard components. */

const TONES = ["Friendly", "Bold", "Witty", "Authoritative", "Playful"];
const PLATFORMS = ["facebook", "instagram", "linkedin", "tiktok"];
const EXAMPLE_BRIEFS = [
  { brand: "Northwind Coffee Co.", brief: "Autumn blend launch — single-origin Colombian, notes of toffee, fig and cocoa. Pre-order opens Friday for café members." },
  { brand: "BLF Transportation", brief: "Hiring 12 long-haul drivers for new Atlanta hub. Day-one health, paid CDL ride-along program, average $87k year one." },
  { brand: "Maple & Stone", brief: "End-of-summer sample sale on the rope-handled tote. 40% off Friday-Sunday only. In-store at the Brooklyn shop." },
];

function platformPromptHint(p) {
  switch (p) {
    case "facebook":  return "60–90 words, warm and conversational. End with a soft call to action. No hashtags.";
    case "instagram": return "1–2 punchy lines, lowercase voice, 3–5 relevant hashtags at the end on a new line.";
    case "linkedin":  return "100–140 words, professional but human. Lead with a hook. Use line breaks for rhythm. No hashtags inside the body; 2–3 at the end.";
    case "tiktok":    return "10–25 words, casual energy. Include 3–4 trending-style hashtags inline at the end. Use one emoji max.";
  }
}

function shimmerText(lines = 3) {
  return Array.from({ length: lines }).map((_, i) => (
    <div key={i} style={{
      height: 10, borderRadius: 4,
      background: "linear-gradient(90deg, #ece8df 0%, #f6f4ef 50%, #ece8df 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s ease-in-out infinite",
      width: i === lines - 1 ? "60%" : "100%",
      marginBottom: 8,
    }} />
  ));
}

const ComposerDemo = () => {
  const [brand, setBrand] = React.useState(EXAMPLE_BRIEFS[0].brand);
  const [brief, setBrief] = React.useState(EXAMPLE_BRIEFS[0].brief);
  const [tone, setTone] = React.useState("Friendly");
  const [active, setActive] = React.useState({ facebook: true, instagram: true, linkedin: true, tiktok: true });
  const [posts, setPosts] = React.useState({});  // platform -> body
  const [loading, setLoading] = React.useState({});
  const [exampleIdx, setExampleIdx] = React.useState(0);

  const cycleExample = () => {
    const next = (exampleIdx + 1) % EXAMPLE_BRIEFS.length;
    setExampleIdx(next);
    setBrand(EXAMPLE_BRIEFS[next].brand);
    setBrief(EXAMPLE_BRIEFS[next].brief);
    setPosts({});
  };

  const targets = PLATFORMS.filter(p => active[p]);

  const generate = async () => {
    if (!brief.trim() || targets.length === 0) return;
    const loadingMap = {};
    targets.forEach(p => { loadingMap[p] = true; });
    setLoading(loadingMap);
    setPosts({});

    const prompt = `You are a senior social media writer. Generate ONE post per platform for the brand "${brand}" with a ${tone.toLowerCase()} tone.

Brief: ${brief}

Platforms and rules:
${targets.map(p => `- ${p.toUpperCase()}: ${platformPromptHint(p)}`).join("\n")}

Return ONLY a JSON object, no commentary, of shape:
{ ${targets.map(p => `"${p}": "post body for ${p}"`).join(", ")} }`;

    try {
      const raw = await window.claude.complete(prompt);
      // strip code fences if present
      let json = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "");
      const start = json.indexOf("{");
      const end = json.lastIndexOf("}");
      if (start >= 0 && end > start) json = json.slice(start, end + 1);
      const parsed = JSON.parse(json);
      setPosts(parsed);
    } catch (err) {
      console.error("composer error", err);
      // fallback static content so the demo never looks broken
      const fb = {};
      targets.forEach(p => { fb[p] = `[Demo offline] ${brief}`; });
      setPosts(fb);
    } finally {
      setLoading({});
    }
  };

  return (
    <div>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .platform-toggle {
          display: inline-flex; align-items: center; gap: 8px;
          height: 36px; padding: 0 12px;
          border-radius: 10px; border: 1px solid var(--line-2);
          background: #fff; font-size: 13px; cursor: pointer;
          font-family: inherit;
          transition: all 120ms ease;
        }
        .platform-toggle.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
        .platform-toggle .glyph-chip {
          width: 20px; height: 20px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
        }
        .tone-chip {
          height: 30px; padding: 0 12px; border-radius: 999px;
          font-size: 12.5px; font-family: inherit;
          border: 1px solid var(--line-2); background: #fff; cursor: pointer;
          transition: all 120ms ease;
        }
        .tone-chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
        .composer-card { background: #fff; border: 1px solid var(--line-2); border-radius: 18px; }
        .results-grid {
          display: grid; gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .preview-shell { position: relative; }
        .preview-label {
          font-family: "Geist Mono", monospace;
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
      `}</style>

      <div className="grid" style={{ gridTemplateColumns: "minmax(0, 360px) 1fr", gap: 24, alignItems: "start" }}>
        {/* LEFT: composer */}
        <div className="composer-card" style={{ padding: 20, position: "sticky", top: 96 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
              The Composer
            </div>
            <button onClick={cycleExample} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "Geist Mono, monospace", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)",
            }}>Try another →</button>
          </div>

          <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Brand</label>
          <input
            type="text"
            value={brand}
            onChange={e => setBrand(e.target.value)}
            style={{
              width: "100%", height: 36, borderRadius: 8,
              border: "1px solid var(--line-2)", padding: "0 12px",
              background: "var(--paper)", marginBottom: 14,
            }}
          />

          <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Brief</label>
          <textarea
            value={brief}
            onChange={e => setBrief(e.target.value)}
            rows={5}
            style={{
              width: "100%", borderRadius: 8,
              border: "1px solid var(--line-2)", padding: 12,
              background: "var(--paper)", marginBottom: 14, lineHeight: 1.45,
            }}
          />

          <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Tone</label>
          <div className="row gap-2" style={{ flexWrap: "wrap", marginBottom: 16 }}>
            {TONES.map(t => (
              <button key={t} className={`tone-chip ${tone === t ? "on" : ""}`} onClick={() => setTone(t)}>
                {t}
              </button>
            ))}
          </div>

          <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Publish to</label>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
            {PLATFORMS.map(p => (
              <button
                key={p}
                className={`platform-toggle ${active[p] ? "on" : ""}`}
                onClick={() => setActive(a => ({ ...a, [p]: !a[p] }))}
              >
                <span className="glyph-chip" style={{ background: platformMeta[p].color }}>
                  <PlatformGlyph kind={p} size={12} />
                </span>
                <span style={{ flex: 1, textAlign: "left" }}>{platformMeta[p].name}</span>
                {active[p] ? <IconCheck size={14} stroke={2} /> : null}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={generate}
            disabled={!brief.trim() || targets.length === 0}
          >
            <IconSparkle size={16} stroke={2} />
            Generate posts
          </button>
          <div className="mono" style={{ fontSize: 10, color: "var(--muted-2)", textAlign: "center", marginTop: 10, letterSpacing: "0.06em" }}>
            Live demo · powered by AI · ~3 seconds
          </div>
        </div>

        {/* RIGHT: results */}
        <div>
          <div className="results-grid">
            {targets.length === 0 && (
              <div style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center", color: "var(--muted)", border: "1px dashed var(--line)", borderRadius: 16 }}>
                Pick at least one platform on the left.
              </div>
            )}
            {targets.map(p => {
              const meta = platformMeta[p];
              const body = posts[p];
              const isLoading = loading[p];
              return (
                <div key={p} className="preview-shell">
                  <div className="preview-label">
                    <span style={{
                      width: 16, height: 16, borderRadius: 4, background: meta.color,
                      color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <PlatformGlyph kind={p} size={10} />
                    </span>
                    {meta.name}
                    {body && !isLoading && (
                      <span style={{ marginLeft: "auto", color: "var(--pos)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pos)" }}></span>
                        ready
                      </span>
                    )}
                  </div>
                  {isLoading ? (
                    <div className="card" style={{ padding: 18 }}>
                      {shimmerText(p === "tiktok" ? 6 : 4)}
                    </div>
                  ) : (
                    <PlatformCard kind={p} brand={p === "instagram" ? brand.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") : brand} body={body} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

window.ComposerDemo = ComposerDemo;
