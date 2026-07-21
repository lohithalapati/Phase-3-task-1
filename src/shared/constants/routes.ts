export const ROUTES = {
  PUBLIC: {
    LANDING: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    EMAIL_VERIFICATION: '/verify-email',
  },
  PROTECTED: {
    DASHBOARD: '/dashboard',
    SETTINGS: '/dashboard/settings',
    PROFILE: '/dashboard/profile',
  },
  ERRORS: {
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '/404',
    SERVER_ERROR: '/500',
    MAINTENANCE: '/maintenance',
  }
} as const;