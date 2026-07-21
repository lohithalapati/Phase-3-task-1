
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';

// Auth Pages & System
import { 
  LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage,
  SessionExpiredPage, UnauthorizedPage, ForbiddenPage, LandingAuthPage 
} from '../features/auth';

// Guards
import { ProtectedRoute, PublicRoute } from './guards';

// Layouts
import { DashboardLayout } from '../layouts/dashboard/DashboardLayout';
import { DashboardIndex } from '../pages/dashboard/DashboardIndex';

// Router Navigation Wrapper for isolated pages that don't have access to useNavigation directly
const LoginWrapper = () => {
  const navigate = useNavigate();
  return <LoginPage onNavigate={(path) => navigate(`/${path}`)} />;
};

const SignupWrapper = () => {
  const navigate = useNavigate();
  return <SignupPage onNavigate={(path) => navigate(`/${path}`)} />;
};

const LandingWrapper = () => {
  const navigate = useNavigate();
  return <LandingAuthPage onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/signup')} />;
};

export const router = createBrowserRouter([
  // Public Landing
  {
    path: '/',
    element: <PublicRoute><LandingWrapper /></PublicRoute>,
  },
  // Public Authentication Routes
  {
    path: '/login',
    element: <PublicRoute><LoginWrapper /></PublicRoute>,
  },
  {
    path: '/signup',
    element: <PublicRoute><SignupWrapper /></PublicRoute>,
  },
  {
    path: '/forgot-password',
    element: <PublicRoute><ForgotPasswordPage onNavigate={() => {}} /></PublicRoute>,
  },
  {
    path: '/reset-password',
    element: <PublicRoute><ResetPasswordPage /></PublicRoute>,
  },
  
  // Protected Enterprise Application Routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardIndex />
      },
      {
        path: 'users',
        element: <div className="p-6 text-slate-600">Identity Management Module (Requires Task 5)</div>
      },
      {
        path: 'audit',
        element: <div className="p-6 text-slate-600">Security Audit Logs (Requires Task 5)</div>
      }
    ]
  },

  // Error States
  { path: '/session-expired', element: <SessionExpiredPage onRelogin={() => window.location.href = '/login'} /> },
  { path: '/unauthorized', element: <UnauthorizedPage onReturn={() => window.location.href = '/login'} /> },
  { path: '/forbidden', element: <ForbiddenPage onReturn={() => window.location.href = '/dashboard'} /> },
  
  // Fallback Catch-all
  { path: '*', element: <Navigate to="/dashboard" replace /> }
]);

