import React, { useState, useId } from 'react';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label = 'Password', value, onChange, error, disabled }) => {
  const [show, setShow] = useState(false);
  const id = useId();

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      </div>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required
          placeholder="••••••••••••"
          className={`w-full pl-4 pr-12 py-3 rounded-lg bg-slate-900 border ${
            error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
          } text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 disabled:opacity-50`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none focus:text-white text-xs font-semibold"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
