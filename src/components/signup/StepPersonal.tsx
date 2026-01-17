'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignUpData } from '@/types/SignUpData';
import Button from '@/components/ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toast from '@/components/ui/Toast';
import { fetchCountryCodes } from '@/lib/countries';

interface Props {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  next: () => void;
}

export default function PersonalDetails({ data, setData, next }: Props) {
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });

  useEffect(() => {
    fetchCountryCodes().then(setCountryCodes);
  }, []);
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

    if (!data.countryCode) e.countryCode = 'Required';
    if (!data.contact?.trim()) {
      e.contact = 'Required';
    } else if (!/^\d+$/.test(data.contact)) {
      e.contact = 'Contact number must contain only numbers';
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

  const handleNext = () => {
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
      } else if (
        validationErrors.contact &&
        validationErrors.contact !== 'Required'
      ) {
        title = 'Invalid contact number';
        message = 'Contact number must contain only numbers.';
      } else if (validationErrors.password) {
        title = 'Weak password';
        message =
          validationErrors.password === 'Min 8 characters'
            ? 'Password must be at least 8 characters.'
            : validationErrors.password === 'Must include 1 uppercase letter'
            ? 'Password must include at least one uppercase letter (A–Z).'
            : 'Password must include at least one number (0–9).';
      }

      setToast({
        open: true,
        type: 'error',
        title,
        message,
      });
      return;
    }

    next();
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
        {/* Responsive grid */}
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <Select
              label="Code"
              value={data.countryCode}
              options={countryCodes}
              onChange={(v) => {
                setData({ ...data, countryCode: v });
                if (errors.countryCode)
                  setErrors((p) => ({ ...p, countryCode: '' }));
              }}
              required
              error={errors.countryCode}
            />
          </div>

          <div className="md:col-span-8">
            <Input
              label="Contact Number"
              type="tel"
              value={data.contact}
              onChange={(v) => {
                setData({ ...data, contact: v });
                if (errors.contact) setErrors((p) => ({ ...p, contact: '' }));
              }}
              required
              error={errors.contact}
            />
          </div>
        </div>

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
        <Button label="NEXT →" onClick={handleNext} />
      </div>
    </div>
  );
}
