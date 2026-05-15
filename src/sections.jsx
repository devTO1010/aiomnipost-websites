/* All other page sections. Features verified against the "Completed
   Features" list in CLAUDE.md — nothing promised that isn't shipped. */

/* ============================== HEADER ============================== */
const Header = () => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(246,244,239,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid var(--line-2)" : "1px solid transparent",
      transition: "all 220ms ease",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 72, gap: 24,
      }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
          <Logomark size={28} />
          <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: "-0.02em" }}>AI OmniPost</span>
        </a>
        <nav className="row gap-8 site-nav" style={{ fontSize: 14, color: "var(--muted)", whiteSpace: "nowrap" }}>
          <a href="#composer" style={{ textDecoration: "none" }}>The Composer</a>
          <a href="#features" style={{ textDecoration: "none" }}>Features</a>
          <a href="#workflow" style={{ textDecoration: "none" }}>Workflow</a>
          <a href="#pricing" style={{ textDecoration: "none" }}>Pricing</a>
          <a href="#faq" style={{ textDecoration: "none" }}>FAQ</a>
        </nav>
        <div className="row gap-2" style={{ alignItems: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
          <a href="https://app.aiomnipost.com/login" className="btn btn-ghost" style={{ height: 38, fontSize: 13.5 }}>Sign in</a>
          <a href="https://app.aiomnipost.com/signup" className="btn btn-primary" style={{ height: 38, fontSize: 13.5 }}>
            Start 30 days free <IconArrow size={14} stroke={2} />
          </a>
        </div>
      </div>
    </header>
  );
};

const Logomark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="1" y="1" width="30" height="30" rx="8" fill="var(--ink)" />
    <circle cx="16" cy="16" r="9" stroke="var(--paper)" strokeWidth="1.6" />
    <circle cx="16" cy="9.5" r="2" fill="var(--paper)" />
    <circle cx="22.5" cy="16" r="2" fill="var(--paper)" />
    <circle cx="16" cy="22.5" r="2" fill="var(--paper)" />
    <circle cx="9.5" cy="16" r="2" fill="var(--paper)" />
    <circle cx="16" cy="16" r="2.5" fill="var(--blue)" />
  </svg>
);

/* ============================== HERO ============================== */
const Hero = () => {
  return (
    <section id="top" style={{
      position: "relative", paddingTop: 140, paddingBottom: 80, overflow: "hidden",
    }}>
      <div className="hero-bg" />
      <div className="container" style={{ position: "relative" }}>
        <div className="row gap-3" style={{ marginBottom: 28 }}>
          <div className="pill">
            <span className="dot live-dot" />
            One brief → a month of posts
          </div>
          <div className="pill">Live for marketing teams now</div>
        </div>
        <h1 style={{ maxWidth: 1080, marginBottom: 28 }}>
          A month of social posts, written for every channel, ready before your <span className="serif" style={{ color: "var(--blue)" }}>coffee</span> gets cold.
        </h1>
        <p style={{
          maxWidth: 620, fontSize: 19, lineHeight: 1.55, color: "var(--muted)", marginBottom: 36,
        }}>
          Tell us what you want to say. We turn it into on-brand posts — with images and short videos — across Facebook, Instagram, LinkedIn, and TikTok. You approve. We publish. Your week opens back up.
        </p>
        <div className="row gap-3" style={{ marginBottom: 56, flexWrap: "wrap" }}>
          <a href="https://app.aiomnipost.com/signup" className="btn btn-primary" style={{ height: 52, padding: "0 28px", fontSize: 15 }}>
            Start 30 days free — no card <IconArrow size={16} stroke={2} />
          </a>
          <a href="#composer" className="btn btn-ghost" style={{ height: 52, padding: "0 24px", fontSize: 15 }}>
            <IconPlay size={12} stroke={0} />
            See it write a post
          </a>
        </div>
        <PlatformStack />
      </div>
    </section>
  );
};

