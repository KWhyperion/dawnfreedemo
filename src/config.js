// ── Demo configuration ───────────────────────────────────────────────────────
// Values come from Vite env vars (VITE_* are inlined at build time). Nothing
// secret lives here: the lead endpoint is a public URL for a Lambda that lives
// OUTSIDE this repo and does the SES send server-side. The browser never holds
// AWS credentials and never talks to SES directly.

export const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '';