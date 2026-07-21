import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export const ResetPasswordPage: React.FC = () => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Re-secure Identity Parameter" subtitle="Finalize secure credentials configuration details." />
        <ResetPasswordForm token="mock_active_token" />
      </AuthCard>
    </AuthLayout>
  );
};