/* Four fanned platform cards showing the same campaign idea adapted per channel */
const PlatformStack = () => {
  const sharedBrief = {
    facebook: "We rebuilt our autumn sourcing program around three principles — direct trade, single-origin transparency, and a no-blend rule on first-of-season harvests. The result lands Friday. Café members get first access.",
    instagram: "autumn blend, friday. fig + toffee + cocoa. ☕\n\n#singleorigin #specialtycoffee #autumnblend #coffeelover",
    linkedin: "After six months of supplier visits, a new sourcing rule, and twenty failed roast profiles, our autumn blend is finally ready.\n\nThree things changed for us this year:\n→ Direct trade only, full price transparency\n→ Single-origin on first-of-season harvests\n→ No blending until the cup speaks for itself\n\nMembers get first access Friday.",
    tiktok: "pov: six months of roast profiles for one cup 🍂 #specialtycoffee #coffeetok #autumnvibes",
  };
  return (
    <div style={{
      position: "relative",
      display: "grid",
      gridTemplateColumns: "1.05fr 1fr 1.05fr 0.7fr",
      gap: 18, alignItems: "start",
    }}>
      <div style={{ transform: "translateY(20px)" }}>
        <PreviewTag kind="facebook" />
        <PlatformCard kind="facebook" body={sharedBrief.facebook} media="assets/post-cafe.jpg" />
      </div>
      <div>
        <PreviewTag kind="instagram" />
        <PlatformCard kind="instagram" body={sharedBrief.instagram} media="assets/post-latte.jpg" />
      </div>
      <div style={{ transform: "translateY(40px)" }}>
        <PreviewTag kind="linkedin" />
        <PlatformCard kind="linkedin" body={sharedBrief.linkedin} media="assets/post-roastery.jpg" />
      </div>
      <div style={{ transform: "translateY(10px)" }}>
        <PreviewTag kind="tiktok" />
        <PlatformCard kind="tiktok" body={sharedBrief.tiktok} media="assets/post-barista.jpg" />
      </div>
    </div>
  );
};

const PreviewTag = ({ kind }) => {
  const meta = platformMeta[kind];
  return (
    <div className="mono" style={{
      fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
      color: "var(--muted)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 4, background: meta.color, color: "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}><PlatformGlyph kind={kind} size={9} /></span>
      {meta.name}
    </div>
  );
};

/* ============================== COMPOSER SECTION ============================== */
const ComposerSection = () => (
  <section id="composer" style={{ padding: "120px 0", borderTop: "1px solid var(--line-2)" }}>
    <div className="container">
      <SectionHeader
        num="01 / 05"
        eyebrow="The Composer · Live"
        title={<>Type one sentence. Get four <span className="serif" style={{ color: "var(--blue)" }}>finished</span> posts.</>}
        sub="See for yourself — type your own brief below and watch a week's worth of writing happen in 10 seconds."
      />
      <ComposerDemo />
    </div>
  </section>
);

/* ============================== FEATURES ============================== */
const FEATURES = [
  {
    eyebrow: "Write once",
    title: "A week of posts in the time it takes to make coffee",
    body: "Type one short brief. Get on-brand copy, images, and short-form video — already shaped for Facebook, Instagram, LinkedIn, and TikTok. What used to be a Tuesday is now a tab you close before lunch.",
    bullets: ["Four channels written in one go", "Photos and short videos generated for you", "Upload your own photo, get a ready-to-post caption", "Stop staring at a blank page"],
  },
  {
    eyebrow: "Stay in control",
    title: "Nothing goes out until you say so",
    body: "Every post lands in a review queue. Approve in bulk, tweak a line, regenerate anything that's off, or test two versions side-by-side and pick the winner. You're still the editor — the AI just did the typing.",
    bullets: ["Bulk approve when you're confident", "Edit a sentence without starting over", "Test two takes, keep the better one", "Optional client + manager sign-off"],
  },
  {
    eyebrow: "Plan ahead",
    title: "A whole month, mapped in minutes",
    body: "Pick a campaign goal, drop in a few details, and your month fills itself in. Drag a post to a new day if plans change. We space your posts across channels so you're never spamming the same followers twice.",
    bullets: ["Full month auto-scheduled from one prompt", "Drag-and-drop the calendar like a whiteboard", "Smart spacing across channels", "Export the calendar to Google / Apple"],
  },
  {
    eyebrow: "Set & forget",
    title: "Your posts go live without you in the room",
    body: "Connect each account once. From there, approved posts publish themselves at the right time on the right channel. If something doesn't go through, we keep trying — and let you know. No 8 a.m. \"did it post?\" panic.",
    bullets: ["Connect once, post forever", "Auto-publishes at your scheduled time", "Quietly retries when a platform is slow", "Boost your best posts straight into Meta ads"],
  },
  {
    eyebrow: "Sound like you",
    title: "Gets sharper every time you click approve",
    body: "Every approval, every tweak, every winning post teaches your account what your brand actually sounds like. Two weeks in, the first drafts feel like you wrote them. Two months in, you're mostly hitting approve.",
    bullets: ["Learns your tone from your edits", "Pulls in what's actually getting likes", "Imagery matches your brand colors and logo", "Reset and restart anytime"],
  },
  {
    eyebrow: "Know what works",
    title: "See what's landing — in plain English",
    body: "Likes, comments, shares, views — pulled in automatically and explained without a PhD in spreadsheets. \"Posts with photos on Thursdays get 3× the engagement.\" Now you know what to do more of.",
    bullets: ["One dashboard, every channel", "Plain-English summary of what's working", "Compare this month vs. last", "Export to share with the team"],
  },
];

const FeaturesSection = () => (
  <section id="features" style={{ padding: "120px 0", borderTop: "1px solid var(--line-2)" }}>
    <div className="container">
      <SectionHeader
        num="02 / 05"
        eyebrow="The Product"
        title={<>Six ways it gives you <span className="serif" style={{ color: "var(--blue)" }}>your week</span> back.</>}
        sub="Less time staring at the post box. More time on the parts of the job that actually need you."
      />
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const FeatureCard = ({ feature, index }) => (
  <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
    <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--blue)" }}>
        {feature.eyebrow}
      </span>
      <span className="mono" style={{ fontSize: 11, color: "var(--muted-2)" }}>
        0{index + 1}
      </span>
    </div>
    <h3 style={{ fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{feature.title}</h3>
    <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted)" }}>{feature.body}</p>
    <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
      {feature.bullets.map(b => (
        <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "var(--ink-2)" }}>
          <span style={{ marginTop: 5, width: 5, height: 5, borderRadius: "50%", background: "var(--ink)", flexShrink: 0 }}></span>
          {b}
        </li>
      ))}
    </ul>
  </div>
);

