# Typed Route Endpoint Registry

All application endpoints are managed centrally in `shared/api/endpoints/registry.ts`.

## Configuration Standard
```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
  },
  ORGANIZATION: {
    LIST: '/organizations',
    DETAILS: (id: string) => `/organizations/${id}`,
  }
} as const;
Direct string literals are not allowed when calling the shared API client inside feature modules.
