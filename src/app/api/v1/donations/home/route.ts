import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Include auth token if available (for authenticated stats)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/donations/home`, {
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Backend error:', res.status, data);
      return NextResponse.json(
        { error: 'Failed to fetch donation homepage', details: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching donation homepage:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
