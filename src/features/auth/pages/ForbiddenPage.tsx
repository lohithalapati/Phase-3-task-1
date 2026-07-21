import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthError } from '../components/AuthError';

export const ForbiddenPage: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Authorization Refused" subtitle="403: Role mapping mismatch." />
        <AuthError message="This workstation does not possess the credentials to view these modules." />
        <button
          onClick={onReturn}
          className="mt-6 w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold text-white focus:outline-none focus:ring-4 focus:ring-slate-500/30 transition-all duration-150"
        >
          De-escalate Workspace Console
        </button>
      </AuthCard>
    </AuthLayout>
  );
};
