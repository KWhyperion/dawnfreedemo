/**
 * Demo fixture — Neuroscience.
 *
 * DRAFT for review. Purpose: demonstrate the CROSS_PARENT topic-ambiguity
 * state — an abstract that genuinely sits under two themes in DIFFERENT
 * branches of the programme, so Dawn names both and asks the author to choose
 * by primary contribution rather than auto-selecting one.
 *
 * Conference rule: 250-word abstract limit (fixed, known).
 *
 * Planted issues (each genuinely present; lighter set than cardiology, and no
 * title issue — for variety):
 *   1. Undefined abbreviation — "AAD" used without expansion on first use.
 *   2. Sample size not stated — "a group of healthy adults", no N.
 *   3. Vague result — "high accuracy" with no figure.
 *   (Within the 250-word limit, so no length flag — shows a compliant abstract.)
 *
 * The dual contribution (method + cognitive finding) is deliberately the same
 * property that (a) drives the cross_parent ambiguity and (b) shows up as a
 * MODERATE focus signal in presentation suitability. That internal consistency
 * is intentional.
 */

export default {
    key: 'neuro',
    domainLabel: 'Neuroscience',

    taxonomy: {
        field: 'theme',
        label: 'Conference theme',
        options: [
            { id: 'sensory_motor', parent: 'systems',  name: 'Sensory & Motor Systems' },
            { id: 'cognition',     parent: 'systems',  name: 'Cognition & Behaviour' },
            { id: 'cellular',      parent: 'cellular', name: 'Cellular & Molecular Neuroscience' },
            { id: 'synaptic',      parent: 'cellular', name: 'Synaptic Signalling' },
            { id: 'neurodegen',    parent: 'disease',  name: 'Neurodegeneration & Neurological Disorders' },
            { id: 'neuroinflamm',  parent: 'disease',  name: 'Neuroinflammation' },
            { id: 'engineering',   parent: 'methods',  name: 'Neural Engineering & Computation' },
            { id: 'translational', parent: 'methods',  name: 'Translational Neuroscience' },
        ],
    },

    abstract: {
        title: 'A deep-learning decoder reveals the temporal dynamics of selective auditory attention',
        body:
            `Selective attention allows listeners to follow one speaker amid competing sounds, yet how rapidly the brain commits to an attended source remains debated. Neural decoding offers a means to track attentional selection continuously, but most approaches rely on linear models that may miss faster dynamics.

We developed a convolutional-recurrent neural network to perform AAD from high-density electroencephalography recorded while a group of healthy adults performed a dichotic listening task. The model was trained to identify the attended speaker from neural activity alone, and its performance was compared with established linear decoders. We then used the model to estimate how quickly attentional selection became detectable after stimulus onset.

The network decoded the attended speaker with high accuracy, outperforming linear baselines. Attentional selection was reliably detectable within approximately 150 ms of stimulus onset, earlier than previously reported using linear methods. Performance was stable across participants.

These results introduce a decoding approach that improves on existing methods and, in doing so, reveal that attentional selection emerges more rapidly than linear analyses suggest. The findings have implications both for neural decoding technique and for models of auditory attention.`,
    },

    analysis: {
        // ── Phase 1: structural — TERSE observational flags, no advice ──
        structural: {
            structureScore: 78,
            suggestions: [
                '"AAD" not expanded on first use.',
                'Sample size (number of participants) not stated.',
                'Decoder accuracy described as "high" without a figure.',
            ],
        },

        // ── Phase 2: author feedback — the advisory channel (markdown; chunked) ──
        authorComments:
            `This is a clear and well-paced abstract — the question, the method, and what the method revealed all come through, and the title matches the work.

A few things you might consider before submitting:

- **Sample size.** You describe "a group of healthy adults" but don't give the number of participants. Stating N would let a reviewer gauge how well the decoder's performance is supported.

- **Decoder accuracy.** You report "high accuracy" and that it outperformed linear baselines, but without a figure. Consider giving the actual accuracy (and ideally the baseline's), so the size of the improvement is visible rather than asserted.

- **First-use abbreviation.** "AAD" appears without expansion. Spelling it out the first time (auditory attention decoding) would help readers outside that immediate subfield.

These are presentation points — the work itself reads as solid, and the conclusion follows from what you report.`,

        // ── Topic advice — CROSS_PARENT: two themes, different branches, no pick ──
        classifications: {
            theme: {
                // No recommendation auto-selected: the ambiguity is genuine, so Dawn
                // presents both and hands the choice to the author.
                recommendation: null,
                ambiguity: {
                    type: 'cross_parent',
                    detected: true,
                    message:
                        'This abstract fits two themes that sit in different parts of the programme: Neural Engineering & Computation (it develops and benchmarks a new decoding model) and Cognition & Behaviour (it uses that model to characterise how attentional selection unfolds over time). These are typically reviewed by different panels. Consider which is the primary contribution of your work — the decoding method itself, or what it reveals about attention — and select the theme that matches.',
                },
            },
        },

        // ── Phase 3: presentation suitability ──
        presentation: {
            combined: 'HIGH',
            authorSummary:
                'A completed study with a clear method and result, well suited to an oral presentation. Note that it makes two contributions — a methodological advance and a cognitive finding — so you may want the talk to foreground whichever is primary.',
            signals: {
                singleQuestion:     { rating: 'HIGH',     withheld: false },
                narrativeCoherence: { rating: 'HIGH',     withheld: false },
                focusedOutcome:     { rating: 'MODERATE', withheld: false }, // dual contribution
                cognitiveLoad:      { rating: 'LOW',      withheld: false }, // LOW is good
            },
        },
    },
};
