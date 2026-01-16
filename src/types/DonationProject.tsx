// Donation Project Types (based on OpenAPI schema)

export type DonationProjectType = 'ONGOING' | 'SPECIFIC';

export type DonationProjectSubmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED';

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

// Finance-related types for donation projects
export type ProjectDonation = {
  donorName: string;
  amount: number;
  date: string;
  paymentMode: string;
};

export type ProjectRefund = {
  requestorName: string;
  startDate: string;
  endDate: string;
  amount: number;
  paymentMode: string;
  refundStatus: 'pending' | 'refunded';
};

// Extended DonationProject type with financial details (for finance manager views)
export type DonationProjectWithFinance = DonationProject & {
  donations: ProjectDonation[];
  refunds: ProjectRefund[];
  donors: ProjectDonor[];
};

// Donor information for a specific donation project
export type ProjectDonor = {
  donorId: string;
  partnerName: string;
  projects: string[];
  cumulativeAmount: number;
  gender: 'male' | 'female' | 'others';
  contactNumber: string;
  status: 'Active' | 'Inactive';
};
