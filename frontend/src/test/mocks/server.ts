import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
  http.get('/api/v1/health', () => HttpResponse.json({ status: 'ok' })),
];

export const server = setupServer(...handlers);
