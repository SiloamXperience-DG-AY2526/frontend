'use client';

import { useState } from 'react';
import StepPersonal from './StepPersonal';
import { SignUpData } from '@/types/SignUpData';

const initialData: SignUpData = {
  // Basic signup info
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '',
  contact: '',
  password: '',
  confirmPassword: '',

  // These fields are collected during onboarding now
  nationality: '',
  identificationNumber: '',
  gender: 'male',
  dob: '',
  occupation: '',
  languages: [],
  qualification: '',
  address: '',
  interest: [],
  otherInterest: '',
  passportName: '',
  passportNumber: '',
  passportExpiry: '',
  healthNotes: '',
  emergencyContactNumber: '',
  skills: '',
  volunteeredBefore: 'No',
  availability: '',
  foundUsThrough: '',
  preferredContactMethod: '',
  agreeUpdates: false,
  joinMailingList: false,
};

export default function SignupForm() {
  const [data, setData] = useState<SignUpData>(initialData);

  // Signup is now a single step - onboarding happens after
  return <StepPersonal data={data} setData={setData} next={() => {}} />;
}
