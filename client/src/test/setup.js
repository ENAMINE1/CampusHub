// Runs before every test file: adds DOM matchers (toBeInTheDocument...), a default fake API in
// which nobody is logged in, and cleanup after each test. Tests can stub fetch with their own fake.
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        error: { code: 'UNAUTHENTICATED', message: 'Please log in.' },
      }),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});
