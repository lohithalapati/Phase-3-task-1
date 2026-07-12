import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthValidator } from '../validators';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { LoadingButton } from './LoadingButton';
import { AuthError } from './AuthError';

export const LoginForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { login, state, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const emailErr = AuthValidator.validateEmail(email);
    const passErr = AuthValidator.validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr || undefined, password: passErr || undefined });
      return;
    }

    setErrors({});
    try {
      await login(email, password);
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
        Access Platform Control
      </LoadingButton>
    </form>
  );
};
