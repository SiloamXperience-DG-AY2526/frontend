import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL!;

// Complete onboarding - creates Partner profile
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/auth/onboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  // Update token cookie if onboarding successful (new token with hasOnboarded=true)
  if (res.ok && data?.token) {
    cookieStore.set('access_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });
  }

  return NextResponse.json(data, { status: res.status });
}
