/**
 * Demo fixture — Public Health / Epidemiology.
 * Topic state: SAME_PARENT (two sibling themes under the same branch). Lower
 * stakes than cross_parent: Dawn leads with the closer theme but flags the
 * sibling, rather than declining to pick. Demonstrates the "one, with an
 * alternative noted" representation.
 * Planted issues: undefined abbreviation; vague magnitude; over the limit.
 */

export default {
  key: 'pubhealth',
  domainLabel: 'Public Health & Epidemiology',

  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'infectious',   parent: 'epi',          name: 'Infectious Disease Epidemiology' },
      { id: 'chronic',      parent: 'epi',          name: 'Chronic Disease Epidemiology' },
      { id: 'environ_occ',  parent: 'determinants', name: 'Environmental & Occupational Health' },
      { id: 'social_det',   parent: 'determinants', name: 'Social Determinants of Health' },
      { id: 'policy',       parent: 'systems',      name: 'Health Policy & Systems' },
      { id: 'global',       parent: 'global',       name: 'Global Health' },
      { id: 'methods',      parent: 'methods',      name: 'Biostatistics & Methods' },
    ],
  },

  abstract: {
    title: 'Long-term cardiovascular risk following hospitalisation for severe respiratory infection: a population cohort study',
    body:
`Severe respiratory infections are associated with acute cardiovascular complications, but whether they confer elevated cardiovascular risk over the longer term is less clear. Understanding this association is relevant both to infection control and to chronic disease prevention.

Using linked national health records, we conducted a retrospective cohort study of 84,210 adults hospitalised for severe respiratory infection between 2010 and 2018, matched to 84,210 unexposed individuals by age, sex, and region. The primary outcome was incident MACE over a follow-up period extending to 2022. Cox proportional-hazards models were adjusted for baseline cardiovascular risk factors and socioeconomic status.

Hospitalisation for severe respiratory infection was associated with a substantially increased rate of subsequent cardiovascular events compared with matched controls. The elevated risk was greatest in the first year following infection and remained higher than in controls throughout follow-up. The association persisted after adjustment for measured confounders and was consistent across age groups.

These findings indicate that severe respiratory infection is associated with lasting cardiovascular risk, suggesting that survivors may benefit from cardiovascular risk assessment and longer-term monitoring. The results support closer integration of infectious disease and chronic disease prevention strategies in affected populations.`,
  },

  analysis: {
    structural: {
      structureScore: 76,
      suggestions: [
        '"MACE" not expanded on first use.',
        'Increase in cardiovascular events described as "substantial" without a figure (e.g. hazard ratio).',
        'Exceeds the 250-word limit (~250+ words).',
      ],
    },

    authorComments:
`A well-organised cohort study with a clear exposure, outcome, and analysis.

A few things you might consider before submitting:

- **The headline result.** You describe a "substantially increased rate" of cardiovascular events, but the central figure — a hazard ratio or rate difference — isn't given. Stating it would let the reader judge the size of the association, which is the abstract's main finding.

- **First-use abbreviation.** "MACE" is your primary outcome; spelling it out the first time removes any ambiguity about what was counted.

- **Length.** The abstract is at or just over the 250-word limit. The closing paragraph's implications could be tightened if you need to recover space.

These are presentation points — the design and reasoning come through clearly.`,

    classifications: {
      theme: {
        // Leads with the closer sibling, flags the other — same branch, so the
        // consequence of either choice is modest.
        recommendation: { name: 'Chronic Disease Epidemiology', id: 'chronic' },
        ambiguity: {
          type: 'same_parent',
          detected: true,
          message:
            'This sits between two closely related themes in the same area: Chronic Disease Epidemiology (the long-term cardiovascular outcome) and Infectious Disease Epidemiology (the respiratory-infection exposure). They share reviewers, so either is defensible — but if the emphasis of your work is the lasting cardiovascular risk, Chronic Disease Epidemiology is the better fit.',
        },
      },
    },

    presentation: {
      combined: 'HIGH',
      authorSummary:
        'A completed population cohort study with a defined outcome and long follow-up — well suited to an oral presentation.',
      signals: {
        singleQuestion:     { rating: 'HIGH',     withheld: false },
        narrativeCoherence: { rating: 'HIGH',     withheld: false },
        focusedOutcome:     { rating: 'MODERATE', withheld: false },
        cognitiveLoad:      { rating: 'LOW',      withheld: false },
      },
    },
  },
};
