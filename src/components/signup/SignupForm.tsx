'use client';

import { useState } from 'react';
import StepPersonal from './StepPersonal';
import StepAbout from './StepMoreDetails';
import StepVolunteer from './StepVolunteerInterest';
import { SignUpData } from '@/types/SignUpData';
import StepEmergency from './StepEmergency';
import StepCommunication from './StepCommunication';

const initialData: SignUpData = {
  // Page 1 - Personal Details
  salutation: '',
  firstName: '',
  lastName: '', 
  email: '',
  countryCode: '',
  contact: '',
  password: '',
  confirmPassword: '',

  // Page 2 - More About You
  nationality: '',
  identificationNumber: '',
  gender: 'male',
  dob: '',
  occupation: '',
  languages: [],
  qualification: '',
  address: '',

  // Page 3 - Volunteer Interest
  interest: [],
  otherInterest: '',
  passportName: '',
  passportNumber: '',
  passportExpiry: '',
  healthNotes: '',

  // Page 4 - Emergency Contact
  emergencyContactName: '',
  emergencyContactNumber: '',
  skills: '',
  volunteeredBefore: 'No',
  availability: '',

  // Page 5 - Communication Preferences
  foundUsThrough: '',
  preferredContactMethod: '',
  agreeUpdates: false,
  joinMailingList: false,
};

export default function SignupForm() {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<SignUpData>(initialData);

  const next = () => setStep((prev) => Math.min(prev + 1, 5));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  switch (step) {
  case 1:
    return <StepPersonal data={data} setData={setData} next={next} />;
  case 2:
    return (
      <StepAbout data={data} setData={setData} back={back} next={next} />
    );
  case 3:
    return (
      <StepVolunteer data={data} setData={setData} back={back} next={next} />
    );
  case 4:
    return (
      <StepEmergency data={data} setData={setData} back={back} next={next} />
    );
  case 5:
    return <StepCommunication data={data} setData={setData} back={back} />;
  default:
    return null;
  }
}
