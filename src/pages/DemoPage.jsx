import React, {useEffect, useState} from 'react';
import {Box, Container, Button, Fade, Typography, Divider} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AbstractAnalysisPanel from '../components/AbstractAnalysisPanel.js';
import SampleAbstract from '../components/SampleAbstract.jsx';
import LeadCaptureForm from '../components/LeadCaptureForm.jsx';
import useFixtureDriver from '../hooks/useFixtureDriver.js';

// ── Page 2 — the demo + capture ──────────────────────────────────────────────
// Shows the selected sample's dummy abstract, runs the canned analysis through
// the reused panel (structural → streamed author feedback → presentation), and
// reveals the lead-capture form once the output begins resolving (the agreed
// open-decision setting: orchestration preserved, keen visitor not held hostage).

// ── Reveal-sequence timings (ms) — tune here ──
// load → TITLE_DELAY → title (paste, whole block) → ABSTRACT_DELAY → abstract
// body (paste) → PANEL_SLIDE_DELAY → panel slides in → STRUCTURAL_DELAY →
// structural analysis → author feedback streams → [stream completes] →
// THEME_DELAY → conference theme block → PRESENTATION_DELAY → presentation.
const TITLE_DELAY = 500;        // blank → title appears
const ABSTRACT_DELAY = 500;     // title shown → abstract body appears
const PANEL_SLIDE_DELAY = 2000; // abstract shown → panel slides in
const STRUCTURAL_DELAY = 500;   // panel in → structural appears (the isAnalysingStructure beat)
const THEME_DELAY = 200;        // author feedback complete → conference theme block
const PRESENTATION_DELAY = 200; // theme block shown → presentation suitability

export default function DemoPage({sample, onBack}) {
    // Paste-style reveal gates. The driver does NOT auto-start; it begins only
    // once the panel has slid in, so STRUCTURAL_DELAY is the panel's own
    // "analysing structure" beat (isAnalysingStructure) rather than a second
    // mechanism layered on top.
    const [reveal, setReveal] = useState({title: false, body: false, panel: false});

    const {
        structural, author, presentation, score,
        isAnalysingStructure, isStreaming,
        outputBegun, start,
    } = useFixtureDriver(sample, {
        auto: false,
        structuralDelay: STRUCTURAL_DELAY,
        themeDelay: THEME_DELAY,
        presentationDelay: PRESENTATION_DELAY,
    });

    // Run the reveal cascade on mount / sample change.
    useEffect(() => {
        setReveal({title: false, body: false, panel: false});
        const t1 = setTimeout(() => setReveal((r) => ({...r, title: true})), TITLE_DELAY);
        const t2 = setTimeout(() => setReveal((r) => ({...r, body: true})), TITLE_DELAY + ABSTRACT_DELAY);
        const t3 = setTimeout(
            () => setReveal((r) => ({...r, panel: true})),
            TITLE_DELAY + ABSTRACT_DELAY + PANEL_SLIDE_DELAY,
        );
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [sample]);

    // Kick off the analysis the moment the panel has slid in.
    useEffect(() => {
        if (reveal.panel) start();
    }, [reveal.panel, start]);

    // Topic-advice control list for the panel — one entry per classification
    // field, derived from the fixture's taxonomy. Must be NON-EMPTY for the panel
    // to render the topic accordion (with [] it renders nothing). The matching
    // result is placed at structural.classifications[field] by the driver.
    const classifications = sample?.taxonomy
        ? [{field: sample.taxonomy.field, label: sample.taxonomy.label}]
        : [];

    return (
        <Box sx={{minHeight: '100vh', py: {xs: 3, md: 5}}}>
            <Container maxWidth="lg">
                <Button startIcon={<ArrowBackIcon/>} onClick={onBack} sx={{mb: 2}}>
                    Choose a different field
                </Button>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'},
                        gap: {xs: 3, md: 1},
                        alignItems: 'flex-start',
                    }}
                >
                    {/* ── Left: the reused analysis panel ──
                        Mounted only once the abstract has been "pasted" (reveal.panel),
                        so the panel's own slide-in animation plays as the entrance.
                        Stubbed form-structure props: the demo has no multi-page live
                        form, so pages/controlStates/abstractFields are omitted.
                        classifications is the derived topic control list (non-empty),
                        so the topic accordion renders. pageNumber:1/totalPages:2 makes
                        the panel render (pageNumber > 0) and treat this as the last
                        page (so presentation auto-opens). */}
                    <Box
                        sx={{
                            position: {md: 'sticky'},
                            top: {md: 16},
                            height: {xs: 620, md: 'calc(100vh - 32px)'},
                            flexShrink: 0,
                            alignSelf: {xs: 'center', md: 'stretch'},
                        }}
                    >
                        {reveal.panel && (
                            <AbstractAnalysisPanel
                                structural={structural}
                                author={author}
                                presentation={presentation}
                                score={score}
                                isAnalysingStructure={isAnalysingStructure}
                                isStreaming={isStreaming}
                                pageNumber={1}
                                totalPages={2}
                                submissionId={sample?.key}
                                classifications={classifications}
                            />
                        )}
                    </Box>

                    {/* ── Right: abstract + capture ── */}
                    <Box sx={{flex: 1, minWidth: 0, width: '100%',  mt: { md: '20px' }}}>
                        <SampleAbstract
                            domainLabel={sample?.domainLabel}
                            abstract={sample?.abstract}
                            showTitle={reveal.title}
                            showBody={reveal.body}
                        />

                        {/* Capture becomes available once output begins resolving. */}
                        <Fade in={outputBegun} mountOnEnter>
                            <Box sx={{mt: 4}}>
                                <Divider sx={{mb: 4}}/>
                                <LeadCaptureForm/>
                            </Box>
                        </Fade>
                    </Box>
                </Box>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{display: 'block', textAlign: 'center', mt: 4}}
                >
                    This is a prepared, illustrative example.
                </Typography>
            </Container>
        </Box>
    );
}
