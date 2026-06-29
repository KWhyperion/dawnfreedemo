/**
 * Demo fixture — Physiology.
 * Maps to the Physiological Society (an anchor client) — a natural choice for a
 * targeted ?sample=physiology link.
 * Topic state: NONE (confident single match → Exercise & Environmental).
 * Planted issues: aim implied rather than stated; vague performance result;
 * over the limit.
 */

export default {
  key: 'physiology',
  domainLabel: 'Physiology',

  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'cardiovascular', parent: 'systems',  name: 'Cardiovascular Physiology' },
      { id: 'respiratory',    parent: 'systems',  name: 'Respiratory Physiology' },
      { id: 'renal',          parent: 'systems',  name: 'Renal & Fluid Balance' },
      { id: 'neurophys',      parent: 'systems',  name: 'Neurophysiology' },
      { id: 'endocrine',      parent: 'systems',  name: 'Endocrine & Metabolic Physiology' },
      { id: 'exercise_env',   parent: 'applied',  name: 'Exercise & Environmental Physiology' },
      { id: 'cellular_integ', parent: 'cellular', name: 'Cellular & Integrative Physiology' },
    ],
  },

  abstract: {
    title: 'Effects of heat acclimation on thermoregulation and endurance performance in trained cyclists',
    body:
`Repeated exposure to environmental heat induces physiological adaptations that may enhance exercise performance, but the time course of these adaptations and their persistence after heat exposure ceases are incompletely understood. Endurance athletes increasingly use heat acclimation as a training strategy, yet evidence guiding its optimal application remains limited.

Sixteen trained male cyclists completed a ten-day heat acclimation protocol consisting of daily 90-minute sessions at 38°C. Physiological responses, including core temperature, heart rate, plasma volume, and sweat rate, were measured before, during, and after the intervention. Endurance performance was assessed using a time-to-exhaustion test in temperate conditions at baseline, immediately after acclimation, and following a two-week decay period.

Heat acclimation produced significant reductions in core temperature and heart rate during exercise, alongside an expansion of plasma volume. Time-to-exhaustion improved following acclimation. After the two-week decay period, some adaptations were partially retained, although plasma volume returned towards baseline. Individual responses varied considerably.

These results indicate that a ten-day heat acclimation protocol enhances thermoregulatory function and endurance performance in trained cyclists, with partial retention of benefits two weeks later. The variability in individual responses suggests that acclimation strategies may benefit from personalisation, with practical implications for athletes preparing for competition in both temperate and hot environments.`,
  },

  analysis: {
    structural: {
      structureScore: 75,
      suggestions: [
        'Study aim is implied by the background rather than stated explicitly.',
        'Performance result ("time-to-exhaustion improved") reported without magnitude.',
        'Exceeds the 250-word limit (~260 words).',
      ],
    },

    authorComments:
`A clear, well-sequenced abstract — the rationale, protocol, and findings all come through.

A few things you might consider before submitting:

- **State the aim.** The background sets up the gap well, but the abstract moves straight into methods without an explicit aim. A single sentence — what you set out to test — would orient the reader before the protocol.

- **The performance result.** You report that time-to-exhaustion "improved", but without the size of the change. Since endurance performance is the outcome of most interest, giving the magnitude would let the reader weigh it against the physiological changes.

- **Length.** The abstract runs a little over the 250-word limit; the closing implications are the most condensable part.

These are presentation points — the study itself reads as well-designed.`,

    classifications: {
      theme: {
        recommendation: { name: 'Exercise & Environmental Physiology', id: 'exercise_env' },
        ambiguity: { type: 'none', detected: false, message: null },
      },
    },

    presentation: {
      combined: 'HIGH',
      authorSummary:
        'A completed intervention study with repeated measures and a clear outcome — well suited to an oral presentation.',
      signals: {
        singleQuestion:     { rating: 'HIGH',     withheld: false },
        narrativeCoherence: { rating: 'HIGH',     withheld: false },
        focusedOutcome:     { rating: 'MODERATE', withheld: false },
        cognitiveLoad:      { rating: 'LOW',      withheld: false },
      },
    },
  },
};
