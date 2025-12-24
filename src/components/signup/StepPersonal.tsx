import { SignupData } from "@/types/SignUpData";
import Button from "@/components/ui/Button";
import Input from "../ui/Input";

interface Props {
  data: SignupData;
  setData: (d: SignupData) => void;
  next: () => void;
}

export default function PersonalDetails({ data, setData, next }: Props) {
  return (
    <div>
      <h2 className="text-3xl text-center font-bold text-black mb-5">Personal Details</h2>

      <div className="space-y-7">
        <Input
          label="Name:"
          value={data.name}
          onChange={(v) => setData({ ...data, name: v })}
        />

        <Input
          label="NRIC/FIN Number:"
          value={data.nric}
          onChange={(v) => setData({ ...data, nric: v })}
        />

        <Input
          label="Passport Number (Optional):"
          value={data.passport}
          onChange={(v) => setData({ ...data, passport: v })}
        />

        <Input
          label="Email:"
          value={data.email}
          onChange={(v) => setData({ ...data, email: v })}
        />

        <Input
          label="Contact Number:"
          value={data.contact}
          onChange={(v) => setData({ ...data, contact: v })}
        />

        <Input
          label="Password:"
          type="password"
          value={data.password}
          onChange={(v) => setData({ ...data, password: v })}
        />
      </div>

      <div className="mt-5 flex justify-center">
        <Button label="NEXT →" onClick={next} />
      </div>
    </div>
  );
}

