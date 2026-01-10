import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/AuthData';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) { 
    return NextResponse.json(
      { user: null, role: null, errMsg: 'Missing access token.' }, 
      { status: 401 },
    );
  }

  const payload = jwtDecode<JwtPayload>(token);

  // check token expiry
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    return NextResponse.json(
      { userId: null, role: null, errMsg: 'User session expired.' }, 
      { status: 401 }
    );
  }

  return NextResponse.json(
    { userId: payload.userId, role: payload.role },
    { status: 200 }
  );
}
