// Donation Application Types (based on OpenAPI schema)

export type DonationType = 'INDIVIDUAL' | 'CORPORATE' | 'FUNDRAISING_EVENTS';

export type DonationApplicationStatus = 'pending' | 'completed' | 'cancelled';

export type SubmitDonationApplication = {
  projectId: string;
  type: DonationType;
  countryOfResidence: string;
  paymentMode: string;
  amount: number;
  brickCount?: number;
};

export type DonationApplication = {
  id: string;
  projectId: string;
  partnerId: string;
  type: DonationType;
  countryOfResidence: string;
  paymentMode: string;
  amount: number;
  brickCount: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type DonationDetail = DonationApplication & {
  project: {
    id: string;
    title: string;
    location: string;
    about: string;
    type: string;
  };
};

export type DonationHistoryResponse = {
  donations: DonationApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type DonationHomepage = {
  featuredProjects: any[];
  statistics: {
    totalDonations: number;
    totalProjects: number;
    totalDonors: number;
  };
};
