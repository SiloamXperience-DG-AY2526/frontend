import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(req: Request) {
  const body = await req.json();

  // actual backend login endpoint
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) return NextResponse.json({ status: 401 });

  const response = NextResponse.json({ status: 200 });

  // set auth token cookie
  response.cookies.set('access_token', data.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return response;
}
