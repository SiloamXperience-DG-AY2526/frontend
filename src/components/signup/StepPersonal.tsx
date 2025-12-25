import { SignupData } from "@/types/SignUpData";
import Button from "@/components/ui/Button";
import Input from "../ui/Input";
import Link from "next/link";

interface Props {
  data: SignupData;
  setData: (d: SignupData) => void;
  next: () => void;
}

export default function PersonalDetails({ data, setData, next }: Props) {
  return (
    <div>
      <div className="text-start mb-5 mt-3">
        <h1 className="text-3xl font-bold  text-black">Create an Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 font-bold hover:underline"
          >
            Log In
          </Link>{" "}
        </p>
      </div>
      <div className="space-y-3">
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