/* ============================== WORKFLOW ============================== */
const WORKFLOW = [
  { n: "01", title: "Tell us about your brand", body: "Upload your logo — we pick up your colors automatically. Choose how you want to sound (twelve personalities to pick from). Drop in a few reference photos. Five minutes, tops." },
  { n: "02", title: "Spin up a campaign", body: "Pick a goal: launch a product, hire, drive foot traffic, build awareness. Tell us what you want to hit and by when. A full month of posts shows up in your review queue." },
  { n: "03", title: "Approve what looks good", body: "Skim the queue, tweak a line where you want, regenerate anything off. Confident? Approve the whole batch in two clicks. Need a second pair of eyes? Loop in a teammate." },
  { n: "04", title: "Walk away. Watch it work.", body: "Approved posts go live at the right time on the right channels. The results come back in. Next week's drafts already sound a little more like you. Repeat." },
];

const WorkflowSection = () => (
  <section id="workflow" className="dark" style={{ padding: "120px 0" }}>
    <div className="container">
      <SectionHeader
        dark
        num="03 / 05"
        eyebrow="The Workflow"
        title={<>From blank page to a month of posts in <span className="serif" style={{ color: "var(--on-dark-accent)" }}>four</span> steps.</>}
        sub="Most teams have their first month of content scheduled before lunch on day one."
      />
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {WORKFLOW.map(step => (
          <div key={step.n} style={{
            padding: 28, borderRadius: 14,
            border: "1px solid var(--on-dark-line)",
            background: "var(--on-dark-surface)",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div className="mono" style={{ fontSize: 36, letterSpacing: "-0.04em", color: "var(--on-dark-accent)" }}>{step.n}</div>
            <h3 style={{ fontSize: 20, color: "var(--on-dark)" }}>{step.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--on-dark-mute)" }}>{step.body}</p>
          </div>
        ))}
      </div>

      <LearningLoopDiagram />
    </div>
  </section>
);

const LearningLoopDiagram = () => (
  <div style={{
    marginTop: 64, padding: "36px 32px", borderRadius: 18,
    border: "1px solid var(--on-dark-line)",
    background: "var(--on-dark-surface)",
    display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center",
  }}>
    <div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--on-dark-accent)", marginBottom: 14 }}>
        The Learning Loop
      </div>
      <h3 style={{ fontSize: 28, color: "var(--on-dark)", marginBottom: 14, letterSpacing: "-0.02em" }}>
        It learns your voice while you sleep.
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--on-dark-mute)", maxWidth: 460 }}>
        Every time you hit approve, every line you tweak, every post that takes off — it all teaches your account what good looks like. Two weeks in, you'll notice the first drafts already sound right. Two months in, you're mostly hitting approve.
      </p>
    </div>
    <div style={{ position: "relative", height: 240 }}>
      {[
        { label: "Generate", x: "50%", y: "8%" },
        { label: "Approve", x: "92%", y: "50%" },
        { label: "Publish", x: "50%", y: "92%" },
        { label: "Measure", x: "8%", y: "50%" },
      ].map((node, i) => (
        <div key={node.label} style={{
          position: "absolute", left: node.x, top: node.y,
          transform: "translate(-50%, -50%)",
          background: i === 0 ? "var(--on-dark)" : "var(--on-dark-surface)",
          color: i === 0 ? "var(--paper)" : "var(--on-dark)",
          border: "1px solid var(--on-dark-line-2)",
          borderRadius: 999, padding: "8px 16px",
          fontSize: 13, fontWeight: 500,
          fontFamily: "Geist Mono, monospace", letterSpacing: "0.04em",
        }}>{node.label}</div>
      ))}
      <svg viewBox="0 0 240 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <circle cx="120" cy="120" r="92" fill="none" stroke="var(--on-dark-line-2)" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 120 28 Q 200 50 212 120" fill="none" stroke="var(--on-dark-accent)" strokeWidth="1.5" markerEnd="url(#arr)" />
        <path d="M 212 120 Q 200 190 120 212" fill="none" stroke="var(--on-dark-accent)" strokeWidth="1.5" markerEnd="url(#arr)" />
        <path d="M 120 212 Q 40 190 28 120" fill="none" stroke="var(--on-dark-accent)" strokeWidth="1.5" markerEnd="url(#arr)" />
        <path d="M 28 120 Q 40 50 120 28" fill="none" stroke="var(--on-dark-accent)" strokeWidth="1.5" markerEnd="url(#arr)" />
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--on-dark-accent)" />
          </marker>
        </defs>
      </svg>
    </div>
  </div>
);

