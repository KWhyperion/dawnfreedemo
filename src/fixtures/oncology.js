/**
 * Demo fixture — Oncology.
 * Topic state: NONE (confident single match → Immuno-oncology).
 * Planted issues: promotional title phrasing; multiple undefined abbreviations;
 * a vague survival result. Within the 250-word limit.
 */

export default {
  key: 'onco',
  domainLabel: 'Oncology',

  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'solid_tumours',  parent: 'clinical', name: 'Solid Tumours' },
      { id: 'haem_malig',     parent: 'clinical', name: 'Haematological Malignancies' },
      { id: 'immuno_onc',     parent: 'clinical', name: 'Immuno-oncology' },
      { id: 'radiation',      parent: 'clinical', name: 'Radiation Oncology' },
      { id: 'cancer_biology', parent: 'science',  name: 'Cancer Biology & Genomics' },
      { id: 'supportive',     parent: 'care',     name: 'Supportive & Palliative Care' },
      { id: 'screening',      parent: 'population', name: 'Early Detection & Screening' },
    ],
  },

  abstract: {
    title: 'A novel immunotherapy dramatically improves survival in advanced non-small cell lung cancer',
    body:
`Immune checkpoint inhibitors have transformed the treatment of several malignancies, but their benefit in combination with chemotherapy in advanced non-small cell lung cancer (NSCLC) requires further definition. We report a randomised controlled trial evaluating a PD-1 inhibitor combined with platinum-based chemotherapy.

A total of 612 patients with previously untreated advanced NSCLC were randomised to receive the PD-1 inhibitor plus chemotherapy or chemotherapy alone. The primary endpoints were ORR and PFS; OS was a key secondary endpoint. Patients were stratified by tumour PD-L1 expression and histology.

The combination arm showed a markedly higher ORR and prolonged PFS compared with chemotherapy alone (p < 0.001). Median OS was also improved. Benefit was observed across PD-L1 subgroups, including patients with low expression. Treatment-related adverse events were more frequent in the combination arm but were generally manageable and consistent with the known safety profile of this drug class.

These findings demonstrate that adding a PD-1 inhibitor to first-line chemotherapy improves outcomes in advanced NSCLC and should be considered a new standard of care. The consistency of benefit across subgroups underscores the broad applicability of this approach.`,
  },

  analysis: {
    structural: {
      structureScore: 70,
      suggestions: [
        'Title uses promotional phrasing ("novel", "dramatically") not carried by the body.',
        'Abbreviations "ORR", "PFS", "OS" not expanded on first use.',
        '"Median OS was also improved" — no figure given.',
      ],
    },

    authorComments:
`A clearly structured trial abstract — design, endpoints, and results are easy to follow.

A few things you might consider before submitting:

- **Title tone.** The title describes the therapy as *novel* and the effect as *dramatic*, but the body presents it as a PD-1 inhibitor of an established class with results reported in measured terms. You might align the title with the body's register, so it reads as a finding rather than a claim a reviewer may discount.

- **First-use abbreviations.** "ORR", "PFS", and "OS" each appear without expansion. Spelling them out the first time would help readers who don't share that shorthand.

- **The survival result.** You note that median OS "was also improved" but give no figure, where the other endpoints carry a p-value. Consider stating the survival difference, so the secondary result is as concrete as the primary ones.

These are presentation points rather than concerns about the trial itself.`,

    classifications: {
      theme: {
        recommendation: { name: 'Immuno-oncology', id: 'immuno_onc' },
        ambiguity: { type: 'none', detected: false, message: null },
      },
    },

    presentation: {
      combined: 'HIGH',
      authorSummary:
        'A completed randomised trial with defined endpoints and a clear primary result — well suited to an oral presentation.',
      signals: {
        singleQuestion:     { rating: 'HIGH', withheld: false },
        narrativeCoherence: { rating: 'HIGH', withheld: false },
        focusedOutcome:     { rating: 'HIGH', withheld: false },
        cognitiveLoad:      { rating: 'LOW',  withheld: false },
      },
    },
  },
};
