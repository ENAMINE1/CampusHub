// Poster picker for the edit page. Checks type and size in the browser for quick feedback; the
// server checks again, because anything in the browser can be bypassed.
import { useState } from 'react';
import { ImageUp } from 'lucide-react';
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
    <section
      className="mt-8 max-w-3xl rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8"
      aria-labelledby="poster-heading"
    >
      <h2 id="poster-heading" className="mb-4 text-xl font-bold">
        Poster
      </h2>
      {url && (
        <img
          src={assetUrl(url)}
          alt="Current poster"
          className="mb-4 max-h-60 rounded-xl border border-line"
        />
      )}
      <label
        htmlFor="poster-file"
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line px-6 py-8 text-center text-sm text-ink-muted transition hover:border-brand-400 hover:bg-surface-muted focus-within:border-brand-500"
      >
        <ImageUp className="size-6 text-brand-500" aria-hidden="true" />
        <span>
          <span className="font-semibold text-ink">Choose an image</span> (JPEG, PNG or
          WebP, max 2 MB)
        </span>
        <input
          id="poster-file"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleChange}
          aria-describedby={error ? 'poster-error' : undefined}
          className="sr-only"
        />
      </label>
      <p
        role="status"
        className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-300"
      >
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
