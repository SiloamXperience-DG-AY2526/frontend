import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET() {

  const cookie = await cookies();

  const token = cookie.get('access_token')?.value;

  const res = await fetch(`${BACKEND_URL}/profile/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json(); // user profile

  if (!res.ok) return NextResponse.json( data, { status: res.status });

  return NextResponse.json( data, { status: 200 });
}

export async function PATCH( request: Request ) {

  const cookie = await cookies();

  const token = cookie.get('access_token')?.value;

  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/profile/me`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(body),
  });

  const data = await res.json(); // updated profile

  if (!res.ok) return NextResponse.json( data, { status: res.status });

  return NextResponse.json( data, { status: 200 });
}
