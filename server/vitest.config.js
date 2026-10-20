// Vitest settings for the API. Tests get their own fixed, fake secrets so they run without a .env file.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      JWT_ACCESS_SECRET: 'test-access-secret-that-is-long-enough-123',
      JWT_REFRESH_SECRET: 'test-refresh-secret-that-is-long-enough-456',
    },
  },
});
