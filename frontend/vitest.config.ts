import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        statements: 90,
        functions: 90,
        lines: 90,
        branches: 80,
      },
      exclude: [
        'src/test/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/main.tsx',
        '**/vite-env.d.ts',
      ],
    },
  },
});
