import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { BackendDonorsResponseSchema } from '@/types/DonorData';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET(request: Request) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Forward query params (page, limit, search) to the backend
    const { searchParams } = new URL(request.url);
    const backendParams = new URLSearchParams();
    if (searchParams.has('page'))
      backendParams.set('page', searchParams.get('page')!);
    if (searchParams.has('limit'))
      backendParams.set('limit', searchParams.get('limit')!);
    if (searchParams.has('search'))
      backendParams.set('search', searchParams.get('search')!);

    // Call backend API
    const response = await fetch(
      `${BACKEND_URL}/donors?${backendParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch donors' },
        { status: response.status },
      );
    }

    const data = await response.json();

    console.log('Raw donors data from backend:', JSON.stringify(data, null, 2));

    // Validate backend response with Zod
    const validatedBackendData = BackendDonorsResponseSchema.parse(data);

    // Handle both 'donor' and 'donors' keys from backend
    const donorsList =
      validatedBackendData.donor || validatedBackendData.donors || [];

    // Transform backend response to match frontend schema
    const transformedDonors = donorsList.map((donor) => ({
      donorId: donor.user.id,
      partnerName: `${donor.user.firstName} ${donor.user.lastName}`,
      projects: donor.user.managedDonationProjects.map((p) => p.title),
      cumulativeAmount:
        typeof donor.totalDonations === 'string'
          ? parseFloat(donor.totalDonations)
          : donor.totalDonations || 0,
      gender: donor.gender as 'male' | 'female' | 'others',
      contactNumber: donor.contactNumber,
      status: donor.user.isActive ? ('Active' as const) : ('Inactive' as const),
    }));

    console.log(
      'Transformed donors:',
      JSON.stringify(transformedDonors, null, 2),
    );

    return NextResponse.json(
      {
        donors: transformedDonors,
        pagination: validatedBackendData.pagination,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.message);
      console.error(
        'Validation issues:',
        JSON.stringify(error.issues, null, 2),
      );
      return NextResponse.json(
        {
          error: 'Invalid response format from backend',
          details: error.issues,
        },
        { status: 500 },
      );
    }

    console.error('Error fetching donors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
