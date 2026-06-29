# Dawn Free — Demo Variant (DawnFree-demo)

## What this project is

This is the **Canned demo** variant of Dawn Free. It is one of three variants
that look identical to the user but differ entirely under the hood. This one is
the simplest: a **static frontend with no AI backend and no live API calls**.

Dawn is an advisor that gives authors pre-submission feedback on conference
abstracts. The demo's job is **not** to give real feedback — it is a sales
asset. It lands in a cold email aimed at learned societies and conference
organisers, shows them what Dawn does for their authors, and captures their
contact details so a human can follow up. The recipient is usually an
**organiser, not an author** — most have no abstract of their own to submit.

Read these two boundaries before writing anything:

1. **No AI. No Anthropic API call. No live inference of any kind.** Outputs are
   preloaded fixtures matched to preloaded sample abstracts. If you find
   yourself adding an API client, a mutation, or a subscription, you have
   misunderstood the variant.
2. **The email capture field is the entire point of this build.** Everything
   else is set dressing for that one conversion. Treat it as the primary
   feature, not a footer afterthought.

## Reference code (`reference/`)

The `reference/` folder contains **two real files from the original (Live)
Dawn client**. They have **different roles** — do not treat them as equals.

### `AbstractAnalysisPanel.js` — REUSE THIS
This is the rendering component, and it is the source of truth for the look and
feel. It is already **pure and props-driven**: it takes analysis data as plain
props (`structural`, `author`, `presentation`, `score`, `isAnalysingStructure`,
`isStreaming`, …) and renders it. It does no fetching, knows nothing about
AppSync, and does not call the hook. Reuse it, adapted as lightly as possible
(see Adaptations below). Every edit to it is a place the demo and Live can drift
apart, so keep changes minimal and surgical.

### `useAbstractAnalysis.js` — DO NOT RUN THIS; it is the data-shape contract
This is the Live hook that does all the network work (AppSync subscription +
mutations, three-phase streaming). **The demo does not use it.** It is included
only because its header comment and `emptyResult()` document the **exact result
shape** the panel consumes. Read it to learn the shape, then **replace it** with
a small fixture-driver that emits the same shape from canned data on a timer.
Do not port its subscription/mutation logic — there is no backend to talk to.

### The data shape (from the hook)
The panel consumes a `result` object of this shape:

```
result: {
  structural: {
    structureScore, sectionBreakdown, titleAlignment,
    vaguenessFlags, suggestions, classifications
  },
  author:        { comments: string | null },   // markdown text
  presentation:  { submissionType, signals, combined, authorSummary } | null,
  score:         number | null,
  confidenceLevel: string | null,
  specialistReviewNeeded: boolean,
  reviewer:      { comments } | null,            // not shown to authors
  admin:         { comments } | null,            // not shown to authors
}
```

Plus two loading flags: `isAnalysingStructure` (Phase 1 in flight) and
`isStreaming` (Phase 2 chunks arriving).

**What the panel actually renders (confirmed against the panel code) — build
fixtures to this, not to the full shape above:**
- From `structural`, the panel renders **only `suggestions`** (an array of
  strings) and uses `structureScore`. It does NOT surface `sectionBreakdown`,
  `titleAlignment`, or `vaguenessFlags` in the UI — these can be omitted or left
  minimal in fixtures. `suggestions: []` (empty) renders a "well-structured, no
  issues" success card.
- `author.comments` is **markdown** text.
- `presentation` shape, exactly:
  ```
  presentation: {
    combined: 'HIGH' | 'MODERATE' | 'LOW',   // → oral/poster wording
    authorSummary: '…',                       // a sentence or two for the author
    signals: {                                // each key optional; withheld hides it
      singleQuestion:     { rating: 'HIGH'|'MODERATE'|'LOW', withheld: false },
      narrativeCoherence: { rating: '…', withheld: false },
      focusedOutcome:     { rating: '…', withheld: false },
      cognitiveLoad:      { rating: '…', withheld: false },  // LOW is good here
    }
  }
  ```
  Note `cognitiveLoad` inverts: LOW rating is the *good* one (low audience load).
