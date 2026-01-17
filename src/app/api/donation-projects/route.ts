import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { DonationProjectsResponseSchema } from '@/types/DonationProjectData';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET() {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call backend API
    const response = await fetch(`${BACKEND_URL}/donation-projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch donation-projects' },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log(
      'Raw donation project data from backend:',
      JSON.stringify(data, null, 2)
    );

    // Validate backend response with Zod
    const validatedData = DonationProjectsResponseSchema.parse(data);

    return NextResponse.json(validatedData, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.message);
      console.error(
        'Validation issues:',
        JSON.stringify(error.issues, null, 2)
      );
      return NextResponse.json(
        {
          error: 'Invalid response format from backend',
          details: error.issues,
        },
        { status: 500 }
      );
    }

    console.error('Error fetching donation projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
