// ESLint flat config for the whole repo. Prettier owns formatting, ESLint owns bugs.
import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
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
  prettier,
];
