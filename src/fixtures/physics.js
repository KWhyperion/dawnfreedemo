/**
 * Demo fixture — Physics.
 * The clear POSTER example: presentation.combined = LOW. The work is genuinely
 * preliminary (confirmatory data still being collected), which is both a real
 * structural observation and the reason poster suits it. Shows presentation
 * suitability returning something other than "oral".
 * Topic state: NONE (confident single match → Condensed Matter).
 */

export default {
  key: 'physics',
  domainLabel: 'Physics',

  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'condensed',   parent: 'matter',   name: 'Condensed Matter' },
      { id: 'quantum_info', parent: 'quantum', name: 'Quantum Information & Computation' },
      { id: 'particle',    parent: 'highenergy', name: 'Particle & High-Energy Physics' },
      { id: 'astro',       parent: 'cosmos',   name: 'Astrophysics & Cosmology' },
      { id: 'amo',         parent: 'quantum',  name: 'Atomic, Molecular & Optical' },
      { id: 'soft_matter', parent: 'matter',   name: 'Soft Matter & Biophysics' },
      { id: 'plasma',      parent: 'highenergy', name: 'Plasma Physics' },
    ],
  },

  abstract: {
    title: 'Signatures of superconductivity in a newly synthesised layered telluride: preliminary findings',
    body:
`The search for new superconducting materials at accessible temperatures continues to drive condensed matter research. Layered transition-metal tellurides have recently attracted attention as candidate hosts for unconventional superconductivity. We report preliminary measurements on a newly synthesised layered telluride compound.

Single crystals were grown by chemical vapour transport and characterised by X-ray diffraction. Resistivity and magnetic susceptibility were measured as a function of temperature. Initial resistivity measurements show a sharp drop near 6 K, consistent with a possible superconducting transition. Magnetic susceptibility data are currently being collected to confirm this interpretation.

Further measurements, including specific heat and the response to applied magnetic fields, are ongoing and will be discussed. If confirmed, these findings would add a new compound to the family of layered telluride superconductors and motivate further study of this material class.`,
  },

  analysis: {
    structural: {
      structureScore: 72,
      suggestions: [
        'Central result described as a "possible" transition; confirmatory data not yet available.',
        'Some findings deferred ("ongoing and will be discussed") rather than reported.',
      ],
    },

    authorComments:
`A focused, honest abstract that's clear about what has and hasn't yet been established — and the title appropriately signals that the work is preliminary.

A couple of things to consider:

- **Framing the central result.** The resistivity drop near 6 K is your key observation, but it currently rests on a single measurement described as a "possible" transition. That framing is fair given the stage of the work; just be aware reviewers will read this as in-progress rather than a settled result.

- **Deferred findings.** Several measurements are noted as ongoing and to be discussed. That's reasonable for preliminary work, though an abstract is generally stronger when it can state what was found rather than what is still to come.

Nothing here is a flaw — it reflects where the work is. See the note below on format.`,

    classifications: {
      theme: {
        recommendation: { name: 'Condensed Matter', id: 'condensed' },
        ambiguity: { type: 'none', detected: false, message: null },
      },
    },

    presentation: {
      combined: 'LOW',
      authorSummary:
        'This is preliminary work, with the central result still to be confirmed and several measurements ongoing. It is likely better suited to a poster, where in-progress findings and direct discussion with attendees are well supported, than to an oral slot.',
      signals: {
        singleQuestion:     { rating: 'HIGH',     withheld: false },
        narrativeCoherence: { rating: 'MODERATE', withheld: false },
        focusedOutcome:     { rating: 'LOW',      withheld: false }, // no firm outcome yet
        cognitiveLoad:      { rating: 'LOW',      withheld: false },
      },
    },
  },
};
