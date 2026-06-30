/**
 * Demo fixture — Immunology.
 * THE "STAYS QUIET" SAMPLE. The abstract is genuinely well-written, so
 * structural.suggestions is EMPTY (renders the success card) and the author
 * feedback says so plainly rather than manufacturing nitpicks. This is the
 * fixture that shows Dawn knows when to stop.
 * Topic state: NONE (confident single match).
 */

export default {
  key: 'immuno',
  domainLabel: 'Immunology',

  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'innate',       parent: 'core',     name: 'Innate Immunity' },
      { id: 'adaptive_t',   parent: 'core',     name: 'Adaptive Immunity & T Cells' },
      { id: 'b_cells',      parent: 'core',     name: 'B Cells & Antibodies' },
      { id: 'mucosal',      parent: 'tissue',   name: 'Mucosal Immunology' },
      { id: 'immunometab',  parent: 'tissue',   name: 'Immunometabolism' },
      { id: 'autoimmune',   parent: 'disease',  name: 'Autoimmunity & Tolerance' },
      { id: 'tumour_imm',   parent: 'disease',  name: 'Tumour Immunology' },
    ],
  },

  abstract: {
    title: 'Tonic type I interferon signalling sets the activation threshold of memory CD8+ T cells',
    body:
`Memory CD8+ T cells respond more rapidly than naïve cells upon re-encounter with antigen, but the molecular basis of this lowered activation threshold is not fully resolved. We tested the hypothesis that tonic type I interferon (IFN) signalling primes memory cells for rapid responses.

Using conditional deletion of the type I IFN receptor in murine memory CD8+ T cells, we measured activation kinetics, calcium flux, and cytokine production following antigen stimulation. Memory cells lacking the receptor showed delayed activation and reduced early cytokine production compared with wild-type controls. Quantitative phosphoproteomics revealed that tonic IFN signalling maintained elevated baseline phosphorylation of proximal T cell receptor signalling components.

Restoring downstream signalling pharmacologically rescued the activation defect in receptor-deficient cells, confirming that tonic IFN acts upstream to set signalling tone. The magnitude of the effect was consistent across three independent experiments.

These findings identify tonic type I IFN signalling as a determinant of the lowered activation threshold that defines CD8+ T cell memory, and suggest a mechanism by which the inflammatory environment calibrates memory responsiveness. This has implications for understanding memory function during chronic infection and for vaccine strategies that aim to establish rapidly responsive T cell memory.`,
  },

  analysis: {
    structural: {
      structureScore: 91,
      suggestions: [], // empty → success card
    },

    authorComments:
`This reads well and meets the requirements I can see — I don't have substantive suggestions to offer.

The things that make it work: the hypothesis is stated explicitly up front, the abbreviation is defined on first use, the result includes the mechanism rather than only the outcome, and the consistency across independent experiments is noted. The conclusion follows directly from what you report and doesn't overreach.

If you wanted to push on anything, it would be a matter of taste rather than a gap — but the abstract is in good shape as it stands.`,

    classifications: {
      theme: {
        recommendation: { name: 'Adaptive Immunity & T Cells', id: 'adaptive_t' },
        ambiguity: { type: 'none', detected: false, message: null },
      },
    },

    presentation: {
      combined: 'HIGH',
      authorSummary:
        'A complete, focused mechanistic study with a clear result — well suited to an oral presentation.',
      signals: {
        singleQuestion:     { rating: 'HIGH', withheld: false },
        narrativeCoherence: { rating: 'HIGH', withheld: false },
        focusedOutcome:     { rating: 'HIGH', withheld: false },
        cognitiveLoad:      { rating: 'LOW',  withheld: false },
      },
    },
  },
};
