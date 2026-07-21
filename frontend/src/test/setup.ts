import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import './mocks/browser-apis';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  server.resetHandlers();
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
