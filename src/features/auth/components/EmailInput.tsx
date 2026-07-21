import React, { useId } from 'react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, error, disabled }) => {
  const id = useId();
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
        Work Email Address
      </label>
      <input
        id={id}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required
        placeholder="name@enterprise.com"
        className={`w-full px-4 py-3 rounded-lg bg-slate-900 border ${
          error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
        } text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 disabled:opacity-50`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
