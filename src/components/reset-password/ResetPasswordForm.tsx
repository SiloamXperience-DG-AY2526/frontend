'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get('id');
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !token) {
      setError('Invalid or expired reset link.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(undefined);

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-semibold mb-6">
        Reset Password
      </h1>

      {success ? (
        <div className="text-green-700 text-sm">
          Password has been reset successfully. Redirecting to login...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            label={loading ? 'Resetting...' : 'Reset Password'}
            disabled={loading}
          />

        </form>
      )}
    </div>
  );
}