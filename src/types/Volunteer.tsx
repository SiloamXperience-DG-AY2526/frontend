export type FeedbackPayload = {
  ratings: {
    overall: number;
    management: number;
    planning: number;
    facilities: number;
  };
  feedback: {
    experience: string;
    improvement: string;
    comments: string;
  };
  submittedAt: string;
};
export type VolunteerProjectListPosition = {
  id: string;
  role: string;
  description: string;
  totalSlots: number;
  slotsFilled: number;
  slotsAvailable: number;
};

export type VolunteerProjectListSession = {
  id: string;
  name: string;
  sessionDate: string;
  startTime: string | null;
  endTime: string | null;
  totalSlots: number;
  slotsFilled: number;
  slotsAvailable: number;
};

export type VolunteerProject = {
  id: string;
  title: string;
  location?: string | null;
  image?: string | null;

  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;

  aboutDesc?: string | null;

  // ✅ PROJECT-LEVEL (THIS SOLVES EVERYTHING)
  projectTotalSlots: number;
  projectAvailableSlots: number;

  // Optional details for list view
  positions?: VolunteerProjectListPosition[];
  sessions?: VolunteerProjectListSession[];
};
export type VolunteerProjectsResponse = {
  status: "success" | "error";
  data: VolunteerProject[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type VolunteerPosition = {
  id: string;
  role: string;
  description: string;
  totalSlots: number;
  slotsFilled: number;
  slotsAvailable: number;
  skills: string[];
};

export type VolunteerSession = {
  id: string;
  name: string;
  sessionDate: string; // ISO
  startTime: string | null;
  endTime: string | null;
};

export type VolunteerProjectDetail = {
  id: string;

  title: string;
  location: string | null;

  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;

  frequency: string | null;
  interval: number | null;
  dayOfWeek: string | null;

  initiatorName: string | null;
  organisingTeam: string | null;
  proposedPlan: string | null;

  aboutDesc: string | null;
  objectives: string | null; // backend currently string
  beneficiaries: string | null; // backend currently string

  image: string | null;
  attachments: string | null;

  positions: VolunteerPosition[];
  sessions: VolunteerSession[];

  createdAt: string;
  updatedAt: string;
};

export type VolunteerProjectDetailResponse = {
  status: "success";
  data: VolunteerProjectDetail;
};
