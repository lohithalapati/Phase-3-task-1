import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { AuthFooter } from '../components/AuthFooter';

export const ForgotPasswordPage: React.FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Key Rotation Service" subtitle="Initiate cryptographic recovery credentials vector." />
        <ForgotPasswordForm />
        <AuthFooter text="Recalled credentials?" linkText="Return to gateway" onLinkClick={() => onNavigate('login')} />
      </AuthCard>
    </AuthLayout>
  );
};
