export type StaffProfile = {
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
}

export type PartnerProfile = {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  countryCode: string;
  contactNumber: string;
  emergencyCountryCode: string;
  emergencyContactNumber: string;
  identificationNumber: string;
  nationality: string;
  occupation: string;
  gender: string;
  residentialAddress: string;
  otherInterests: string;
  otherReferrers: string;
  otherContactModes: string;
  hasVolunteerExperience: boolean;
  volunteerAvailability: string;
  isActive: string;
  consentUpdatesCommunications: string;
  subscribeNewsletterEvents: string;
  skills: string[];
  languages: string[];
  contactModes: string[];
  interests: string[];
};
