import React, { useState } from 'react';
import { AuthValidator } from '../validators';
import { PasswordInput } from './PasswordInput';
import { LoadingButton } from './LoadingButton';
import { AuthService } from '../api/auth.service';
import { AuthError } from './AuthError';
import { AuthSuccess } from './AuthSuccess';

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const passErr = AuthValidator.validatePassword(password);
    const confirmErr = AuthValidator.validateConfirmPassword(password, confirm);

    if (passErr || confirmErr) {
      setError(passErr || confirmErr);
      return;
    }

    setLoading(true);
    try {
      await AuthService.resetPassword(token, password);
      setSuccess('Enterprise password parameters successfully rotated.');
    } catch {
      setError('An issue was encountered updating identity variables.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && <AuthError message={error} />}
      {success && <AuthSuccess message={success} />}
      <PasswordInput value={password} onChange={setPassword} disabled={loading} label="New Password" />
      <PasswordInput value={confirm} onChange={setConfirm} disabled={loading} label="Confirm New Password" />
      <LoadingButton type="submit" loading={loading}>
        Commit Password Rotation
      </LoadingButton>
    </form>
  );
};
