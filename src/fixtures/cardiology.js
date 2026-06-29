/**
 * Demo fixture — Cardiology.
 *
 * DRAFT for review. This is content, not wiring. The `analysis` object matches
 * the shape AbstractAnalysisPanel consumes; the fixture-driver replays it.
 *
 * Conference rule: 250-word abstract limit (fixed, known).
 *
 * Planted issues (each is genuinely present in the text, so the feedback is
 * anchored to something real):
 *   1. Title/content misalignment — title says "elderly patients"; the cohort
 *      is defined as adults aged 40 and older.
 *   2. Undefined abbreviation — "MACE" used without expansion on first use.
 *   3. Vague result — statistical significance (p = 0.004) reported with no
 *      effect size.
 *   4. Over the 250-word limit — body is ~260 words.
 *
 * Two-channel design:
 *   - structural.suggestions (Phase 1): TERSE, observational flags. No advice.
 *   - authorComments (Phase 2): the advisory channel — warm, prioritised.
 *
 * Topic advice: sits cleanly in one theme → `type: 'none'` (confident single
 * match). Other fixtures will demonstrate the ambiguous and no-match states.
 */

export default {
  key: 'cardio',
  domainLabel: 'Cardiology',

  // ── The conference's theme list (the "taxonomy") this abstract is matched
  //    against. In Live this comes from the client's config; here it's canned.
  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'interventional', parent: 'clinical',   name: 'Interventional Cardiology' },
      { id: 'heart_failure',  parent: 'clinical',   name: 'Heart Failure & Cardiomyopathy' },
      { id: 'electrophys',    parent: 'clinical',   name: 'Electrophysiology & Arrhythmias' },
      { id: 'imaging',        parent: 'diagnostic', name: 'Cardiovascular Imaging' },
      { id: 'prevention',     parent: 'population',  name: 'Preventive & Population Cardiology' },
      { id: 'basic_science',  parent: 'science',    name: 'Basic & Translational Science' },
    ],
  },

  abstract: {
    title: 'Effect of early rhythm-control therapy on cardiovascular outcomes in elderly patients with newly diagnosed atrial fibrillation',
    body:
        `Atrial fibrillation (AF) is the most common sustained cardiac arrhythmia and is associated with increased risk of stroke, heart failure, and death, and confers a substantial burden on healthcare systems worldwide. Current guidelines have historically favoured rate-control management for many patients, but whether initiating rhythm-control therapy early after diagnosis improves cardiovascular outcomes, compared with usual rate-control management, remains uncertain in older populations.

We conducted a prospective cohort study of 1,842 adults aged 40 years and older with AF diagnosed within the preceding 12 months, recruited across nine centres between 2019 and 2022. Patients with permanent AF or a contraindication to antiarrhythmic therapy were excluded. Participants receiving early rhythm-control therapy (antiarrhythmic drugs or catheter ablation within 90 days of diagnosis) were compared with those managed by rate control. The primary endpoint was a composite of MACE assessed over a median follow-up of 2.1 years. Outcomes were adjusted for age, sex, baseline comorbidity, and centre.

Early rhythm-control therapy was associated with significantly improved outcomes compared with rate control (p = 0.004). The effect was consistent across pre-specified subgroups, including those defined by age and sex. Adverse events related to antiarrhythmic therapy were uncommon and were predominantly mild, with no significant difference in serious adverse events between groups.

These findings suggest that early rhythm-control therapy may benefit patients with newly diagnosed AF and support its consideration as a first-line management strategy in routine practice. Further randomised trials are warranted to confirm these observations in broader and more diverse populations.`,
  },

  analysis: {
    // ── Phase 1: structural — TERSE observational flags, no advice ──
    structural: {
      structureScore: 74,
      suggestions: [
        'Title refers to "elderly patients"; cohort is defined as adults aged 40 and older.',
        '"MACE" not expanded on first use.',
        'Primary result reports significance (p = 0.004) but no effect size.',
        'Exceeds the 250-word limit (~260 words).',
      ],
    },

    // ── Phase 2: author feedback — the advisory channel (markdown; chunked) ──
    authorComments:
        `This reads as a clear, well-organised abstract with a strong structure — background, methods, result, and conclusion are all present and easy to follow.

A few things you might consider before submitting:

- **Title and cohort.** The title describes *elderly* patients, but your methods define the cohort as adults aged 40 and over. A reviewer may expect those to match. You might either narrow the cohort description or adjust the title so a reader knows exactly who was studied.

- **The main result.** You report that outcomes were *significantly improved* and give a precise p-value, but not the size of the effect. Consider stating the magnitude — a hazard ratio, or the difference in event rates — so the reader can see how much benefit early rhythm-control conferred, not only that it was statistically significant.

- **First-use abbreviation.** "MACE" carries the weight of your primary endpoint. Spelling it out the first time would remove any ambiguity about what was counted.

- **Length.** The abstract is a little over the 250-word limit. The description of adverse events is the most condensable section if you need to recover space.

These are presentation points rather than concerns about the work itself — the study reads as solid, and the conclusion follows from what you report.`,

    // ── Topic advice (classification) — `none`: confident single match ──
    classifications: {
      theme: {
        recommendation: { name: 'Electrophysiology & Arrhythmias', id: 'electrophys' },
        ambiguity: {
          type: 'none',
          detected: false,
          message: null,
        },
      },
    },

    // ── Phase 3: presentation suitability ──
    presentation: {
      combined: 'HIGH',
      authorSummary:
          'This is a completed cohort study with a defined endpoint and follow-up, reporting a clear primary result. Work of this kind is generally well suited to an oral presentation.',
      signals: {
        singleQuestion:     { rating: 'HIGH',     withheld: false },
        narrativeCoherence: { rating: 'HIGH',     withheld: false },
        focusedOutcome:     { rating: 'MODERATE', withheld: false },
        cognitiveLoad:      { rating: 'LOW',      withheld: false }, // LOW is good
      },
    },
  },
};
