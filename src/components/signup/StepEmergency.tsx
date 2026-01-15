'use client';

import { useEffect, useState } from 'react';
import { SignUpData } from '@/types/SignUpData';
import Button from '@/components/ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toast from '../ui/Toast';
import { fetchCountryCodes } from '@/lib/countries';

type SignUpFormProps = {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  back: () => void;
  next: () => void;
};

export default function StepEmergency({
  data,
  setData,
  back,
  next,
}: SignUpFormProps) {
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [emergencyCode, setEmergencyCode] = useState<string>(''); // UI-only
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });

  useEffect(() => {
    fetchCountryCodes()
      .then(setCountryCodes)
      .catch(() => setCountryCodes([]));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!data.emergencyContactName?.trim()) e.emergencyContactName = 'Required';

    // Code is UI-only but required for this step
    if (!emergencyCode) e.emergencyCode = 'Required';

    const num = (data.emergencyContactNumber || '').trim();
    if (!num) {
      e.emergencyContactNumber = 'Required';
    } else if (!/^\d+$/.test(num)) {
      e.emergencyContactNumber = 'Contact number must contain only numbers.';
    }

    if (!data.skills?.trim()) e.skills = 'Required';
    if (!data.volunteeredBefore) e.volunteeredBefore = 'Required';
    if (!data.availability) e.availability = 'Required';

    setErrors(e);
    return e;
  };

  const handleNext = () => {
    const e = validate();

    if (Object.keys(e).length > 0) {
      const hasRequired = Object.values(e).includes('Required');

      let title = 'Missing information';
      let message = 'Please fill in all required fields before continuing.';

      if (!hasRequired && e.emergencyContactNumber === 'Must be a number') {
        title = 'Invalid contact number';
        message = 'Emergency Contact Number must contain only numbers.';
      }

      setToast({ open: true, type: 'error', title, message });
      return;
    }

    next();
  };

  return (
    <div>
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <h2 className="text-3xl font-bold text-black text-center mb-8">
        Emergency Contact & Skills
      </h2>

      <div className="space-y-6">
        <Input
          label="Emergency Contact Name"
          value={data.emergencyContactName || ''}
          onChange={(v) => {
            setData({ ...data, emergencyContactName: v });
            if (errors.emergencyContactName)
              setErrors((p) => ({ ...p, emergencyContactName: '' }));
          }}
          required
          error={errors.emergencyContactName}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <Select
              label="Code"
              value={emergencyCode}
              options={countryCodes}
              onChange={(v) => {
                setEmergencyCode(v);
                if (errors.emergencyCode)
                  setErrors((p) => ({ ...p, emergencyCode: '' }));
              }}
              required
              error={errors.emergencyCode}
            />
          </div>

          <div className="md:col-span-8">
            <Input
              label="Emergency Contact Number"
              type="tel"
              value={data.emergencyContactNumber || ''}
              onChange={(v) => {
                const cleaned = v.replace(/\s+/g, '');
                setData({ ...data, emergencyContactNumber: cleaned });
                if (errors.emergencyContactNumber)
                  setErrors((p) => ({ ...p, emergencyContactNumber: '' }));
              }}
              required
              error={errors.emergencyContactNumber}
            />
          </div>
        </div>

        <Input
          label="Skills"
          value={data.skills || ''}
          onChange={(v) => {
            setData({ ...data, skills: v });
            if (errors.skills) setErrors((p) => ({ ...p, skills: '' }));
          }}
          required
          error={errors.skills}
          placeholder="e.g., Teaching, Admin, Cooking"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Have you volunteered before?"
            value={data.volunteeredBefore || ''}
            options={['Yes', 'No']}
            onChange={(v) => {
              setData({
                ...data,
                volunteeredBefore: v === 'Yes' ? 'Yes' : 'No',
              });
              if (errors.volunteeredBefore)
                setErrors((p) => ({ ...p, volunteeredBefore: '' }));
            }}
            required
            error={errors.volunteeredBefore}
          />

          <Select
            label="Availability"
            value={data.availability || ''}
            options={['Weekdays', 'Weekends', 'Evenings', 'Flexible']}
            onChange={(v) => {
              setData({ ...data, availability: v });
              if (errors.availability)
                setErrors((p) => ({ ...p, availability: '' }));
            }}
            required
            error={errors.availability}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button label="Back" onClick={back} />
        <Button label="NEXT →" onClick={handleNext} />
      </div>
    </div>
  );
}
