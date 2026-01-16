// API client functions for donation features
// Following the pattern from lib/api/auth.ts and lib/api/user.ts

import {
  DonationProjectsResponse,
  DonationProject,
} from '@/types/DonationProject';
import {
  SubmitDonationApplication,
  DonationApplication,
  DonationHistoryResponse,
  DonationDetail,
  DonationHomepage,
} from '@/types/DonationData';

// Get donation homepage data (statistics and featured projects)
export async function getDonationHomepage(): Promise<DonationHomepage> {
  const res = await fetch('/api/v1/donations/home');

  if (!res.ok) {
    throw new Error('Failed to fetch donation homepage data.');
  }

  const data = await res.json();
  return data;
}

// Get all donation projects with optional filters
export async function getDonationProjects(
  type?: 'ongoing' | 'specific' | 'all',
  page: number = 1,
  limit: number = 20
): Promise<DonationProjectsResponse> {
  const params = new URLSearchParams({
    type: type || 'all',
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(`/api/v1/donation-projects?${params.toString()}`);

  if (!res.ok) {
    throw new Error('Failed to fetch donation projects.');
  }

  const data = await res.json();
  return data;
}

// Get a specific donation project by ID
export async function getDonationProjectById(
  projectId: string
): Promise<DonationProject> {
  const res = await fetch(`/api/v1/donation-projects/${projectId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch donation project details.');
  }

  const data = await res.json();
  return data;
}

// Submit a donation application
export async function submitDonation(
  donationData: SubmitDonationApplication
): Promise<DonationApplication> {
  const res = await fetch('/api/v1/donations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donationData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to submit donation application.');
  }

  const response = await res.json();
  return response.donation;
}

// Get my donation history
export async function getMyDonations(
  status?: 'pending' | 'completed' | 'cancelled' | 'all',
  page: number = 1,
  limit: number = 10
): Promise<DonationHistoryResponse> {
  const params = new URLSearchParams({
    status: status || 'all',
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(`/api/v1/donations/me?${params.toString()}`);

  if (!res.ok) {
    throw new Error('Failed to fetch donation history.');
  }

  const data = await res.json();
  return data;
}

// Get a specific donation detail
export async function getDonationDetail(
  donationId: string
): Promise<DonationDetail> {
  const res = await fetch(`/api/v1/donations/me/${donationId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch donation detail.');
  }

  const data = await res.json();
  return data;
}

// Download donation receipt
export async function downloadDonationReceipt(
  donationId: string
): Promise<Blob> {
  const res = await fetch(`/api/v1/donations/me/${donationId}/receipt`);

  if (!res.ok) {
    throw new Error('Failed to download donation receipt.');
  }

  const blob = await res.blob();
  return blob;
}

//sample data: temp
const sample = {
  projects: [
    {
      id: 'dp_001',
      title: 'Clean Water for Rural Villages',
      location: 'Cambodia',
      about: 'Providing access to clean and safe drinking water.',
      objectives: 'Install filtration systems.',
      beneficiaries: 'Rural households',
      initiatorName: 'Hope Foundation',
      organisingTeam: 'Water Aid Team',
      targetFund: 50000,
      currentFund: 18350,
      brickSize: 50,
      deadline: '2026-06-30T23:59:59.000Z',
      type: 'ONGOING',
      startDate: '2026-01-01T00:00:00.000Z',
      endDate: '2026-12-31T23:59:59.000Z',
      submissionStatus: 'APPROVED',
      approvalStatus: 'APPROVED',
      approvalNotes: null,
      image: null,
      attachments: null,
      managerId: 'user_123',
      createdAt: '2026-01-10T08:30:00.000Z',
      updatedAt: '2026-01-15T14:45:00.000Z',
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  },
} as const satisfies DonationProjectsResponse;

// Get all donation projects for finance manager with pagination
export async function getFinanceManagerProjects(
  page: number = 1,
  limit: number = 20
): Promise<DonationProjectsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // Placeholder API endpoint - replace with actual endpoint later
  /**
  const res = await fetch(
    `/api/v1/finance/donation-projects?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch donation projects for finance manager.');
  }

  const data = await res.json();

   */
  const data = sample;
  return data;
}
