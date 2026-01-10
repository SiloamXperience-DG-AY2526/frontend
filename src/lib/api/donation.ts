// API client functions for donation features
// Following the pattern from lib/api/auth.ts and lib/api/user.ts

import { 
  DonationProjectsResponse, 
  DonationProject 
} from '@/types/DonationProject';
import { 
  SubmitDonationApplication, 
  DonationApplication,
  DonationHistoryResponse,
  DonationDetail 
} from '@/types/DonationData';

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
export async function getDonationProjectById(projectId: string): Promise<DonationProject> {
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
export async function getDonationDetail(donationId: string): Promise<DonationDetail> {
  const res = await fetch(`/api/v1/donations/me/${donationId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch donation detail.');
  }

  const data = await res.json();
  return data;
}

// Download donation receipt
export async function downloadDonationReceipt(donationId: string): Promise<Blob> {
  const res = await fetch(`/api/v1/donations/me/${donationId}/receipt`);

  if (!res.ok) {
    throw new Error('Failed to download donation receipt.');
  }

  const blob = await res.blob();
  return blob;
}
