import { useCallback, useRef, useState } from 'react';

const Recognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export const voiceSupported = Boolean(Recognition);

/** Permission-aware speech recognition. Calls onResult(text) / onError(message). */
export function useVoiceSearch({ onResult, onError }) {
  const [listening, setListening] = useState(false);
  const ref = useRef(null);

  const stop = useCallback(() => ref.current?.stop(), []);

  const start = useCallback(() => {
    if (!Recognition) {
      onError('Voice search isn’t supported in this browser. Try Chrome, Edge or Safari, or type your search.');
      return;
    }
    if (listening) {
      stop();
      return;
    }
    const rec = new Recognition();
    rec.lang = navigator.language || 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript;
      if (text) onResult(text);
    };
    rec.onerror = (e) => {
      setListening(false);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        onError('Microphone access was blocked. Allow it in your browser’s site settings to use voice search.');
      } else if (e.error === 'no-speech') {
        onError('I didn’t catch that. Try again.');
      } else if (e.error !== 'aborted') {
        onError('Voice search failed. Please try again or type your search.');
      }
    };
    ref.current = rec;
    try {
      rec.start();
    } catch {
      onError('Voice search couldn’t start. Please try again.');
    }
  }, [listening, onError, onResult, stop]);

  return { listening, start };
}
