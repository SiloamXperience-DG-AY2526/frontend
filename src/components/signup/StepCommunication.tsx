'use client';

import {  SignUpData } from '@/types/SignUpData';
import Button from '@/components/ui/Button';
import Select from '../ui/Select';
import { useState } from 'react';

type LastSignUpFormProps = {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  back: () => void;
};

export default function StepCommunication({
  data,
  setData,
  back,
}: LastSignUpFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // validation (page-specific)
    if (!data.agreeUpdates) {
      alert('You must agree to receive updates to continue.');
      return;
    }

    if (!data.preferredContactMethod) {
      alert('Please select a preferred contact method.');
      return;
    }

    setLoading(true);

    const payload: SignUpData = {
      ...data,
    };

    try {
      // frontend test
      console.log('Signup data:', payload);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert('Signup completed successfully!');
    } catch (error) {
      console.error(error);
      alert('There was an error submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-black text-center mb-2">
        Stay Connected
      </h2>
      <p className="text-sm text-gray-600 text-center mb-8">
        We promise not to spam! Just updates and opportunities that matter.
      </p>

      <div className="space-y-6">
        <Select
          label="How did you hear about us?"
          value={data.foundUsThrough || ''}
          options={[
            'Friend',
            'Social Media',
            'Church',
            'Website',
            'Event',
            'Other',
          ]}
          onChange={(v) => setData({ ...data, foundUsThrough: v })}
        />

        <Select
          label="What's the best way to stay in touch?"
          value={data.preferredContactMethod || ''}
          options={['Email', 'WhatsApp', 'Telegram', 'Messenger', 'Phone Call']}
          onChange={(v) => setData({ ...data, preferredContactMethod: v })}
        />

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.agreeUpdates || false}
              onChange={(e) =>
                setData({ ...data, agreeUpdates: e.target.checked })
              }
            />
            I agree to receive updates and communications (required)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.joinMailingList || false}
              onChange={(e) =>
                setData({ ...data, joinMailingList: e.target.checked })
              }
            />
            I&apos;d like to join your mailing list for newsletters and event
            invitations (optional)
          </label>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button label="Back" onClick={back} />
        <Button
          label={loading ? 'Submitting...' : 'SUBMIT →'}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
}
