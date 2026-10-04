import React, { useRef, useState } from 'react';
import { Bookmark, ChevronDown } from 'lucide-react';
import { AvatarSilhouette } from './icons.jsx';
import { useDismiss } from '../hooks/useDismiss.js';

export default function AccountMenu({ savedCount, onSaved, onClearSaved }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div className="account" ref={ref}>
      <button
        type="button"
        className="account__btn"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="account__avatar">
          <AvatarSilhouette size={30} />
        </span>
        <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
      </button>
      {open && (
        <div className="menu account__menu" role="menu">
          <div className="account__who">
            <span className="account__avatar account__avatar--lg">
              <AvatarSilhouette size={44} />
            </span>
            <div>
              <strong>Guest</strong>
              <span>Saved pins stay in this browser</span>
            </div>
          </div>
          <button
            type="button"
            role="menuitem"
            className="menu__item"
            onClick={() => {
              setOpen(false);
              onSaved();
            }}
          >
            <Bookmark size={16} /> Saved pins{savedCount ? ` (${savedCount})` : ''}
          </button>
          <button
            type="button"
            role="menuitem"
            className="menu__item"
            disabled={!savedCount}
            onClick={() => {
              setOpen(false);
              onClearSaved();
            }}
          >
            Clear saved pins
          </button>
          <a
            role="menuitem"
            className="menu__item"
            href="https://openverse.org/about"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Image sources &amp; licenses
          </a>
        </div>
      )}
    </div>
  );
}
