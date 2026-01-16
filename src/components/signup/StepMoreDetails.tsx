'use client';

import { useEffect, useState } from 'react';
import { SignUpData } from '@/types/SignUpData';
import Button from '@/components/ui/Button';
import { fetchNationalities, fetchLanguages } from '@/lib/countries';
import Textarea from '../ui/TextArea';
import Select from '../ui/Select';
import Input from '../ui/Input';
import MultiSelect from '../ui/MultiSelect';
import Toast from '../ui/Toast';

export type SignUpFormProps = {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  back: () => void;
  next: () => void;
};

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
] as const;

//cache to avoid reloading and flickering

const CACHE_KEY = 'more_details_meta_v1';

function getCachedMeta(): { countries: string[]; languages: string[] } | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export default function MoreAboutYou({
  data,
  setData,
  next,
  back,
}: SignUpFormProps) {
  const cachedMeta = getCachedMeta();

  const [countries, setCountries] = useState<string[]>(
    cachedMeta?.countries ?? []
  );
  const [languages, setLanguages] = useState<string[]>(
    cachedMeta?.languages ?? []
  );
  const [loading, setLoading] = useState(!cachedMeta);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });
  useEffect(() => {
    if (cachedMeta) return;

    const load = async () => {
      try {
        const [c, l] = await Promise.all([
          fetchNationalities(),
          fetchLanguages(),
        ]);

        setCountries(c);
        setLanguages(l);

        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ countries: c, languages: l })
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [cachedMeta]);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!data.nationality) e.nationality = 'Required';
    if (!data.gender) e.gender = 'Required';
    if (!data.dob) e.dob = 'Required';
    if (!data.occupation?.trim()) e.occupation = 'Required';
    if (!data.languages || data.languages.length === 0)
      e.languages = 'Select at least 1';
    if (!data.qualification) e.qualification = 'Required';
    if (!data.address?.trim()) e.address = 'Required';

    setErrors(e);
    return e;
  };

  const handleNext = () => {
    const e = validate();

    if (Object.keys(e).length > 0) {
      let title = 'Missing information';
      let message = 'Please fill in all required fields.';
      const hasRequiredError = Object.values(e).includes('Required');

      if (hasRequiredError) {
        title = 'Missing information';
        message = 'Please fill in all required fields before continuing.';
      }
      if (e.languages) {
        title = 'Languages required';
        message = 'Please select at least one language.';
      }

      setToast({ open: true, type: 'error', title, message });
      return;
    }

    next();
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-black/10 rounded w-1/3 mx-auto" />

        <div className="grid grid-cols-2 gap-6">
          <div className="h-10 bg-black/10 rounded" />
          <div className="h-10 bg-black/10 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="h-10 bg-black/10 rounded" />
          <div className="h-10 bg-black/10 rounded" />
        </div>

        <div className="h-20 bg-black/10 rounded" />
      </div>
    );
  }

  return (
    <div>
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <h2 className="text-3xl font-bold text-center text-black mb-8 mt-3">
        More About You
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Nationality"
            value={data.nationality}
            options={countries}
            onChange={(v) => {
              setData({ ...data, nationality: v });
              if (errors.nationality)
                setErrors((p) => ({ ...p, nationality: '' }));
            }}
            required
            error={errors.nationality}
          />

          <div>
            <label className="block text-black text-sm font-semibold mb-2">
              Gender <span className="text-red-600">*</span>
            </label>

            <div className="flex gap-6">
              {genderOptions.map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={data.gender === value}
                    onChange={() => {
                      setData({ ...data, gender: value });
                      if (errors.gender)
                        setErrors((p) => ({ ...p, gender: '' }));
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>

            {errors.gender ? (
              <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Date of Birth"
            type="date"
            value={data.dob}
            onChange={(v) => {
              setData({ ...data, dob: v });
              if (errors.dob) setErrors((p) => ({ ...p, dob: '' }));
            }}
            required
            error={errors.dob}
          />

          <Input
            label="Occupation"
            value={data.occupation}
            onChange={(v) => {
              setData({ ...data, occupation: v });
              if (errors.occupation)
                setErrors((p) => ({ ...p, occupation: '' }));
            }}
            required
            error={errors.occupation}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MultiSelect
            label="Languages Spoken"
            options={languages}
            value={data.languages}
            onChange={(v) => {
              setData({ ...data, languages: v });
              if (errors.languages) setErrors((p) => ({ ...p, languages: '' }));
            }}
            required
            error={errors.languages}
          />

          <Select
            label="Highest Qualification"
            value={data.qualification}
            options={[
              'Secondary School',
              'Diploma',
              'Bachelor\'s Degree',
              'Master\'s Degree',
              'Doctorate',
              'Others',
            ]}
            onChange={(v) => {
              setData({ ...data, qualification: v });
              if (errors.qualification)
                setErrors((p) => ({ ...p, qualification: '' }));
            }}
            required
            error={errors.qualification}
          />
        </div>

        {/* Address */}
        <Textarea
          label="Address"
          value={data.address}
          onChange={(v) => {
            setData({ ...data, address: v });
            if (errors.address) setErrors((p) => ({ ...p, address: '' }));
          }}
          required
          error={errors.address}
          rows={3}
        />
      </div>

      <div className="mt-5 flex justify-between">
        <Button label="Back" onClick={back} />
        <Button label="NEXT →" onClick={handleNext} />
      </div>
    </div>
  );
}
