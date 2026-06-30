import React from 'react';
import {
    Box, Container, Typography, Stack, Button,
    FormControl, InputLabel, Select, MenuItem, Paper,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import faceLogo from '../../assets/face.png';
import {DOMAIN_OPTIONS} from '../fixtures/index.js';

// ── Page 1 — self-contained explainer + domain choice ────────────────────────
// Carries the entire onboarding cold: a forwarded-link visitor with zero context
// must understand what Dawn is, what Dawn Free is, and what this demo shows — and
// that the samples are illustrative worked examples, not a live tool they feed.

export default function ExplainerPage({selectedKey, onSelectDomain, onContinue}) {
    return (
        <Box sx={{minHeight: '100vh', py: {xs: 5, md: 9}}}>
            <Container maxWidth="md">
                {/* Brand row — modest logo + secondary brand line */}
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mb: 4}}>
                    <Box
                        component="img"
                        src={faceLogo}
                        alt="Hyperion"
                        sx={{width: 44, height: 'auto', borderRadius: 1}}
                    />
                    <Typography sx={{fontWeight: 600, fontSize: 16, color: 'text.secondary', letterSpacing: '0.01em'}}>
                        Hyperion Live
                    </Typography>
                </Box>

                {/* Hero — the former lozenge text, now the page's headline */}
                <Typography variant="h1" sx={{mb: 1.5}}>
                    Dawn Free — demo
                </Typography>

                <Typography variant="h2" sx={{fontWeight: 600, mb: 2.5}}>
                    Pre-submission feedback on conference abstracts
                </Typography>

                <Typography variant="h2" sx={{fontWeight: 400, fontSize: 18, color: 'text.secondary', mb: 4, lineHeight: 1.5}}>
                    <p>Dawn Free reads an author’s abstract before they submit. It
                        suggests how the structure, clarity, or completeness could
                        be improved and advises on the best conference topic and appropriate presentation format, oral or poster. It comments on the writing, never on the academic quality.</p>
                    <p>It's a standalone service that works alongside <em>any</em> abstract system. To use it, simply add a link from your Call For Abstracts page or email. </p>
                </Typography>

                <Stack spacing={2.5} sx={{mb: 5}}>
                    <ExplainerPoint title="What Dawn does">
                        Gives authors private advice on a draft abstract so it’s in good shape before it reaches the reviewers. Dawn might suggest a clear aim,
                        defined terms, concrete results, a conclusion that matches the evidence, and so on.
                        .
                    </ExplainerPoint>
                    <ExplainerPoint title="What Dawn Free is">
                        A no-cost version of our standard Dawn service, designed as a drop-in for existing submission systems. This page is a
                        short demo, built for conference organisers.
                    </ExplainerPoint>
                    <ExplainerPoint title="What this demo shows">
                        <strong>Illustrative examples</strong> - sample abstracts in
                        chosen fields and Dawn's feedback. It’s a
                        walkthrough that shows exactly how straightforward Dawn is.  Pick a field below to choose an example.
                    </ExplainerPoint>
                </Stack>

                <Paper variant="outlined" sx={{p: {xs: 2.5, md: 3.5}, borderRadius: 2}}>
                    <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>
                        Choose a field for your worked example
                    </Typography>
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems={{sm: 'center'}}>
                        <FormControl fullWidth size="small" sx={{maxWidth: {sm: 320}}}>
                            <InputLabel id="domain-label">Field</InputLabel>
                            <Select
                                labelId="domain-label"
                                label="Field"
                                value={selectedKey}
                                onChange={(e) => onSelectDomain(e.target.value)}
                            >
                                {DOMAIN_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon/>}
                            onClick={onContinue}
                        >
                            See the example
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

function ExplainerPoint({title, children}) {
    return (
        <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: {xs: 0.25, sm: 2}}}>
            <Typography
                sx={{
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: 'primary.main', minWidth: 150, pt: {sm: '3px'},
                }}
            >
                {title}
            </Typography>
            <Typography variant="body1" sx={{color: 'text.secondary', lineHeight: 1.7}}>
                {children}
            </Typography>
        </Box>
    );
}
