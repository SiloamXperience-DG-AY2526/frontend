import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();

  const res = await fetch(`${BACKEND_URL}/email-campaigns/all${qs ? `?${qs}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message || 'Failed to fetch campaigns' },
      { status: res.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  const res = await fetch(`${BACKEND_URL}/email-campaigns`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message || 'Failed to create campaign' },
      { status: res.status }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
