// api/client.js: an expired access token is renewed with the refresh cookie and the request retried once.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, setAccessToken, setSessionExpiredHandler } from '../api/client.js';

const json = (status, body) => ({ ok: status < 300, status, json: async () => body });
const expired = json(401, {
  error: { code: 'TOKEN_EXPIRED', message: 'Your session expired.' },
});

afterEach(() => {
  vi.unstubAllGlobals();
  setAccessToken(null);
});

describe('apiFetch', () => {
  it('sends the access token as a Bearer header', async () => {
    const fetchMock = vi.fn(async () => json(200, { ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    setAccessToken('abc');

    await apiFetch('/me/registrations');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
    expect(fetchMock.mock.calls[0][1].credentials).toBe('include');
  });

  it('refreshes once after a 401 and retries with the new token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(expired)
      .mockResolvedValueOnce(json(200, { user: {}, accessToken: 'fresh' }))
      .mockResolvedValueOnce(json(200, ['my data']));
    vi.stubGlobal('fetch', fetchMock);
    setAccessToken('old');

    expect(await apiFetch('/me/registrations')).toEqual(['my data']);
    expect(fetchMock.mock.calls[1][0]).toMatch(/\/auth\/refresh$/);
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe('Bearer fresh');
  });

  it('gives up when the refresh fails and reports the expired session', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(expired)
      .mockResolvedValueOnce(json(401, { error: { code: 'SESSION_EXPIRED' } }));
    vi.stubGlobal('fetch', fetchMock);
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    setAccessToken('old');

    await expect(apiFetch('/me/registrations')).rejects.toMatchObject({ status: 401 });
    expect(onExpired).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(2); // no endless retry loop
  });

  it('turns error responses into ApiError with the server code', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => json(409, { error: { code: 'EMAIL_TAKEN', message: 'Taken.' } })),
    );
    await expect(
      apiFetch('/auth/register', { method: 'POST', body: {} }),
    ).rejects.toMatchObject({
      status: 409,
      code: 'EMAIL_TAKEN',
      message: 'Taken.',
    });
  });
});