- The panel shows only when `pageNumber > 0`. For the demo's page 2, feed
  `pageNumber: 1, totalPages: 2` so the panel renders.

## What the demo shows (and what it omits)

Real Dawn runs a three-phase pipeline. The demo imitates the **author-facing**
parts of it, with one deliberate omission:

- **Structural analysis** (Phase 1) — SHOW. Populate `structural.suggestions`
  (an array of strings). An empty array renders a "well-structured, no issues"
  success card — use that on at least one sample (see register note below).
- **Detailed feedback** (Phase 2, the streamed author comments) — SHOW, with the
  faked typewriter effect (see below). This is `author.comments`, rendered as
  markdown.
- **Presentation suitability** (Phase 3) — SHOW. Populate `presentation`
  (`combined` is HIGH/MODERATE/LOW → oral/poster wording; `signals` is an object
  of `{ rating, withheld }`; plus `authorSummary`). This feature stays in.
- **Topic / theme advice** — **SHOW.** (This reverses an earlier instruction to
  omit it.) The demo demonstrates Dawn's topic advice, including its handling of
  ambiguity. Two things are required for it to display, and BOTH are needed —
  passing only one renders nothing:
  1. The `classifications` prop must be a NON-EMPTY control list — one entry per
     classification field, e.g. `[{ field: 'theme', label: 'Conference theme' }]`
     (derive `field`/`label` from each fixture's `taxonomy`). With `[]` the panel
     renders no topic section — that was the cause of topic advice not appearing.
  2. The panel reads each result at `structural.classifications[field]`. So the
     fixture-driver must place the fixture's topic data there. In the fixtures the
     topic data lives at `fixture.analysis.classifications` (e.g. `.theme`); the
     driver maps it into the `structural` prop's `classifications` key when it
     builds props. The result shape per field is
     `{ recommendation: {name,id}|null, ambiguity: { type, detected, message } }`
     where `type` is one of `none | same_parent | cross_parent | no_match`.

## Faking the typewriter effect (important — easy to get wrong)

In real Dawn the typewriter effect is **not an animation** — it is a side-effect
of the server streaming Phase 2 feedback to the client in chunks, each chunk
appended to `author.comments`, with `isStreaming` true. The panel already
renders this progressively (it shows growing `author.comments` while
`isStreaming` is true, with a pulse indicator).

The demo has no stream, so it must **reproduce that mechanism, not a separate
animation**:

1. Set `isAnalysingStructure: true` briefly, then publish `structural`.
2. Set `isStreaming: true` and append the canned `author.comments` text to the
   panel's prop **in small chunks on a timer** (e.g. a few words every ~30–60ms,
   with slight irregularity so it feels like real model output, not a metronome).
3. When the text is fully released, set `isStreaming: false`.
4. Then publish `presentation` (Phase 3) so suitability appears after the
   feedback, as it does in Live.

Driving the panel's **existing** display path this way is what keeps the demo
honest — do not build a parallel typewriter component. Do not reveal the whole
output instantly and fully formed; that oversells against the real product.

## Canned outputs must match Dawn's real register

The preloaded feedback must read the way real Dawn talks, not like idealised
marketing copy. Dawn's voice:
- Comments on the abstract **as writing** — structure, clarity, completeness,
  internal consistency. It **never** comments on the research as science, never
  judges validity, novelty, or whether the abstract will be accepted.
- **Advisory, not instructive**: "Consider whether…", "Reviewers often look
  for…", "You might make X explicit." The author decides.
- Is allowed to find little to fix: a strong sample can have empty
  `structural.suggestions` (renders the success card) and `author.comments` that
  says so plainly rather than manufacturing nitpicks. Include at least one such
  sample, so the demo shows Dawn knows when to stay quiet.

If the canned outputs are too clean or too surgical, the demo lies about the
product. Keep them realistic.

## Adaptations to the reference panel

The panel was built to live inside the Live form. Four things need a decision
when reusing it in the demo — make each one knowingly:

1. **`sessionStorage`** — the panel uses it to play its intro animation once
   (`aiPanelIntroPlayed`). Fine in a normal browser; if the demo runs anywhere
   sandboxed, stub it. Do not let it throw.