/* ============================== PRICING ============================== */
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    cadence: "for 30 days",
    priceNote: "then $29.99 / month",
    description: "Get started with AI-powered marketing.",
    cta: "Start 30-day trial",
    features: ["1 account", "2 social media platforms", "Posts, images & short videos generated for you", "Learns your brand voice as you go", "Engagement insights"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$49.99",
    cadence: "per month",
    description: "Scale your marketing presence.",
    popular: true,
    cta: "Start 30-day trial",
    features: ["3 accounts", "All 4 channels — FB, IG, LinkedIn, TikTok", "Posts, images & short videos generated for you", "Test two versions, keep the winner", "Deeper insights & monthly reports", "Priority support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$79.99",
    cadence: "per month",
    description: "Full-power marketing automation.",
    cta: "Start 30-day trial",
    features: ["Unlimited accounts", "All 4 channels — FB, IG, LinkedIn, TikTok", "Unlimited posts", "Custom reports + spreadsheet exports", "Test two versions, keep the winner", "A real person on your account", "Connect your own tools"],
  },
];

const PricingSection = () => (
  <section id="pricing" style={{ padding: "120px 0", borderTop: "1px solid var(--line-2)" }}>
    <div className="container">
      <SectionHeader
        num="04 / 05"
        eyebrow="Pricing"
        title={<>Pick a plan. <span className="serif" style={{ color: "var(--blue)" }}>30 days</span> free on every tier.</>}
        sub="Start free for 30 days. No credit card required. Change or cancel anytime."
      />
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {PLANS.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "var(--muted)" }}>
        Every plan includes the full Composer, your brand voice learning, and your calendar across Facebook, Instagram, LinkedIn, and TikTok.
      </p>
    </div>
  </section>
);

