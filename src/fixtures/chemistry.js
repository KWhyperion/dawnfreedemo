/**
 * Demo fixture — Chemistry.
 * Topic state: NO_MATCH. The abstract is sound, but it's a chemistry-EDUCATION
 * study, and the conference's theme list is research areas (synthesis,
 * catalysis, materials …). None fit confidently, so Dawn says so and points the
 * author to check for a more appropriate category rather than forcing a wrong
 * one. Demonstrates Dawn staying useful when it genuinely can't place an
 * abstract.
 * Planted issues: missing figures; unnamed instrument. Within the limit.
 */

export default {
  key: 'chemistry',
  domainLabel: 'Chemistry',

  taxonomy: {
    field: 'theme',
    label: 'Conference theme',
    options: [
      { id: 'organic',      parent: 'molecular', name: 'Organic & Synthetic Chemistry' },
      { id: 'inorganic',    parent: 'molecular', name: 'Inorganic & Organometallic' },
      { id: 'physical',     parent: 'physical',  name: 'Physical & Theoretical Chemistry' },
      { id: 'analytical',   parent: 'physical',  name: 'Analytical Chemistry' },
      { id: 'materials',    parent: 'materials', name: 'Materials Chemistry' },
      { id: 'catalysis',    parent: 'materials', name: 'Catalysis' },
      { id: 'electrochem',  parent: 'physical',  name: 'Electrochemistry' },
    ],
  },

  abstract: {
    title: 'Impact of a flipped-classroom approach on student performance in undergraduate organic chemistry',
    body:
`Active-learning approaches are increasingly adopted in undergraduate science education, but their effect on student outcomes in organic chemistry — a subject many students find challenging — is not well established. We evaluated whether a flipped-classroom format improved performance compared with traditional lectures.

Over two academic years, 248 second-year undergraduate students were taught organic chemistry either through conventional lectures or a flipped-classroom format, in which pre-recorded material was reviewed before class and contact time was devoted to problem-solving. Student performance was assessed using a common end-of-module examination, and engagement was measured through attendance and a survey instrument.

Students in the flipped-classroom group achieved higher examination scores than those taught by conventional lectures, and reported greater engagement. The improvement was most pronounced among students in the lower attainment quartile at baseline. Attendance was comparable between groups.

These findings suggest that a flipped-classroom approach can improve learning outcomes in undergraduate organic chemistry, particularly for students who initially struggle. Wider adoption of active-learning formats may help address the difficulties students commonly encounter in this subject.`,
  },

  analysis: {
    structural: {
      structureScore: 79,
      suggestions: [
        'Examination-score difference reported without figures.',
        'Survey instrument referred to but not named.',
      ],
    },

    authorComments:
`A clear and well-structured abstract — the question, design, and findings are easy to follow.

A couple of things you might consider before submitting:

- **Quantify the result.** You report higher examination scores and greater engagement, but without figures. Giving the size of the difference (and, if available, a measure of its reliability) would let the reader judge the strength of the effect.

- **Name the instrument.** You refer to "a survey instrument" for engagement; naming it would let readers assess what was measured.

These are presentation points — the study reads as soundly designed.`,

    classifications: {
      theme: {
        recommendation: null,
        ambiguity: {
          type: 'no_match',
          detected: true,
          message:
            'None of this conference\'s themes confidently fit this abstract. The listed themes are research areas in chemistry (synthesis, catalysis, materials, and so on), whereas this is a study in chemistry education. Please check whether the conference offers an education, pedagogy, or general track, and select that — or contact the organisers if no suitable category is listed.',
        },
      },
    },

    presentation: {
      combined: 'MODERATE',
      authorSummary:
        'A completed education study with a clear result. It would present well either as a talk or a poster; a poster may suit it if the conference\'s oral sessions are weighted toward laboratory research.',
      signals: {
        singleQuestion:     { rating: 'HIGH',     withheld: false },
        narrativeCoherence: { rating: 'HIGH',     withheld: false },
        focusedOutcome:     { rating: 'MODERATE', withheld: false },
        cognitiveLoad:      { rating: 'LOW',      withheld: false },
      },
    },
  },
};
