// Poster picker for the edit page. Checks type and size in the browser for quick feedback; the
// server checks again, because anything in the browser can be bypassed.
import { useState } from 'react';
import { apiFetch, assetUrl } from '../api/client.js';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 2 * 1024 * 1024;

export default function PosterUpload({ eventId, posterUrl }) {
  const [url, setUrl] = useState(posterUrl);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    if (!TYPES.includes(file.type)) return setError('Choose a JPEG, PNG or WebP image.');
    if (file.size > MAX_BYTES) return setError('The image must be 2 MB or smaller.');

    const form = new FormData();
    form.append('poster', file);
    setStatus('Uploading…');
    try {
      const event = await apiFetch(`/events/${eventId}/poster`, {
        method: 'POST',
        body: form,
      });
      setUrl(event.posterUrl);
      setStatus('Poster updated.');
    } catch (err) {
      setError(err.message);
      setStatus('');
    }
  }

  return (
    <section className="mt-10 max-w-2xl" aria-labelledby="poster-heading">
      <h2
        id="poster-heading"
        className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100"
      >
        Poster
      </h2>
      {url && (
        <img
          src={assetUrl(url)}
          alt="Current poster"
          className="mb-3 max-h-60 rounded-lg"
        />
      )}
      <label
        htmlFor="poster-file"
        className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Upload a JPEG, PNG or WebP (max 2 MB)
      </label>
      <input
        id="poster-file"
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleChange}
        aria-describedby={error ? 'poster-error' : undefined}
        className="block text-sm text-slate-700 dark:text-slate-300"
      />
      <p role="status" className="mt-2 text-sm text-green-800 dark:text-green-300">
        {status}
      </p>
      {error && (
        <p
          id="poster-error"
          role="alert"
          className="text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      )}
    </section>
  );
}