const PlanCard = ({ plan }) => (
  <div className="card" style={{
    padding: 28, position: "relative",
    background: plan.popular ? "var(--ink)" : "var(--surface, #fff)",
    color: plan.popular ? "var(--paper)" : "var(--ink)",
    border: plan.popular ? "1px solid var(--ink)" : "1px solid var(--line-2)",
    display: "flex", flexDirection: "column", gap: 18,
  }}>
    {plan.popular && (
      <div style={{
        position: "absolute", top: -12, right: 20,
        background: "var(--blue)", color: "var(--on-accent)", fontFamily: "Geist Mono, monospace",
        fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "5px 10px", borderRadius: 999,
      }}>Most popular</div>
    )}
    <div>
      <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{plan.name}</div>
      <div style={{ fontSize: 13, color: plan.popular ? "var(--mute-on-ink)" : "var(--muted)" }}>{plan.description}</div>
    </div>
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 44, letterSpacing: "-0.03em", fontWeight: 500 }}>{plan.price}</span>
        <span style={{ fontSize: 13, color: plan.popular ? "var(--mute-on-ink)" : "var(--muted)" }}>{plan.cadence}</span>
      </div>
      {plan.priceNote && (
        <div className="mono" style={{
          fontSize: 11, letterSpacing: "0.06em", marginTop: 6,
          color: plan.popular ? "var(--mute-on-ink-2)" : "var(--muted-2)",
        }}>{plan.priceNote}</div>
      )}
    </div>
    <a href="https://app.aiomnipost.com/signup" className="btn" style={{
      background: plan.popular ? "var(--paper)" : "var(--ink)",
      color: plan.popular ? "var(--ink)" : "var(--paper)",
      width: "100%",
    }}>{plan.cta}</a>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {plan.features.map(f => (
        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14 }}>
          <span style={{ marginTop: 2, color: plan.popular ? "var(--accent-on-ink)" : "var(--blue)" }}>
            <IconCheck size={14} stroke={2.2} />
          </span>
          {f}
        </li>
      ))}
    </ul>
  </div>
);

/* ============================== FAQ ============================== */
const FAQ_ITEMS = [
  { q: "Where do my posts go live?", a: "Facebook, Instagram, LinkedIn, and TikTok. You connect each account once and we handle the rest — different image sizes, hashtag styles, timing, all of it." },
  { q: "Do I review every post before it goes out?", a: "Yes by default. New drafts wait in a review queue and you approve them before they go anywhere. If you'd rather autopilot a particular campaign, you can flip it on. Need an extra set of eyes? Loop in a teammate." },
  { q: "Where do the images and videos come from?", a: "We generate them for you, on-brand and sized correctly for each channel. Have your own photo? Drop it in and we'll write the caption to match. No more 30-tab hunts for a stock image." },
  { q: "Will it sound like my brand or like a robot?", a: "Like you — more so each week. Every edit and every approval teaches your account what your voice is. Most teams stop tweaking copy after about a month because the drafts already sound right." },
  { q: "How long until I save time?", a: "Day one. A month of posts that used to take a full afternoon now takes about 20 minutes — mostly spent skimming the queue. The teams using us already are getting their Tuesdays back." },
  { q: "Can my team work in here too?", a: "Yes. Bring in teammates, set their permissions, and route who approves what. If you handle marketing for clients, you can keep each client's brand, calendar, and approvals neatly separated." },
  { q: "What about turning a great post into an ad?", a: "Boost any approved Facebook or Instagram post into an ad campaign right from the page. Set a budget, pick how long it runs, watch the numbers come back. No flipping between tabs." },
];

const FaqSection = () => (
  <section id="faq" style={{ padding: "120px 0", borderTop: "1px solid var(--line-2)" }}>
    <div className="container">
      <SectionHeader
        num="05 / 05"
        eyebrow="Questions"
        title={<>Answered. <span className="serif" style={{ color: "var(--blue)" }}>Honestly.</span></>}
      />
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        {FAQ_ITEMS.map((item, i) => <FaqRow key={i} item={item} />)}
      </div>
    </div>
  </section>
);

const FaqRow = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--line)", padding: "22px 0" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", background: "transparent", border: "none", padding: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 24, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
      }}>
        <span style={{ fontSize: 18, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.01em" }}>{item.q}</span>
        <span style={{
          width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--line)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 200ms ease",
        }}>
          <IconPlus size={14} stroke={2} />
        </span>
      </button>
      <div style={{
        maxHeight: open ? 400 : 0, overflow: "hidden",
        transition: "max-height 320ms ease, margin 320ms ease",
        marginTop: open ? 14 : 0,
      }}>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--muted)", maxWidth: 680 }}>{item.a}</p>
      </div>
    </div>
  );
};

