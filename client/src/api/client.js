// The one place the React app talks to the API. Every request goes through apiFetch, so headers,
// cookies and error handling are written once.
// In development VITE_API_URL is unset and '/api/v1' goes through the Vite proxy (vite.config.js).
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

// Thrown for every non-2xx response, carrying the server's { code, message, details }.
export class ApiError extends Error {
  constructor(status, code, message, details = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch(path, { body, ...options } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // send cookies (needed for login in a later video)
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // fetch only rejects when the server could not be reached at all.
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'Cannot reach the server. Is the API running?',
    );
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = data?.error ?? {};
    // 502-504 with no JSON body usually means a proxy could not reach Express at all.
    const fallback =
      res.status >= 502 && res.status <= 504
        ? 'Cannot reach the server. Is the API running?'
        : `Request failed (HTTP ${res.status}).`;
    throw new ApiError(
      res.status,
      error.code ?? 'HTTP_ERROR',
      error.message ?? fallback,
      error.details ?? [],
    );
  }
  return data;
}
