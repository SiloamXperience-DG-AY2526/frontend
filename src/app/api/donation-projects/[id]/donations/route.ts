import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { ProjectDonationsResponseSchema } from '@/types/DonationProjectData';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call backend API
    const response = await fetch(
      `${BACKEND_URL}/donation-projects/${id}/donations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.message || 'Failed to fetch project donations',
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Validate backend response with Zod
    const validatedData = ProjectDonationsResponseSchema.parse(data);

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

    console.error('Error fetching project donations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
