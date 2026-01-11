export type Donor = {
  donorId: string;
  partnerName: string;
  projects: string[];
  cumulativeAmount: number;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  status: 'Active' | 'Inactive';
};

export type DonorTableData = Donor[];
