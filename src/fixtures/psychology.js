/**
 * Demo fixture — Psychology / Behavioural Science.
 * Topic state: NONE (confident single match → Social Psychology).
 * Presentation: MODERATE — a sound single experiment with a modest sample, the
 * kind of work that sits comfortably as either a talk or a poster. Adds a
 * mid-range presentation outcome to the set.
 * Planted issues: missing effect size; unspecified method detail. Within limit.
 */

export default {
  key: 'psychology',
  domainLabel: 'Psychology & Behavioural Science',

  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'cognitive',    parent: 'basic',    name: 'Cognitive Psychology' },
      { id: 'social',       parent: 'basic',    name: 'Social Psychology' },
      { id: 'developmental', parent: 'basic',   name: 'Developmental Psychology' },
      { id: 'clinical',     parent: 'applied',  name: 'Clinical & Health Psychology' },
      { id: 'behav_neuro',  parent: 'biological', name: 'Behavioural Neuroscience' },
      { id: 'personality',  parent: 'basic',    name: 'Personality & Individual Differences' },
      { id: 'methods',      parent: 'methods',  name: 'Methods & Measurement' },
    ],
  },

  abstract: {
    title: 'Perceived resource scarcity reduces cooperative behaviour in an economic game',
    body:
`Cooperation underpins many social and economic interactions, but the conditions that erode it are not fully understood. Scarcity has been proposed to shift behaviour towards self-interest, yet experimental evidence in cooperative settings is mixed. We examined whether inducing a sense of resource scarcity reduces cooperation.

Participants completed a repeated public-goods game after being randomly assigned to a scarcity or control condition through a guided recall task. Contributions to the common pool were measured across rounds, and participants completed measures of perceived scarcity and affect. A total of 94 undergraduate participants took part.

Participants in the scarcity condition contributed significantly less to the common pool than those in the control condition. The effect persisted across rounds and was partially mediated by reported anxiety. Perceived-scarcity ratings confirmed that the manipulation was effective.

These findings suggest that a psychological sense of scarcity can reduce cooperative behaviour even when actual resources are held constant, and that affect may play a mediating role. The results contribute to understanding how perceived scarcity shapes social decision-making, although replication with larger and more diverse samples would strengthen confidence in the effect.`,
  },

  analysis: {
    structural: {
      structureScore: 78,
      suggestions: [
        'Main effect reported as significant without an effect size.',
        'Number of rounds in the public-goods game not specified.',
      ],
    },

    authorComments:
`A clear experimental abstract with a well-defined manipulation and outcome, and a commendably honest closing note about generalisability.

A couple of things you might consider before submitting:

- **Give the effect size.** You report that the scarcity group contributed "significantly less", but not by how much. An effect size (or the difference in contributions) would let the reader gauge the strength of the finding, not only that it reached significance.

- **A method detail.** You note contributions were measured "across rounds" without saying how many. Stating the number of rounds would let readers picture the design.

These are presentation points — the study is clearly described and appropriately caveated.`,

    classifications: {
      theme: {
        recommendation: { name: 'Social Psychology', id: 'social' },
        ambiguity: { type: 'none', detected: false, message: null },
      },
    },

    presentation: {
      combined: 'MODERATE',
      authorSummary:
        'A sound single experiment with a clear effect but a modest, homogeneous sample. It would present well as either a talk or a poster; a poster may suit it if you\'d value direct discussion of the design and its limits.',
      signals: {
        singleQuestion:     { rating: 'HIGH',     withheld: false },
        narrativeCoherence: { rating: 'HIGH',     withheld: false },
        focusedOutcome:     { rating: 'MODERATE', withheld: false },
        cognitiveLoad:      { rating: 'LOW',      withheld: false },
      },
    },
  },
};
