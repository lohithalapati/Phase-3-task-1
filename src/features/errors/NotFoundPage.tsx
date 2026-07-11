import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <span className="px-3 py-1 text-[10px] font-mono tracking-widest text-blue-400 bg-blue-500/5 border border-blue-500/20 rounded-full uppercase">
        Network Failure
      </span>
      <h1 className="text-6xl font-black text-blue-500 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-white">Dynamic Route Coordinates Missing</h2>
      <p className="text-xs text-neutral-500 max-w-xs mx-auto">
        The requested address does not map to any active operational structures inside the dynamic route configuration module.
      </p>
      <div className="pt-4">
        <Link 
          to={ROUTES.PROTECTED.DASHBOARD} 
          className="inline-block px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};