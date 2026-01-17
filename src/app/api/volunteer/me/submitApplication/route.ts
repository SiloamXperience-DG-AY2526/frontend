import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json(
      { status: 'error', message: 'Missing token' },
      { status: 401 }
    );
  }

  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/volunteer-applications/me/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) return NextResponse.json(data, { status: res.status });

  return NextResponse.json(data, { status: 201 });
}
