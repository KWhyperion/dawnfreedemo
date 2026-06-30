import React, {useState, useCallback, useRef, useMemo, useEffect} from 'react';
import {
    Box,
    Card,
    Typography,
    Fade,
    Slide,
    Collapse,
    keyframes,
    Chip,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import faceIcon from '../../assets/face.png';
import faceBlueIcon from '../../assets/face_blue.png';

// ── Safe sessionStorage (demo adaptation) ────────────────────────
// The panel uses sessionStorage only to play its intro animation once. A
// forwarded demo link can be opened in sandboxed/embedded contexts where
// sessionStorage access throws; this wrapper guarantees it never does.
const safeSession = {
    get(key) {
        try {
            return window.sessionStorage.getItem(key);
        } catch {
            return null;
        }
    },
    set(key, val) {
        try {
            window.sessionStorage.setItem(key, val);
        } catch { /* no-op */
        }
    },
    remove(key) {
        try {
            window.sessionStorage.removeItem(key);
        } catch { /* no-op */
        }
    },
};

// ── Pulse animation ──────────────────────────────────────────────
const pulse = keyframes`
    0%, 100% {
        opacity: 0.3;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.5);
    }
`;

const textPulse = keyframes`
    0%, 100% {
        opacity: 0.4;
    }
    50% {
        opacity: 1;
    }
`;

// ── Markdown-to-JSX renderer ─────────────────────────────────────
function renderMarkdown(text) {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let currentList = null;
    let key = 0;

    const flushList = () => {
        if (!currentList) return;
        const Tag = currentList.type === 'ol' ? 'ol' : 'ul';
        elements.push(
            <Tag key={key++} style={{margin: '6px 0', paddingLeft: 20, fontSize: 13, color: '#444', lineHeight: 1.65}}>
                {currentList.items.map((item, i) => (
                    <li key={i}>{inlineFormat(item)}</li>
                ))}
            </Tag>
        );
        currentList = null;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (trimmed === '') {
            flushList();
            continue;
        }

        const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
        if (headingMatch) {
            flushList();
            const level = headingMatch[1].length;
            const Tag = level === 2 ? 'h5' : 'h6';
            const sx = level === 2
                ? {fontSize: 14, fontWeight: 600, color: '#333', mt: 1.5, mb: 0.75}
                : {fontSize: 13, fontWeight: 600, color: '#444', mt: 1.25, mb: 0.5};
            elements.push(
                <Typography key={key++} component={Tag} sx={sx}>
                    {inlineFormat(headingMatch[2])}
                </Typography>
            );
            continue;
        }

        const olMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
        if (olMatch) {
            if (currentList?.type !== 'ol') {
                flushList();
                currentList = {type: 'ol', items: []};
            }
            currentList.items.push(olMatch[1]);
            continue;
        }

        const ulMatch = trimmed.match(/^[-*]\s+(.+)$/);
        if (ulMatch) {
            if (currentList?.type !== 'ul') {
                flushList();
                currentList = {type: 'ul', items: []};
            }
            currentList.items.push(ulMatch[1]);
            continue;
        }

        flushList();
        elements.push(
            <Typography
                key={key++}
                variant="body2"
                sx={{color: 'text.secondary', lineHeight: 1.65, mb: 0.75}}
            >
                {inlineFormat(trimmed)}
            </Typography>
        );
    }

    flushList();
    return elements;
}

function inlineFormat(text) {
    if (!text) return text;

    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

        let earliest = null;
        let type = null;

        if (boldMatch && (!earliest || boldMatch.index < earliest.index)) {
            earliest = boldMatch;
            type = 'bold';
        }
        if (italicMatch && (!earliest || italicMatch.index < earliest.index)) {
            earliest = italicMatch;
            type = 'italic';
        }

        if (!earliest) {
            parts.push(remaining);
            break;
        }

        if (earliest.index > 0) {
            parts.push(remaining.slice(0, earliest.index));
        }

        if (type === 'bold') {
            parts.push(<strong key={key++}>{earliest[1]}</strong>);
        } else {
            parts.push(<em key={key++}>{earliest[1]}</em>);
        }

        remaining = remaining.slice(earliest.index + earliest[0].length);
    }

    return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

// ── Animated header ──────────────────────────────────────────────
function AnimatedHeader({hasIntroPlayed, onIntroEnd}) {
    const [phase, setPhase] = useState(hasIntroPlayed ? 'settled' : 'centre');

    useEffect(() => {
        if (hasIntroPlayed) {
            setPhase('settled');
            return;
        }

        // Hold for 0.75s before starting the transition
        const holdTimer = setTimeout(() => {
            setPhase('settling');
            const endTimer = setTimeout(() => {
                setPhase('settled');
                onIntroEnd();
            }, 1000);
            return () => clearTimeout(endTimer);
        }, 750);

        return () => clearTimeout(holdTimer);
    }, [hasIntroPlayed, onIntroEnd]);

    const isCentred = phase === 'centre';
    const isSettled = phase === 'settled';
    const isSettling = phase === 'settling';
    const inTransition = isSettling || isSettled;

    // Crossfade: blue logo fades out during settling, sun logo fades in
    // Blue fully visible at centre, fully gone by settled
    const blueOpacity = isCentred ? 1 : 0;
    // Sun logo: invisible at centre, fully visible once settled
    const sunOpacity = isCentred ? 0 : 1;

    return (
        <Box
            sx={{
                position: 'relative',
                borderBottom: '1px solid',
                borderColor: 'divider',
                flexShrink: 0,
                overflow: 'hidden',
                height: isCentred ? 200 : 72,
                transition: inTransition ? 'height 1s ease-in-out' : 'none',
            }}
        >
            {/* ── Blue logo (fades out during transition) ── */}
            <Box
                component="img"
                src={faceBlueIcon}
                alt=""
                sx={{
                    position: 'absolute',
                    borderRadius: 1,
                    width: isCentred ? 150 : 48,
                    height: 'auto',
                    left: isCentred ? '50%' : 16,
                    top: isCentred ? '33%' : 12,
                    transform: isCentred ? 'translate(-50%, -50%)' : 'translate(0, 0)',
                    opacity: blueOpacity,
                    transition: inTransition ? 'all 1s ease-in-out, opacity 1s ease-in-out' : 'none',
                    zIndex: 2,
                }}
            />

            {/* ── Sun logo (fades in during transition) ── */}
            <Box
                component="img"
                src={faceIcon}
                alt=""
                sx={{
                    position: 'absolute',
                    borderRadius: 1,
                    width: isCentred ? 150 : 48,
                    height: 'auto',
                    left: isCentred ? '50%' : 16,
                    top: isCentred ? '33%' : 12,
                    transform: isCentred ? 'translate(-50%, -50%)' : 'translate(0, 0)',
                    opacity: sunOpacity,
                    transition: inTransition ? 'all 1s ease-in-out, opacity 1s ease-in-out' : 'none',
                    zIndex: 1,
                }}
            />

            {/* ── Centre phase: "Dawn" large and centred ── */}
            <Typography
                sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '72%',
                    transform: 'translateX(-50%)',
                    fontWeight: 600,
                    fontSize: 22,
                    color: '#333',
                    opacity: isCentred ? 1 : 0,
                    transition: inTransition ? 'opacity 0.5s ease-out' : 'none',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                }}
            >
                Dawn
            </Typography>

            {/* ── Settled phase: "Dawn" italic + "AI Assistant" ── */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 76,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: isSettled ? 1 : 0,
                    transition: 'opacity 0.4s ease-in',
                    pointerEvents: 'none',
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: 15,
                        fontStyle: 'italic',
                        color: '#333',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                    }}
                >
                    Dawn
                </Typography>
                <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: 13,
                        color: '#666',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                    }}
                >
                    AI Assistant
                </Typography>
            </Box>
        </Box>
    );
}

