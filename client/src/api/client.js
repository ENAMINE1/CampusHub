// The one place the React app talks to the API. Every request goes through apiFetch, so headers,
// cookies, the access token and error handling are written once.
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

// The access token lives only in this variable (memory), never in localStorage, where any
// script injected into the page could read it. A reload loses it; AuthContext gets a new one
// from the httpOnly refresh cookie.
let accessToken = null;
let onSessionExpired = () => {};

export function setAccessToken(token) {
  accessToken = token;
}

// AuthContext registers what to do when the session cannot be renewed (forget the user).
export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

async function send(path, { body, headers, ...options }) {
  // FormData (file uploads) goes as-is: the browser sets the multipart Content-Type itself.
  const isForm = body instanceof FormData;
  try {
    return await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(body && !isForm && { 'Content-Type': 'application/json' }),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...headers,
      },
      body: isForm ? body : JSON.stringify(body), // JSON.stringify(undefined) is undefined: no body
      credentials: 'include', // send the refresh cookie to /auth routes
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
}

async function readResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (res.ok) return data;

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

// Several requests can expire at the same moment; they all wait for ONE refresh call,
// because each refresh rotates the cookie and a second one would use an already-spent token.
let refreshing = null;

export function refreshSession() {
  refreshing ??= send('/auth/refresh', { method: 'POST' })
    .then(readResponse)
    .then((session) => {
      setAccessToken(session.accessToken);
      return session;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

export async function apiFetch(path, options = {}) {
  const res = await send(path, options);

  // An expired access token is normal: renew it with the refresh cookie and retry once.
  if (res.status === 401 && accessToken && !path.startsWith('/auth/')) {
    try {
      await refreshSession();
    } catch {
      setAccessToken(null);
      onSessionExpired();
      return readResponse(res);
    }
    return readResponse(await send(path, options));
  }
  return readResponse(res);
}

// Uploaded files come back as paths like /uploads/abc.png. In development the Vite proxy serves
// them; in production the API lives on another domain, so put the API's origin in front.
export function assetUrl(url) {
  if (!url || /^https?:\/\//.test(url) || !/^https?:\/\//.test(BASE_URL)) return url;
  return new URL(url, BASE_URL).href;
}
