// Donation Project Types (based on actual backend response)

export type DonationProjectType = 'brick' | 'sponsor' | 'partnerLed';

export type DonationProjectSubmissionStatus = 'draft' | 'submitted' | 'withdrawn';

export type DonationProjectApprovalStatus = 'pending' | 'approved' | 'rejected';

export type DonationProject = {
  id: string;
  title: string;
  location: string;
  about: string;
  objectives: string;
  beneficiaries: string;
  initiatorName: string | null;
  organisingTeam: string | null;
  targetFund: string | null; // Backend returns as string
  brickSize: string | null; // Backend returns as string
  deadline: string | null;
  type: DonationProjectType;
  startDate: string;
  endDate: string;
  submissionStatus: DonationProjectSubmissionStatus;
  approvalStatus: DonationProjectApprovalStatus;
  approvalNotes: string | null;
  image: string | null;
  attachments: string | null;
  managedBy: string;
  createdAt: string;
  updatedAt: string;
  project_manager: {
    id: string;
    firstName: string;
    lastName: string;
  };
  totalRaised?: string; // Backend returns as string
  objectivesList?: string[];
};

export type DonationProjectsResponse = {
  projectsWithTotals: DonationProject[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};
