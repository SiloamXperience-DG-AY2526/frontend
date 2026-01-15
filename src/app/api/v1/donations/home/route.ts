import { NextResponse } from 'next/server';

export async function GET() {
  // Mock homepage statistics
  return NextResponse.json({
    totalBeneficiaries: 1250,
    totalFundsRaised: 547500,
    totalDonors: 1623,
    totalProjects: 6,
    featuredProjects: [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Emergency Relief Fund',
        currentFund: 25000,
        targetFund: 50000,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Children Education Fund',
        currentFund: 45000,
        targetFund: 100000,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Senior Care Program',
        currentFund: 130000,
        targetFund: null,
      },
    ],
  });
}
