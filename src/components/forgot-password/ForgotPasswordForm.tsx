'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || cooldown) return;

    try {
      setLoading(true);
      setError(undefined);

      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setSent(true);
      setCooldown(true);

      setTimeout(() => setCooldown(false), 10000);

    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Forgot Password?
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (sent) setSent(false);
          }}
          placeholder="Your Email"
          required
          error={error}
        />

        {sent && (
          <p className="text-sm text-gray-600">
            Recovery email sent. Didn’t receive it? Request again in 10 seconds.
          </p>
        )}

        <Button
          type="submit"
          label={
            loading
              ? 'Sending...'
              : cooldown
              ? 'Please wait...'
              : 'Send Recovery Email'
          }
          disabled={loading || cooldown}
          variant="primary"
        />

      </form>
    </div>
  );
}