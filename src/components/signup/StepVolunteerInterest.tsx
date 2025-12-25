import { SignupData } from "@/types/SignUpData";
import Button from "@/components/ui/Button";
import Input from "../ui/Input";
import MultiSelect from "../ui/MultiSelect";
import Textarea from "../ui/Textarea";

interface Props {
  data: SignupData;
  setData: (d: SignupData) => void;
  back: () => void;
}
const VOLUNTEER_INTERESTS = [
  "Education",
  "Elderly Care",
  "Children & Youth",
  "Healthcare",
  "Mental Health",
  "Environment",
  "Animal Welfare",
  "Disaster Relief",
  "Community Development",
  "Fundraising",
];

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
      <h2 className="text-3xl font-bold text-black text-center mb-8 mt-3">
        Volunteer Interest
      </h2>

      <div className="space-y-10 mt-3">
        <div>
          <label className="block text-black font-semibold  text-sm mb-2">
            Volunteering Duration :
          </label>
          <div className="flex gap-24">
            {["Ad Hoc", "Short Term", "Long Term"].map((v) => (
              <label key={v} className="flex items-center gap-2 mt-4">
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

        <MultiSelect
          label="Volunteer Interests"
          options={VOLUNTEER_INTERESTS}
          value={data.interest}
          onChange={(v) => setData({ ...data, interest: v })}
        />

        <Input
          label="Availability"
          value={data.availability}
          onChange={(v) => setData({ ...data, availability: v })}
        />

        <Textarea
          label="Preferred Cause for Donation"
          value={data.donation}
          onChange={(v) => setData({ ...data, donation: v })}
        />
      </div>

      <div className="mt-5 flex justify-between">
        <Button label="Back" variant="secondary" onClick={back} />
        <Button label="SIGN UP →" onClick={submit} />
      </div>
    </div>
  );
}
