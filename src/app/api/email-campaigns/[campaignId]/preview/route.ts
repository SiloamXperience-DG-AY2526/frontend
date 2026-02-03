import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const { campaignId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/email-campaigns/${campaignId}/preview`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message || 'Failed to preview audience' },
      { status: res.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
