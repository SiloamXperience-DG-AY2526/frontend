"use client";

import { useState } from "react";
import StepPersonal from "./StepPersonal";
import StepAbout from "./StepMoreDetails";
import StepVolunteer from "./StepVolunteerInterest";
import { SignupData } from "@/types/SignUpData";

const initialData: SignupData = {
  name: "",
  nric: "",
  passport: "",
  email: "",
  contact: "",
  password: "",

  nationality: "",
  gender: "",
  dob: "",
  occupation: "",
  languages: [],
  qualification: "",
  address: "",

  duration: "",
  interest: "",
  availability: "",
  donation: "",
};

export default function SignupForm() {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<SignupData>(initialData);

  if (step === 1)
    return (
      <StepPersonal data={data} setData={setData} next={() => setStep(2)} />
    );

  if (step === 2)
    return (
      <StepAbout
        data={data}
        setData={setData}
        back={() => setStep(1)}
        next={() => setStep(3)}
      />
    );

  return (
    <StepVolunteer data={data} setData={setData} back={() => setStep(2)} />
  );
}
