import React, {useState} from 'react';
import ExplainerPage from './pages/ExplainerPage.jsx';
import DemoPage from './pages/DemoPage.jsx';
import {resolveSample, resolveSampleFromQuery} from './fixtures/index.js';

// ── App ──────────────────────────────────────────────────────────────────────
// Two-page flow: explainer (domain choice) → demo (+ capture). The `?sample=`
// URL param pre-selects the dropdown so a targeted email lands on the recipient's
// field; ANY unknown/stale/junk value silently falls back to the default (the
// resolve* helpers guarantee this), degrading to the normal first-visit path.

export default function App() {
    // Initialise the dropdown from the URL param (graceful fallback inside).
    const [selectedKey, setSelectedKey] = useState(
        () => resolveSampleFromQuery(window.location.search).sample.key,
    );
    const [page, setPage] = useState('explainer'); // 'explainer' | 'demo'

    // selectedKey always comes from the registry, so this is never null.
    const sample = resolveSample(selectedKey).sample;

    if (page === 'demo') {
        return <DemoPage sample={sample} onBack={() => setPage('explainer')}/>;
    }

    return (
        <ExplainerPage
            selectedKey={selectedKey}
            onSelectDomain={(key) => {
                setSelectedKey(key);
                console.log('[DawnFree-demo] domain selected:', key);
            }}
            onContinue={() => {
                console.log('[DawnFree-demo] viewing sample:', selectedKey);
                setPage('demo');
            }}
        />
    );
}