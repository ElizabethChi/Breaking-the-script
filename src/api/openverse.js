// Openverse Images API client: normalisation, caching, throttling and error handling.
// Docs: https://api.openverse.org/v1/  (anonymous limits: ~20 req/min burst, 200 req/day sustained)

const ENDPOINT = 'https://api.openverse.org/v1/images/';
const REQUEST_TIMEOUT_MS = 9000;
const MAX_REQUESTS_PER_MINUTE = 18; // stay under the anonymous burst limit of 20/min
const SESSION_PREFIX = 'openverse:v1:';

export class OpenverseError extends Error {
  constructor(message, { status = 0, rateLimited = false, exhausted = false } = {}) {
    super(message);
    this.name = 'OpenverseError';
    this.status = status;
    this.rateLimited = rateLimited;
    this.exhausted = exhausted;
  }
}

const memoryCache = new Map();
const inflight = new Map();
const requestStamps = [];
let blockedUntil = 0;

function readSession(key) {
  try {
    const raw = sessionStorage.getItem(SESSION_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(key, value) {
  try {
    sessionStorage.setItem(SESSION_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable: memory cache still applies */
  }
}

export function clearSearchCache() {
  memoryCache.clear();
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(SESSION_PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

function licenseLabel(license, version) {
  if (!license) return 'License unknown';
  if (license === 'cc0') return 'CC0 1.0';
  if (license === 'pdm') return 'Public Domain Mark 1.0';
  return `CC ${license.toUpperCase()}${version ? ` ${version}` : ''}`;
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Map one raw Openverse result to the shape the UI uses. Every field except an image URL is optional. */
export function normalizeResult(r) {
  if (!r || (!r.url && !r.thumbnail)) return null;
  const id = r.id || r.url;
  const title = (r.title || '').trim() || 'Untitled image';
  const creator = (r.creator || '').trim() || null;
  const width = toNumber(r.width);
  const height = toNumber(r.height);
  return {
    key: id,
    id,
    title,
    alt: creator ? `${title} by ${creator}` : title,
    thumb: r.thumbnail || null,
    url: r.url || r.thumbnail,
    width,
    height,
    rawRatio: width && height ? height / width : null,
    creator,
    creatorUrl: r.creator_url || null,
    landingUrl: r.foreign_landing_url || r.url,
    license: licenseLabel(r.license, r.license_version),
    licenseUrl: r.license_url || null,
    provider: r.provider || r.source || null,
    attribution: r.attribution || null,
  };
}

function buildUrl({ q, page, pageSize, aspectRatio, category, licenseType }) {
  const params = [
    ['q', q],
    ['page', page],
    ['page_size', pageSize],
    ['license_type', licenseType],
    ['mature', 'false'],
  ];
  if (aspectRatio) params.push(['aspect_ratio', aspectRatio]);
  if (category) params.push(['category', category]);
  return `${ENDPOINT}?${params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
}

function checkRateLimit() {
  const now = Date.now();
  if (now < blockedUntil) {
    throw new OpenverseError('Openverse rate limit reached', { status: 429, rateLimited: true });
  }
  while (requestStamps.length && now - requestStamps[0] > 60000) requestStamps.shift();
  if (requestStamps.length >= MAX_REQUESTS_PER_MINUTE) {
    throw new OpenverseError('Slow down: too many searches in a minute', { status: 429, rateLimited: true });
  }
  requestStamps.push(now);
}

async function request(url) {
  checkRateLimit();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (res.status === 429) {
      const wait = Number(res.headers.get('Retry-After')) || 30;
      blockedUntil = Date.now() + wait * 1000;
      throw new OpenverseError('Openverse rate limit reached', { status: 429, rateLimited: true });
    }
    if (res.status === 400 || res.status === 404) {
      // Requesting a page past the end of the result set returns 400.
      throw new OpenverseError('No more results', { status: res.status, exhausted: true });
    }
    if (!res.ok) throw new OpenverseError(`Openverse responded with ${res.status}`, { status: res.status });
    return await res.json();
  } catch (err) {
    if (err instanceof OpenverseError) throw err;
    throw new OpenverseError(err.name === 'AbortError' ? 'Openverse timed out' : 'Network error');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Search Openverse. Resolves to { items, page, pageCount, resultCount }.
 * Successful responses are cached for the browser session.
 */
export function searchImages({
  q,
  page = 1,
  pageSize = 20,
  aspectRatio = '',
  category = '',
  licenseType = 'commercial',
}) {
  const query = (q || '').trim();
  if (!query) return Promise.resolve({ items: [], page, pageCount: 0, resultCount: 0 });

  const opts = { q: query, page, pageSize, aspectRatio, category, licenseType };
  const cacheKey = JSON.stringify(opts);

  if (memoryCache.has(cacheKey)) return Promise.resolve(memoryCache.get(cacheKey));
  const stored = readSession(cacheKey);
  if (stored) {
    memoryCache.set(cacheKey, stored);
    return Promise.resolve(stored);
  }
  if (inflight.has(cacheKey)) return inflight.get(cacheKey);

  const promise = request(buildUrl(opts))
    .then((json) => {
      const seen = new Set();
      const items = (json.results || [])
        .map(normalizeResult)
        .filter((item) => {
          if (!item || seen.has(item.id) || seen.has(item.url)) return false;
          seen.add(item.id);
          seen.add(item.url);
          return true;
        });
      const value = {
        items,
        page: json.page || page,
        pageCount: json.page_count || 0,
        resultCount: json.result_count || 0,
      };
      memoryCache.set(cacheKey, value);
      writeSession(cacheKey, value);
      return value;
    })
    .finally(() => inflight.delete(cacheKey));

  inflight.set(cacheKey, promise);
  return promise;
}
