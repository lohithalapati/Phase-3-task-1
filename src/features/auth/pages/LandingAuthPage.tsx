import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';

interface LandingAuthPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const LandingAuthPage: React.FC<LandingAuthPageProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
            Ω
          </div>
        </div>
        <AuthHeader
          title="Enterprise Registry System"
          subtitle="Configure, trace, and manage global dynamic infrastructure leases."
        />
        <div className="space-y-3 mt-8">
          <button
            onClick={onLoginClick}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            Sign In with Security Clearance
          </button>
          <button
            onClick={onSignupClick}
            className="w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-sm transition-all duration-150 text-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-500/30"
          >
            Submit Key Access Form
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};
