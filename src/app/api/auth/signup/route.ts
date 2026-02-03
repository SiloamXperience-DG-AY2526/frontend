import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL!;

// Basic signup - creates User only
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  // Set token cookie if signup successful
  if (res.ok && data?.token) {
    const cookieStore = await cookies();
    cookieStore.set('access_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });
  }

  return NextResponse.json(data, { status: res.status });
}
