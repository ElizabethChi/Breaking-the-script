import React, { useRef } from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Link2 } from 'lucide-react';
import { useDismiss } from '../hooks/useDismiss.js';
import { useApp } from '../context/AppContext.jsx';

/** Compact action menu opened from the three-dot button. Absolutely positioned: never affects layout. */
export default function OverflowMenu({ item, openUp, onClose }) {
  const ref = useRef(null);
  const { isSaved, save, share, viewSource } = useApp();
  const saved = isSaved(item);
  useDismiss(ref, true, onClose);

  const run = (fn) => () => {
    fn(item);
    onClose();
  };

  return (
    <div ref={ref} className={`menu overflow-menu${openUp ? ' overflow-menu--up' : ''}`} role="menu" aria-label="Pin actions">
      <button type="button" role="menuitem" className="menu__item" onClick={run(save)}>
        {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {saved ? 'Unsave' : 'Save'}
      </button>
      <button type="button" role="menuitem" className="menu__item" onClick={run(share)}>
        <Link2 size={16} />
        Share link
      </button>
      <button type="button" role="menuitem" className="menu__item" onClick={run(viewSource)}>
        <ExternalLink size={16} />
        View source
      </button>
    </div>
  );
}
