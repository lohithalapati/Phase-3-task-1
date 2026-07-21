import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthError } from '../components/AuthError';

export const VerificationFailurePage: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Verification Failure" subtitle="Security Registry verification block error." />
        <AuthError message="Cryptographic identity parameter handshake error. Verification challenge has timed out." />
        <button
          onClick={onRetry}
          className="mt-6 w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold text-white focus:outline-none focus:ring-4 focus:ring-slate-500/30 transition-all duration-150"
        >
          Request Alternate Challenge Vector
        </button>
      </AuthCard>
    </AuthLayout>
  );
};
