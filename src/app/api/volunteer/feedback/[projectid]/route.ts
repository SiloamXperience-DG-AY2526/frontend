import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectid: string }> }
) {
  const { projectid } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json(
      { status: 'error', message: 'NO_ACCESS_TOKEN_COOKIE' },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { status: 'error', message: 'INVALID_JSON_BODY' },
      { status: 400 }
    );
  }

  const backendUrl = `${BACKEND_URL}/volunteer-projects/${projectid}/feedbacks`;

  const res = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body), 
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
