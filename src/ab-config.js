/* A/B test endpoint config. Safe to commit and ship publicly — these are
   only the function URLs. The collector is write-only and validated; the
   stats endpoint requires a bearer token that is NOT stored here (it is
   entered at runtime in dashboard.html). No secrets in this file. */
window.AB_CONFIG = {
  collectUrl: "https://tbatkbpzdqygzadhxrtc.supabase.co/functions/v1/ab-collect",
  statsUrl: "https://tbatkbpzdqygzadhxrtc.supabase.co/functions/v1/ab-stats",
  composeUrl: "https://tbatkbpzdqygzadhxrtc.supabase.co/functions/v1/compose",
};
