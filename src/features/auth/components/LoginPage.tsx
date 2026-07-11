import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (role: 'admin' | 'user') => {
    localStorage.setItem('auth_token', 'session_active_key_token_v5');
    localStorage.setItem('user_role', role);
    if (role === 'admin') {
      localStorage.setItem('user_permissions', JSON.stringify(['read:telemetry', 'write:config']));
    } else {
      localStorage.setItem('user_permissions', JSON.stringify(['read:telemetry']));
    }
    navigate(ROUTES.PROTECTED.DASHBOARD);
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Sign In to Workspace</h2>
        <p className="text-xs text-neutral-500 mt-2">Enter credentials to authenticate your terminal node</p>
      </div>
      <div className="space-y-3 pt-2">
        <button 
          onClick={() => handleLogin('admin')}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
        >
          Sign In as Admin
        </button>
        <button 
          onClick={() => handleLogin('user')}
          className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200"
        >
          Sign In as Standard User
        </button>
      </div>
      <div className="flex flex-col space-y-2 text-xs font-semibold text-neutral-500 pt-2 border-t border-neutral-900/60">
        <Link to={ROUTES.PUBLIC.FORGOT_PASSWORD} className="hover:text-blue-400 transition-colors">Forgot credentials?</Link>
        <p>No workspace registered? <Link to={ROUTES.PUBLIC.SIGNUP} className="text-blue-500 hover:text-blue-400">Register Node</Link></p>
      </div>
    </div>
  );
};