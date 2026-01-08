'use client';

import { useEffect, useState } from 'react';
import { SignUpData } from '@/types/SignUpData';
import Button from '@/components/ui/Button';
import Input from '../ui/Input';
import Link from 'next/link';
import { fetchCountryCodes } from '@/lib/countries';
import Select from '../ui/Select';

interface Props {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  next: () => void;
}

const salutations = [
  'Mr.',
  'Ms.',
  'Mrs.',
  'Mx.',
  'Dr.',
  'Rev.',
  'Prefer not to say',
];

interface Props {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  next: () => void;
}

export default function PersonalDetails({ data, setData, next }: Props) {
  const [countryCodes, setCountryCodes] = useState<string[]>([]);

  useEffect(() => {
    fetchCountryCodes().then(setCountryCodes);
  }, []);

  return (
    <div className="flex-1">
      <div className="text-start mb-5 mt-3">
        <h1 className="text-3xl font-bold  text-black">Create an Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-500 font-bold hover:underline"
          >
            Log In
          </Link>{' '}
        </p>
      </div>
      <div className="space-y-4">
        {/* Salutation + First + Last Name */}
        <div className="grid grid-cols-4 gap-4">
          <Select
            label="Salutation"
            value={data.salutation}
            options={salutations}
            onChange={(v) => setData({ ...data, salutation: v })}
          />

          <div className="col-span-1">
            <Input
              label="First Name"
              value={data.firstName}
              onChange={(v) => setData({ ...data, firstName: v })}
            />
          </div>

          <div className="col-span-2">
            <Input
              label="Last Name"
              value={data.lastName}
              onChange={(v) => setData({ ...data, lastName: v })}
            />
          </div>
        </div>

        {/* Email */}
        <Input
          label="Email"
          value={data.email}
          onChange={(v) => setData({ ...data, email: v })}
        />

        {/* Country Code + Contact Number */}
        <div className="grid grid-cols-4 gap-4">
          <Select
            label="Code"
            value={data.countryCode}
            options={countryCodes}
            onChange={(v) => setData({ ...data, countryCode: v })}
          />

          <div className="col-span-3">
            <Input
              label="Contact Number"
              value={data.contact}
              onChange={(v) => setData({ ...data, contact: v })}
            />
          </div>
        </div>

        {/* Password */}
        <Input
          label="Password"
          type="password"
          value={data.password}
          onChange={(v) => setData({ ...data, password: v })}
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          value={data.confirmPassword}
          onChange={(v) => setData({ ...data, confirmPassword: v })}
        />
      </div>

      {/* Button */}
      <div className="mt-6 flex justify-center">
        <Button label="NEXT →" onClick={next} />
      </div>
    </div>
  );
}
