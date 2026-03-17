'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function UpdatePasswordForm() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const payload = token ? parseJwt(token) : null;
  const userId = payload?.userId; 

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function parseJwt(token: string) {
    try {
      // Base64 decode payload part
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !userId) {
        setError('Invalid or missing token/user ID');
        return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(undefined);

      const res = await fetch('/api/auth/update-password-first-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update password');
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="w-full max-w-md mx-auto">

        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          Set Your <br /> New Password
        </h1>
        <p className="text-gray-600 mb-2">
          For security reasons, you’ll need to create a new password before continuing.
        </p>

        {success ? (
          <p className="text-green-600 text-sm">
            Password updated successfully. Redirecting to login...
          </p>
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
              label={loading ? 'Updating...' : 'Update Password'}
              disabled={loading}
            />

          </form>
        )}
      </div>
    );
}