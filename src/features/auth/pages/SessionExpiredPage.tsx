import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthError } from '../components/AuthError';

export const SessionExpiredPage: React.FC<{ onRelogin: () => void }> = ({ onRelogin }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Session Disconnected" subtitle="Inactivity window constraints surpassed." />
        <AuthError message="Session has closed automatically to prevent unauthorized access vectors." />
        <button
          onClick={onRelogin}
          className="mt-6 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-150"
        >
          Re-establish Dynamic Gateway
        </button>
      </AuthCard>
    </AuthLayout>
  );
};
