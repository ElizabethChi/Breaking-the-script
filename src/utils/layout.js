// Masonry helpers. Card heights are derived from known aspect ratios, so columns can be computed
// up-front (no post-load relayout) and card order stays stable while images load.

export const COLUMN_GAP = 14;
const TARGET_COLUMN_WIDTH = 219;
const ACTION_AREA_RATIO = 43 / TARGET_COLUMN_WIDTH; // image bottom -> next image top

const MIN_RATIO = 0.74;
const MAX_RATIO = 1.9;
const FALLBACK_RATIOS = [1.0, 1.25, 1.5, 1.33, 1.78, 1.12, 1.62];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Height/width ratio used for a card box. */
export function cardRatio(item) {
  if (item.ratio) return item.ratio;
  if (item.rawRatio) return Math.min(MAX_RATIO, Math.max(MIN_RATIO, item.rawRatio));
  return FALLBACK_RATIOS[hash(String(item.id)) % FALLBACK_RATIOS.length];
}

export function columnCountFor(contentWidth) {
  const n = Math.round((contentWidth + COLUMN_GAP) / (TARGET_COLUMN_WIDTH + COLUMN_GAP));
  return Math.min(8, Math.max(2, n));
}

/** Deterministic placement: pinned items (7-column layout only) first, then shortest-column-first. */
export function distribute(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);
  items.forEach((item) => {
    let target = -1;
    if (columnCount === 7 && Number.isInteger(item.col)) target = item.col;
    if (target < 0) {
      target = 0;
      for (let c = 1; c < columnCount; c += 1) if (heights[c] < heights[target] - 1e-6) target = c;
    }
    columns[target].push(item);
    heights[target] += cardRatio(item) + ACTION_AREA_RATIO;
  });
  return columns;
}

export function interleave(lists) {
  const out = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i += 1) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
}
