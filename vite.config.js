import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// The reused panel (AbstractAnalysisPanel.js) is a .js file that contains JSX,
// kept at that exact name to minimise drift from the Live client. Vite/esbuild
// only treat .jsx as JSX by default, so we widen the JSX loader to .js files.
export default defineConfig({
    plugins: [react({include: /\.(jsx?|tsx?)$/})],
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {'.js': 'jsx'},
        },
    },
});