// ── Indicators ───────────────────────────────────────────────────
function AnalysingIndicator() {
    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.25, py: 2}}>
            <Box sx={{
                width: 8, height: 8, borderRadius: '50%', bgcolor: '#90caf9',
                animation: `${pulse} 1.4s ease-in-out infinite`,
            }}/>
            <Typography variant="body2" sx={{
                color: '#888', fontStyle: 'italic',
                animation: `${textPulse} 1.4s ease-in-out infinite`,
                borderBottom: '1px dotted #ccc', pb: '1px',
            }}>
                Analysing…
            </Typography>
        </Box>
    );
}

function PulseDot() {
    return (
        <Box sx={{
            width: 8, height: 8, borderRadius: '50%', bgcolor: '#90caf9',
            flexShrink: 0, animation: `${pulse} 1.4s ease-in-out infinite`,
        }}/>
    );
}

function WaitingIndicator() {
    return (
        <Box sx={{py: 2}}>
            <Typography variant="body2" sx={{color: '#aaa', fontStyle: 'italic'}}>
                Waiting for abstract…
            </Typography>
        </Box>
    );
}

// ── Accordion ────────────────────────────────────────────────────
/**
 * A collapsible section with a clickable header.
 * `isOpen` is the resolved open state (after applying override logic).
 * `onToggle` is called when the user clicks the header.
 * `pending` shows a pulse dot in the header when data hasn't arrived yet.
 */
