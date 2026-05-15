/* Root composition. */

/* ── Variant tracking ─────────────────────────────────────────────
   1. On load, read ?variant=X from the URL (set by index.html's
      A/B/C splitter) and append it to any link pointing at the
      sign-up / login flow, so conversions can be attributed back
      to the theme the visitor saw.
   2. Fire a `landing_view` impression event into whichever
      analytics tool is loaded — Plausible, PostHog, or GA4.
      Plays nicely with all three; silent if none is present.
   ───────────────────────────────────────────────────────────── */
function useVariantTracking() {
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const variant = params.get("variant");
    if (!variant) return;

    // (1) stamp variant onto outbound sign-up / sign-in links
    requestAnimationFrame(() => {
      document.querySelectorAll('a[href*="aiomnipost.com"]').forEach(a => {
        try {
          const u = new URL(a.href);
          if (!u.searchParams.has("variant")) {
            u.searchParams.set("variant", variant);
            a.href = u.toString();
          }
        } catch (e) {}
      });
    });

    // (2) fire an impression event into whichever analytics tool exists
    const fireImpression = () => {
      try {
        // Plausible — https://plausible.io
        if (typeof window.plausible === "function") {
          window.plausible("landing_view", { props: { variant } });
        }
        // PostHog — https://posthog.com
        if (window.posthog && typeof window.posthog.capture === "function") {
          window.posthog.capture("landing_view", { variant });
        }
        // GA4 / gtag — https://developers.google.com/analytics
        if (typeof window.gtag === "function") {
          window.gtag("event", "landing_view", { variant });
        }
      } catch (e) {
        console.warn("[ab-test] impression hook failed", e);
      }
      console.log("[ab-test] landing_view variant=" + variant);
    };
    // small delay so analytics scripts have a chance to load
    setTimeout(fireImpression, 400);
  }, []);
}

/* ── Conversion capture ───────────────────────────────────────────
   Counts a `conversion` the moment a visitor clicks any "/signup" CTA
   (any theme — they all render the same shared sections), attributed
   to their variant. No modal, no form, no email — the only thing
   recorded is the variant. The beacon uses keepalive, so it completes
   even as the browser navigates to the real signup URL; we never
   block or delay the click.
   ───────────────────────────────────────────────────────────────── */
function isSignupHref(href) {
  return typeof href === "string" &&
    href.indexOf("aiomnipost.com") !== -1 &&
    href.indexOf("/signup") !== -1;
}

function useConversionCapture() {
  React.useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest("a");
      if (!a || !isSignupHref(a.href)) return;
      try {
        if (typeof window.aiomnipostTrackConversion === "function") {
          window.aiomnipostTrackConversion(); // keepalive — no await needed
        }
      } catch (err) {
        console.warn("[ab-test] conversion track failed", err);
      }
      // Intentionally no preventDefault: native navigation proceeds.
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
}

const App = () => {
  useVariantTracking();
  useConversionCapture();
  return (
    <React.Fragment>
      <Header />
      <Hero />
      <ComposerSection />
      <FeaturesSection />
      <WorkflowSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </React.Fragment>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
