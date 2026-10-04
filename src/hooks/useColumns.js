import { useLayoutEffect, useState } from 'react';
import { columnCountFor } from '../utils/layout.js';

function estimate() {
  const w = window.innerWidth;
  const mobile = w < 640;
  return columnCountFor(w - (mobile ? 24 : 64 + 14 + 30));
}

/** Column count derived from the real content width of the feed (not the viewport). */
export function useColumns(ref) {
  const [count, setCount] = useState(estimate);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setCount(columnCountFor(el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return count;
}
