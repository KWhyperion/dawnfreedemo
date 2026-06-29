import {useCallback, useEffect, useRef, useState} from 'react';

// ── useFixtureDriver ─────────────────────────────────────────────────────────
//
// Replaces the Live useAbstractAnalysis hook. It performs NO network work — no
// AppSync, no mutation, no subscription, no inference. It reads a canned fixture
// and emits the SAME result shape the panel consumes, on a timer, reproducing
// the three-phase sequence the Live hook documents:
//
//   1. isAnalysingStructure (Phase 1 in flight)  →  publish `structural`
//   2. isStreaming, with `author.comments` GROWING in small chunks  (Phase 2)
//   3. publish `presentation` (Phase 3) after the feedback settles
//
// The "typewriter" is NOT a separate animation — it is the same mechanism Live
// uses (comments appended chunk-by-chunk while isStreaming is true), which the
// panel already renders progressively. Driving the panel's existing path is what
// keeps the demo honest.
//
// Total duration is bounded (see TIMING) so an organiser reaches the capture CTA
// rather than waiting out minutes of crawling text.

const TIMING = {
    STRUCTURAL_DELAY: 500,    // "analysing structure" beat (isAnalysingStructure true) before structural appears; overridable via opts.structuralDelay
    GAP_BEFORE_FEEDBACK: 1000, // pause after structural, before detailed feedback streams
    TICK_MIN_MS: 45,          // streaming cadence (jittered between min/max)
    TICK_MAX_MS: 90,
    BASE_CHARS_PER_TICK: 3,   // chars released per tick (jittered up)
    MAX_STREAM_MS: 10000,     // hard cap on Phase 2 — long fixtures speed up to fit
    THEME_DELAY: 200,         // after author stream completes → conference theme block; overridable via opts.themeDelay
    PRESENTATION_DELAY: 200,  // theme block shown → presentation suitability; overridable via opts.presentationDelay
};

function emptyResult() {
    // Mirrors the Live hook's emptyResult() so the shape is identical.
    return {
        structural: null,
        author: {comments: null},
        presentation: null,
        score: null,
    };
}

/**
 * @param {object|null} sample  a fixture (see src/fixtures/*) or null
 * @param {{auto?: boolean}} [opts]  auto-start the sequence on mount (default true)
 */
export default function useFixtureDriver(sample, opts = {}) {
    const {
        auto = true,
        structuralDelay = TIMING.STRUCTURAL_DELAY,
        themeDelay = TIMING.THEME_DELAY,
        presentationDelay = TIMING.PRESENTATION_DELAY,
    } = opts;

    const [result, setResult] = useState(emptyResult);
    const [isAnalysingStructure, setIsAnalysingStructure] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    // Mutable run state held in refs so timers can be cancelled cleanly and the
    // sequence never double-runs (e.g. under React StrictMode's mount/remount).
    const timersRef = useRef([]);
    const runningRef = useRef(false);
    const commentsRef = useRef('');

    const clearTimers = useCallback(() => {
        for (const id of timersRef.current) clearTimeout(id);
        timersRef.current = [];
    }, []);

    const schedule = useCallback((fn, ms) => {
        const id = setTimeout(fn, ms);
        timersRef.current.push(id);
        return id;
    }, []);

    const reset = useCallback(() => {
        clearTimers();
        runningRef.current = false;
        commentsRef.current = '';
        setResult(emptyResult());
        setIsAnalysingStructure(false);
        setIsStreaming(false);
        setHasStarted(false);
    }, [clearTimers]);

    const start = useCallback(() => {
        if (!sample || runningRef.current) return;
        runningRef.current = true;
        clearTimers();
        commentsRef.current = '';

        const {structural, authorComments = '', presentation, classifications} =
            sample.analysis || {};

        // ── Phase 1: structural analysis in flight ───────────────────────────
        setHasStarted(true);
        setResult(emptyResult());
        setIsAnalysingStructure(true);
        setIsStreaming(false);

        schedule(() => {
            // Publish structural — output has now begun resolving. Topic data is
            // held back: it's merged into structural.classifications only after the
            // author stream completes (see below), so the theme block reveals after
            // the feedback rather than alongside the Phase 1 result.
            setIsAnalysingStructure(false);
            setResult((prev) => ({
                ...prev,
                structural,
                score: structural?.structureScore ?? null,
            }));

            // ── Phase 2: stream author.comments in small chunks ──────────────
            // Hold a beat after the structural results before the feedback begins.
            schedule(startStreaming, TIMING.GAP_BEFORE_FEEDBACK);
        }, structuralDelay);

        function startStreaming() {
            setIsStreaming(true);

            const text = authorComments || '';
            // Size each chunk so the whole stream fits inside MAX_STREAM_MS even
            // for long fixtures, but never smaller than BASE_CHARS_PER_TICK.
            const avgTick = (TIMING.TICK_MIN_MS + TIMING.TICK_MAX_MS) / 2;
            const maxTicks = Math.max(1, Math.floor(TIMING.MAX_STREAM_MS / avgTick));
            const minChars = Math.ceil(text.length / maxTicks);
            const baseChars = Math.max(TIMING.BASE_CHARS_PER_TICK, minChars);

            const tick = () => {
                if (commentsRef.current.length >= text.length) {
                    // Phase 2 complete — stream finished (isStreaming now false).
                    setIsStreaming(false);
                    // ── Reveal theme, then presentation, each after a beat. Both
                    //    wait for the stream to COMPLETE, not appear alongside it. ──
                    schedule(() => {
                        // Conference theme: merge topic data into structural.classifications.
                        setResult((prev) => ({
                            ...prev,
                            structural: {...prev.structural, classifications},
                        }));
                        // Presentation suitability follows after a further beat.
                        schedule(() => {
                            setResult((prev) => ({...prev, presentation}));
                        }, presentationDelay);
                    }, themeDelay);
                    return;
                }
                // Release a few chars, jittered, biased to break on whitespace so
                // chunks look like word groups rather than mid-word cuts.
                const jitter = Math.floor(Math.random() * 5); // 0–4 extra
                let next = Math.min(
                    text.length,
                    commentsRef.current.length + baseChars + jitter,
                );
                const ws = text.indexOf(' ', next);
                if (ws !== -1 && ws - next <= 6) next = ws + 1;

                commentsRef.current = text.slice(0, next);
                const comments = commentsRef.current;
                setResult((prev) => ({...prev, author: {comments}}));

                const delay =
                    TIMING.TICK_MIN_MS +
                    Math.random() * (TIMING.TICK_MAX_MS - TIMING.TICK_MIN_MS);
                schedule(tick, delay);
            };

            tick();
        }
    }, [sample, clearTimers, schedule, structuralDelay, themeDelay, presentationDelay]);

    // Auto-start once per sample. Cleanup cancels every pending timer so a
    // StrictMode remount (or sample change) never leaves a stream running.
    useEffect(() => {
        if (auto && sample) start();
        return () => {
            clearTimers();
            runningRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sample]);

    const outputBegun = !!result.structural; // output has begun resolving
    const isComplete = !!result.presentation && !isStreaming;

    return {
        // Panel-facing result shape (identical to the Live hook)
        structural: result.structural,
        author: result.author,
        presentation: result.presentation,
        score: result.score,
        isAnalysingStructure,
        isStreaming,
        // Demo orchestration signals (capture timing lives off `outputBegun`)
        hasStarted,
        outputBegun,
        isComplete,
        start,
        reset,
    };
}