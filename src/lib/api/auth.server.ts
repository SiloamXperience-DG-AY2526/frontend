import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/AuthData';

export async function getUserCredentialsServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) { 
    return { userId: null, role: null };
  }

  const payload = jwtDecode<JwtPayload>(token);

  // check token expiry
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    return { userId: null, role: null };
  }

  return { userId: payload.userId, role: payload.role };
}
