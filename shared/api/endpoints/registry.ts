export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  ORGANIZATION: {
    LIST: '/organizations',
    DETAILS: (id: string) => `/organizations/${id}`,
  },
  USER: {
    PROFILE: '/user/profile',
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
