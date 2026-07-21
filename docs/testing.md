# Testing Guide

## Task 12 Enterprise Testing Infrastructure

Frontend testing infrastructure includes:

- Vitest configuration
- Global test setup
- Mock Service Worker server
- Browser API mocks
- Mock EventBus
- Test factories
- Fixtures
- Custom render utilities

## Coverage Targets

- Statements >= 90%
- Functions >= 90%
- Lines >= 90%
- Branches >= 80%

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run test:coverage
npm run build