/* ============================== FINAL CTA + FOOTER ============================== */
const FinalCta = () => (
  <section className="dark" style={{ padding: "100px 0" }}>
    <div className="container" style={{ textAlign: "center" }}>
      <h2 style={{ color: "var(--on-dark)", maxWidth: 880, margin: "0 auto 24px" }}>
        Get your <span className="serif" style={{ color: "var(--on-dark-accent)" }}>Tuesday</span> back. Try it free for 30 days.
      </h2>
      <p style={{ color: "var(--on-dark-mute)", fontSize: 17, maxWidth: 540, margin: "0 auto 36px" }}>
        Your first month of posts is on us. No credit card. Cancel inside the app whenever — takes two clicks.
      </p>
      <div className="row gap-3" style={{ justifyContent: "center", flexWrap: "wrap" }}>
        <a href="https://app.aiomnipost.com/signup" className="btn btn-light" style={{ height: 52, padding: "0 28px", fontSize: 15 }}>
          Create your account <IconArrow size={16} stroke={2} />
        </a>
        <a href="#composer" className="btn btn-ghost" style={{ height: 52, padding: "0 24px", fontSize: 15 }}>
          Watch it work first
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ padding: "56px 0 32px", background: "var(--paper-2)", borderTop: "1px solid var(--line)" }}>
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40 }}>
      <div>
        <div className="row gap-3" style={{ alignItems: "center", marginBottom: 14 }}>
          <Logomark size={28} />
          <span style={{ fontWeight: 600, fontSize: 17 }}>AI OmniPost</span>
        </div>
        <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 320, lineHeight: 1.5 }}>
          The content engine for teams who post everywhere and still want every post to sound like them.
        </p>
        <p className="mono" style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 24, letterSpacing: "0.06em" }}>
          A TekOmni LLC product · est. 2026
        </p>
      </div>
      <FooterCol title="Product" links={[["The Composer", "#composer"], ["Features", "#features"], ["Workflow", "#workflow"], ["Pricing", "#pricing"]]} />
      <FooterCol title="App" links={[["Sign in", "https://app.aiomnipost.com/login"], ["Create account", "https://app.aiomnipost.com/signup"], ["Status", "#"]]} />
      <FooterCol title="Legal" links={[["Privacy", "#"], ["Terms", "#"], ["Contact", "mailto:hello@aiomnipost.com"]]} />
    </div>
    <div className="container" style={{
      marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--line)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: 12, color: "var(--muted)", flexWrap: "wrap", gap: 12,
    }}>
      <span>© 2026 TekOmni LLC. All rights reserved.</span>
      <span className="mono" style={{ letterSpacing: "0.06em" }}>aiomnipost.com</span>
    </div>
  </footer>
);

const FooterCol = ({ title, links }) => (
  <div>
    <div className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 14 }}>{title}</div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {links.map(([label, href]) => (
        <li key={label}><a href={href} style={{ fontSize: 14, color: "var(--ink-2)", textDecoration: "none" }}>{label}</a></li>
      ))}
    </ul>
  </div>
);

/* ============================== SECTION HEADER ============================== */
const SectionHeader = ({ num, eyebrow, title, sub, dark = false }) => (
  <div style={{ marginBottom: 56, maxWidth: 920 }}>
    <div className="row gap-3" style={{ marginBottom: 20, alignItems: "center" }}>
      <span className="section-num">{num}</span>
      <span style={{ flex: 1, height: 1, background: dark ? "var(--on-dark-line-2)" : "var(--line)", maxWidth: 80 }}></span>
      <span className="eyebrow">{eyebrow}</span>
    </div>
    <h2 style={{ marginBottom: sub ? 16 : 0, color: dark ? "var(--on-dark)" : "var(--ink)", maxWidth: 880 }}>{title}</h2>
    {sub && <p style={{ fontSize: 17, lineHeight: 1.55, color: dark ? "var(--on-dark-mute)" : "var(--muted)", maxWidth: 640 }}>{sub}</p>}
  </div>
);

Object.assign(window, {
  Header, Hero, ComposerSection, FeaturesSection, WorkflowSection,
  PricingSection, FaqSection, FinalCta, Footer,
});
