// Fetches JSON from a URL and reports { data, isLoading, error }. Refetches whenever the URL changes.
import { useEffect, useState } from 'react';

export default function useFetch(url) {
  // Remember which URL the stored result belongs to. If it is not the current URL, we are still loading.
  // This avoids calling setState at the start of the effect just to flip a loading flag.
  const [result, setResult] = useState({ url: null, data: null, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        // Classic mistake: fetch only rejects on network failure. A 404 still "succeeds" unless you check res.ok.
        if (!res.ok) throw new Error(`Request failed (HTTP ${res.status}).`);
        return res.json();
      })
      .then((data) => setResult({ url, data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setResult({ url, data: null, error: err.message });
      });
    return () => controller.abort();
  }, [url]);

  const isLoading = result.url !== url;
  return { data: result.data, isLoading, error: isLoading ? '' : result.error };
}
