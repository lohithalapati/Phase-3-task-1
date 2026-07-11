import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <span className="px-3 py-1 text-[10px] font-mono tracking-widest text-red-400 bg-red-500/5 border border-red-500/20 rounded-full uppercase">
        Authorization Fault
      </span>
      <h1 className="text-6xl font-black text-red-500 tracking-tight">403</h1>
      <h2 className="text-xl font-bold text-white">Insufficient Security Clearance</h2>
      <p className="text-xs text-neutral-500 max-w-xs mx-auto">
        Your designated role assignment lacks permissions necessary to parse this specific route node coordinate.
      </p>
      <div className="pt-4">
        <Link 
          to={ROUTES.PROTECTED.DASHBOARD} 
          className="inline-block px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
        >
          Return to Safety
        </Link>
      </div>
    </div>
  );
};