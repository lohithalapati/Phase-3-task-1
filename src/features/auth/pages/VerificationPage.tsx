import React, { useEffect, useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { AuthLoader } from '../components/AuthLoader';
import { AuthError } from '../components/AuthError';
import { AuthSuccess } from '../components/AuthSuccess';
import { AuthService } from '../api/auth.service';

export const VerificationPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [state, setState] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    let active = true;
    const executeVerification = async () => {
      try {
        await AuthService.verifyEmail('mock_verification_token');
        if (active) {
          setState('success');
          setTimeout(onComplete, 2000);
        }
      } catch {
        if (active) setState('error');
      }
    };
    executeVerification();
    return () => { active = false; };
  }, [onComplete]);

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Validation Processing Block" subtitle="Checking security credentials with registry..." />
        {state === 'pending' && <AuthLoader />}
        {state === 'error' && <AuthError message="Validation failed. Cryptographic key represents an invalid or expired challenge." />}
        {state === 'success' && <AuthSuccess message="Identity profile validated. Redirecting to workstation..." />}
      </AuthCard>
    </AuthLayout>
  );
};
