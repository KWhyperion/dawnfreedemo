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

                <Typography variant="h2" sx={{fontWeight: 600, mb: 2.5}}>
                   Dawn Free - pre-submission feedback for authors
                </Typography>

                <Typography variant="h2" sx={{fontWeight: 400, fontSize: 18, color: 'text.secondary', mb: 4, lineHeight: 1.5}}>
                    <p>Dawn Free gives authors private advice on their abstracts so they're in good shape before they reach the reviewers.
                        </p>
                    <p>It's a drop-in service that works with <em>any</em> abstract system. Simply add a link to a web page or email. </p>

                    <p><strong>Choose a conference topic for a demonstration:</strong></p>
                </Typography>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems={{sm: 'center'}}>
                    <FormControl fullWidth size="small" sx={{maxWidth: {sm: 320}}}>
                        <InputLabel id="domain-label">Topic</InputLabel>
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
                        See it
                    </Button>
                </Stack>

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
