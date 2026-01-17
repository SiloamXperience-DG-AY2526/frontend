// Donation Application Types (based on actual backend response)

export type DonationType = 'individual' | 'corporate' | 'fundraisingEvents';

export type DonationReceiptStatus = 'pending' | 'received';

export type SubmitDonationApplication = {
  projectId: string;
  type: DonationType;
  countryOfResidence: string;
  paymentMode: string;
  amount: number;
  brickCount?: number | null;
  donorNote?: string;
};

export type DonationApplication = {
  id: string;
  donorId: string;
  projectId: string;
  recurringDonationId: string | null;
  type: DonationType;
  countryOfResidence: string;
  paymentMode: string;
  date: string;
  amount: string; // Backend returns as string
  receipt: string | null;
  isThankYouSent: boolean;
  isAdminNotified: boolean;
  submissionStatus: string;
  receiptStatus: DonationReceiptStatus;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
    location: string;
    image: string | null;
    type: string;
    brickSize: string | null;
  };
};

export type DonationHistoryResponse = {
  donations: DonationApplication[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export type DonationHomepage = {
  featuredProjects: Array<{
    id: string;
    title: string;
    location: string;
    about: string;
    targetFund: string | null;
    deadline: string | null;
    image: string | null;
    type: string;
    totalRaised: string;
    isOngoing: boolean;
  }>;
  statistics: {
    totalRaised: string;
    totalDonations: number;
    activeProjects: number;
  };
};
