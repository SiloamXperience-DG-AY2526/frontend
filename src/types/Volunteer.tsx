import { ProjectApprovalStatus } from './ProjectData';

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
};

export type FeedbackSubmitResponse = {
  status: 'success';
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

export type SubmitVolunteerApplicationResult = {
  application: {
    id: string;
    volunteerId: string;
    positionId: string;
    status: string;
    hasConsented: boolean;
    createdAt: string;
  };
  volunteer: {
    userId: string;
    name: string;
    gender: string;
    contactNumber: string;
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
  status: 'success' | 'error';
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
  status: 'success';
  data: VolunteerProjectDetail;
};
export type VolunteerProjectPositionStatus =
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive';

export type OperationStatus = 'ongoing' | 'paused' | 'cancelled' | 'completed';

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

export type ProjectFrequency =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';



export type ProposeVolunteerProjectPayload = {
 

  title: string;
  initiatorName?: string;
  location: string;

  // project plan fields
  aboutDesc: string;
  beneficiaries: string;
  proposedPlan?: string;

  objectives: string;

  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;

  frequency: ProjectFrequency;
  interval?: number | null;
  dayOfWeek?: string | null;

  positions: Array<{
    role: string;
    description: string;
    skills: string[];
  }>;

  attachments?: string;
  image?: string;
  organisingTeam?: string;
};

export type MyProposedProject = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  initiatorName: string;
  approvalStatus: ProjectApprovalStatus;
  totalCapacity: number;
  acceptedCount: number;
};
