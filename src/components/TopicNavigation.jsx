import React, { useEffect, useRef } from 'react';

export default function TopicNavigation({ topics, activeIndex, onSelect }) {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current?.querySelector('[aria-current="true"]');
    el?.scrollIntoView?.({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  }, [activeIndex]);

  return (
    <nav className="topics" aria-label="Topics">
      <ul ref={listRef} className="topics__list">
        {topics.map((t, i) => (
          <li key={t.label}>
            <button
              type="button"
              className={`topic${i === activeIndex ? ' is-active' : ''}`}
              aria-current={i === activeIndex ? 'true' : undefined}
              onClick={() => onSelect(i)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
