import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Modal from './Modal.jsx';

export default function CreatePinModal({ onClose, onPublish }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dims, setDims] = useState(null);
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const choose = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => setDims({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
    setFile(f);
    setPreview(url);
    setTitle((t) => t || f.name.replace(/\.[^.]+$/, ''));
  };

  const publish = (e) => {
    e.preventDefault();
    if (!file || !preview) return;
    const id = `mine-${Date.now()}`;
    onPublish({
      key: id,
      id,
      title: title.trim() || 'Untitled pin',
      alt: title.trim() || 'Your uploaded pin',
      thumb: null,
      url: preview,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
      rawRatio: dims ? dims.height / dims.width : 1.33,
      creator: 'You',
      creatorUrl: null,
      landingUrl: null,
      license: 'Your upload',
      licenseUrl: null,
      provider: 'local',
      attribution: null,
    });
    setPreview(null); // ownership of the blob URL passes to the pin
    onClose();
  };

  return (
    <Modal label="Create Pin" onClose={onClose} className="dialog">
      <form onSubmit={publish}>
        <div className="dialog__head">
          <h2>Create Pin</h2>
          <button type="button" className="icon-btn icon-btn--round" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="dialog__body create">
          <button type="button" className="dropzone" onClick={() => inputRef.current?.click()}>
            {preview ? (
              <img src={preview} alt="Selected upload preview" />
            ) : (
              <>
                <ImagePlus size={28} strokeWidth={1.6} />
                <span>Choose an image</span>
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => choose(e.target.files?.[0])}
          />
          <label className="field">
            <span>Title</span>
            <input type="text" value={title} maxLength={100} placeholder="Add a title" onChange={(e) => setTitle(e.target.value)} />
          </label>
          <p className="dialog__note">Pins you create stay on this device and in this tab only — nothing is uploaded.</p>
        </div>
        <div className="dialog__foot">
          <button type="submit" className="save-btn save-btn--lg" disabled={!file}>
            Publish
          </button>
        </div>
      </form>
    </Modal>
  );
}
