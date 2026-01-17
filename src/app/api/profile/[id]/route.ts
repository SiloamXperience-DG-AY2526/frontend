import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  
  // If we want to check for authentication:
  /*
  if (!token) {
    return NextResponse.json(
      { errMsg: 'Missing access token.' },
      { status: 401 }
    );
  }
  */

  const res = await fetch(`${BACKEND_URL}/profile/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) return NextResponse.json(data, { status: res.status });

  return NextResponse.json(data, { status: 200 });
}


