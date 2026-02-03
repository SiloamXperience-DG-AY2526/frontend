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

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/donation-projects/me`, {
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch donation projects' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching donation projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
