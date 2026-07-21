import React, { useId } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, error, disabled }) => {
  const id = useId();
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider text-center mb-3">
        MFA Verification Code
      </label>
      <input
        id={id}
        type="text"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required
        placeholder="000000"
        className="w-full text-center tracking-[1em] text-2xl font-bold px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-4 transition-all duration-200 disabled:opacity-50 text-slate-100 placeholder-slate-700"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs font-medium text-red-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
};
