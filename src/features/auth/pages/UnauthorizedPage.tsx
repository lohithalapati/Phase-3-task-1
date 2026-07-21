import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthError } from '../components/AuthError';

export const UnauthorizedPage: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Access Protocol Warning" subtitle="401: Identity validation parameters missing." />
        <AuthError message="An active workstation lease token is required to view these assets." />
        <button
          onClick={onReturn}
          className="mt-6 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-150"
        >
          Return to Identity Gateway
        </button>
      </AuthCard>
    </AuthLayout>
  );
};
