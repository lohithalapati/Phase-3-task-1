import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { LoginForm } from '../components/LoginForm';
import { AuthFooter } from '../components/AuthFooter';

export const LoginPage: React.FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Enterprise Identity Gateway" subtitle="Access your secure system portal." />
        <LoginForm onSuccess={() => onNavigate('dashboard')} />
        <AuthFooter text="Access pending review?" linkText="Request identity keys" onLinkClick={() => onNavigate('signup')} />
      </AuthCard>
    </AuthLayout>
  );
};