function AccordionSection({title, isOpen, onToggle, pending = false, children}) {
    return (
        <Box sx={{mb: 0.5}}>
            <Box
                onClick={onToggle}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    py: 1,
                    px: 0.5,
                    borderRadius: 1,
                    userSelect: 'none',
                    '&:hover': {bgcolor: 'action.hover'},
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Typography sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'text.secondary',
                    }}>
                        {title}
                    </Typography>
                    {pending && <PulseDot/>}
                </Box>
                {isOpen
                    ? <ExpandLessIcon sx={{fontSize: 16, color: 'text.secondary'}}/>
                    : <ExpandMoreIcon sx={{fontSize: 16, color: 'text.secondary'}}/>
                }
            </Box>
            <Collapse in={isOpen} timeout="auto">
                <Box sx={{pb: 1.5}}>
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
}

// ── Topic block ──────────────────────────────────────────────────
const AMBIGUITY_STYLES = {
    none: {
        bgcolor: '#e3f2fd',
        borderLeft: '3px solid #2196f3',
        color: '#0d47a1',
        icon: <InfoOutlinedIcon sx={{fontSize: 16, mt: '1px', color: '#2196f3'}}/>,
    },
    same_parent: {
        bgcolor: '#fff8e1',
        borderLeft: '3px solid #ffa726',
        color: '#5d4037',
        icon: <WarningAmberIcon sx={{fontSize: 16, mt: '1px', color: '#ffa726'}}/>,
    },
    cross_parent: {
        bgcolor: '#fff8e1',
        borderLeft: '3px solid #ffa726',
        color: '#5d4037',
        icon: <WarningAmberIcon sx={{fontSize: 16, mt: '1px', color: '#ffa726'}}/>,
    },
    no_match: {
        bgcolor: '#fafafa',
        borderLeft: '3px solid #bdbdbd',
        color: '#555',
        icon: <InfoOutlinedIcon sx={{fontSize: 16, mt: '1px', color: '#9e9e9e'}}/>,
    },
};

