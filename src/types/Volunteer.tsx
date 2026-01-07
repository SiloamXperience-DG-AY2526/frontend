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
    comments?: string;
  };
  submittedAt?: string;
};

export type FeedbackSubmitResponse = {
  status: "success";
  message: string;
  data: {
    feedback: {
      id: string;
      projectId: string;
      overallRating: number;
      managementRating: number;
      planningRating: number;
      resourcesRating: number;
      enjoyMost: string;
      improvements: string;
      otherComments?: string | null;
      createdAt: string;
    };
    linkedSignupId: string;
  };
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

  projectTotalSlots: number;
  projectAvailableSlots: number;

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
  sessionDate: string;
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
export type VolunteerProjectPositionStatus =
  | "reviewing"
  | "approved"
  | "rejected"
  | "active"
  | "inactive";

export type OperationStatus = "ongoing" | "paused" | "cancelled" | "completed";

export type VolunteerApplicationDTO = {
  applicationId: string;
  status: VolunteerProjectPositionStatus;
  appliedAt: string;
  feedbackGiven: boolean;
  project: {
    id: string;
    title: string;
    description: string;
    location: string;
    startDate: string;
    startTime: string;
    endTime: string;
    endDate: string;
    operationStatus: OperationStatus;
  };
  position: {
    id: string;
    role: string;
  };
};
