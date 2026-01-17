import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { BackendManagersResponseSchema } from '@/types/Managers';

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
    const response = await fetch(`${BACKEND_URL}/staff`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch managers' },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('Raw managers data from backend:', JSON.stringify(data, null, 2));

    // Validate backend response with Zod
    const validatedBackendData = BackendManagersResponseSchema.parse(data);

    // Transform backend response to match frontend schema
    const transformedManagers = validatedBackendData.data.map(
      (manager) => ({
        id: manager.id,
        name: `${manager.firstName} ${manager.lastName}`,
        projects: manager.managedProjects || [],
        role: manager.role,
        email: manager.email,
        status: manager.isActive
      })
    );

    console.log(
      'Transformed managers:',
      JSON.stringify(transformedManagers, null, 2)
    );

    return NextResponse.json(transformedManagers, { status: 200 });
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

    console.error('Error fetching manager:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
