import React from 'react';
import ImageCard from './ImageCard.jsx';

export default function MasonryColumn({ items, columnIndex }) {
  return (
    <div className="masonry__column" role="list" aria-label={`Column ${columnIndex + 1}`}>
      {items.map((item, i) => (
        <div role="listitem" key={item.key}>
          <ImageCard item={item} eager={i < 2} />
        </div>
      ))}
    </div>
  );
}
