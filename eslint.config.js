// ESLint flat config for the whole repo. Prettier owns formatting, ESLint owns bugs.
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import { reactRefresh } from 'eslint-plugin-react-refresh';

export default defineConfig(
  { ignores: ['**/node_modules/', '**/dist/', '**/coverage/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
  {
    // The React app runs in the browser and uses JSX.
    files: ['client/src/**/*.{js,jsx}'],
    extends: [reactHooks.configs.flat['recommended-latest'], reactRefresh.configs.vite()],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // A context file exports its Provider and its hook together on purpose; Fast Refresh
    // simply reloads the page when one of these files changes.
    files: ['client/src/context/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  prettier,
);
