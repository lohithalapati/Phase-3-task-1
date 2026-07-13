import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['shared/api/**/*.ts'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'shared/api/__tests__/**',
        'shared/api/**/index.ts',
        'shared/api/types/**',
        'shared/api/dto/**',
        'shared/api/utils/localStorage.ts',
        'shared/api/constants/http.ts',
        'shared/api/constants/retry.ts',
      ],
      // Thresholds enforced on every test run
      thresholds: {
        statements: 95,    // Currently 95.52% ?
        branches: 80,      // Currently 82.8% ? (gap is private/module state)
        functions: 95,     // Currently 96.07% ?
        lines: 95,         // Currently 96.2% ?
      },
    },
  },
});
