// Vite config: the React plugin compiles JSX, the Tailwind plugin replaces PostCSS setup.
// The `test` block configures Vitest, which reuses this same config.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom', // a fake browser DOM inside Node
    setupFiles: './src/test/setup.js',
  },
});
