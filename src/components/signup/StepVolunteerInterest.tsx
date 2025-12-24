import { SignupData } from "@/types/SignUpData";
import Button from "@/components/ui/Button";

interface Props {
  data: SignupData;
  setData: (d: SignupData) => void;
  back: () => void;
}

export default function VolunteerInterest({ data, setData, back }: Props) {
  const submit = async () => {
    await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert("Submitted");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-8">Volunteer Interest</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-black text-sm mb-2">
            Volunteering Duration
          </label>
          <div className="flex gap-6">
            {["Ad Hoc", "Short Term", "Long Term"].map((v) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={data.duration === v}
                  onChange={() => setData({ ...data, duration: v })}
                />
                {v}
              </label>
            ))}
          </div>
        </div>

        <Input
          label="Volunteer Interest"
          value={data.interest}
          onChange={(v) => setData({ ...data, interest: v })}
        />

        <Input
          label="Availability"
          value={data.availability}
          onChange={(v) => setData({ ...data, availability: v })}
        />

        <Input
          label="Preferred Cause for Donation"
          value={data.donation}
          onChange={(v) => setData({ ...data, donation: v })}
        />
      </div>

      <div className="mt-12 flex justify-between">
        <Button label="Back" variant="secondary" onClick={back} />
        <Button label="SIGN UP →" onClick={submit} />
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-black text-sm mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-black outline-none py-1.5"
      />
    </div>
  );
}
