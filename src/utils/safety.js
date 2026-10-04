// Content-safety gate. This site never shows explicit imagery.
// Layers: (1) Openverse is asked to exclude sensitive results, (2) results flagged by Openverse are dropped,
// (3) results whose title/tags contain explicit terms are dropped, (4) explicit search terms are refused.

const TERMS = [
  'porn', 'porno', 'pornography', 'pornographic', 'xxx', 'nsfw', 'explicit', 'erotic', 'erotica', 'sex', 'sexual',
  'sexually', 'nude', 'nudes', 'nudity', 'naked', 'topless', 'nipple', 'nipples', 'genital', 'genitals', 'genitalia',
  'penis', 'vagina', 'vulva', 'boobs', 'breasts', 'butt naked', 'fetish', 'bdsm', 'bondage', 'hentai', 'onlyfans',
  'stripper', 'striptease', 'orgasm', 'masturbation', 'masturbating', 'cum', 'cumshot', 'milf', 'incest', 'rape',
  'gore', 'gory', 'corpse', 'beheading', 'dismembered', 'mutilated', 'decapitated',
];

const PATTERN = new RegExp(`(^|[^a-z0-9])(${TERMS.map((t) => t.replace(/ /g, '[\\s_-]*')).join('|')})(?![a-z0-9])`, 'i');

export function hasExplicitText(text) {
  return PATTERN.test(String(text || ''));
}

/** True when a search query must not be sent to the API. */
export function isBlockedQuery(query) {
  return hasExplicitText(query);
}

/** True when a raw Openverse result is safe to display. */
export function isSafeResult(raw) {
  if (!raw) return false;
  if (raw.mature === true) return false;
  if (Array.isArray(raw.unstable__sensitivity) && raw.unstable__sensitivity.length > 0) return false;
  const tags = Array.isArray(raw.tags) ? raw.tags.map((t) => t && t.name).join(' ') : '';
  return !hasExplicitText(`${raw.title || ''} ${tags}`);
}

/** Same check for already-normalised items (used on cached data). */
export function isSafeItem(item) {
  return !hasExplicitText(`${item.title || ''} ${(item.tags || []).join(' ')}`);
}
