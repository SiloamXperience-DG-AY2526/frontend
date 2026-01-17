import { UserProfile } from '@/types/UserData';

export async function getUserProfile(userId: string): Promise<UserProfile> {

  const res = await fetch(`/api/me/${userId}`, {credentials: 'include'});

  if (!res.ok) throw Error('Failed to fetch user profile.');

  const userProfile = await res.json();

  return userProfile;
}