function TopicBlock({label, recommendation, ambiguity}) {
    if (!ambiguity) return null;

    const ambiguityType = ambiguity.type || 'none';
    const detected = ambiguity.detected;
    const style = AMBIGUITY_STYLES[ambiguityType] || AMBIGUITY_STYLES.none;

    if (!recommendation && !detected) return null;

    return (
        <Box sx={{mb: 1}}>
            {label && (
                <Typography variant="caption" sx={{
                    fontWeight: 600, color: 'text.secondary',
                    textTransform: 'uppercase', letterSpacing: 0.5,
                    mb: 0.5, display: 'block',
                }}>
                    {label}
                </Typography>
            )}
            <Box sx={{
                display: 'flex', alignItems: 'flex-start', gap: 1,
                px: 1.25, py: 1, borderRadius: 1.5,
                bgcolor: style.bgcolor, borderLeft: style.borderLeft,
            }}>
                {style.icon}
                <Box sx={{flex: 1}}>
                    {recommendation?.name && (
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25, flexWrap: 'wrap'}}>
                            <Typography variant="body2" sx={{fontWeight: 600, color: style.color}}>
                                {recommendation.name}
                            </Typography>
                            {!detected && (
                                <Typography component="span" variant="caption"
                                            sx={{fontWeight: 400, color: style.color, opacity: 0.75}}>
                                    {/*(auto-selected)*/}
                                </Typography>
                            )}
                        </Box>
                    )}
                    {detected && ambiguity.message && (
                        <Typography variant="body2" sx={{color: style.color, fontSize: 12, lineHeight: 1.5}}>
                            {ambiguity.message}
                        </Typography>
                    )}
                    {ambiguityType === 'no_match' && !ambiguity.message && (
                        <Typography variant="body2" sx={{color: style.color, fontSize: 12, lineHeight: 1.5}}>
                            No confident match found. Please select manually.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

// ── Suitability block ────────────────────────────────────────────
const RATING_COLOURS = {
    HIGH: {bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32'},
    MODERATE: {bg: '#fff8e1', border: '#ffa726', text: '#5d4037'},
    LOW: {bg: '#ffebee', border: '#ef5350', text: '#b71c1c'},
};

const COMBINED_LABELS = {
    HIGH: 'Well suited for oral presentation',
    MODERATE: 'May suit oral presentation',
    LOW: 'Better suited to poster format',
};

const SIGNAL_DISPLAY = {
    singleQuestion: 'Single focus',
    narrativeCoherence: 'Clear narrative',
    focusedOutcome: 'Focused outcome',
    cognitiveLoad: 'Audience load',
};

const SIGNAL_RATING_COLOURS = {
    singleQuestion: {HIGH: 'success', MODERATE: 'warning', LOW: 'error'},
    narrativeCoherence: {HIGH: 'success', MODERATE: 'warning', LOW: 'error'},
    focusedOutcome: {HIGH: 'success', MODERATE: 'warning', LOW: 'error'},
    cognitiveLoad: {LOW: 'success', MODERATE: 'warning', HIGH: 'error'},
};

function SuitabilityBlock({presentation}) {
    if (!presentation) return null;

    const combined = presentation.combined;
    const colours = RATING_COLOURS[combined] || RATING_COLOURS.MODERATE;
    const signals = presentation.signals || {};
    const visibleSignals = Object.entries(signals).filter(([, sig]) => !sig.withheld);

    return (
        <Box sx={{borderRadius: 1.5, border: `1px solid ${colours.border}`, overflow: 'hidden'}}>
            {/* Header */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 1.5, py: 1, bgcolor: colours.bg,
                borderBottom: `1px solid ${colours.border}`,
            }}>
                <Typography variant="body2" sx={{fontWeight: 600, color: colours.text, flex: 1}}>
                    {COMBINED_LABELS[combined] || combined}
                </Typography>
            </Box>

            {/* Author summary */}
            {presentation.authorSummary && (
                <Box sx={{
                    px: 1.5, py: 1,
                    borderBottom: visibleSignals.length > 0 ? `1px solid ${colours.border}30` : 'none',
                }}>
                    <Typography variant="body2" sx={{color: 'text.secondary', fontSize: 12, lineHeight: 1.6}}>
                        {presentation.authorSummary}
                    </Typography>
                </Box>
            )}

            {/* Signals */}
            {visibleSignals.length > 0 && (
                <Box sx={{px: 1.5, py: 1, display: 'flex', flexWrap: 'wrap', gap: 1}}>
                    {visibleSignals.map(([key, sig]) => (
                        <Box key={key} sx={{
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            bgcolor: 'action.hover', borderRadius: 1, px: 0.75, py: 0.4,
                        }}>
                            <Typography variant="caption" sx={{color: 'text.secondary', fontWeight: 500}}>
                                {SIGNAL_DISPLAY[key] || key}
                            </Typography>
                            <Chip
                                label={sig.rating}
                                size="small"
                                color={SIGNAL_RATING_COLOURS[key]?.[sig.rating] || 'default'}
                                sx={{fontWeight: 700, fontSize: 10, height: 18}}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

// ── Constants ────────────────────────────────────────────────────
// Demo adaptation: the panel is a fixed width here (drag-to-resize removed),
// since the demo is an orchestrated experience, not a tool the user arranges.
// Widened by a third from the Live default (340) for the demo's right-hand column.
const PANEL_WIDTH = 450;

// ── Derive which classification fields are visible on current page ─
function deriveVisibleClassificationFields(pages, pageNumber, controlStates, classifications) {
    // Demo adaptation: with no multi-page form model supplied, every classification
    // field is treated as visible, so the topic accordion auto-opens.
    if (!pages?.length) return new Set(classifications.map(cls => cls.field));
    const currentPage = pages?.[pageNumber];
    if (!currentPage?.controls) return new Set();

    // Build a set of classification field names from config
    const classificationFields = new Set(classifications.map(cls => cls.field));

    // Find controls on this page whose key matches a classification field
    // and which are not hidden
    const visible = new Set();
    for (const control of currentPage.controls) {
        if (
            classificationFields.has(control.key) &&
            controlStates[control.key]?.isHidden !== true
        ) {
            visible.add(control.key);
        }
    }
    return visible;
}

/**
 * AbstractAnalysisPanel
 *
 * Props:
 *   structural          — Phase 1 result | null
 *   author              — { comments: string | null } | null
 *   presentation        — suitability result | null
 *   score               — number | null
 *   isAnalysingStructure — true while Phase 1 is in flight
 *   isStreaming          — true while Phase 2 chunks are arriving
 *   pageNumber          — current form page index (panel hidden on page 0)
 *   totalPages          — total number of pages in the form
 *   submissionId        — current submission ID
 *   classifications     — [{ field, label, autoSelect }]
 *   pages               — normalised pages array from main.js
 *   controlStates       — current control states from main.js
 */
export default function AbstractAnalysisPanel({
                                                  structural,
                                                  author,
                                                  presentation,
                                                  score,
                                                  isAnalysingStructure,
                                                  isStreaming,
                                                  pageNumber,
                                                  totalPages,
                                                  submissionId,
                                                  classifications,
                                                  abstractFields,
                                                  pages,
                                                  controlStates,
                                              }) {
    const SESSION_KEY = 'aiPanelIntroPlayed';
    const [hasIntroPlayed, setHasIntroPlayed] = useState(false); // was: safeSession.get(...)
    const prevSubmissionIdRef = useRef(submissionId);
    const prevPageNumberRef = useRef(pageNumber);

    // userOverrides: keyed by accordion id ('classifications:<field>' or 'presentation')
    // null = no override, true = force open, false = force closed
    const [userOverrides, setUserOverrides] = useState({});

    const showPanel = pageNumber > 0;
    const isLastPage = pageNumber === totalPages - 1;

    // Derive which classification fields are visible on the current page
    const visibleClassificationFields = useMemo(
        () => deriveVisibleClassificationFields(pages, pageNumber, controlStates, classifications),
        [pages, pageNumber, controlStates, classifications]
    );

    // Derive whether any abstract field is on the current page
    const abstractOnPage = useMemo(() => {
        // Demo adaptation: with no multi-page form model supplied, the abstract is
        // always "on page", so the structural/author accordions auto-open.
        if (!pages?.length) return true;
        const currentPage = pages?.[pageNumber];
        if (!currentPage?.controls || !abstractFields?.length) return false;
        return currentPage.controls.some(
            c => abstractFields.includes(c.key) && controlStates[c.key]?.isHidden !== true
        );
    }, [pages, pageNumber, controlStates, abstractFields]);

    // ── Handle submissionId change ───────────────────────────────
    useEffect(() => {
        if (submissionId !== prevSubmissionIdRef.current) {
            prevSubmissionIdRef.current = submissionId;
            safeSession.remove(SESSION_KEY);
            setHasIntroPlayed(false);
            setUserOverrides({});
        }
    }, [submissionId]);

    // ── Reset intro when panel hides ─────────────────────────────
    useEffect(() => {
        if (!showPanel) {
            safeSession.remove(SESSION_KEY);
            setHasIntroPlayed(false);
        }
    }, [showPanel]);

    // ── Handle page change ───────────────────────────────────────
    // On page change:
    // - Automatic open always wins for newly-relevant accordions
    // - Automatic close only applies when userOverride is null
    // - Reset override for accordions that are no longer relevant to the page
    //
    // Visibility is derived inline here (not from the memo) to avoid a React
    // ordering issue where the memo may not have recalculated yet when this
    // effect fires after a pageNumber change.
    useEffect(() => {
        if (pageNumber === prevPageNumberRef.current) return;
        prevPageNumberRef.current = pageNumber;

        const newIsLastPage = pageNumber === totalPages - 1;

        // Derive visible fields directly from the new pageNumber
        const currentPage = pages?.[pageNumber];
        const classificationFields = new Set(classifications.map(cls => cls.field));
        const visibleNow = new Set();
        for (const control of (currentPage?.controls || [])) {
            if (
                classificationFields.has(control.key) &&
                controlStates[control.key]?.isHidden !== true
            ) {
                visibleNow.add(control.key);
            }
        }

        setUserOverrides(prev => {
            const next = {...prev};

            // Classifications
            for (const cls of classifications) {
                const key = `classifications:${cls.field}`;
                const isVisible = visibleNow.has(cls.field);

                if (isVisible) {
                    // Automatic open always wins — set true explicitly
                    next[key] = true;
                } else {
                    // No longer relevant — reset override
                    delete next[key];
                }
            }

            // Structural + author — open when any abstract field is on the page
            const abstractOnNewPage = (currentPage?.controls || []).some(
                c => (abstractFields || []).includes(c.key) && controlStates[c.key]?.isHidden !== true
            );

            if (abstractOnNewPage) {
                next['structural'] = true;
                next['author'] = true;
            } else {
                delete next['structural'];
                delete next['author'];
            }

            // Presentation
            if (newIsLastPage) {
                // Automatic open always wins on last page — set true explicitly
                next['presentation'] = true;
            } else {
                // No longer relevant — reset override
                delete next['presentation'];
            }

            return next;
        });
    }, [pageNumber, totalPages, classifications, abstractFields, pages, controlStates]);

    // ── Auto-expand presentation when data arrives on last page ──
    const prevPresentationRef = useRef(presentation);
    useEffect(() => {
        if (presentation && !prevPresentationRef.current && isLastPage) {
            // Data just arrived on last page — clear any override to let auto-open apply
            setUserOverrides(prev => {
                const next = {...prev};
                next['presentation'] = null;
                return next;
            });
        }
        prevPresentationRef.current = presentation;
    }, [presentation, isLastPage]);

    // ── Resolve accordion open state ─────────────────────────────
    // For a given accordion:
    //   - userOverride === true  → open
    //   - userOverride === false → closed
    //   - userOverride === null / undefined → use automatic logic
    function resolveOpen(key, automaticOpen) {
        const override = userOverrides[key];
        if (override === true) return true;
        if (override === false) return false;
        return automaticOpen;
    }

    function handleToggle(key, currentOpen) {
        setUserOverrides(prev => ({
            ...prev,
            [key]: !currentOpen,
        }));
    }

    // ── Derived states ───────────────────────────────────────────
    const hasStructural = !!structural;
    const hasAuthor = !!author?.comments;
    const hasPresentation = !!presentation;

    const isIdle = !structural && !isAnalysingStructure;
    const isReanalysing = isAnalysingStructure && !structural;

    const handleIntroEnd = useCallback(() => {
        setHasIntroPlayed(true);   // drop the safeSession.set — don't persist across loads
    }, []);

    // ── Memoised markdown ─────────────────────────────────────────
    const authorContent = useMemo(() => {
        if (!author?.comments) return null;
        return renderMarkdown(author.comments);
    }, [author?.comments]);

    if (!showPanel) return null;

    return (
        <Slide direction="right" in={showPanel} mountOnEnter unmountOnExit>
            <Box sx={{display: 'flex', flexShrink: 0, height: '100%', py: '20px', pl: '20px'}}>
                <Fade in={showPanel}>
                    <Card
                        variant="outlined"
                        sx={{
                            width: PANEL_WIDTH,
                            borderRadius: 2,
                            borderColor: '#2196f3',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                    >
                        {/* ── Header ──────────────────────────── */}
                        <AnimatedHeader
                            hasIntroPlayed={hasIntroPlayed}
                            onIntroEnd={handleIntroEnd}
                        />

                        {/* ── Scrollable body ──────────────────── */}
                        <Box sx={{
                            px: 2, py: 1.75,
                            overflowY: 'auto', flex: 1,
                            direction: 'rtl',
                            '& > *': {direction: 'ltr'},
                            '&::-webkit-scrollbar': {width: 5},
                            '&::-webkit-scrollbar-thumb': {bgcolor: '#90caf9', borderRadius: 2.5},
                            '&::-webkit-scrollbar-thumb:hover': {bgcolor: '#2196f3'},
                        }}>

                            {/* ── Idle ─────────────────────────── */}
                            {isIdle && <WaitingIndicator/>}

                            {/* ── Re-analysing ─────────────────── */}
                            {isReanalysing && <AnalysingIndicator/>}

                            {/* ── Results ──────────────────────── */}
                            {hasStructural && (
                                <>
                                    {/* ── Structural feedback accordion — open when abstract is on page ── */}
                                    {(() => {
                                        const key = 'structural';
                                        const isOpen = resolveOpen(key, abstractOnPage);
                                        return (
                                            <AccordionSection
                                                title="Structural analysis"
                                                isOpen={isOpen}
                                                onToggle={() => handleToggle(key, isOpen)}
                                            >
                                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                                    {structural.suggestions.length === 0 ? (
                                                        <AlertCard variant="success">
                                                            <CheckCircleOutlineIcon sx={{fontSize: 18, mt: '1px'}}/>
                                                            <Typography variant="body2">
                                                                Your abstract is well-structured. No issues detected.
                                                            </Typography>
                                                        </AlertCard>
                                                    ) : (
                                                        structural.suggestions.map((s, i) => (
                                                            <AlertCard key={i} variant="warning">
                                                                <WarningAmberIcon sx={{fontSize: 18, mt: '1px'}}/>
                                                                <Typography variant="body2">{s}</Typography>
                                                            </AlertCard>
                                                        ))
                                                    )}
                                                </Box>
                                            </AccordionSection>
                                        );
                                    })()}

                                    <Divider/>

                                    {/* ── Author feedback accordion — open when abstract is on page ── */}
                                    {(() => {
                                        const key = 'author';
                                        const isOpen = resolveOpen(key, abstractOnPage);
                                        return (
                                            <AccordionSection
                                                title="Detailed feedback"
                                                isOpen={isOpen}
                                                onToggle={() => handleToggle(key, isOpen)}
                                                pending={isStreaming}
                                            >
                                                {isStreaming && !hasAuthor ? (
                                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.25}}>
                                                        <PulseDot/>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Generating feedback…
                                                        </Typography>
                                                    </Box>
                                                ) : isStreaming && hasAuthor ? (
                                                    <Box>
                                                        {authorContent}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            mt: 0.5
                                                        }}>
                                                            <PulseDot/>
                                                        </Box>
                                                    </Box>
                                                ) : hasAuthor ? (
                                                    <Box>{authorContent}</Box>
                                                ) : (
                                                    <Typography variant="caption"
                                                                sx={{color: 'text.disabled', fontStyle: 'italic'}}>
                                                        Detailed feedback will appear shortly…
                                                    </Typography>
                                                )}
                                            </AccordionSection>
                                        );
                                    })()}

                                    <Divider/>

                                    {/* ── Classification accordions ── */}
                                    {classifications.map((cls, idx) => {
                                        const clsResult = structural.classifications?.[cls.field];
                                        if (!clsResult) return null;

                                        const accordionKey = `classifications:${cls.field}`;
                                        const automaticOpen = visibleClassificationFields.has(cls.field);
                                        const isOpen = resolveOpen(accordionKey, automaticOpen);
                                        const currentOpen = isOpen;

                                        return (
                                            <React.Fragment key={cls.field}>
                                                {idx > 0 && <Divider/>}
                                                <AccordionSection
                                                    title={cls.label || cls.field}
                                                    isOpen={isOpen}
                                                    onToggle={() => handleToggle(accordionKey, currentOpen)}
                                                    pending={false}
                                                >
                                                    <TopicBlock
                                                        label={null}
                                                        recommendation={clsResult.recommendation}
                                                        ambiguity={clsResult.ambiguity}
                                                    />
                                                </AccordionSection>
                                            </React.Fragment>
                                        );
                                    })}

                                    {classifications.length > 0 && <Divider/>}

                                    {/* ── Presentation suitability accordion ── */}
                                    {(() => {
                                        const accordionKey = 'presentation';
                                        const automaticOpen = isLastPage;
                                        const isOpen = resolveOpen(accordionKey, automaticOpen);

                                        return (
                                            <AccordionSection
                                                title="Presentation suitability"
                                                isOpen={isOpen}
                                                onToggle={() => handleToggle(accordionKey, isOpen)}
                                                pending={!hasPresentation}
                                            >
                                                {hasPresentation ? (
                                                    <SuitabilityBlock presentation={presentation}/>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.25,
                                                        py: 0.5
                                                    }}>
                                                        <PulseDot/>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Assessing suitability…
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </AccordionSection>
                                        );
                                    })()}
                                </>
                            )}
                        </Box>
                    </Card>
                </Fade>
            </Box>
        </Slide>
    );
}

// ── Divider ───────────────────────────────────────────────────────
function Divider() {
    return <Box sx={{height: '1px', bgcolor: 'divider', my: 1.5}}/>;
}

// ── Alert card ────────────────────────────────────────────────────
const ALERT_STYLES = {
    warning: {bgcolor: '#fff8e1', borderLeft: '3px solid #ffa726', color: '#5d4037'},
    success: {bgcolor: '#e8f5e9', borderLeft: '3px solid #4caf50', color: '#2e7d32'},
};

function AlertCard({variant = 'warning', children}) {
    return (
        <Box sx={{
            display: 'flex', alignItems: 'flex-start', gap: 1,
            px: 1.25, py: 1, borderRadius: 1.5,
            ...ALERT_STYLES[variant],
        }}>
            {children}
        </Box>
    );
}
