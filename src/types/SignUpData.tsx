export interface SignupData {
  //page 1 - Personal Details
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  contact: string;
  password: string;
  confirmPassword: string;

  // //page 3 - more about user
  nationality: string;
  identificationNumber: string;
  gender: "Male" | "Female";
  dob: string;
  occupation: string;
  languages: string[];
  qualification: string;
  address: string;

  //page 3 - volunteer interest
  interest: string[];
  otherInterest?: string;
  passportName?: string;
  passportNumber?: string;
  passportExpiry?: string;
  healthNotes?: string;

  //page 4 - Emergency
  emergencyContactName?: string;
  emergencyContactNumber?: string;
 skills?: string;
  volunteeredBefore?: "Yes" | "No" ;
  availability?: string;

  // page 5 - Communication Preferences
  foundUsThrough?: string;
  preferredContactMethod?: string;
  agreeUpdates?: boolean;
  joinMailingList?: boolean;
}
