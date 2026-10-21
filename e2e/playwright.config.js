// Playwright settings for the end-to-end test: a real browser drives the real app.
// Needs MongoDB with the demo data (npm run seed) and, once, `npx playwright install chromium`.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    // E2E_CHANNEL=msedge (or chrome) reuses a browser you already have instead of the download.
    channel: process.env.E2E_CHANNEL,
    trace: 'retain-on-failure', // a step-by-step replay to debug a failure: npx playwright show-trace
  },
  // Starts API and client together, or reuses them if `npm run dev` is already running.
  webServer: {
    command: 'npm run dev',
    cwd: '..',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
