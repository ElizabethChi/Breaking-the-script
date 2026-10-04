import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import Modal from './Modal.jsx';

/**
 * Visual-search entry point. Openverse can't search by image and no recognition runs here,
 * so the dialog says so plainly and lets the user describe the picture in words instead.
 */
export default function VisualSearchModal({ onClose, onSearch }) {
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const choose = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
    setText((t) => t || f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSearch(text.trim());
    onClose();
  };

  return (
    <Modal label="Search with an image" onClose={onClose} className="dialog">
      <form onSubmit={submit}>
        <div className="dialog__head">
          <h2>Search with an image</h2>
          <button type="button" className="icon-btn icon-btn--round" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="dialog__body create">
          <button type="button" className="dropzone" onClick={() => inputRef.current?.click()}>
            {preview ? (
              <img src={preview} alt="Selected image" />
            ) : (
              <>
                <Camera size={28} strokeWidth={1.6} />
                <span>Choose a photo</span>
              </>
            )}
          </button>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => choose(e.target.files?.[0])} />
          <p className="dialog__note">
            Image recognition isn’t available in this demo, and the photo never leaves your device. Describe what you’d
            like to find and we’ll search Openverse for it.
          </p>
          <label className="field">
            <span>Describe it</span>
            <input
              type="text"
              value={text}
              placeholder="e.g. teal sports car"
              onChange={(e) => setText(e.target.value)}
            />
          </label>
        </div>
        <div className="dialog__foot">
          <button type="submit" className="save-btn save-btn--lg" disabled={!text.trim()}>
            Search
          </button>
        </div>
      </form>
    </Modal>
  );
}
