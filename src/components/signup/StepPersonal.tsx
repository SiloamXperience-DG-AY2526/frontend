'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignUpData } from '@/types/SignUpData';
import Button from '@/components/ui/Button';
import Input from '../ui/Input';
import Toast from '@/components/ui/Toast';

interface Props {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  next: () => void;
}

export default function PersonalDetails({ data, setData }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });

  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!data.firstName?.trim()) e.firstName = 'Required';
    if (!data.lastName?.trim()) e.lastName = 'Required';

    if (!data.email?.trim()) {
      e.email = 'Required';
    } else if (!isValidEmail(data.email)) {
      e.email = 'Invalid email format';
    }

    if (!data.password) {
      e.password = 'Required';
    } else {
      if (data.password.length < 8) e.password = 'Min 8 characters';
      if (!/[A-Z]/.test(data.password))
        e.password = 'Must include 1 uppercase letter';
      if (!/\d/.test(data.password)) e.password = 'Must include 1 number';
    }

    if (!data.confirmPassword) e.confirmPassword = 'Required';

    if (
      data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword
    ) {
      e.confirmPassword = 'Passwords do not match';
    }

    setErrors(e);
    return e;
  };

  const handleSignup = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      let title = 'Missing information';
      let message = 'Please fill in all required fields.';

      if (validationErrors.email === 'Invalid email format') {
        title = 'Invalid email';
        message = 'Please enter a valid email address (e.g. name@example.com).';
      } else if (
        validationErrors.confirmPassword === 'Passwords do not match'
      ) {
        title = 'Password mismatch';
        message = 'Password and Confirm Password must be the same.';
      } else if (validationErrors.password) {
        title = 'Weak password';
        message =
          validationErrors.password === 'Min 8 characters'
            ? 'Password must be at least 8 characters.'
            : validationErrors.password === 'Must include 1 uppercase letter'
            ? 'Password must include at least one uppercase letter (A-Z).'
            : 'Password must include at least one number (0-9).';
      }

      setToast({
        open: true,
        type: 'error',
        title,
        message,
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message ?? 'Signup failed');
      }

      setToast({
        open: true,
        type: 'success',
        title: 'Account created!',
        message: 'Please complete your profile.',
      });

      // Redirect to onboarding
      setTimeout(() => {
        router.push('/onboarding');
      }, 1500);
    } catch (err: unknown) {
      setToast({
        open: true,
        type: 'error',
        title: 'Signup failed',
        message: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <div className="text-start mb-5 mt-3">
        <h1 className="text-3xl font-bold text-black">Create an Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-500 font-bold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={data.firstName}
            onChange={(v) => {
              setData({ ...data, firstName: v });
              if (errors.firstName) setErrors((p) => ({ ...p, firstName: '' }));
            }}
            required
            error={errors.firstName}
          />

          <Input
            label="Last Name"
            value={data.lastName}
            onChange={(v) => {
              setData({ ...data, lastName: v });
              if (errors.lastName) setErrors((p) => ({ ...p, lastName: '' }));
            }}
            required
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={data.email}
          onChange={(v) => {
            setData({ ...data, email: v });
            if (errors.email) setErrors((p) => ({ ...p, email: '' }));
          }}
          required
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          value={data.password}
          onChange={(v) => {
            setData({ ...data, password: v });
            if (errors.password) setErrors((p) => ({ ...p, password: '' }));
          }}
          required
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          value={data.confirmPassword}
          onChange={(v) => {
            setData({ ...data, confirmPassword: v });
            if (errors.confirmPassword)
              setErrors((p) => ({ ...p, confirmPassword: '' }));
          }}
          required
          error={errors.confirmPassword}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          label={loading ? 'Creating account...' : 'CREATE ACCOUNT'}
          onClick={handleSignup}
          disabled={loading}
        />
      </div>
    </div>
  );
}
