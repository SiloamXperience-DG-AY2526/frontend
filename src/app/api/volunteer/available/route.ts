import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;


export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json(
      { status: 'error', message: 'NO_ACCESS_TOKEN_COOKIE' },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const qs = url.searchParams.toString();

  const backendUrl = `${BACKEND_URL}/volunteer-projects/available${qs ? `?${qs}` : ''}`;

  const res = await fetch(backendUrl, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