2. **Resize machinery** — the panel has self-contained drag-to-resize
   (`ResizeHandle`, `panelWidth`, `MIN/MAX/DEFAULT_WIDTH`). It is NOT an external
   window dependency, so no wrapper is needed. The demo can keep it as-is, or
   fix the width to a constant and drop `ResizeHandle` if a static panel is
   preferred. Decide; don't leave it half-wired.
3. **Logo assets** — the animated header crossfades two images,
   `../assets/face.png` and `../assets/face_blue.png` (blue → sun). Both must be
   present in the demo repo at the expected path or the import breaks. Use the
   real assets; do not invent substitutes.
4. **Form-structure props** — the panel takes `pages`, `controlStates`,
   `pageNumber`, `totalPages`, `abstractFields` to decide which accordions
   auto-open as the author moves through form pages. The demo's form is simpler
   (preloaded samples, not a multi-page live form), so supply minimal stub
   values OR simplify the panel so it does not gate on page position. This is
   the one place light editing of the panel is justified, because the demo's
   page model genuinely differs from Live. Keep the edit small and obvious.

## Scope — the rest of the demo

### Audience and channel (this shapes everything below)
The demo is aimed at **conference organisers and owners** — potential clients,
not the wider public, and not authors. But it goes out in **thousands of
emails** and **we cannot control where the link is forwarded**. So the demo
**must stand on its own**: a recipient who opens a forwarded link, with no
surrounding email context, must be able to understand what Dawn is and what the
demo shows without any external explanation. Write for that cold, forwarded
visitor — they are the harder case, and the page that satisfies them satisfies
the intended recipient too. There is **one audience and one call to action**;
do not build a second audience path or a share-to-author feature.

### Two-page structure

**Page 1 — self-contained explainer + domain choice.** This page carries the
entire onboarding cold:
- What Dawn is, what Dawn Free is, and what this demo shows. Assume the visitor
  arrived with zero context.
- Make clear the samples are **illustrative worked examples**, not a live tool
  the visitor feeds their own abstract into. The dropdown invites a domain
  choice, so set the expectation that they are about to see a prepared example
  — otherwise the demo reads as broken when it doesn't accept their input.
- A **domain dropdown** listing the available sample domains.
- A link/button through to page 2.
- Treat page 1 as a **cold first impression of Hyperion** — for a forwarded
  link it may be the visitor's first ever contact with us.

**Page 2 — the demo + capture.**
- Shows the selected sample's **dummy abstract title and body**.
- Runs the canned analysis through the reused panel (structural → streamed
  author feedback → presentation suitability), with the faked typewriter.
- **Lead capture sits at the end, after the mock output.** See below.

### Dropdown + URL preselect (with graceful fallback)
- The **dropdown is the baseline** — always present, serves every visitor
  including forwarded ones who self-select their field.
- A **URL query parameter pre-selects** the dropdown (e.g. `?sample=cardio`
  selects cardiology) so a targeted email lands on the recipient's own field
  and feels bespoke. The parameter is an *enhancement layer* on top of the
  dropdown, not the only way in.
