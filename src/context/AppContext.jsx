import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useSaved } from '../hooks/useSaved.js';
import { copyText } from '../utils/share.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { saved, isSaved, toggleSave, clearSaved } = useSaved();
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(0);

  const showToast = useCallback((message, action) => {
    clearTimeout(toastTimer.current);
    setToast({ message, action, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const save = useCallback(
    (item) => {
      const wasSaved = isSaved(item);
      toggleSave(item);
      showToast(wasSaved ? 'Removed from saved pins' : 'Saved to your pins');
    },
    [isSaved, toggleSave, showToast],
  );

  const share = useCallback(
    async (item) => {
      const link = item.landingUrl;
      if (!link) {
        showToast('This placeholder has no public link to share');
        return;
      }
      const ok = await copyText(link);
      showToast(ok ? 'Link copied to clipboard' : 'Couldn’t copy the link');
    },
    [showToast],
  );

  const viewSource = useCallback(
    (item) => {
      if (!item.landingUrl || item.fallback) {
        showToast('No external source for this placeholder');
        return;
      }
      window.open(item.landingUrl, '_blank', 'noopener,noreferrer');
    },
    [showToast],
  );

  const value = useMemo(
    () => ({
      saved,
      isSaved,
      save,
      clearSaved,
      share,
      viewSource,
      detail,
      openDetail: setDetail,
      closeDetail: () => setDetail(null),
      toast,
      showToast,
      dismissToast: () => setToast(null),
    }),
    [saved, isSaved, save, clearSaved, share, viewSource, detail, toast, showToast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
