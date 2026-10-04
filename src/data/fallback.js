import { HERO_SLOTS } from './heroSlots.js';

// Locally bundled fallback pins (AI-generated artwork created for this project, plus plain colour tiles).
// They are only used when the Openverse API cannot be reached.

function tileDataUri(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="660" viewBox="0 0 440 660"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".78"/></linearGradient></defs><rect width="440" height="660" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function fallbackForSlot(slot) {
  const { fb } = slot;
  const src = fb.src || tileDataUri(fb.tile);
  return {
    key: slot.id,
    id: `fallback-${slot.id}`,
    title: fb.title,
    alt: `${fb.title} (offline placeholder)`,
    thumb: null,
    url: src,
    width: 219,
    height: Math.round(slot.h),
    rawRatio: slot.ratio,
    ratio: slot.ratio,
    creator: fb.src ? 'AI-generated for this project' : null,
    creatorUrl: null,
    landingUrl: null,
    license: fb.src ? 'Project asset' : 'Placeholder',
    licenseUrl: null,
    provider: 'local',
    attribution: null,
    fallback: true,
    col: slot.col,
    badge: slot.badge || null,
  };
}

export const FALLBACK_ITEMS = HERO_SLOTS.map(fallbackForSlot);
