import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Reset Key Request</h2>
        <p className="text-xs text-neutral-500 mt-2">Initiate decryption sequence mapping coordinates</p>
      </div>

      {success ? (
        <div className="space-y-4 text-center">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-xs font-semibold text-emerald-400">Decryption key dispatched to coordinates.</p>
            <p className="text-2xs text-neutral-500 mt-1">Check your registered telemetry inbox for reset link.</p>
          </div>
          <Link 
            to={ROUTES.PUBLIC.LOGIN}
            className="block w-full py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors text-center"
          >
            Return to Portal login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-2xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
              Registered Telemetry Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="operator@neuralhandoff.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              'Dispatch Key Recovery Link'
            )}
          </button>

          <Link 
            to={ROUTES.PUBLIC.LOGIN}
            className="block text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors pt-2"
          >
            Back to portal
          </Link>
        </form>
      )}
    </div>
  );
};