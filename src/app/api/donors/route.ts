import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { DonorSchema } from '@/types/DonorData';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

// Schema for array of donors
const DonorsArraySchema = z.array(DonorSchema);

export async function GET() {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call backend API
    const response = await fetch(`${BACKEND_URL}/donors`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch donors' },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('Raw donors data from backend:', JSON.stringify(data, null, 2));

    // Transform backend response to match frontend schema
    const transformedDonors = data.donorsWithTotals.map((donor: any) => ({
      donorId: donor.user.id,
      partnerName: `${donor.user.firstName} ${donor.user.lastName}`,
      projects: donor.user.managedDonationProjects || [],
      cumulativeAmount: donor.totalDonations || 0,
      gender: donor.gender,
      contactNumber: donor.contactNumber,
      status: 'Active', // Default status, adjust if backend provides this
    }));

    console.log(
      'Transformed donors:',
      JSON.stringify(transformedDonors, null, 2)
    );

    // Validate response shape with Zod
    const validatedData = DonorsArraySchema.parse(transformedDonors);

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

    console.error('Error fetching donors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
