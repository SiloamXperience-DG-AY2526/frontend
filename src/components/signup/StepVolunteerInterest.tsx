import { SignUpData } from '@/types/SignUpData';
import Button from '@/components/ui/Button';
import Input from '../ui/Input';
import MultiSelect from '../ui/MultiSelect';
import TextArea from '../ui/TextArea';
import { useState } from 'react';
import Toast from '../ui/Toast';
import RadioGroup from '../ui/RadioGroup';

const VOLUNTEER_INTERESTS = [
  'Organizing fundraising events',
  'Planning trips for your organization/group',
  'Short-term mission trips (up to 14 days)',
  'Long-term commitments (6 months or more)',
  'Behind-the-scenes administration',
  'Marketing & social media magic',
  'Teaching & mentoring',
  'Training & program development',
  'Agriculture projects',
  'Building & facilities work',
  'Other',
];
type SignUpFormProps = {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  back: () => void;
  next: () => void;
};
type YesNo = 'Yes' | 'No';

export default function VolunteerInterest({
  data,
  setData,
  next,
  back,
}: SignUpFormProps) {
  const showOther = data.interest.includes('Other');
  //  ui check if no passport details when user comes back, state would be no
  const hasPassport =
    !!data.passportName?.trim() ||
    !!data.passportNumber?.trim() ||
    !!data.passportExpiry?.trim();

  const [trips, setTrips] = useState<YesNo>(hasPassport ? 'Yes' : 'No');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });
  const validate = () => {
    const e: Record<string, string> = {};

    if (!data.interest || data.interest.length === 0) e.interest = 'Required';
    if (showOther && !(data.otherInterest || '').trim())
      e.otherInterest = 'Required';

    if (trips === 'Yes') {
      if (!(data.passportName || '').trim()) e.passportName = 'Required';
      if (!(data.passportNumber || '').trim()) e.passportNumber = 'Required';
      if (!(data.passportExpiry || '').trim()) e.passportExpiry = 'Required';
    }

    setErrors(e);
    return e;
  };

  const handleNext = () => {
    const e = validate();

    if (Object.keys(e).length > 0) {
      const hasRequired = Object.values(e).includes('Required');

      let title = 'Missing information';
      let message = 'Please fill in all required fields before continuing.';

      if (
        !hasRequired &&
        (e.passportName || e.passportNumber || e.passportExpiry)
      ) {
        title = 'Trip details required';
        message = 'Please complete your passport details to proceed.';
      }

      setToast({ open: true, type: 'error', title, message });
      return;
    }

    next();
  };
  const onTripsChange = (v: string) => {
    const yn: YesNo = v === 'Yes' ? 'Yes' : 'No';
    setTrips(yn);

    if (yn === 'No') {
      setData({
        ...data,
        passportName: '',
        passportNumber: '',
        passportExpiry: '',
      });
      setErrors((p) => ({
        ...p,
        passportName: '',
        passportNumber: '',
        passportExpiry: '',
      }));
    }
  };

  const passportDisabled = trips === 'No';

  return (
    <div>
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <h2 className="text-3xl font-bold text-black text-center mb-8 mt-3">
        Volunteer Interest
      </h2>

      <div className="space-y-6">
        {/* Interests */}
        <MultiSelect
          label="Volunteering Interests (Select all that apply)"
          options={[...VOLUNTEER_INTERESTS]}
          value={data.interest}
          onChange={(v) => {
            setData({ ...data, interest: v });
            if (errors.interest) setErrors((p) => ({ ...p, interest: '' }));
          }}
          required
          error={errors.interest}
        />

        {showOther && (
          <Input
            label="Other (please specify)"
            value={data.otherInterest || ''}
            onChange={(v) => {
              setData({ ...data, otherInterest: v });
              if (errors.otherInterest)
                setErrors((p) => ({ ...p, otherInterest: '' }));
            }}
            required
            error={errors.otherInterest}
          />
        )}
        <TextArea
          label="Do you have any health conditions we should know about?"
          value={data.healthNotes || ''}
          onChange={(v) => setData({ ...data, healthNotes: v })}
          placeholder=""
        />
        <RadioGroup
          label="Interested in trips?"
          value={trips}
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]}
          onChange={onTripsChange}
          required
        />

        {/* Trip details */}
        <div className="space-y-3">
          <p className="text-md font-semibold text-green-900">
            Trip details {trips === 'Yes' ? '(required)' : ''}
          </p>

          <Input
            label="Full Name (as per passport)"
            value={data.passportName || ''}
            onChange={(v) => {
              setData({ ...data, passportName: v });
              if (errors.passportName)
                setErrors((p) => ({ ...p, passportName: '' }));
            }}
            required={trips === 'Yes'}
            disabled={passportDisabled}
            error={errors.passportName}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-7">
              <Input
                label="Passport Number"
                value={data.passportNumber || ''}
                onChange={(v) => {
                  setData({ ...data, passportNumber: v });
                  if (errors.passportNumber)
                    setErrors((p) => ({ ...p, passportNumber: '' }));
                }}
                required={trips === 'Yes'}
                disabled={passportDisabled}
                error={errors.passportNumber}
              />
            </div>

            <div className="md:col-span-5">
              <Input
                label="Passport Expiry Date"
                type="date"
                value={data.passportExpiry || ''}
                onChange={(v) => {
                  setData({ ...data, passportExpiry: v });
                  if (errors.passportExpiry)
                    setErrors((p) => ({ ...p, passportExpiry: '' }));
                }}
                required={trips === 'Yes'}
                disabled={passportDisabled}
                error={errors.passportExpiry}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-between">
        <Button label="Back" onClick={back} />
        <Button label="NEXT →" onClick={handleNext} />
      </div>
    </div>
  );
}
