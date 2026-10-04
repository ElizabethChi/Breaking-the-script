import { useEffect } from 'react';

/** Calls onDismiss on outside pointer-down or Escape while `active`. */
export function useDismiss(ref, active, onDismiss) {
  useEffect(() => {
    if (!active) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onDismiss();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, active, onDismiss]);
}
