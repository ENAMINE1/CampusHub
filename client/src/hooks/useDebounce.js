// Returns `value`, but only after it has stopped changing for `delay` milliseconds.
import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Each new value cancels the previous timer, so only the last one wins.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
