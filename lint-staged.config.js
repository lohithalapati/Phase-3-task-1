module.exports = {
  'src/**/*.{ts,tsx}': [
    'prettier --write',
    'eslint --fix',
    'vitest run --passWithNoTests'
  ],
  'src/**/*.css': [
    'prettier --write'
  ]
};