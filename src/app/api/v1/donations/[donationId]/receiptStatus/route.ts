import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ donationId: string }> },
) {
  try {
    const { donationId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const body = await request.json();

    const res = await fetch(
      `${BACKEND_URL}/donations/${donationId}/receiptStatus`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.message || 'Failed to update donation receipt status' },
        { status: res.status },
      );
    }

    if (!res.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Expected JSON response from server' },
        { status: 502 },
      );
    }

    const responseBody = await res.text();
    let data;
    try {
      data = responseBody ? JSON.parse(responseBody) : {};
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON response from server' },
        { status: 502 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating donation receipt status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
