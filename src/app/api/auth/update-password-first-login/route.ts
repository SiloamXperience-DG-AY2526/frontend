import { NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const response = await fetch(
      `${BACKEND_URL}/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: body.userId,
          token: body.token,
          newPassword: body.newPassword
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to update password' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {

    console.error('Update password first login error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );

  }
}