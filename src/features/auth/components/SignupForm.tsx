import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthValidator } from '../validators';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { LoadingButton } from './LoadingButton';
import { AuthError } from './AuthError';

export const SignupForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { signup, state, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; username?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const emailErr = AuthValidator.validateEmail(email);
    const userErr = AuthValidator.validateUsername(username);
    const passErr = AuthValidator.validatePassword(password);

    if (emailErr || userErr || passErr) {
      setErrors({
        email: emailErr || undefined,
        username: userErr || undefined,
        password: passErr || undefined
      });
      return;
    }

    setErrors({});
    try {
      await signup(email, password, username);
      onSuccess();
    } catch {
      // Handled by context state error
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {state.error && <AuthError message={state.error.message} />}
      <EmailInput
        value={email}
        onChange={(val) => {
          setEmail(val);
          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
        }}
        error={errors.email}
        disabled={state.status === 'loading'}
      />
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
          }}
          disabled={state.status === 'loading'}
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-200"
          placeholder="enterprise_admin"
        />
        {errors.username && <p className="mt-1.5 text-xs font-medium text-red-400">{errors.username}</p>}
      </div>
      <PasswordInput
        value={password}
        onChange={(val) => {
          setPassword(val);
          if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
        }}
        error={errors.password}
        disabled={state.status === 'loading'}
      />
      <LoadingButton type="submit" loading={state.status === 'loading'}>
        Register Account Credentials
      </LoadingButton>
    </form>
  );
};
