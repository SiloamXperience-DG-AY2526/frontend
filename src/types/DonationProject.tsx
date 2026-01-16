// Donation Project Types (based on OpenAPI schema)

export type DonationProjectType = 'ONGOING' | 'SPECIFIC';

export type DonationProjectSubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export type DonationProjectApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type DonationProject = {
  id: string;
  title: string;
  location: string;
  about: string;
  objectives: string;
  beneficiaries: string | null;
  initiatorName: string | null;
  organisingTeam: string | null;
  targetFund: number | null;
  currentFund: number;
  brickSize: number | null;
  deadline: string;
  type: DonationProjectType;
  startDate: string;
  endDate: string;
  submissionStatus: DonationProjectSubmissionStatus;
  approvalStatus: DonationProjectApprovalStatus;
  approvalNotes: string | null;
  image: string | null;
  attachments: string | null;
  managerId: string;
  createdAt: string;
  updatedAt: string;
};

export type DonationProjectsResponse = {
  projects: DonationProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
