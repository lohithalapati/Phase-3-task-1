import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Interactive Simulated UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic client-side syntax validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setTimeout(() => {
        setErrorMsg('Invalid telemetry address format.');
        setIsLoading(false);
      }, 500);
      return;
    }

    if (password.length < 6) {
      setTimeout(() => {
        setErrorMsg('Password coordinate signature is too short (min 6 characters).');
        setIsLoading(false);
      }, 500);
      return;
    }

    // Simulate Network Handoff Success
    setTimeout(() => {
      setSuccessMsg('Terminal Node authenticated. Preserving session...');
      localStorage.setItem('auth_token', 'token_auth_state_v5');
      localStorage.setItem('user_role', email.includes('admin') ? 'admin' : 'user');
      localStorage.setItem('user_permissions', JSON.stringify(['read:telemetry']));
      
      setTimeout(() => {
        navigate(ROUTES.PROTECTED.DASHBOARD);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Access Portal</h2>
        <p className="text-xs text-neutral-500 mt-2">Provide keys to establish network synchronization</p>
      </div>

      {/* Dynamic Feedback Banner */}
      {errorMsg && (
        <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400 animate-pulse">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div role="alert" className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-semibold text-emerald-400">
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
            Telemetry Address (Email)
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="operator@neuralhandoff.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#161616] border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-700"
          />
          <span className="text-[10px] text-neutral-600 mt-1 block">Pro-Tip: Enter email containing "admin" to log in with full Admin permissions.</span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase">
              Secure Signature Key (Password)
            </label>
          </div>
          <input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#161616] border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="rounded border-neutral-800 bg-[#161616] text-blue-600 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">Keep Session Active</span>
          </label>
          <Link to={ROUTES.PUBLIC.FORGOT_PASSWORD} className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-medium">
            Forget Coordinates?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            'Establish Connection'
          )}
        </button>
      </form>

      <p className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-900/60">
        New Operations Node? <Link to={ROUTES.PUBLIC.SIGNUP} className="text-blue-500 hover:text-blue-400 font-semibold">Register Workspace</Link>
      </p>
    </div>
  );
};