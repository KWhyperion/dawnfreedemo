import {LEAD_ENDPOINT} from '../config.js';

// ── submitLead ───────────────────────────────────────────────────────────────
//
// Posts a captured lead to the configurable endpoint and FAILS LOUDLY.
//
// Boundaries (per CLAUDE.md and the "static frontend only" rule):
//   • No AWS SDK, no credentials, no SES here. Just a plain fetch POST of
//     { email, name, org, website } to LEAD_ENDPOINT. The SES send happens in a
//     Lambda deployed OUTSIDE this repo.
//   • A non-2xx response OR a thrown fetch → this throws. The caller surfaces an
//     error to the visitor; the UI must NEVER report success on a failed send.
//     A lead lost from a paid campaign is the one failure with no recovery.
//   • `website` is a honeypot field (see LeadCaptureForm). It is sent as-is; the
//     backend uses it to silently drop bots. The frontend does not branch on it.

export async function submitLead({email, name = '', org = '', website = '', sample}) {
    if (!LEAD_ENDPOINT) {
        // Misconfiguration is itself a loud failure — better to error than to
        // silently accept a lead we can't deliver.
        console.error('[DawnFree-demo] lead capture FAILED — VITE_LEAD_ENDPOINT not configured');
        throw new Error('Lead capture is not configured. Please contact us directly.');
    }

    let res;
    try {
        res = await fetch(LEAD_ENDPOINT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, name, org, website}),
        });
    } catch (err) {
        console.error('[DawnFree-demo] lead capture FAILED — network error:', err);
        throw new Error('We couldn’t send your details just now. Please try again.');
    }

    if (!res.ok) {
        console.error('[DawnFree-demo] lead capture FAILED — HTTP', res.status);
        throw new Error('We couldn’t send your details just now. Please try again.');
    }

    // The one log that matters (per the logging policy): capture succeeded.
    console.log('[DawnFree-demo] lead capture OK');
    // Funnel: Lead captured — SUCCESS branch only (never on attempt or failure),
    // sliced by field. Guarded so a blocked/absent Plausible never throws.
    window.plausible?.('Lead captured', {props: {sample}});
    return true;
}

export default submitLead;