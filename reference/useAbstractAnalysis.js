/**
 * useAbstractAnalysis.js
 *
 * React hook for AI abstract analysis via the aiAnalysis AppSync Lambda.
 *
 * Flow:
 *   1. Subscribe to onStreamChunk(submissionId) BEFORE firing the mutation
 *   2. Fire Stage 1 mutation — returns structural results (~1s)
 *      - Auto-selects classification fields where recommendation is unambiguous
 *      - Publishes result.structural immediately
 *   3. Lambda streams Phase 2 (author feedback) as chunks via subscription
 *      - result.author.comments builds up progressively (typewriter effect)
 *      - isStreaming resolves when chunk { done: false, chunk: '', payload: null } arrives
 *   4. Lambda publishes Phase 3 results via { done: true, payload: { presentation, score, ... } }
 *      - result.presentation, result.score, result.reviewer, result.admin populated
 *      - Subscription torn down
 *
 * Result shape:
 *   result: {
 *     structural: {
 *       structureScore, sectionBreakdown, titleAlignment,
 *       vaguenessFlags, suggestions, classifications
 *     },
 *     author:               { comments: string | null },
 *     presentation:         { submissionType, signals, combined, authorSummary } | null,
 *     score:                number | null,
 *     confidenceLevel:      string | null,
 *     specialistReviewNeeded: boolean,
 *     reviewer:             { comments: string | null } | null,
 *     admin:                { comments: string | null } | null,
 *   }
 *
 * Loading states:
 *   isAnalysingStructure — true while Stage 1 mutation is in flight
 *   isStreaming          — true while Phase 2 chunks are arriving
 *
 * analysisConfig shape (from form.meta.AI.analysis):
 *   {
 *     title:    { fields: ['titleField'], separator: ' ' },
 *     abstract: { fields: ['body'], separator: '\n\n' },
 *     classifications: [{ field: 'topic', taxonomy: 'topics.json', autoSelect: true }]
 *   }
 *
 * Props:
 *   form         — form object (provides token and analysisConfig)
 *   submission   — full submission object (provides id and existing analysis)
 *   controlStatesRef — ref to current control values
 *   onTopicRecommend — (fieldKey, value) => void, called on unambiguous classification
 *
 * Location: src/hooks/useAbstractAnalysis.js
 */

import {useEffect, useRef, useCallback, useState} from 'react';
import {generateClient} from 'aws-amplify/api';

const client = generateClient();

// ============================================
// GraphQL
// ============================================

const stage1Mutation = /* GraphQL */ `
  mutation AnalyseAbstract($input: AnalysisInput!) {
    analyseAbstract(input: $input) {
      structureScore
      sectionBreakdown
      titleAlignment
      vaguenessFlags
      suggestions
      classificationResults
    }
  }
`;

// Minimal warm-up — triggers cold start without real analysis
const warmUpMutation = /* GraphQL */ `
  mutation AnalyseAbstract($input: AnalysisInput!) {
    analyseAbstract(input: $input) {
      structureScore
    }
  }
`;

const streamChunkSubscription = /* GraphQL */ `
  subscription OnStreamChunk($submissionId: ID!) {
    onStreamChunk(submissionId: $submissionId) {
      submissionId
      chunk
      done
      payload
    }
  }
`;

// ============================================
// Field resolution helpers
// ============================================

function resolveField(fieldConfig, data) {
    if (!fieldConfig?.fields?.length || !data) return '';

    const values = fieldConfig.fields
        .map(key => {
            const val = data[key];
            if (val && typeof val === 'object' && 'value' in val) return val.value;
            return val;
        })
        .filter(v => typeof v === 'string' && v.trim().length > 0);

    const separator = fieldConfig.separator || ' ';
    return values.join(separator).trim();
}

