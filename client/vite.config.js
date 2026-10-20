// Vite config: the React plugin compiles JSX, the Tailwind plugin replaces PostCSS setup.
// The `test` block configures Vitest, which reuses this same config.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development the browser calls /api on Vite's own port, and Vite forwards it to Express.
    // Same origin means no CORS errors and cookies just work.
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000', // poster images
    },
  },
  test: {
    environment: 'jsdom', // a fake browser DOM inside Node
    setupFiles: './src/test/setup.js',
  },
});
