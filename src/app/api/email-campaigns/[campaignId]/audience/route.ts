import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const { campaignId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const res = await fetch(`${BACKEND_URL}/email-campaigns/${campaignId}/audience`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(
      { error: data?.message || 'Failed to update audience' },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
