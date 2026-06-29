import {createTheme} from '@mui/material/styles';

// Match the panel's palette: it leans on MUI blues (#2196f3 / #90caf9) and a
// light, neutral surface. Keep surrounding UI (explainer, form, capture) in the
// same family so the demo reads as one product, not a wrapper around a widget.
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {main: '#2196f3', light: '#90caf9', dark: '#1976d2'},
        background: {default: '#f7f9fc', paper: '#ffffff'},
        text: {primary: '#2a2f36', secondary: '#5a6472'},
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h1: {fontSize: 34, fontWeight: 700, letterSpacing: '-0.01em'},
        h2: {fontSize: 22, fontWeight: 600},
        button: {textTransform: 'none', fontWeight: 600},
    },
    shape: {borderRadius: 10},
});

export default theme;