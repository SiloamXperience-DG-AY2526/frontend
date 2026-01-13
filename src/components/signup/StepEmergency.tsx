'use client';

import { SignUpData} from '@/types/SignUpData';
import Button from '@/components/ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';


type SignUpFormProps = {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  back: () => void;
  next: () => void;
}

export default function StepEmergency({ data, setData, back, next }: SignUpFormProps) {


  return (
    <div>
      <h2 className="text-3xl font-bold text-black text-center mb-8">
        Emergency Contact & Skills
      </h2>

      <div className="space-y-6">
        <Input
          label="Emergency Contact Name"
          value={data.emergencyContactName || ''}
          onChange={(v) => setData({ ...data, emergencyContactName: v })}
        />

        <Input
          label="Emergency Contact Number"
          value={data.emergencyContactNumber || ''}
          onChange={(v) => setData({ ...data, emergencyContactNumber: v })}
        />
        {/* dropdown? */}
        <Input
          label="Skills"
          value={data.skills || ''}
          onChange={(v) => setData({ ...data, skills: v })}
        />

        <Select
          label="Have you volunteered before?"
          value={data.volunteeredBefore || ''}
          options={['Yes', 'No']}
          onChange={(v) =>
            setData({ ...data, volunteeredBefore: v as 'Yes' | 'No' })
          }
        />

        <Select
          label="Availability"
          value={data.availability || ''}
          options={['Weekdays', 'Weekends', 'Evenings', 'Flexible']}
          onChange={(v) => setData({ ...data, availability: v })}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <Button label="Back"  onClick={back} />
        <Button label="NEXT →" onClick={next} />
      </div>
    </div>
  );
}
