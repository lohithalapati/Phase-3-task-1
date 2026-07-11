import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const ResetPasswordPage: React.FC = () => {
  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Configure New Key</h2>
        <p className="text-xs text-neutral-500 mt-2">Update credentials to reinstate pipeline authorization</p>
      </div>
      <div className="space-y-3">
        <Link 
          to={ROUTES.PUBLIC.LOGIN}
          className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-colors"
        >
          Authenticate New Key
        </Link>
      </div>
    </div>
  );
};