// ── Fixture registry ─────────────────────────────────────────────────────────
// This file is the integration point between content and code. To add or change
// a campaign domain, edit/add a fixture file and list it here — no component
// changes required. Each fixture default-exports { key, domainLabel, abstract,
// analysis } (see the existing files for the shape the driver/panel consume).

import cardiology from './cardiology.js';
import neuroscience from './neuroscience.js';
import oncology from './oncology.js';
import publicHealth from './public-health.js';
import immunology from './immunology.js';
import physiology from './physiology.js';
import chemistry from './chemistry.js';
import physics from './physics.js';
import environmental from './environmental.js';
import psychology from './psychology.js';

// Order here is the dropdown order. The first entry is the default (used for
// first-time visitors and as the graceful fallback for bad URL params).
export const SAMPLES = [
    cardiology,
    neuroscience,
    oncology,
    publicHealth,
    immunology,
    physiology,
    chemistry,
    physics,
    environmental,
    psychology,
];

export const DEFAULT_SAMPLE = SAMPLES[0];

// key -> fixture, for O(1) lookup by URL param / dropdown value.
const BY_KEY = new Map(SAMPLES.map((s) => [s.key, s]));

// Options for the domain dropdown.
export const DOMAIN_OPTIONS = SAMPLES.map((s) => ({
    value: s.key,
    label: s.domainLabel,
}));

/**
 * Resolve a sample from a raw value (typically the `?sample=` URL param or the
 * dropdown selection).
 *
 * Graceful fallback is mandatory: at thousands of sends with forwarding,
 * malformed / stale / unknown values are a certainty. ANY unrecognised value
 * silently falls back to DEFAULT_SAMPLE — no error, no broken state. This is the
 * deliberate alternative to the naive "select the option matching the param",
 * which misbehaves on no-match.
 *
 * @param {unknown} raw
 * @returns {{sample: object, matched: boolean}}
 */
export function resolveSample(raw) {
    if (typeof raw === 'string') {
        const key = raw.trim().toLowerCase();
        const hit = BY_KEY.get(key);
        if (hit) return {sample: hit, matched: true};
    }
    return {sample: DEFAULT_SAMPLE, matched: false};
}

/**
 * Read the `?sample=` param from a query string and resolve it. Falls back
 * silently on anything unexpected.
 * @param {string} [search] e.g. window.location.search
 */
export function resolveSampleFromQuery(search = '') {
    let raw = null;
    try {
        raw = new URLSearchParams(search).get('sample');
    } catch {
        raw = null; // malformed query string — fall back
    }
    return resolveSample(raw);
}