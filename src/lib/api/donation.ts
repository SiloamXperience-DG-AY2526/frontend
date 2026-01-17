// API client functions for donation features
// Following the pattern from lib/api/auth.ts and lib/api/user.ts

import {
  DonationProjectsResponse,
  DonationProject,
  DonationProjectWithFinance,
} from '@/types/DonationProjectData';
import {
  SubmitDonationApplication,
  DonationApplication,
  DonationHistoryResponse,
  DonationHomepage 
} from '@/types/DonationData';

// Get donation homepage data (statistics and featured projects)
export async function getDonationHomepage(): Promise<DonationHomepage> {
  const res = await fetch('/api/v1/donations/home');

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    console.error('Failed to fetch donation homepage:', res.status, errorData);
    throw new Error('Failed to fetch donation homepage data.');
  }

  const data = await res.json();
  return data;
}

// Get all donation projects with optional filters
export async function getDonationProjects(
  type?: 'all' | 'ongoing' | 'specific' | 'brick' | 'sponsor' | 'partnerLed',
  page: number = 1,
  limit: number = 20
): Promise<DonationProjectsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (type && type !== 'all') {
    params.append('type', type);
  }

  const res = await fetch(`/api/donation-projects?${params.toString()}`);

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

  if (res.ok) {
    const data = await res.json();
    return {
      ...data.project,
      totalRaised:
        data.totalRaised?.toString?.() ?? String(data.totalRaised ?? '0'),
    };
  }

  if (res.status !== 403 && res.status !== 404) {
    throw new Error('Failed to fetch donation project details.');
  }

  const params = new URLSearchParams({
    page: '1',
    limit: '100',
  });
  const listRes = await fetch(`/api/v1/donation-projects?${params.toString()}`);

  if (!listRes.ok) {
    throw new Error('Failed to fetch donation project details.');
  }

  const listData = await listRes.json();
  const project = listData.projects?.find(
    (item: DonationProject) => item.id === projectId
  );

  if (!project) {
    throw new Error('Donation project not found.');
  }

  return project;
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
export async function getDonationDetail(donationId: string): Promise<DonationApplication> {
  const res = await fetch(`/api/v1/donations/me/${donationId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch donation detail.');
  }

  const data = await res.json();
  return data;
}

// Download donation receipt (returns URL to receipt)
export async function downloadDonationReceipt(donationId: string): Promise<{ receiptUrl: string }> {
  const res = await fetch(`/api/v1/donations/${donationId}/receipt`);

  if (!res.ok) {
    throw new Error('Failed to download donation receipt.');
  }

  return res.json();
}

// Get all donation projects for finance manager with pagination
export async function getFinanceManagerProjects(
  page: number = 1,
  limit: number = 20
): Promise<DonationProjectsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const res = await fetch(`/api/donation-projects?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch donation projects for finance manager.');
  }
  const data = await res.json();
  return data;
}

// Get donation project finance details (donations and donors)
export async function getDonationProjectFinance(
  projectId: string
): Promise<DonationProjectWithFinance> {
  // Fetch all three endpoints in parallel
  const [projectRes, donationsRes, donorsRes] = await Promise.all([
    fetch(`/api/donation-projects/${projectId}`),
    fetch(`/api/donation-projects/${projectId}/donations`),
    fetch(`/api/donation-projects/${projectId}/donors`),
  ]);

  if (!projectRes.ok) {
    throw new Error('Failed to fetch donation project details.');
  }

  const projectData = await projectRes.json();

  // Handle donations - default to empty array if fails
  let donations = [];
  if (donationsRes.ok) {
    const donationsData = await donationsRes.json();
    donations = donationsData.donations || [];
  } else {
    console.warn('Failed to fetch project donations, using empty array');
  }

  // Handle donors - default to empty array if fails
  let donors = [];
  if (donorsRes.ok) {
    const donorsData = await donorsRes.json();
    donors = donorsData.donors || [];
  } else {
    console.warn('Failed to fetch project donors, using empty array');
  }

  return {
    project: projectData.project,
    totalRaised: projectData.totalRaised,
    donations,
    donors,
  };
}
