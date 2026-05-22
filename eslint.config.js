import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['frontend/**/*.{js,jsx}', 'backend/**/*.{js,jsx}', 'scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['frontend/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['backend/**/*.{js,jsx}', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
];
