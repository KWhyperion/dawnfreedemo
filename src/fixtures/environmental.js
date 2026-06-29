/**
 * Demo fixture — Environmental / Climate Science.
 * Topic state: NONE (confident single match → Climate Modelling & Projections).
 * Planted issues: undefined abbreviation; unnamed scenarios; vague magnitude;
 * over the limit.
 */

export default {
  key: 'environmental',
  domainLabel: 'Environmental & Climate Science',

  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'modelling',   parent: 'climate',   name: 'Climate Modelling & Projections' },
      { id: 'biodiversity', parent: 'eco',      name: 'Biodiversity & Ecosystems' },
      { id: 'atmospheric', parent: 'climate',   name: 'Atmospheric Science' },
      { id: 'hydrology',   parent: 'water',     name: 'Hydrology & Water Resources' },
      { id: 'policy_adapt', parent: 'society',  name: 'Climate Policy & Adaptation' },
      { id: 'carbon',      parent: 'cycles',    name: 'Carbon & Biogeochemical Cycles' },
      { id: 'remote',      parent: 'methods',   name: 'Remote Sensing & Earth Observation' },
    ],
  },

  abstract: {
    title: 'Projected changes in regional precipitation extremes under high-emission scenarios',
    body:
`Changes in precipitation extremes pose significant risks to water resources, agriculture, and infrastructure, yet regional projections remain uncertain owing to model spread and internal variability. Robust regional estimates are needed to inform adaptation planning.

We analysed output from an ensemble of climate models participating in CMIP6 to assess projected changes in precipitation extremes over a mid-latitude region through to the end of the century. Daily precipitation was evaluated under two emission pathways, focusing on the frequency and intensity of extreme events defined by exceedance of the historical 95th percentile. Model agreement was quantified, and results were compared against a high-resolution regional downscaling.

Under the high-emission pathway, the frequency of extreme precipitation events increased substantially across most of the region, with the largest changes concentrated in winter months. The intensity of the heaviest events also increased. Model agreement was strong for the direction of change but weaker for its magnitude. Downscaled projections broadly reproduced the ensemble signal while resolving finer spatial structure.

These results indicate a robust increase in precipitation extremes under continued high emissions, with implications for flood risk and water management in the region. The persistent uncertainty in magnitude underscores the value of large ensembles and high-resolution downscaling for adaptation planning.`,
  },

  analysis: {
    structural: {
      structureScore: 77,
      suggestions: [
        '"CMIP6" not expanded on first use.',
        'Emission pathways referred to but not named (e.g. SSP/RCP).',
        'Increase in extreme-event frequency described as "substantial" without a figure.',
        'Exceeds the 250-word limit (~255 words).',
      ],
    },

    authorComments:
`A clear, well-structured abstract — the question, the ensemble approach, and the findings all come through, and the title matches the work.

A few things you might consider before submitting:

- **Name the scenarios.** You refer to "two emission pathways" and "the high-emission pathway" without naming them. Stating which (for example the SSP or RCP labels) would let readers place your projections against others they know.

- **Quantify the headline change.** The increase in extreme-event frequency is described as "substantial"; a figure or range would make the central result concrete rather than qualitative.

- **First-use abbreviation, and length.** "CMIP6" could be expanded on first use, and the abstract is just over the 250-word limit — the closing implications are the most condensable part.

These are presentation points — the analysis itself reads as sound.`,

    classifications: {
      theme: {
        recommendation: { name: 'Climate Modelling & Projections', id: 'modelling' },
        ambiguity: { type: 'none', detected: false, message: null },
      },
    },

    presentation: {
      combined: 'HIGH',
      authorSummary:
        'A completed modelling study with a clear question and result — well suited to an oral presentation.',
      signals: {
        singleQuestion:     { rating: 'HIGH',     withheld: false },
        narrativeCoherence: { rating: 'HIGH',     withheld: false },
        focusedOutcome:     { rating: 'HIGH',     withheld: false },
        cognitiveLoad:      { rating: 'MODERATE', withheld: false }, // dense, data-heavy
      },
    },
  },
};
