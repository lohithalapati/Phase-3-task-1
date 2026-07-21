import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';

interface LandingAuthPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const LandingAuthPage: React.FC<LandingAuthPageProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-6" role="banner">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20 mb-2">
          N
        </div>
        <span className="text-sm font-bold tracking-[0.25em] text-blue-400 uppercase">NEURALHANDOFF</span>
        <span className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase mt-1">Enterprise Platform</span>
      </div>
      <AuthCard>
        <div className="text-center mb-6">
          <h2 className="text-base font-bold text-slate-300">Identity Provisioning Console</h2>
          <p className="text-xs text-slate-400 mt-1">Configure, authorize, and manage multi-tenant node leases.</p>
        </div>
        <div className="space-y-3 mt-8">
          <button
            onClick={onLoginClick}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            Authenticate Node
          </button>
          <button
            onClick={onSignupClick}
            className="w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-sm transition-all duration-150 text-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-500/30"
          >
            Register Node Instance
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};
