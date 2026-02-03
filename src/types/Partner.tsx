export type PartnerSummary = {
  partnerId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  nationality: string | null;
  occupation: string | null;
  volunteerAvailability: string | null;
  hasVolunteerExperience: boolean;
  gender: string | null;
  status: 'Active' | 'Inactive';
};

export type PartnerVolunteerApplication = {
  id: string;
  status: string;
  createdAt: string;
  availability?: string | null;
  position: {
    id: string;
    role: string;
    projectId: string;
    projectTitle?: string | null;
  };
};
