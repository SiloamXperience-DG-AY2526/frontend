import { NextResponse } from 'next/server';
import { Donor } from '@/types/DonorData';

// Mock donor data - replace with actual backend call later
const mockDonors: Donor[] = [
  {
    donorId: '1',
    partnerName: 'Tan Chen Yi',
    projects: ['Project Recycle', 'Project Health'],
    cumulativeAmount: 100,
    gender: 'Female',
    contactNumber: '91111111',
    status: 'Active',
  },
  {
    donorId: '2',
    partnerName: 'Tan Siew Mei',
    projects: ['Project Recycle', 'Project Health'],
    cumulativeAmount: 100,
    gender: 'Female',
    contactNumber: '91111111',
    status: 'Inactive',
  },
  {
    donorId: '3',
    partnerName: 'Tan Siew Mei',
    projects: ['Project Recycle'],
    cumulativeAmount: 100,
    gender: 'Female',
    contactNumber: '91111111',
    status: 'Active',
  },
  {
    donorId: '4',
    partnerName: 'Tan Siew Mei',
    projects: ['Project Recycle'],
    cumulativeAmount: 100,
    gender: 'Female',
    contactNumber: '91111111',
    status: 'Active',
  },
  {
    donorId: '5',
    partnerName: 'Tan Siew Mei',
    projects: ['Project Recycle', 'Project Health'],
    cumulativeAmount: 100,
    gender: 'Female',
    contactNumber: '91111111',
    status: 'Active',
  },
  {
    donorId: '6',
    partnerName: 'Tan Siew Mei',
    projects: ['Project Health'],
    cumulativeAmount: 100,
    gender: 'Female',
    contactNumber: '91111111',
    status: 'Active',
  },
  {
    donorId: '7',
    partnerName: 'Tan Siew Mei',
    projects: ['Project Health'],
    cumulativeAmount: 100,
    gender: 'Female',
    contactNumber: '91111111',
    status: 'Active',
  },
];

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(mockDonors, { status: 200 });
}
