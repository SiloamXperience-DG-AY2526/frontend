import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET() {

  const cookie = await cookies();

  const token = cookie.get('access_token')?.value;

  // actual backend fetch profile endpoint
  const res = await fetch(`${BACKEND_URL}/profile/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json(); // user profile

  if (!res.ok) return NextResponse.json( data, { status: res.status });

  return NextResponse.json( data, { status: 200 });
}
