import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const SignupPage: React.FC = () => {
  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Register Node Instance</h2>
        <p className="text-xs text-neutral-500 mt-2">Create your multi-tenant secure credentials</p>
      </div>
      <div className="py-6 border border-dashed border-neutral-800 rounded-xl">
        <p className="text-xs text-neutral-400 font-mono">[Sign-up fields isolated for Task 3]</p>
      </div>
      <p className="text-xs text-neutral-500">
        Already registered? <Link to={ROUTES.PUBLIC.LOGIN} className="text-blue-500 hover:text-blue-400">Authenticate Node</Link>
      </p>
    </div>
  );
};