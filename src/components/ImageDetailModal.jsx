import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Link2 } from 'lucide-react';
import Modal from './Modal.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function ImageDetailModal() {
  const { detail: item, closeDetail, isSaved, save, share, viewSource } = useApp();
  if (!item) return null;
  return <DetailBody key={item.id} item={item} onClose={closeDetail} {...{ isSaved, save, share, viewSource }} />;
}

function DetailBody({ item, onClose, isSaved, save, share, viewSource }) {
  const [fullFailed, setFullFailed] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);
  const saved = isSaved(item);
  const previewSrc = item.thumb || item.url;
  const hasSource = Boolean(item.landingUrl) && !item.fallback;

  return (
    <Modal label={item.title} onClose={onClose} className="detail" variant="detail">
      <button type="button" className="icon-btn icon-btn--round detail__back" aria-label="Close" onClick={onClose}>
        <ArrowLeft size={22} />
      </button>

      <div className="detail__media">
        <img className="detail__img detail__img--preview" src={previewSrc} alt="" referrerPolicy="no-referrer" />
        {!fullFailed && (
          <img
            className={`detail__img detail__img--full${fullLoaded ? ' is-loaded' : ''}`}
            src={item.url}
            alt={item.alt}
            referrerPolicy="no-referrer"
            onLoad={() => setFullLoaded(true)}
            onError={() => setFullFailed(true)}
          />
        )}
      </div>

      <div className="detail__info">
        <div className="detail__toolbar">
          <button type="button" className="icon-btn icon-btn--round" aria-label="Copy link" onClick={() => share(item)}>
            <Link2 size={22} />
          </button>
          <button
            type="button"
            className={`save-btn save-btn--lg${saved ? ' save-btn--saved' : ''}`}
            onClick={() => save(item)}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        <h2 className="detail__title">{item.title}</h2>
        {item.creator && (
          <p className="detail__line">
            By{' '}
            {item.creatorUrl ? (
              <a href={item.creatorUrl} target="_blank" rel="noopener noreferrer">
                {item.creator}
              </a>
            ) : (
              <strong>{item.creator}</strong>
            )}
            {item.provider && item.provider !== 'local' && <span className="detail__muted"> · via {item.provider}</span>}
          </p>
        )}
        <p className="detail__line">
          License:{' '}
          {item.licenseUrl ? (
            <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer">
              {item.license}
            </a>
          ) : (
            <strong>{item.license}</strong>
          )}
        </p>
        {item.width && item.height && !item.fallback && (
          <p className="detail__line detail__muted">
            {item.width} × {item.height}px
          </p>
        )}
        {item.attribution && <p className="detail__attribution">{item.attribution}</p>}

        <div className="detail__buttons">
          <button type="button" className="btn btn--gray" disabled={!hasSource} onClick={() => viewSource(item)}>
            <ExternalLink size={16} /> View source
          </button>
        </div>
        {fullFailed && <p className="detail__muted detail__line">The full-size image couldn’t be loaded.</p>}
      </div>
    </Modal>
  );
}
