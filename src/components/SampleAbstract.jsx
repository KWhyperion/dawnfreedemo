import React from 'react';
import {Box, Typography, Chip, Paper, alpha, Fade} from '@mui/material';

// ── SampleAbstract ───────────────────────────────────────────────────────────
// Renders the selected sample's dummy abstract (title + body). The body is plain
// text with blank-line-separated paragraphs.
//
// `showTitle` / `showBody` gate the paste-style reveal driven by DemoPage: each
// appears as a whole block (NOT typewritered), as if a user pasted it. Before
// `showTitle` the component is blank.

export default function SampleAbstract({domainLabel, abstract, showTitle = true, showBody = true}) {
    if (!abstract || !showTitle) return null;
    const paragraphs = (abstract.body || '').split(/\n{2,}/).filter(Boolean);

    return (
        <Paper variant="outlined" sx={{p: {xs: 2.5, md: 3.5}, position:'relative', overflow: 'hidden', border: '1px solid #2196F3',borderRadius: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1.5}}>
                <Chip label="Sample abstract" size="small" color="primary" variant="outlined"/>
                {domainLabel && (
                    <Typography variant="caption" color="text.secondary">{domainLabel}</Typography>
                )}
            </Box>
            <Typography variant="h2" sx={{fontSize: 20, fontWeight: 600, mb: 1.5, lineHeight: 1.35}}>
                {abstract.title}
            </Typography>

            {showBody && (
                <Fade in appear timeout={250}>
                    <Box>
                        {paragraphs.map((p, i) => (
                            <Typography
                                key={i}
                                variant="body1"
                                sx={{color: 'text.secondary', lineHeight: 1.7, mb: 1.25, fontSize: 15}}
                            >
                                {p}
                            </Typography>
                        ))}
                    </Box>
                </Fade>
            )}
            {/* Watermark label over the text */}
            <Typography
                aria-hidden
                sx={(theme) => ({
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-30deg)',
                    fontSize: '5rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: alpha(theme.palette.text.primary, 0.1),
                    pointerEvents: 'none',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                })}
            >
                SAMPLE
            </Typography>
        </Paper>
    );
}
