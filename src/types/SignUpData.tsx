export interface SignupData {
  name: string;
  nric: string;
  passport: string;
  email: string;
  contact: string;
  password: string;

  nationality: string;
  gender: "Male" | "Female" | "Others" | "";
  dob: string;
  occupation: string;
  languages: string[];
  qualification: string;
  address: string;

  duration: string;
  interest: string[];
  availability: string;
  donation: string;
}
