export const ENDPOINT_REGISTRY = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh-token',
    me: '/auth/me',
  },
  users: {
    base: '/users',
    detail: (userId: string) => `/users/${userId}`,
    profile: '/users/profile',
  },
  dashboard: {
    summary: '/dashboard/summary',
    metrics: '/dashboard/metrics',
  },
  projects: {
    base: '/projects',
    detail: (projectId: string) => `/projects/${projectId}`,
    handoffs: (projectId: string) => `/projects/${projectId}/handoffs`,
  },
  analytics: {
    performance: '/analytics/performance',
    usage: '/analytics/usage',
  },
  ai: {
    transcribe: '/ai/transcribe',
    summarize: '/ai/summarize',
    generateHandoff: '/ai/generate-handoff',
  },
} as const;

export type EndpointRegistryType = typeof ENDPOINT_REGISTRY;