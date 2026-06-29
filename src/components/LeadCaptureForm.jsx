import React, {useState} from 'react';
import {Box, TextField, Button, Typography, Alert, Stack} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import submitLead from '../lib/submitLead.js';

// ── LeadCaptureForm ──────────────────────────────────────────────────────────
//
// The commercial mechanism of the whole build. Captures email (+ optional name
// and organisation) and hands off to a human. No self-serve path, no account
// creation.
//
//   • Honeypot: a visually-hidden but REAL "website" field. Humans never see or
//     fill it; bots do. It is posted as-is and the backend uses it to silently
//     drop bot submissions.
//   • Fails LOUDLY: any submit failure surfaces an error and the UI never shows
//     success on a failed send (submitLead throws; we catch and show the error).

const visuallyHidden = {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LeadCaptureForm() {
    const [name, setName] = useState('');
    const [org, setOrg] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState(''); // honeypot
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setErrorMsg('');

        if (!EMAIL_RE.test(email.trim())) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setStatus('submitting');
        try {
            await submitLead({email: email.trim(), name: name.trim(), org: org.trim(), website});
            setStatus('success');
        } catch (err) {
            // Loud failure: show the error, stay on the form so they can retry.
            setStatus('error');
            setErrorMsg(err?.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 1.5}}>
                <CheckCircleOutlineIcon color="success" sx={{mt: '2px'}}/>
                <Box>
                    <Typography variant="h6" sx={{fontWeight: 600}}>Thanks — we’ll be in touch.</Typography>
                    <Typography variant="body2" color="text.secondary">
                        We’ve received your details and someone from Hyperion will follow up shortly.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" sx={{fontWeight: 600, mb: 0.5}}>
                See Dawn on your conference’s abstracts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                Leave your details and we’ll show you how Dawn works for your authors.
            </Typography>

            {status === 'error' && (
                <Alert severity="error" sx={{mb: 2}}>
                    {errorMsg}
                </Alert>
            )}

            <Stack spacing={2}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    size="small"
                    autoComplete="name"
                />
                <TextField
                    label="Organisation"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    fullWidth
                    size="small"
                    autoComplete="organization"
                />
                <TextField
                    label="Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError || ' '}
                    fullWidth
                    size="small"
                    autoComplete="email"
                />

                {/* Honeypot — visually hidden, real field. Bots fill it; humans don't. */}
                <TextField
                    label="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    inputProps={{tabIndex: -1, 'aria-hidden': true}}
                    sx={visuallyHidden}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={status === 'submitting'}
                    sx={{alignSelf: 'flex-start'}}
                >
                    {status === 'submitting' ? 'Sending…' : 'Request a demo for my conference'}
                </Button>
            </Stack>
        </Box>
    );
}