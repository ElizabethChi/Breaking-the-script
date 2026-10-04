import React, { useEffect, useRef } from 'react';
import { Camera, Mic, Search, X } from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch.js';

const DEBOUNCE_MS = 900;

export default function SearchBar({ value, onChange, onSearch, onClear, onCamera, onNotify }) {
  const inputRef = useRef(null);
  const typed = useRef(false);
  const lastSearched = useRef('');

  // Debounced live search for typed input; Enter always searches immediately.
  useEffect(() => {
    if (!typed.current) return undefined;
    const q = value.trim();
    if (q.length < 3 || q === lastSearched.current) return undefined;
    const t = setTimeout(() => {
      lastSearched.current = q;
      onSearch(q);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, onSearch]);

  const { listening, start } = useVoiceSearch({
    onResult: (text) => {
      typed.current = false;
      lastSearched.current = text;
      onChange(text);
      onSearch(text);
    },
    onError: onNotify,
  });

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    typed.current = false;
    lastSearched.current = q;
    onSearch(q);
    inputRef.current?.blur();
  };

  return (
    <form className="search" role="search" onSubmit={submit}>
      <Search className="search__icon" size={17} strokeWidth={1.9} aria-hidden="true" />
      <input
        ref={inputRef}
        className="search__input"
        type="search"
        name="q"
        placeholder="Search"
        aria-label="Search"
        autoComplete="off"
        spellCheck="false"
        enterKeyHint="search"
        value={value}
        onChange={(e) => {
          typed.current = true;
          onChange(e.target.value);
        }}
      />
      {value && (
        <button
          type="button"
          className="icon-btn icon-btn--search"
          aria-label="Clear search"
          onClick={() => {
            typed.current = false;
            lastSearched.current = '';
            onClear();
            inputRef.current?.focus();
          }}
        >
          <X size={18} strokeWidth={2} />
        </button>
      )}
      <button type="button" className="icon-btn icon-btn--search" aria-label="Search with an image" title="Search with an image" onClick={onCamera}>
        <Camera size={22} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        className={`icon-btn icon-btn--search${listening ? ' is-listening' : ''}`}
        aria-label={listening ? 'Stop voice search' : 'Search by voice'}
        aria-pressed={listening}
        title="Search by voice"
        onClick={start}
      >
        <Mic size={22} strokeWidth={1.8} />
      </button>
    </form>
  );
}
