import { SignupData } from "@/types/SignUpData";
import Button from "@/components/ui/Button";
import Input from "../ui/Input";
import MultiSelect from "../ui/MultiSelect";
import Textarea from "../ui/TextArea";

interface Props {
  data: SignupData;
  setData: (d: SignupData) => void;
  back: () => void;
  next: () => void;
}
const VOLUNTEER_INTERESTS = [
  "Organizing fundraising events",
  "Planning trips for your organization/group",
  "Short-term mission trips (up to 14 days)",
  "Long-term commitments (6 months or more)",
  "Behind-the-scenes administration",
  "Marketing & social media magic",
  "Teaching & mentoring",
  "Training & program development",
  "Agriculture projects",
  "Building & facilities work",
  "Other",
];

export default function VolunteerInterest({
  data,
  setData,
  next,
  back,
}: Props) {
  const showOther = data.interest.includes("Other");

  return (
    <div>
      <h2 className="text-3xl font-bold text-black text-center mb-8 mt-3">
        Volunteer Interest
      </h2>

      <div className="space-y-8">
        {/* Interests */}
        <MultiSelect
          label="Volunteering Interests (Select all that apply)"
          options={VOLUNTEER_INTERESTS}
          value={data.interest}
          onChange={(v) => setData({ ...data, interest: v })}
        />

        {/* Other interest (conditional) */}
        {showOther && (
          <Input
            label="Other (please specify)"
            value={data.otherInterest || ""}
            onChange={(v) => setData({ ...data, otherInterest: v })}
          />
        )}

        {/* Trip details (optional, always visible) */}
        <div className="space-y-4">
          <p className="text-md font-semibold text-green-900">
            If you're interested in trips, answer the following (optional):
          </p>

          <Input
            label="Full Name (as per passport)"
            value={data.passportName || ""}
            onChange={(v) => setData({ ...data, passportName: v })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Passport Number"
              value={data.passportNumber || ""}
              onChange={(v) => setData({ ...data, passportNumber: v })}
            />

            <Input
              label="Passport Expiry Date"
              type="date"
              value={data.passportExpiry || ""}
              onChange={(v) => setData({ ...data, passportExpiry: v })}
            />
          </div>
        </div>

        {/* Health notes */}
        <Textarea
          label="Do you have any health conditions we should know about?"
          value={data.healthNotes || ""}
          onChange={(v) => setData({ ...data, healthNotes: v })}
        />
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button label="Back" onClick={back} />
        <Button label="NEXT →" onClick={next} />
      </div>
    </div>
  );
}
