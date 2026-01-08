import { UserProfile } from '@/types/UserData';

export async function getUserProfile(userId: string): Promise<UserProfile> {

  console.log(userId);
  const res = await fetch(`api/me/${userId}`);

  if (!res.ok) throw Error('Failed to fetch user profile.');

  const userProfile = await res.json();

  return userProfile;
}