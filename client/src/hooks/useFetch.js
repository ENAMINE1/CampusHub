// Loads data from an API path and reports { data, isLoading, error, reload }.
// Refetches whenever the path changes, or when reload() is called.
import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client.js';

export default function useFetch(path) {
  const [reloadCount, setReloadCount] = useState(0);
  // Remember which request the stored result belongs to. If it is not the current one, we are loading.
  // This avoids calling setState at the start of the effect just to flip a loading flag.
  const requestKey = `${path}#${reloadCount}`;
  const [result, setResult] = useState({ key: null, data: null, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    apiFetch(path, { signal: controller.signal })
      .then((data) => setResult({ key: requestKey, data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setResult({ key: requestKey, data: null, error: err.message });
        }
      });
    return () => controller.abort();
  }, [path, requestKey]);

  const isLoading = result.key !== requestKey;
  return {
    data: result.data,
    isLoading,
    error: isLoading ? '' : result.error,
    reload: () => setReloadCount((n) => n + 1),
  };
}
