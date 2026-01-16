import { StaffProfile, PartnerProfile } from '@/types/UserData';

export async function getUserProfile(): Promise<StaffProfile | PartnerProfile> {

  const res = await fetch('/api/me');

  if (!res.ok) throw Error('Failed to fetch user profile.');

  const userProfile = await res.json();

  return userProfile;
}

export async function updateUserProfile( profileData: Partial<PartnerProfile> ): Promise<PartnerProfile> {

  const res = await fetch('/api/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) throw Error('Failed to update user profile.');

  const updatedProfile = await res.json();

  return updatedProfile;
}