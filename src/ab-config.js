/* A/B test endpoint config. Safe to commit and ship publicly — these are
   only the function URLs. The collector is write-only and validated; the
   stats endpoint requires a bearer token that is NOT stored here (it is
   entered at runtime in dashboard.html). No secrets in this file.

   After deploying the Edge Functions, replace <PROJECT_REF> below. */
window.AB_CONFIG = {
  collectUrl: "https://<PROJECT_REF>.functions.supabase.co/ab-collect",
  statsUrl: "https://<PROJECT_REF>.functions.supabase.co/ab-stats",
};
