import { useCallback, useEffect, useState } from 'react';
import { isSafeItem } from '../utils/safety.js';

const KEY = 'discover:saved:v1';

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isSafeItem) : [];
  } catch {
    return [];
  }
}

export function useSaved() {
  const [saved, setSaved] = useState(load);

  useEffect(() => {
    try {
      // Blob previews (local uploads) can't survive a reload, so they aren't persisted.
      localStorage.setItem(KEY, JSON.stringify(saved.filter((s) => !String(s.url).startsWith('blob:'))));
    } catch {
      /* ignore quota errors */
    }
  }, [saved]);

  const isSaved = useCallback((item) => saved.some((s) => s.id === item.id), [saved]);

  const toggleSave = useCallback((item) => {
    let nowSaved = false;
    setSaved((list) => {
      if (list.some((s) => s.id === item.id)) return list.filter((s) => s.id !== item.id);
      nowSaved = true;
      // Keep only serialisable metadata (drop layout hints and blob previews).
      const { col, badge, placeholder, ...rest } = item; // eslint-disable-line no-unused-vars
      return [{ ...rest, key: item.id, savedAt: Date.now() }, ...list];
    });
    return nowSaved;
  }, []);

  const clearSaved = useCallback(() => setSaved([]), []);

  return { saved, isSaved, toggleSave, clearSaved };
}
