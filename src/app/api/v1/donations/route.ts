import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mock successful donation submission
    const mockDonation = {
      id: `donation-${Date.now()}`,
      ...body,
      submissionStatus: 'submitted',
      receiptStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(mockDonation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}
