// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
   {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // --- Format rules ---
      indent: ['error', 4, { SwitchCase: 1 }],
      'brace-style': ['error', 'allman', { allowSingleLine: true }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'max-len': ['error', { code: 255, ignoreComments: true, ignoreStrings: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      'semi-spacing': ['error', { before: false, after: true }],

      // --- Logic rules ---
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'warn',
    },
  },
);
