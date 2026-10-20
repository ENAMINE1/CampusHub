// Works like useState, but also saves the value in localStorage so it survives a page reload.
import { useEffect, useState } from 'react';

function readStoredValue(key, initialValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? initialValue : JSON.parse(saved);
  } catch {
    // Storage can be blocked (private mode) or hold broken JSON; fall back instead of crashing.
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue) {
  // Passing a function means localStorage is read only on the first render, not on every render.
  const [value, setValue] = useState(() => readStoredValue(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Saving is a nice-to-have; the app keeps working in memory if storage is full or blocked.
    }
  }, [key, value]);

  return [value, setValue];
}