- **Graceful fallback is mandatory.** At thousands of sends with forwarding,
  malformed, stale, or unknown parameter values are a certainty
  (`?sample=cardiology` when the key is `cardio`, a domain with no sample, junk).
  Any unrecognised value must **silently fall back to the dropdown default** —
  no error, no broken state. A bad parameter degrades to the normal
  first-time-visitor experience. (The naive "select the option matching the
  param" implementation will misbehave on no-match unless told otherwise.)

### Streaming duration must serve the CTA, not bury it
Capture now sits *after* the mock output, so the visitor must reach it. The
faked typewriter should feel authentic (see the typewriter section) **but must
not test anyone's patience** — tuned purely for realism it could run long
enough to lose an organiser before the capture appears. The whole sequence
(structural, then streamed feedback, then presentation) should complete in a
span that **holds attention**, not minutes of crawling text. Realistic cadence,
bounded total duration.

OPEN DECISION (do not pick unilaterally — leave both paths easy to switch):
whether the capture field is **revealed when the output completes** (cleaner,
more orchestrated) or **present throughout** (respects the already-convinced
visitor who shouldn't wait out the animation). Lean: field becomes available
once the output has begun resolving, so orchestration is preserved without
holding a keen visitor hostage to the typewriter. Flag this for a human choice.

### Lead capture (the commercial mechanism)
- An **email contact field** plus whatever minimal context makes follow-up
  useful (name, organisation).
- Send the captured lead somewhere reliable — SES or a form service. **At low
  expected volume, do not build a database or CRM.** Email-to-inbox is enough.
- **Capture must fail LOUDLY.** If the lead does not get through, that must
  surface as an error to us — never a silent drop. A lead lost from a campaign
  we paid to send is the one failure with no recovery. Do not swallow capture
  errors; do not let the UI report success on a failed send.
- There is **no self-serve path** to the full product. The call-to-action
  captures interest and hands off to a human. Do not build account creation,
  provisioning, or any route into the Live variant.

## Mock data (the demo's content)

The demo needs a **library of sample fixtures**, one per offered domain. Each
fixture is a pair: a **mock abstract** (title + body) and the **mock Dawn output**
for it (structural suggestions + author feedback + presentation suitability).

Requirements for the data:
- **The abstracts are illustrative, not real** — they don't need to be true
  science, only to read like a plausible abstract in that field.
- **Design the abstract and its feedback together.** A good demo abstract has
  *deliberate, visible-in-the-text* issues so Dawn has something real to say —
  e.g. an aim left implicit, an undefined abbreviation, a result stated vaguely,
  a conclusion that doesn't obviously connect to the result. The feedback then
  points at exactly those planted issues. Feedback that doesn't correspond to
  something in the abstract is the hallucination failure the product exists to
  avoid — don't fake it.
- **Include at least one strong sample** with `suggestions: []` (success card)
  and author feedback that says the abstract reads well with little to add —
  so the demo shows Dawn knows when to stay quiet rather than manufacturing
  nitpicks.
- **All feedback in Dawn's register** (see the register section): about the
  writing, never the science; advisory phrasing; anchored to the text.
- **Presentation suitability** should be consistent with the abstract — a
  finished study with results suits oral (HIGH); preliminary work suits poster
  (LOW). Make `authorSummary` and the signal ratings tell a coherent story.
- **Topic advice in every fixture.** Each fixture supplies a `taxonomy` (the
  conference's theme list) and a topic result that matches the abstract against
  it, demonstrating one of the four states: `none` (confident single match),
  `same_parent` (two sibling themes — lead with one, flag the other),
  `cross_parent` (two themes in different branches — no pick, author chooses),
  `no_match` (nothing fits — say so, point to a more suitable category). Topic
  messages follow Dawn's register: name the theme(s), give the text-anchored
  reason, never invent a theme outside the taxonomy.

Coverage: build for the **campaign's target fields**, not all of science. (The
target domain list is a decision for the Hyperion team — see the open item at
the foot of this file.)

The mock abstracts and outputs are content/product work, not code — they will
be supplied (or drafted and reviewed) rather than invented freely by the build.
Treat the fixture *files* as the integration point: a clear per-domain data
structure the fixture-driver reads, so content can be edited without touching
component code.

## Tech stack & conventions

- Node.js, JavaScript, **ESM** (`import`), AWS SDK **v3**
- AWS Amplify (dev / staging / prod environments)
- **MUI (Material UI)** — the panel is already built in MUI; match it for any
  surrounding UI (form, capture field) rather than introducing another library.
- Company: Hyperion
- Editor: WebStorm
- Keep the dependency surface small. This is a static demo; resist frameworks
  and infrastructure it does not need.

## What NOT to build
- No AI / no API calls / no inference / no AppSync subscription or mutation.
- No database, no CRM, no analytics pipeline.
- No account creation, login, or path into the Live variant.
- No VPC, EFS, queues, or backend coordination — none of the OZ architecture
  touches this variant.
- No parallel typewriter animation — drive the panel's existing streaming path.
- No elaborate framework scaffolding. Static frontend plus a capture path.

## Logging
Light logging only. Enough to confirm the demo loaded, which sample was viewed,
and — importantly — whether a capture succeeded or failed. The capture
success/failure signal is the one log that matters.
