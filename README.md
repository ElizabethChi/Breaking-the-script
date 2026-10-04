# Discover — a Pinterest-style image discovery interface

A pixel-matched, responsive recreation of a Pinterest-inspired home feed: fixed 64px icon rail, search header, a single-line topic bar and a staggered masonry of images. Built with React, Vite and Lucide icons; images come from the [Openverse Images API](https://api.openverse.org/v1/images/).

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Layout (1727 × 900 reference)

| Element | Geometry |
| --- | --- |
| Sidebar | 64px wide, fixed, 1px `#EFEFEF` right border; icon centres at y = 39 / 103 / 168 / 233 / 298 / 363 / 428 and gear at 859 |
| Search | x = 78, y = 17, 44px tall, 12px radius, `#E7E7E2` |
| Topics | 14px / 600, first label at x = 92, no wrapping, hidden scrollbar |
| Feed | starts at y = 132; seven 219px columns, 14px gaps, last column ends at x ≈ 1697 |
| Cards | 16px radius, 43px from image bottom to next image top (4px + 28px actions + 11px) |

Column count is derived from the feed's own width (7 → 6 → 5 → 3/4 → 2). Below 640px the rail becomes a bottom bar.

## How the feed works

- **Masonry** (`src/utils/layout.js`): every card's height comes from a known aspect ratio, so columns are computed up-front (no relayout when images load, stable order, no overlaps). On the first screen, 18 explicit *slots* (`src/data/heroSlots.js`) pin cards to columns with the reference heights; later cards go to the shortest column.
- **Openverse** (`src/api/openverse.js`): the home feed runs the 12 curated queries; topics and search use their own. Results are normalised (every field except the image URL is optional), de-duplicated by id/URL, cached in memory + `sessionStorage`, and throttled client-side to stay under the anonymous limit (20 requests/min, 200/day). 429s are honoured via `Retry-After`. Images use `license_type=commercial` by default (changeable in *Feed options*) and `mature=false`.
- **Failures**: each slot falls back to a bundled image/colour tile if its query fails, so the first screen is never blank. Broken image URLs retry `thumbnail → url → neutral placeholder`.
- **Infinite scroll** loads further pages when the sentinel nears the viewport.

## Content safety

Explicit imagery is never shown. `src/utils/safety.js` applies four layers: Openverse is asked to exclude sensitive results (`mature=false`, `unstable__include_sensitive_results=false`); results Openverse flags as mature/sensitive are dropped; results whose title or tags contain explicit terms are dropped (also re-checked on cached and saved pins); and searches containing explicit terms are refused without calling the API. Keyword filters can't catch everything, so extend the term list if something slips through. Local Create Pin uploads are not moderated, but they never leave your device.

## Interactions

Search (Enter, or debounced typing; voice via Web Speech API when supported; camera opens an honest dialog — no image recognition is performed), topic filters, card hover Save, three-dot menu (Save / Share link / View source), detail modal with creator, license and attribution, local saves (`localStorage`, view them from the grid icon), Create Pin (local-only), notifications / messages popovers, feed options (image type, license type), settings and account menus.

## Attribution

Fallback images in `public/fallback/` were AI-generated for this project. Everything else shown comes from Openverse and carries its own license; creator, license and source links are in each pin's detail view.
