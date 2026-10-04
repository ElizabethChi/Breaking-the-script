import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImageOff, Link2, ArrowUpRight } from 'lucide-react';
import CardActions from './CardActions.jsx';
import { cardRatio } from '../utils/layout.js';
import { useApp } from '../context/AppContext.jsx';

export default function ImageCard({ item, eager }) {
  const { openDetail, isSaved, save } = useApp();
  const ratio = cardRatio(item);
  const sources = useMemo(
    () => [item.thumb, item.url].filter((s, i, arr) => s && arr.indexOf(s) === i),
    [item.thumb, item.url],
  );
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  // Reset when the card is re-used for a different image (e.g. slot placeholder -> loaded result).
  useEffect(() => {
    setAttempt(0);
    setLoaded(false);
  }, [item.id]);

  // Cached images can finish before the load handler is attached.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, [attempt, item.id]);

  const failed = !item.placeholder && attempt >= sources.length;
  const saved = !item.placeholder && isSaved(item);
  const open = () => !item.placeholder && openDetail(item);

  return (
    <article className="card" aria-busy={item.placeholder || undefined}>
      <div
        className={`card__media${loaded ? ' is-loaded' : ''}`}
        style={{ aspectRatio: `1 / ${ratio}` }}
        role={item.placeholder ? undefined : 'button'}
        tabIndex={item.placeholder ? undefined : 0}
        aria-label={item.placeholder ? undefined : `Open ${item.title}`}
        onClick={open}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            open();
          }
        }}
      >
        {!item.placeholder && !failed && (
          <img
            ref={imgRef}
            src={sources[attempt]}
            alt={item.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setAttempt((a) => a + 1)}
          />
        )}
        {failed && (
          <div className="card__fallback" role="img" aria-label="Image unavailable">
            <ImageOff size={26} strokeWidth={1.5} />
          </div>
        )}
        {item.badge && !item.placeholder && <span className="card__badge">{item.badge}</span>}

        {!item.placeholder && (
          <div className="card__hover">
            <button
              type="button"
              className={`save-btn${saved ? ' save-btn--saved' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                save(item);
              }}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
            {item.landingUrl && !item.fallback && (
              <a
                className="card__source"
                href={item.landingUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open original source"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowUpRight size={16} strokeWidth={2.2} />
              </a>
            )}
          </div>
        )}
      </div>
      {item.placeholder ? <div className="card-actions" /> : <CardActions item={item} />}
    </article>
  );
}
