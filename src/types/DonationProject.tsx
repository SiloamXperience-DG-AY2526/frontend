// Donation Project Types (based on actual backend response)

export type DonationProjectType = 'brick' | 'sponsor' | 'partnerLed';

export type DonationProjectSubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'withdrawn';

export type DonationProjectApprovalStatus =
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected';

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
  brickCost?: string | null; // Preferred field name
  brickSize?: string | null; // Legacy field name kept for compatibility
  deadline: string | null;
  type: DonationProjectType;
  startDate: string;
  endDate: string;
  submissionStatus: DonationProjectSubmissionStatus;
  approvalStatus: DonationProjectApprovalStatus;
  approvalNotes?: string | null;
  image: string | null;
  attachments: string | null;
  managedBy?: string;
  createdAt: string;
  updatedAt?: string;
  projectManager: {
    id: string;
    firstName: string;
    lastName: string;
  };
  totalRaised?: string; // Backend returns as string
  objectivesList?: string[];
};

export type DonationProjectsResponse = {
  projects: DonationProject[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};
export type DonationTransaction = {
  id: string;
  donorId: string;
  projectId: string;
  paymentMode: string;
  date: string;
  amount: string | number;
  receiptStatus: 'pending' | 'received' | 'cancelled';
  submissionStatus: 'draft' | 'submitted' | 'withdrawn';
  isThankYouSent: boolean;
};


