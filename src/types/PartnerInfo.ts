export type AttendanceStatus = 'Attended' | 'Did not attend' | 'Unknown';

export type PreferredCommunicationMethod =
  | 'email'
  | 'whatsapp'
  | 'telegram'
  | 'messenger'
  | 'phoneCall';

export type PersonalParticulars = {
  fullName: string;
  prefixTitle: string;
  birthday: string; // DD/MM/YYYY
  gender: 'male' | 'female' | 'others';
  occupation: string;
  nationality: string;
  phoneNumber: string;
  preferredCommunicationMethod: PreferredCommunicationMethod;
};

export type ProjectSession = {
  sessionName: string;
  date: string; // ISO
  startTime: string; // ISO
  endTime: string; // ISO
  attendance: AttendanceStatus;
  hoursCompleted: number;
};

export type ProjectInfo = {
  projectId: string;
  projectTitle: string;
  sessions: ProjectSession[];
  totalHours: number;
};

export type PartnershipInterest = {
  interest: string;
  interested: boolean;
};

export type PerformanceReview = {
  reviewerName: string;
  timestamp: string; // ISO
  score: number;
  strengths: string;
  areasOfImprovement: string;
  projectTitle: string;
  feedbackType: 'supervisor' | 'peer' | 'self';
  tags: string[];
};

export type PartnerInfoResponse = {
  personalParticulars: PersonalParticulars;
  projects: ProjectInfo[];
  partnershipInterests: PartnershipInterest[];
  performance: PerformanceReview[];
  profile: Record<string, unknown>;
};


