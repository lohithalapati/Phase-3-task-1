import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

// Layout Wrappers
import { RootLayout } from '@shared/layouts/RootLayout';
import { AuthLayout } from '@shared/layouts/AuthLayout';
import { DashboardLayout } from '@shared/layouts/DashboardLayout';
import { ErrorLayout } from '@shared/layouts/ErrorLayout';

// Guard Nodes
import { AuthGuard } from '@features/auth/components/guards/AuthGuard';
import { GuestGuard } from '@features/auth/components/guards/GuestGuard';
import { RoleGuard } from '@features/auth/components/guards/RoleGuard';

// Fallback Spinner UI
import { RouteLoader } from '@shared/components/feedback/RouteLoader';

// Lazy-loaded Components
const Landing = lazy(() => import('@features/public/LandingPage').then(m => ({ default: m.LandingPage })));
const Login = lazy(() => import('@features/auth/components/LoginPage').then(m => ({ default: m.LoginPage })));
const Signup = lazy(() => import('@features/auth/components/SignupPage').then(m => ({ default: m.SignupPage })));
const ForgotPassword = lazy(() => import('@features/auth/components/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPassword = lazy(() => import('@features/auth/components/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const EmailVerification = lazy(() => import('@features/auth/components/EmailVerificationPage').then(m => ({ default: m.EmailVerificationPage })));

const Dashboard = lazy(() => import('@features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const Settings = lazy(() => import('@features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const Profile = lazy(() => import('@features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));

const Unauthorized = lazy(() => import('@features/errors/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));
const NotFound = lazy(() => import('@features/errors/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ServerError = lazy(() => import('@features/errors/ServerErrorPage').then(m => ({ default: m.ServerErrorPage })));
const Maintenance = lazy(() => import('@features/errors/MaintenancePage').then(m => ({ default: m.MaintenancePage })));

export const RouteProvider: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Root Application Composition Wrapper */}
          <Route element={<RootLayout />}>
            
            {/* Public Entry Landing View */}
            <Route path={ROUTES.PUBLIC.LANDING} element={<Landing />} />

            {/* Public Unauthenticated Auth Flow */}
            <Route element={<GuestGuard><AuthLayout /></GuestGuard>}>
              <Route path={ROUTES.PUBLIC.LOGIN} element={<Login />} />
              <Route path={ROUTES.PUBLIC.SIGNUP} element={<Signup />} />
              <Route path={ROUTES.PUBLIC.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={ROUTES.PUBLIC.RESET_PASSWORD} element={<ResetPassword />} />
              <Route path={ROUTES.PUBLIC.EMAIL_VERIFICATION} element={<EmailVerification />} />
            </Route>

            {/* Fully Protected Multi-Tenant Dashboard Space */}
            <Route path="/dashboard" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              {/* Role Restricted Admin Configuration Node */}
              <Route 
                path="settings" 
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <Settings />
                  </RoleGuard>
                } 
              />
            </Route>

            {/* Fallback & Technical Error States Layout */}
            <Route element={<ErrorLayout />}>
              <Route path={ROUTES.ERRORS.UNAUTHORIZED} element={<Unauthorized />} />
              <Route path={ROUTES.ERRORS.SERVER_ERROR} element={<ServerError />} />
              <Route path={ROUTES.ERRORS.MAINTENANCE} element={<Maintenance />} />
              <Route path={ROUTES.ERRORS.NOT_FOUND} element={<NotFound />} />
              <Route path="*" element={<Navigate to={ROUTES.ERRORS.NOT_FOUND} replace />} />
            </Route>

          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};