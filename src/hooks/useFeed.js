import { useCallback, useEffect, useRef, useState } from 'react';
import { searchImages } from '../api/openverse.js';
import { HERO_SLOTS } from '../data/heroSlots.js';
import { fallbackForSlot } from '../data/fallback.js';
import { interleave } from '../utils/layout.js';

const BATCH = 14;
const QUERIES_PER_LOAD_MORE = 4;
const SKELETON_RATIOS = [1.33, 1.5, 1.37, 1.25, 1.33, 1.5, 1.78, 1.5, 1.37, 1.5, 1.25, 1.5, 1.2, 1.4];

const skeletons = () =>
  SKELETON_RATIOS.map((ratio, i) => ({ key: `sk-${i}`, id: `sk-${i}`, ratio, placeholder: true }));

const slotSkeletons = () =>
  HERO_SLOTS.map((s) => ({ key: s.id, id: s.id, ratio: s.ratio, col: s.col, placeholder: true }));

function pickForSlot(candidates, slot, used) {
  let best = null;
  let bestScore = Infinity;
  for (const item of candidates) {
    if (used.has(item.id)) continue;
    const score = Math.abs(Math.log((item.rawRatio || 1.2) / slot.ratio));
    if (score < bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}

/**
 * Feed state for the "home", "topic" and "search" sources.
 * source: { key, type: 'home' | 'topic' | 'search', queries: string[] }
 */
export function useFeed(source, filters, reloadToken) {
  const [state, setState] = useState({
    items: [],
    phase: 'loading', // loading | ready | empty | error
    loadingMore: false,
    hasMore: false,
    loadError: null,
    offline: false,
  });
  const sessionRef = useRef(null);

  useEffect(() => {
    const aspectRatio = source.type === 'home' ? 'tall' : '';
    const session = {
      used: new Set(),
      seen: new Set(),
      pool: [],
      cursor: 0,
      busy: false,
      queries: source.queries.map((q) => ({ q, page: 0, done: false })),
    };
    sessionRef.current = session;
    const alive = () => sessionRef.current === session;

    // Fetch the next page of one query; resolves to unseen items. Throws on API failure.
    const fetchNext = async (qs) => {
      const page = qs.page + 1;
      try {
        const res = await searchImages({
          q: qs.q,
          page,
          aspectRatio,
          category: filters.category,
          licenseType: filters.licenseType,
        });
        qs.page = page;
        if (!res.items.length || (res.pageCount && page >= res.pageCount)) qs.done = true;
        return res.items.filter((item) => {
          if (session.seen.has(item.id) || session.seen.has(item.url)) return false;
          session.seen.add(item.id);
          session.seen.add(item.url);
          return true;
        });
      } catch (err) {
        if (err.exhausted) qs.done = true;
        throw err;
      }
    };

    const isHome = source.type === 'home';
    setState({
      items: isHome ? slotSkeletons() : skeletons(),
      phase: 'loading',
      loadingMore: false,
      hasMore: false,
      loadError: null,
      offline: false,
    });

    const results = new Array(session.queries.length).fill(undefined);
    const replaceKey = (key, item) =>
      setState((s) => ({ ...s, items: s.items.map((it) => (it.key === key ? item : it)) }));

    const fillSlots = (qi) => {
      if (!alive() || !isHome) return;
      HERO_SLOTS.filter((slot) => slot.qi === qi).forEach((slot) => {
        const picked = results[qi] ? pickForSlot(results[qi], slot, session.used) : null;
        if (picked) {
          session.used.add(picked.id);
          replaceKey(slot.id, {
            ...picked,
            key: slot.id,
            ratio: slot.ratio,
            col: slot.col,
            badge: slot.badge || null,
          });
        } else {
          replaceKey(slot.id, fallbackForSlot(slot));
        }
      });
    };

    const tasks = session.queries.map((qs, qi) =>
      fetchNext(qs).then(
        (items) => {
          results[qi] = items;
          fillSlots(qi);
        },
        (err) => {
          results[qi] = null;
          results.errors = [...(results.errors || []), err];
          fillSlots(qi);
        },
      ),
    );

    Promise.all(tasks).then(() => {
      if (!alive()) return;
      const failed = results.filter((r) => r === null).length;
      const allFailed = failed === results.length;
      const leftovers = interleave(results.map((r) => (r || []).filter((i) => !session.used.has(i.id))));
      session.pool = leftovers;
      const firstBatch = session.pool.splice(0, isHome ? BATCH : 24);
      const more = session.pool.length > 0 || session.queries.some((q) => !q.done);

      setState((s) => {
        if (isHome) {
          return {
            ...s,
            items: [...s.items.filter((i) => !i.placeholder), ...firstBatch],
            phase: 'ready',
            hasMore: !allFailed && more,
            offline: allFailed,
            loadError: allFailed ? (results.errors?.[0]?.message ?? 'Openverse is unreachable') : null,
          };
        }
        if (allFailed) {
          return { ...s, items: [], phase: 'error', hasMore: false, loadError: results.errors?.[0]?.message };
        }
        return {
          ...s,
          items: firstBatch,
          phase: firstBatch.length ? 'ready' : 'empty',
          hasMore: more,
          loadError: null,
        };
      });
    });

    return () => {
      if (sessionRef.current === session) sessionRef.current = null;
    };
  }, [source.key, filters.category, filters.licenseType, reloadToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    const session = sessionRef.current;
    if (!session || session.busy) return;
    session.busy = true;
    setState((s) => ({ ...s, loadingMore: true, loadError: null }));
    const aspectRatio = '';
    let error = null;

    if (session.pool.length < BATCH) {
      const active = session.queries.filter((q) => !q.done);
      const picks = [];
      for (let i = 0; i < Math.min(QUERIES_PER_LOAD_MORE, active.length); i += 1) {
        picks.push(active[(session.cursor + i) % active.length]);
      }
      session.cursor += picks.length;
      const fetched = await Promise.all(
        picks.map(async (qs) => {
          try {
            const res = await searchImages({
              q: qs.q,
              page: qs.page + 1,
              aspectRatio,
              category: filters.category,
              licenseType: filters.licenseType,
            });
            qs.page += 1;
            if (!res.items.length || (res.pageCount && qs.page >= res.pageCount)) qs.done = true;
            return res.items.filter((item) => {
              if (session.seen.has(item.id) || session.seen.has(item.url)) return false;
              session.seen.add(item.id);
              session.seen.add(item.url);
              return true;
            });
          } catch (err) {
            if (err.exhausted) qs.done = true;
            else error = err;
            return [];
          }
        }),
      );
      session.pool.push(...interleave(fetched));
    }

    if (sessionRef.current !== session) return;
    const next = session.pool.splice(0, BATCH);
    session.busy = false;
    const more = session.pool.length > 0 || session.queries.some((q) => !q.done);
    setState((s) => ({
      ...s,
      items: [...s.items, ...next],
      loadingMore: false,
      hasMore: more && !(error && !next.length),
      loadError: error && !next.length ? error.message : null,
    }));
  }, [filters.category, filters.licenseType]);

  return { ...state, loadMore };
}
