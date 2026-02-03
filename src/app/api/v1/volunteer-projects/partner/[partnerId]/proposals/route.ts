import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  const { partnerId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const res = await fetch(
    `${BACKEND_URL}/volunteer-projects/partner/${partnerId}/proposals`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message || 'Failed to fetch proposals' },
      { status: res.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
