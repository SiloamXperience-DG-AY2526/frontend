'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Toast from '@/components/ui/Toast';
import { fetchCountryCodes } from '@/lib/countries';

type OnboardingData = {
  // Contact info
  countryCode: string;
  contactNumber: string;
  // Personal details
  nationality: string;
  identificationNumber: string;
  gender: 'male' | 'female' | 'others';
  dob: string;
  occupation: string;
  languages: string[];
  address: string;
  // Emergency contact
  emergencyCountryCode: string;
  emergencyContactNumber: string;
  // Volunteer info
  skills: string;
  volunteeredBefore: string;
  availability: string;
  interest: string[];
  // Communication
  foundUsThrough: string;
  preferredContactMethod: string;
  agreeUpdates: boolean;
  joinMailingList: boolean;
};

const initialData: OnboardingData = {
  countryCode: '',
  contactNumber: '',
  nationality: '',
  identificationNumber: '',
  gender: 'male',
  dob: '',
  occupation: '',
  languages: [],
  address: '',
  emergencyCountryCode: '',
  emergencyContactNumber: '',
  skills: '',
  volunteeredBefore: 'No',
  availability: '',
  interest: [],
  foundUsThrough: '',
  preferredContactMethod: '',
  agreeUpdates: false,
  joinMailingList: false,
};

const languageOptions = [
  'English',
  'Mandarin',
  'Malay',
  'Tamil',
  'Thai',
  'Vietnamese',
  'Indonesian',
  'Other',
];

const interestOptions = [
  { value: 'fundraise', label: 'Organizing fundraising events' },
  { value: 'planTrips', label: 'Planning trips for your organization' },
  { value: 'missionTrips', label: 'Short-term mission trips (up to 14 days)' },
  { value: 'longTerm', label: 'Long-term commitments (6 months or more)' },
  { value: 'admin', label: 'Behind-the-scenes administration' },
  { value: 'publicity', label: 'Marketing & social media' },
  { value: 'teaching', label: 'Teaching & mentoring' },
  { value: 'training', label: 'Training & program development' },
  { value: 'agriculture', label: 'Agriculture projects' },
  { value: 'building', label: 'Building & facilities work' },
];

function mapContactMode(mode: string) {
  const map: Record<string, string> = {
    'Email': 'email',
    'WhatsApp': 'whatsapp',
    'Telegram': 'telegram',
    'Messenger': 'messenger',
    'Phone Call': 'phoneCall',
  };
  return map[mode] || 'email';
}

