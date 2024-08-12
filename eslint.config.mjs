import globals from 'globals';
import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['src/**/*.{js,mjs,cjs,ts}'], // Target TypeScript and JavaScript files in the src folder
    languageOptions: {
      globals: {
        ...globals.browser, // Define browser globals
        ...globals.node, // Add Node.js globals
      },
      parser: tsParser, // Use the TypeScript parser
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // Define the TypeScript ESLint plugin
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log, allow warn and error
      ...pluginJs.configs.recommended.rules, // Include ESLint recommended rules
      ...tsPlugin.configs.recommended.rules, // Include TypeScript ESLint recommended rules
    },
  },
];
