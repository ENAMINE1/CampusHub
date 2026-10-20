// Vitest settings for the API. Tests get their own fixed, fake secrets so they run without a .env file,
// and a throwaway in-memory MongoDB (tests/globalSetup.js) instead of a real database.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: './tests/globalSetup.js',
    setupFiles: ['./tests/setupDb.js'],
    hookTimeout: 120_000, // the first run downloads MongoDB, which can take a while
    env: {
      NODE_ENV: 'test',
      JWT_ACCESS_SECRET: 'test-access-secret-that-is-long-enough-123',
      JWT_REFRESH_SECRET: 'test-refresh-secret-that-is-long-enough-456',
    },
  },
});
