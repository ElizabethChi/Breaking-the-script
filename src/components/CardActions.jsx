import React, { useRef, useState } from 'react';
import { Ellipsis } from 'lucide-react';
import OverflowMenu from './OverflowMenu.jsx';

/** Compact action row rendered underneath each image (fixed height keeps the column rhythm). */
export default function CardActions({ item }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const btnRef = useRef(null);

  const toggle = (e) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setOpenUp(window.innerHeight - rect.bottom < 150);
    }
    setOpen((v) => !v);
  };

  return (
    <div className="card-actions">
      <button
        ref={btnRef}
        type="button"
        className="icon-btn icon-btn--dots"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <Ellipsis size={20} strokeWidth={2} />
      </button>
      {open && <OverflowMenu item={item} openUp={openUp} onClose={() => setOpen(false)} />}
    </div>
  );
}
