import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Key signatures do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Key strength insufficient (min 8 characters).');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccessMsg('Workspace register pending. Identity verification sequence issued.');
      setTimeout(() => {
        navigate(ROUTES.PUBLIC.EMAIL_VERIFICATION);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Register Workspace</h2>
        <p className="text-xs text-neutral-500 mt-2">Initialize a secure multi-tenant cloud operations node</p>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400">
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
          <label htmlFor="company" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
            Tenant Corporation Name
          </label>
          <input
            id="company"
            type="text"
            required
            placeholder="NeuralCorp Ltd."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#161616] border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-750"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
            Administrator Telemetry Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="admin@yourdomain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#161616] border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-750"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
            Master Passkey Password
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#161616] border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-750"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
            Confirm Master Passkey
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
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
            'Instantiate Tenant Node'
          )}
        </button>
      </form>

      <p className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-900/60">
        Workspace already active? <Link to={ROUTES.PUBLIC.LOGIN} className="text-blue-500 hover:text-blue-400 font-semibold">Sign In</Link>
      </p>
    </div>
  );
};