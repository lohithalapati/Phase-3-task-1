import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { SignupForm } from '../components/SignupForm';
import { AuthFooter } from '../components/AuthFooter';

export const SignupPage: React.FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Request Account Credentials" subtitle="Submit validation request metadata." />
        <SignupForm onSuccess={() => onNavigate('login')} />
        <AuthFooter text="Already verified?" linkText="Authenticate profile session" onLinkClick={() => onNavigate('login')} />
      </AuthCard>
    </AuthLayout>
  );
};
