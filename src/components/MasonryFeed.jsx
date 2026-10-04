import React, { useEffect, useMemo, useRef } from 'react';
import MasonryColumn from './MasonryColumn.jsx';
import { useColumns } from '../hooks/useColumns.js';
import { distribute } from '../utils/layout.js';

export default function MasonryFeed({
  items,
  phase,
  hasMore,
  loadingMore,
  loadError,
  offline,
  onLoadMore,
  onRetry,
  emptyTitle,
  emptyHint,
}) {
  const gridRef = useRef(null);
  const sentinelRef = useRef(null);
  const columnCount = useColumns(gridRef);
  const columns = useMemo(() => distribute(items, columnCount), [items, columnCount]);

  // Infinite scroll: request more when the sentinel nears the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !onLoadMore || !hasMore || loadingMore || loadError || phase !== 'ready') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onLoadMore();
      },
      { rootMargin: '900px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onLoadMore, hasMore, loadingMore, loadError, phase, items.length]);

  const showEmpty = phase === 'empty' || phase === 'error';

  return (
    <main className="feed" id="feed">
      {showEmpty && (
        <div className="feed__empty">
          <h1>{phase === 'error' ? 'We couldn’t load pins right now' : emptyTitle || 'No pins found'}</h1>
          <p>
            {phase === 'error'
              ? 'The image service didn’t respond. Check your connection or try again in a moment.'
              : emptyHint || 'Try a different search or pick another topic.'}
          </p>
          {phase === 'error' && onRetry && (
            <button type="button" className="btn btn--gray" onClick={onRetry}>
              Try again
            </button>
          )}
        </div>
      )}

      <div ref={gridRef} className="masonry" style={{ '--cols': columnCount }}>
        {columns.map((col, i) => (
          <MasonryColumn key={i} items={col} columnIndex={i} />
        ))}
      </div>

      <div ref={sentinelRef} className="feed__sentinel" aria-hidden="true" />

      {(loadError || offline) && phase === 'ready' && (
        <div className="feed__notice">
          <span>
            {offline
              ? 'Couldn’t reach Openverse, so you’re seeing offline placeholders.'
              : 'Couldn’t load more pins right now.'}
          </span>
          <button type="button" className="btn btn--gray" onClick={onRetry || onLoadMore}>
            {offline ? 'Retry' : 'Try again'}
          </button>
        </div>
      )}
      {loadingMore && <div className="feed__loading" role="status">Loading more pins…</div>}
    </main>
  );
}
