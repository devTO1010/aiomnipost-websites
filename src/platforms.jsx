/* Authentic-feeling but original platform post cards. Each one renders
   a brand, a caption, and the chrome of that platform's post — without
   copying any company's mark exactly. Used in hero + composer demo. */

const platformMeta = {
  facebook: { name: "Facebook", color: "#1877f2", bg: "#ffffff", text: "#050505" },
  instagram: { name: "Instagram", color: "#e1306c", bg: "#ffffff", text: "#0a0a0a" },
  linkedin: { name: "LinkedIn", color: "#0a66c2", bg: "#ffffff", text: "#000000" },
  tiktok: { name: "TikTok", color: "#000000", bg: "#000000", text: "#ffffff" },
};

const Avatar = ({ size = 36, color = "#16304d", initials = "AO" }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: color, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: size * 0.38,
    letterSpacing: "-0.02em", flexShrink: 0,
  }}>{initials}</div>
);

/* media slot: a real photo when `src` is given, otherwise a subtle
   striped backdrop with a label (kept as a graceful fallback). */
const MediaSlot = ({ aspect = "4/5", label = "product shot", tone = "warm", src }) => {
  if (src) {
    return (
      <div style={{ aspectRatio: aspect, width: "100%", overflow: "hidden", background: "#e8e4d8" }}>
        <img
          src={src}
          alt={label}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }
  const stripes = tone === "dark"
    ? "repeating-linear-gradient(135deg, #1d2630 0 12px, #232d39 12px 24px)"
    : "repeating-linear-gradient(135deg, #efece4 0 12px, #e8e4d8 12px 24px)";
  return (
    <div style={{
      aspectRatio: aspect, width: "100%",
      background: stripes,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: tone === "dark" ? "rgba(255,255,255,0.4)" : "#a59f8e",
      fontFamily: "Geist Mono, monospace", fontSize: 10, letterSpacing: "0.1em",
      textTransform: "uppercase",
    }}>{label}</div>
  );
};

/* ---------------- Facebook post ---------------- */
const FacebookCard = ({ brand = "Northwind Coffee Co.", body, image = "indoor café shot", media }) => (
  <div style={{
    background: "#fff", borderRadius: 10, border: "1px solid #e4e6eb",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
    color: "#050505", overflow: "hidden", width: "100%",
  }}>
    <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar size={40} color="#0c1c2e" initials="N" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{brand}</div>
        <div style={{ fontSize: 12, color: "#65676b" }}>Sponsored · <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#65676b22", verticalAlign: "middle" }}></span></div>
      </div>
      <IconDots size={18} stroke={2} />
    </div>
    <div style={{ padding: "0 14px 12px", fontSize: 14, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
      {body || "New autumn blend just landed in the roastery. Notes of toffee, dried fig, and a clean cocoa finish. Pre-order opens Friday for our café members ☕"}
    </div>
    <MediaSlot aspect="1.91/1" label={image} src={media} />
    <div style={{
      padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
      fontSize: 12, color: "#65676b", borderBottom: "1px solid #e4e6eb",
    }}>
      <div className="row gap-2" style={{ alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#1877f2", display: "inline-block", border: "2px solid #fff" }}></span>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#f33e58", display: "inline-block", border: "2px solid #fff", marginLeft: -6 }}></span>
        </div>
        <span>2,341</span>
      </div>
      <span>84 comments · 41 shares</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "4px 8px", color: "#65676b", fontSize: 13, fontWeight: 600 }}>
      {["Like", "Comment", "Share"].map(l => (
        <div key={l} style={{ padding: "8px 0", textAlign: "center" }}>{l}</div>
      ))}
    </div>
  </div>
);

/* ---------------- Instagram post ---------------- */
const InstagramCard = ({ brand = "northwind.coffee", body, image = "latte top-down", media }) => (
  <div style={{
    background: "#fff", borderRadius: 10, border: "1px solid #dbdbdb",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
    color: "#0a0a0a", overflow: "hidden", width: "100%",
  }}>
    <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "conic-gradient(from 210deg, #f9ce34, #ee2a7b, #6228d7, #f9ce34)",
        padding: 2, boxSizing: "border-box",
      }}>
        <div style={{ background: "#fff", borderRadius: "50%", width: "100%", height: "100%", padding: 1.5, boxSizing: "border-box" }}>
          <Avatar size={25} color="#0c1c2e" initials="N" />
        </div>
      </div>
      <div style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{brand}</div>
      <IconDots size={18} stroke={2} />
    </div>
    <MediaSlot aspect="1/1" label={image} src={media} />
    <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 14 }}>
      <IconHeart size={22} stroke={1.8} />
      <IconBubble size={22} stroke={1.8} />
      <IconSend size={22} stroke={1.8} />
      <div style={{ flex: 1 }} />
      <IconBookmark size={22} stroke={1.8} />
    </div>
    <div style={{ padding: "0 12px 12px", fontSize: 13, lineHeight: 1.4 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>3,842 likes</div>
      <div>
        <span style={{ fontWeight: 600 }}>{brand}</span>{" "}
        <span style={{ whiteSpace: "pre-wrap" }}>{body || "the autumn blend is here. fig + toffee + cocoa. link in bio to pre-order."}</span>
      </div>
      <div style={{ color: "#737373", marginTop: 4, fontSize: 12 }}>View all 84 comments</div>
    </div>
  </div>
);

/* ---------------- LinkedIn post ---------------- */
const LinkedInCard = ({ brand = "Northwind Coffee Co.", role = "Specialty roaster · 4,201 followers", body, image = "team in roastery", media }) => (
  <div style={{
    background: "#fff", borderRadius: 10, border: "1px solid #d0d7de",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
    color: "#000", overflow: "hidden", width: "100%",
  }}>
    <div style={{ padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
      <Avatar size={42} color="#0a66c2" initials="N" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{brand}</div>
        <div style={{ fontSize: 12, color: "#666" }}>{role}</div>
        <div style={{ fontSize: 12, color: "#666" }}>2h · <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#eef3f8", verticalAlign: "middle" }}></span></div>
      </div>
      <IconDots size={18} stroke={2} />
    </div>
    <div style={{ padding: "0 14px 12px", fontSize: 14, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
      {body || "We rebuilt our autumn sourcing program around three principles: direct trade, single-origin transparency, and a no-blend rule on first-of-season harvests.\n\nThe result: a notes-forward toffee + fig + cocoa profile we're proud of. Pre-orders open Friday for café members."}
    </div>
    <MediaSlot aspect="1.91/1" label={image} src={media} />
    <div style={{ padding: "10px 14px", fontSize: 12, color: "#666", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0" }}>
      <span><span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: "#0a66c2", verticalAlign: "middle", marginRight: 4 }}></span>412 reactions</span>
      <span>38 comments</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "4px 0", color: "#666", fontSize: 13, fontWeight: 600 }}>
      {["Like", "Comment", "Repost", "Send"].map(l => (
        <div key={l} style={{ padding: "8px 0", textAlign: "center" }}>{l}</div>
      ))}
    </div>
  </div>
);

/* ---------------- TikTok phone-style card ---------------- */
const TikTokCard = ({ brand = "@northwind.coffee", body, image = "barista pour vertical", media }) => (
  <div style={{
    background: "#000", borderRadius: 14, color: "#fff",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
    overflow: "hidden", width: "100%", aspectRatio: "9/16",
    position: "relative",
  }}>
    <MediaSlot aspect="9/16" label={image} tone="dark" src={media} />
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.3) 100%)",
    }} />
    {/* top status */}
    <div style={{ position: "absolute", top: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
      <span>Following</span>
      <span style={{ color: "#fff", borderBottom: "2px solid #fff", paddingBottom: 4 }}>For you</span>
    </div>
    {/* right rail */}
    <div style={{ position: "absolute", right: 10, bottom: 80, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
      <Avatar size={36} color="#0c1c2e" initials="N" />
      {[
        { icon: <IconHeart size={26} stroke={2} />, label: "184K" },
        { icon: <IconBubble size={26} stroke={2} />, label: "2,341" },
        { icon: <IconBookmark size={26} stroke={2} />, label: "12K" },
        { icon: <IconSend size={26} stroke={2} />, label: "Share" },
      ].map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600 }}>
          {it.icon}<span>{it.label}</span>
        </div>
      ))}
    </div>
    {/* bottom caption */}
    <div style={{ position: "absolute", left: 14, right: 70, bottom: 16, fontSize: 13, lineHeight: 1.35 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{brand}</div>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {body || "autumn blend drop friday 🍂 fig + toffee + cocoa #coffeetok #specialtycoffee #autumnvibes"}
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
        <IconMusic size={14} stroke={2} />
        <span>original sound — northwind.coffee</span>
      </div>
    </div>
  </div>
);

const PlatformCard = ({ kind, ...props }) => {
  switch (kind) {
    case "facebook": return <FacebookCard {...props} />;
    case "instagram": return <InstagramCard {...props} />;
    case "linkedin": return <LinkedInCard {...props} />;
    case "tiktok": return <TikTokCard {...props} />;
    default: return null;
  }
};

Object.assign(window, {
  platformMeta, PlatformCard,
  FacebookCard, InstagramCard, LinkedInCard, TikTokCard,
});
