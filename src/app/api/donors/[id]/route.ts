import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { BackendDonorDetailResponseSchema } from '@/types/DonorData';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET(
  req: Request,
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
    const response = await fetch(`${BACKEND_URL}/donors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
      }

      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch donor details' },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log(
      'Raw donor detail data from backend:',
      JSON.stringify(data, null, 2)
    );

    // Validate backend response with Zod
    const validatedBackendData = BackendDonorDetailResponseSchema.parse(data);

    // Transform backend response to match frontend schema
    const donorDetails = validatedBackendData.donorDetails;
    const user = donorDetails.user;
    const donations = validatedBackendData.donationHistory.donations;

    // Calculate cumulative amount from donations if not provided
    const cumulativeAmount = donorDetails.totalDonations
      ? parseFloat(donorDetails.totalDonations.toString())
      : donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

    const transformedDonor = {
      donorId: donorDetails.id,
      fullName: `${user.firstName} ${user.lastName}`,
      prefixTitle: user.title || '',
      birthday: donorDetails.dob,
      gender: donorDetails.gender || '',
      occupation: donorDetails.occupation || '',
      nationality: donorDetails.nationality || '',
      phoneNumber: `${donorDetails.countryCode || ''} ${
        donorDetails.contactNumber
      }`,
      preferredCommunicationMethod:
        donorDetails.contactModes.map((c) => c.mode).join(', ') ||
        'Not specified',
      donations: donations.map((donation) => ({
        id: donation.id,
        project: donation.project.title,
        amount: parseFloat(donation.amount),
        receipt: donation.receiptStatus,
        date: donation.date,
      })),
      cumulativeAmount,
      projects: user.managedDonationProjects.map((p) => p.title),
      status: donorDetails.isActive ? 'Active' : 'Inactive',
    };

    console.log(
      'Transformed donor:',
      JSON.stringify(transformedDonor, null, 2)
    );

    return NextResponse.json(transformedDonor, { status: 200 });
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

    console.error('Error fetching donor details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
