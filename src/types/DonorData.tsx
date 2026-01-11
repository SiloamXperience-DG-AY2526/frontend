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

export type Donation = {
  id: string;
  project: string;
  amount: number;
  receipt: 'Pending' | 'Issued';
  date: string;
};

export type DonorDetail = {
  donorId: string;
  fullName: string;
  prefixTitle: string;
  birthday: string;
  gender: 'Male' | 'Female' | 'Other';
  occupation: string;
  nationality: string;
  phoneNumber: string;
  preferredCommunicationMethod: string;
  donations: Donation[];
  cumulativeAmount: number;
  projects: string[];
  status: 'Active' | 'Inactive';
};
