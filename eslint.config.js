import js from '@eslint/js';
export default [{ files: ['src/**/*.{ts,tsx}'], rules: { ...js.configs.recommended.rules } }];
