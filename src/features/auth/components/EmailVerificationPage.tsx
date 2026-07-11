import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (!val.match(/^[0-9]?$/)) return;
    
    const nextDigits = [...digits];
    nextDigits[index] = val;
    setDigits(nextDigits);

    // Auto-focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const pin = digits.join('');
    if (pin.length < 6) {
      setErrorMsg('Full 6-digit channel validation payload required.');
      setIsLoading(false);
      return;
    }

    // Simulate OTP decryption verification
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
      
      // Seed mock token and route inside to complete enrollment
      localStorage.setItem('auth_token', 'm_enrollment_token');
      localStorage.setItem('user_role', 'user');

      setTimeout(() => {
        navigate(ROUTES.PROTECTED.DASHBOARD);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Identity Channel Verification</h2>
        <p className="text-xs text-neutral-500 mt-2">Enter the 6-digit credential dispatched to your node</p>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400 text-center animate-pulse">
          ⚠️ {errorMsg}
        </div>
      )}

      {success ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
          <p className="text-xs font-semibold text-emerald-400">Verification complete. Linking Workspace...</p>
          <p className="text-2xs text-neutral-500 mt-1">Initializing workspace telemetry canvas...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="w-12 h-12 text-center bg-[#161616] border border-neutral-800 rounded-lg text-lg font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Verify Signature Code'
            )}
          </button>
        </form>
      )}
    </div>
  );
};