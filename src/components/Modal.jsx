import React, { useEffect, useRef } from 'react';

/** Accessible modal shell: Escape/backdrop close, focus moves in and is restored, page scroll locked. */
export default function Modal({ label, onClose, children, className = '', variant = 'dialog' }) {
  const ref = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const focusables = () =>
      ref.current?.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])') ?? [];
    (focusables()[0] || ref.current)?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        const list = [...focusables()].filter((el) => !el.disabled);
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className={`modal-backdrop modal-backdrop--${variant}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={ref} className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