function mapReferrer(ref: string) {
  const map: Record<string, string> = {
    'Friend': 'friend',
    'Social Media': 'socialMedia',
    'Church': 'church',
    'Website': 'website',
    'Event': 'event',
    'Other': 'other',
  };
  return map[ref] || 'other';
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });

  const router = useRouter();

  useEffect(() => {
    fetchCountryCodes().then(setCountryCodes);
  }, []);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!data.countryCode) e.countryCode = 'Required';
    if (!data.contactNumber) e.contactNumber = 'Required';
    if (!data.gender) e.gender = 'Required';
    if (!data.availability) e.availability = 'Required';
    if (!data.nationality.trim()) e.nationality = 'Required';
    if (!data.occupation.trim()) e.occupation = 'Required';
    if (!data.identificationNumber.trim()) e.identificationNumber = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!data.preferredContactMethod) e.preferredContactMethod = 'Required';
    if (!data.agreeUpdates) e.agreeUpdates = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      setToast({
        open: true,
        type: 'error',
        title: 'Missing information',
        message: 'Please complete the required fields.',
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        countryCode: data.countryCode,
        contactNumber: data.contactNumber,
        dob: data.dob || undefined,
        nationality: data.nationality.trim(),
        occupation: data.occupation.trim(),
        gender: data.gender,
        residentialAddress: data.address || undefined,
        identificationNumber: data.identificationNumber.trim(),
        emergencyCountryCode: data.emergencyCountryCode || data.countryCode,
        emergencyContactNumber: data.emergencyContactNumber || data.contactNumber,
        hasVolunteerExperience: data.volunteeredBefore === 'Yes',
        volunteerAvailability: data.availability,
        consentUpdatesCommunications: data.agreeUpdates,
        subscribeNewsletterEvents: data.joinMailingList,
        skills: data.skills ? data.skills.split(',').map((s) => s.trim()) : [],
        languages: data.languages,
        contactModes: data.preferredContactMethod
          ? [mapContactMode(data.preferredContactMethod)]
          : [],
        interests: data.interest,
        referrers: data.foundUsThrough ? [mapReferrer(data.foundUsThrough)] : [],
      };

      const res = await fetch('/api/auth/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.message ?? 'Onboarding failed');
      }

      setToast({
        open: true,
        type: 'success',
        title: 'Welcome!',
        message: 'Your profile is complete.',
      });

      setTimeout(() => {
        router.push('/partner/home');
      }, 1500);
    } catch (err: unknown) {
      setToast({
        open: true,
        type: 'error',
        title: 'Submission failed',
        message: `${err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-white">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <div className="flex min-h-dvh w-full flex-col md:flex-row">
        <div className="w-full md:w-2/5 px-6 md:px-10 py-6">
          <div className="hidden md:block">
            <div className="relative w-full h-[calc(100dvh-48px)] rounded-2xl overflow-hidden">
              <Image
                src="/assets/signup.png"
                alt="Complete your profile"
                fill
                priority
                className="object-cover"
                sizes="40vw"
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 bg-white md:h-dvh overflow-y-auto px-6 md:px-14 py-10">
          <div className="text-start mb-5 mt-3">
            <h1 className="text-3xl font-bold text-black">Complete Your Profile</h1>
            <p className="text-sm text-gray-500 mt-1">
              Step {step} of 2 - {step === 1 ? 'Personal Details' : 'Communication Preferences'}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <Select
                    label="Country Code"
                    value={data.countryCode}
                    options={countryCodes}
                    onChange={(v) => setData({ ...data, countryCode: v })}
                    required
                    error={errors.countryCode}
                  />
                </div>
                <div className="md:col-span-8">
                  <Input
                    label="Contact Number"
                    type="tel"
                    value={data.contactNumber}
                    onChange={(v) => setData({ ...data, contactNumber: v })}
                    required
                    error={errors.contactNumber}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Gender"
                  value={data.gender}
                  options={['male', 'female', 'others']}
                  onChange={(v) => setData({ ...data, gender: v as 'male' | 'female' | 'others' })}
                  required
                  error={errors.gender}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={data.dob}
                  onChange={(v) => setData({ ...data, dob: v })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nationality"
                  value={data.nationality}
                  onChange={(v) => setData({ ...data, nationality: v })}
                  required
                  error={errors.nationality}
                />
                <Input
                  label="Occupation"
                  value={data.occupation}
                  onChange={(v) => setData({ ...data, occupation: v })}
                  required
                  error={errors.occupation}
                />
              </div>

              <Input
                label="Identification Number"
                value={data.identificationNumber}
                onChange={(v) =>
                  setData({ ...data, identificationNumber: v })
                }
                required
                error={errors.identificationNumber}
              />

              <Input
                label="Residential Address"
                value={data.address}
                onChange={(v) => setData({ ...data, address: v })}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <Select
                    label="Emergency Code"
                    value={data.emergencyCountryCode}
                    options={countryCodes}
                    onChange={(v) => setData({ ...data, emergencyCountryCode: v })}
                  />
                </div>
                <div className="md:col-span-8">
                  <Input
                    label="Emergency Contact"
                    type="tel"
                    value={data.emergencyContactNumber}
                    onChange={(v) => setData({ ...data, emergencyContactNumber: v })}
                  />
                </div>
              </div>

              <Select
                label="Availability for Volunteering"
                value={data.availability}
                options={['Weekdays', 'Weekends', 'Both', 'Flexible']}
                onChange={(v) => setData({ ...data, availability: v })}
                required
                error={errors.availability}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((lang) => (
                    <label key={lang} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={data.languages.includes(lang)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setData({ ...data, languages: [...data.languages, lang] });
                          } else {
                            setData({
                              ...data,
                              languages: data.languages.filter((l) => l !== lang),
                            });
                          }
                        }}
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Interest
                </label>
                <div className="space-y-2">
                  {interestOptions.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={data.interest.includes(opt.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setData({ ...data, interest: [...data.interest, opt.value] });
                          } else {
                            setData({
                              ...data,
                              interest: data.interest.filter((i) => i !== opt.value),
                            });
                          }
                        }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button label="NEXT" onClick={handleNext} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Select
                label="How did you hear about us?"
                value={data.foundUsThrough}
                options={['Friend', 'Social Media', 'Church', 'Website', 'Event', 'Other']}
                onChange={(v) => setData({ ...data, foundUsThrough: v })}
              />

              <Select
                label="Preferred Contact Method"
                value={data.preferredContactMethod}
                options={['Email', 'WhatsApp', 'Telegram', 'Messenger', 'Phone Call']}
                onChange={(v) => setData({ ...data, preferredContactMethod: v })}
                required
                error={errors.preferredContactMethod}
              />

              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-black">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={data.agreeUpdates}
                    onChange={(e) => setData({ ...data, agreeUpdates: e.target.checked })}
                  />
                  <span>
                    I agree to receive updates and communications{' '}
                    <span className="text-red-600">(required)</span>
                  </span>
                </label>
                {errors.agreeUpdates && (
                  <p className="text-xs text-red-600">{errors.agreeUpdates}</p>
                )}

                <label className="flex items-start gap-3 text-sm text-black">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={data.joinMailingList}
                    onChange={(e) => setData({ ...data, joinMailingList: e.target.checked })}
                  />
                  <span>Join mailing list for newsletters (optional)</span>
                </label>
              </div>

              <div className="mt-8 flex justify-between">
                <Button label="Back" onClick={() => setStep(1)} />
                <Button
                  label={loading ? 'Submitting...' : 'COMPLETE'}
                  onClick={handleSubmit}
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
