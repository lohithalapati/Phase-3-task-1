import React, { useState } from 'react';
import { AuthValidator } from '../validators';
import { EmailInput } from './EmailInput';
import { LoadingButton } from './LoadingButton';
import { AuthService } from '../api/auth.service';
import { AuthError } from './AuthError';
import { AuthSuccess } from './AuthSuccess';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailErr = AuthValidator.validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setLoading(true);
    try {
      await AuthService.forgotPassword(email);
      setSuccess('Verification link dispatched. Please monitor your business inbox.');
    } catch {
      setError('An error occurred. Please verify domain constraints.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && <AuthError message={error} />}
      {success && <AuthSuccess message={success} />}
      <EmailInput value={email} onChange={setEmail} error={error} disabled={loading} />
      <LoadingButton type="submit" loading={loading}>
        Dispatch Recovery Vector
      </LoadingButton>
    </form>
  );
};
