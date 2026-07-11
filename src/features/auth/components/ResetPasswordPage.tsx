import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getPasswordStrength = () => {
    if (!password) return { label: 'Idle', color: 'bg-neutral-800', width: 'w-0' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
    if (password.length < 10) return { label: 'Moderate', color: 'bg-yellow-500', width: 'w-2/3' };
    return { label: 'Secure', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Coordinate signatures do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Signature criteria unmet (min 8 characters).');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccessMsg('Key signature changed. Re-instating authentication tunnel...');
      setTimeout(() => {
        navigate(ROUTES.PUBLIC.LOGIN);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Reset Credentials</h2>
        <p className="text-xs text-neutral-500 mt-2">Configure replacement keys for your operator profile</p>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400">
          âš ï¸ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div role="alert" className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-semibold text-emerald-400">
          âœ“ {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
            New Key Signature
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#161616] border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-750"
          />
          
          {/* Password Strength Indicator */}
          <div className="mt-3 flex items-center space-x-2">
            <div className="h-1 flex-1 bg-neutral-900 rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
            </div>
            <span className="text-[10px] font-mono uppercase text-neutral-600 tracking-wider">
              {strength.label}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
            Confirm New Key Signature
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#161616] border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-750"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 disabled:opacity-50 flex justify-center items-center"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            'Securely Overwrite Key'
          )}
        </button>
      </form>
    </div>
  );
};