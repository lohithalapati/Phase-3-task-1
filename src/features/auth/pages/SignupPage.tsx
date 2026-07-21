import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { SignupForm } from '../components/SignupForm';
import { AuthFooter } from '../components/AuthFooter';

export const SignupPage: React.FC<{ onNavigate: (target: string) => void }> = ({ onNavigate }) => {
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
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-white mb-1.5">Register Node Instance</h1>
          <p className="text-xs text-slate-400">Create your multi-tenant secure credentials</p>
        </div>
        
        {/* Form fields fully isolated inside Task 3 context */}
        <SignupForm onSuccess={() => onNavigate('login')} />
        
        <AuthFooter 
          text="Already registered?" 
          linkText="Authenticate Node" 
          onLinkClick={() => onNavigate('login')} 
        />
      </AuthCard>
    </AuthLayout>
  );
};
