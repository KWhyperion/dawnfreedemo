import React from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeProvider, CssBaseline} from '@mui/material';
import theme from './theme.js';
import App from './App.jsx';

// Light logging only — confirm the demo loaded (per CLAUDE.md logging policy).
console.log('[DawnFree-demo] loaded');

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
);