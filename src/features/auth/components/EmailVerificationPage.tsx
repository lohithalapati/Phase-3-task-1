import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const EmailVerificationPage: React.FC = () => {
  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Verify Terminal Identity</h2>
        <p className="text-xs text-neutral-500 mt-2">Verification sequence triggered via designated secure channel</p>
      </div>
      <div className="space-y-3">
        <Link 
          to={ROUTES.PUBLIC.LOGIN}
          className="block w-full py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
};