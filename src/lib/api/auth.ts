import { AuthUser, LoginInputData, UserCredentials } from '@/types/AuthData';
import { getUserProfile } from './user';

// DO NOT CALL THESE FUNCTIONS
// functions reserved for auth context 

// use route handlers for server-side calls
export async function login( loginData: LoginInputData ): Promise<AuthUser> {
  
  const res = await fetch('/api/auth/login', { // auth token set here
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) {
    throw new Error('Invalid email or password.');
  }

  const authUser = getAuthUser();

  return authUser;
}

export async function logout() {
  await fetch('/api/auth/logout'); // cookie reset
}

// retrieves data from jwt token
export async function getUserCredentials(): Promise<UserCredentials> {

  const res = await fetch('/api/auth/user');

  if (!res.ok) {
    const body = await res.json();
    throw Error(body.errMsg);
  }
  
  const { userId, role } = await res.json();

  return { userId: userId, role: role };
}

export async function getAuthUser(): Promise<AuthUser> {

  // only userId and role
  const userInfo = await getUserCredentials();

  console.log('userInfo:', userInfo);

  const { firstName, lastName, email } = await getUserProfile(userInfo.userId);

  return {
    userId: userInfo.userId,
    role: userInfo.role,
    firstName,
    lastName,
    email,
  };
}

