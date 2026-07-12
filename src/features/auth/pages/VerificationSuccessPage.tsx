import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccess } from '../components/AuthSuccess';

export const VerificationSuccessPage: React.FC<{ onProceed: () => void }> = ({ onProceed }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Verification Validated" subtitle="All credentials verified successfully." />
        <AuthSuccess message="Security permissions mapped to target workstation successfully." />
        <button
          onClick={onProceed}
          className="mt-6 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-150"
        >
          Initialize Workstation Console
        </button>
      </AuthCard>
    </AuthLayout>
  );
};
