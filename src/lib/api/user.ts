import { StaffProfile, PartnerProfile } from '@/types/UserData';

export async function getUserProfile(): Promise<StaffProfile | PartnerProfile> {

  const res = await fetch('/api/me', {credentials: 'include'});

  if (!res.ok) throw Error('Failed to fetch user profile.');

  const userProfile = await res.json();

  return userProfile;
}