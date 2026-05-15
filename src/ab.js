/* Client-side A/B counter.

   - Resolves the variant the visitor was bucketed into (?variant=X set by
     index.html's splitter, falling back to the stored bucket).
   - Keeps one anonymous, non-PII session id per browser.
   - Fires exactly one `impression` per browser session (a reload must not
     inflate the denominator — the server also dedupes as a backstop).
   - Exposes window.aiomnipostTrackConversion() for the signup modal.

   Plain JS on purpose: loads before the Babel scripts so the conversion
   hook exists by the time React mounts. Silent no-op if AB_CONFIG is
   missing or still has the placeholder ref. */
(function () {
  "use strict";

  var cfg = window.AB_CONFIG || {};
  var configured =
    typeof cfg.collectUrl === "string" &&
    cfg.collectUrl.indexOf("<PROJECT_REF>") === -1;

  function resolveVariant() {
    try {
      var v = new URLSearchParams(location.search).get("variant");
      if (v === "A" || v === "B" || v === "C") return v;
      var stored = localStorage.getItem("aiomnipost_variant");
      if (stored === "A" || stored === "B" || stored === "C") return stored;
    } catch (e) {}
    return null;
  }

  function sessionId() {
    var KEY = "aiomnipost_sid";
    try {
      var sid = localStorage.getItem(KEY);
      if (sid && /^[A-Za-z0-9_-]{8,64}$/.test(sid)) return sid;
      sid = (crypto.randomUUID && crypto.randomUUID()) ||
        String(Date.now()) + "-" + Math.random().toString(36).slice(2, 12);
      localStorage.setItem(KEY, sid);
      return sid;
    } catch (e) {
      // No storage (private mode etc.) — fall back to an ephemeral id.
      return "nostore-" + Math.random().toString(36).slice(2, 14);
    }
  }

  var VARIANT = resolveVariant();
  var SID = sessionId();

  function send(type) {
    if (!configured || !VARIANT) return Promise.resolve(false);
    return fetch(cfg.collectUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: type, variant: VARIANT, sid: SID }),
      keepalive: true,
      mode: "cors",
    })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  // One impression per browser session.
  try {
    if (!sessionStorage.getItem("aiomnipost_impressed") && VARIANT) {
      sessionStorage.setItem("aiomnipost_impressed", "1");
      send("impression");
    }
  } catch (e) {
    if (VARIANT) send("impression");
  }

  // Awaited by the signup modal before it forwards to the real flow, so a
  // slow network can't silently drop the conversion.
  window.aiomnipostTrackConversion = function () {
    return send("conversion");
  };

  window.aiomnipostVariant = VARIANT;
  window.aiomnipostSid = SID; // reused by the composer demo for rate-limiting
})();