function stripHTML(str) {
    if (!str) return '';
    return str
        .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function safeParseJSON(value) {
    if (value == null) return null;
    if (typeof value === 'object') return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

// ============================================
// Initial result state
// ============================================

function emptyResult() {
    return {
        structural: null,
        author: {comments: null},
        presentation: null,
        score: null,
        confidenceLevel: null,
        specialistReviewNeeded: false,
        reviewer: null,
        admin: null,
    };
}

// ============================================
// Hook
// ============================================

export function useAbstractAnalysis({form, submission, controlStatesRef, onTopicRecommend}) {
    const submissionId = submission?.id ?? null;

    const [isAnalysingStructure, setIsAnalysingStructure] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const phase3ReceivedRef = useRef(false);

    const hasWarmedUp = useRef(false);
    const prevSubmissionIdRef = useRef(submissionId);
    const subscriptionRef = useRef(null);
    const submissionRef = useRef(submission);
    useEffect(() => {
        submissionRef.current = submission;
    }, [submission]);

    // Keep onTopicRecommend stable across renders
    const onTopicRecommendRef = useRef(onTopicRecommend);
    useEffect(() => {
        onTopicRecommendRef.current = onTopicRecommend;
    }, [onTopicRecommend]);

    const formToken = form?.token;
    const analysisConfig = form?.meta?.AI?.analysis;

    // ── Warm-up on mount ─────────────────────────────────────────────
    useEffect(() => {
        if (!formToken || hasWarmedUp.current) return;
        hasWarmedUp.current = true;

        (async () => {
            try {
                console.log('[AI Analysis] Warming up Lambda...');
                await client.graphql({
                    query: warmUpMutation,
                    variables: {
                        input: {
                            title: 'warmup',
                            abstract: 'This is a warm-up request to initialise the analysis Lambda. It contains enough characters to pass the minimum length validation check on the server side.',
                            formToken,
                            phase: 1,
                        },
                    },
                });
                console.log('[AI Analysis] Lambda warm');
            } catch (err) {
                console.warn('[AI Analysis] Warm-up failed (non-critical):', err.message || err);
            }
        })();
    }, [formToken]);

    // ── Restore analysis from submission record on mount / submission change ─
    // Populates result from submission.analysis so the author sees their
    // previous analysis immediately on re-entry without re-running.
    useEffect(() => {
        if (submissionId === prevSubmissionIdRef.current) return;
        prevSubmissionIdRef.current = submissionId;
        tearDownSubscription();
        setError(null);
        setIsAnalysingStructure(false);
        setIsStreaming(false);

        const existing = safeParseJSON(submissionRef.current?.analysis);
        if (existing) {
            console.log('[AI Analysis] Restoring analysis from submission record');
            setResult({
                structural: existing.structural ?? null,
                author: existing.author ?? {comments: null},
                presentation: existing.presentation ?? null,
                score: existing.score ?? null,
                confidenceLevel: existing.confidenceLevel ?? null,
                specialistReviewNeeded: existing.specialistReviewNeeded ?? false,
                reviewer: existing.reviewer ?? null,
                admin: existing.admin ?? null,
            });
        } else {
            console.log('[AI Analysis] No existing analysis — clearing results');
            setResult(null);
        }
    }, [submissionId]);

    // ── Cleanup subscription on unmount ──────────────────────────────
    useEffect(() => {
        return () => tearDownSubscription();
    }, []);

    function tearDownSubscription() {
        if (subscriptionRef.current) {
            try {
                subscriptionRef.current.unsubscribe();
            } catch (e) {
                // ignore
            }
            subscriptionRef.current = null;
            console.log('[AI Analysis] Subscription torn down');
        }
    }

    // ── Subscribe ────────────────────────────────────────────────────
    /**
     * Sets up the AppSync subscription for streaming chunks.
     * Must be called BEFORE firing the Stage 1 mutation to avoid
     * missing early chunks.
     *
     * Chunk protocol:
     *   { done: false, chunk: <text>, payload: null }  — streaming text, append to author.comments
     *   { done: false, chunk: '',     payload: null }  — Phase 2 complete, resolve typewriter
     *   { done: true,  chunk: '',     payload: {...} } — Phase 3 complete, distribute payload
     */

    const subscribeToChunks = useCallback(() => {
        if (!submissionId) return Promise.resolve();
        tearDownSubscription();

        console.log('[AI Analysis] Subscribing with submissionId:', submissionId);

        return new Promise((resolve) => {
            const sub = client.graphql({
                query: streamChunkSubscription,
                variables: {submissionId},
                authMode: 'userPool',
            }).subscribe({
                next: (rawMessage) => {
                    console.log('[AI Analysis] Raw subscription event:', JSON.stringify(rawMessage));
                    const msg = rawMessage?.data?.onStreamChunk;
                    if (!msg) return;

                    const {chunk, done, payload} = msg;

                    // ── Phase 3 complete ─────────────────────────────────
                    if (done) {
                        console.log('[AI Analysis] done:true received — Phase 3 complete');
                        phase3ReceivedRef.current = true;
                        const p = safeParseJSON(payload);
                        if (p) {
                            setResult(prev => ({
                                ...prev,
                                presentation: p.presentation ?? null,
                                score: p.score ?? null,
                                confidenceLevel: p.confidenceLevel ?? null,
                                specialistReviewNeeded: p.specialistReviewNeeded ?? false,
                            }));
                        }
                        setIsStreaming(false);
                        return;
                    }

                    // ── Phase 2 complete signal ──────────────────────────
                    if (chunk === '' && !payload) {
                        console.log('[AI Analysis] Phase 2 complete signal received');
                        setIsStreaming(false);
                        return;
                    }

                    // ── Streaming chunk ──────────────────────────────────
                    if (chunk) {
                        setResult(prev => ({
                            ...prev,
                            author: {
                                comments: ((prev?.author?.comments) || '') + chunk,
                            },
                        }));
                    }
                },
                error: (err) => {
                    console.error('[AI Analysis] Subscription error:', err);
                    setError('Streaming connection failed');
                    setIsStreaming(false);
                    tearDownSubscription();
                    resolve();
                },
            });

            subscriptionRef.current = sub;

            // Wait for WebSocket handshake to complete before resolving.
            // Amplify v6 doesn't expose a clean connection-established callback,
            // so we use a conservative fixed delay.
            setTimeout(resolve, 500);
        });
    }, [submissionId]);


    // ── Analyse ──────────────────────────────────────────────────────
    const analyse = useCallback(
        async (inputData) => {
            if (!analysisConfig || !formToken || !inputData) {
                console.warn('[AI Analysis] Missing config, formToken, or data — skipping');
                return null;
            }

            if (!submissionId) {
                console.warn('[AI Analysis] Missing submissionId — skipping full pipeline');
                return null;
            }

            const titleConfig = analysisConfig.title;
            const abstractConfig = analysisConfig.abstract;

            if (!titleConfig || !abstractConfig) {
                console.warn('[AI Analysis] Missing title or abstract config in meta.AI.analysis');
                return null;
            }

            const title = stripHTML(resolveField(titleConfig, inputData));
            const abstract = stripHTML(resolveField(abstractConfig, inputData));

            if (!title || !abstract) {
                console.log('[AI Analysis] Title or abstract empty — skipping');
                return null;
            }

            if (abstract.length < 100) {
                console.log('[AI Analysis] Abstract too short (<100 chars) — skipping');
                return null;
            }

            // Reset state
            setIsAnalysingStructure(true);
            setIsStreaming(false);
            setError(null);
            setResult(emptyResult());
            phase3ReceivedRef.current = false;

            // Subscribe and wait for connection before firing the mutation
            await subscribeToChunks();

            try {
                // ── Stage 1: structural analysis ─────────────────────
                console.log('[AI Analysis] Stage 1: firing mutation...');

                const stage1Response = await client.graphql({
                    query: stage1Mutation,
                    variables: {
                        input: {
                            title,
                            abstract,
                            formToken,
                            submissionId,
                            analysisConfig: JSON.stringify(analysisConfig),
                        },
                    },
                });

                setIsAnalysingStructure(false);

                const raw = stage1Response.data.analyseAbstract;

                const structural = {
                    structureScore: raw.structureScore,
                    sectionBreakdown: safeParseJSON(raw.sectionBreakdown),
                    titleAlignment: raw.titleAlignment,
                    vaguenessFlags: safeParseJSON(raw.vaguenessFlags),
                    suggestions: raw.suggestions,
                    classifications: safeParseJSON(raw.classificationResults),
                };

                console.log('[AI Analysis] Stage 1 result:', structural);

                // Publish structural results immediately
                setResult(prev => ({...prev, structural}));

                // Auto-select classifications where unambiguous
                const classifications = analysisConfig.classifications || [];
                for (const cls of classifications) {
                    if (!cls.autoSelect) continue;
                    const clsResult = structural.classifications?.[cls.field];
                    if (
                        clsResult?.recommendation?.value &&
                        clsResult?.ambiguity?.detected === false &&
                        typeof onTopicRecommendRef.current === 'function'
                    ) {
                        console.log(`[AI Analysis] Auto-selecting ${cls.field}:`, clsResult.recommendation.value);
                        onTopicRecommendRef.current(cls.field, clsResult.recommendation.value);
                    }
                }

                // Only tear down if Phase 3 payload already received
                // (pipeline completed before Stage 1 response returned).
                // Otherwise leave subscription running to receive chunks.
                if (phase3ReceivedRef.current) {
                    tearDownSubscription();
                }

                // Phase 2 streams server-side — flag isStreaming so the UI
                // can show a typewriter indicator while chunks arrive
                setIsStreaming(true);

                console.log('[AI Analysis] Stage 1 complete — waiting for stream...');
                return structural;

            } catch (err) {
                const message = err?.errors?.[0]?.message || err.message || 'Analysis failed';
                console.error('[AI Analysis] Error:', message);
                setError(message);
                setIsAnalysingStructure(false);
                setIsStreaming(false);
                tearDownSubscription();
                return null;
            }
        },
        [analysisConfig, formToken, submissionId, subscribeToChunks],
    );

    return {analyse, isAnalysingStructure, isStreaming, result, error};
}

export default useAbstractAnalysis;
