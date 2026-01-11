import { NextResponse } from 'next/server';
import { DonorDetail } from '@/types/DonorData';

// Mock data for donor details
const mockDonorDetails: Record<string, DonorDetail> = {
  '1': {
    donorId: '1',
    fullName: 'Alex Tan',
    prefixTitle: 'Mr',
    birthday: '13/03/1998',
    gender: 'Male',
    occupation: 'Marketing Executive',
    nationality: 'Singaporean',
    phoneNumber: '91234567',
    preferredCommunicationMethod: 'Email',
    cumulativeAmount: 5650,
    projects: ['Education Support Fund', 'Food Distribution Drive'],
    status: 'Active',
    donations: [
      {
        id: '1',
        project: 'Education Support Fund',
        amount: 150,
        receipt: 'Pending',
        date: '2024-01-15',
      },
      {
        id: '2',
        project: 'Food Distribution Drive',
        amount: 100,
        receipt: 'Issued',
        date: '2024-02-10',
      },
      {
        id: '3',
        project: 'Food Distribution Drive',
        amount: 100,
        receipt: 'Issued',
        date: '2024-03-05',
      },
      {
        id: '4',
        project: 'Food Distribution Drive',
        amount: 100,
        receipt: 'Issued',
        date: '2024-04-20',
      },
      {
        id: '5',
        project: 'Food Distribution Drive',
        amount: 100,
        receipt: 'Issued',
        date: '2024-05-15',
      },
      {
        id: '6',
        project: 'Food Distribution Drive',
        amount: 100,
        receipt: 'Issued',
        date: '2024-06-12',
      },
    ],
  },
  '2': {
    donorId: '2',
    fullName: 'Sarah Johnson',
    prefixTitle: 'Ms',
    birthday: '22/07/1985',
    gender: 'Female',
    occupation: 'Software Engineer',
    nationality: 'American',
    phoneNumber: '98765432',
    preferredCommunicationMethod: 'Phone',
    cumulativeAmount: 3200,
    projects: ['Healthcare Initiative', 'Community Center'],
    status: 'Active',
    donations: [
      {
        id: '7',
        project: 'Healthcare Initiative',
        amount: 500,
        receipt: 'Issued',
        date: '2024-01-10',
      },
      {
        id: '8',
        project: 'Community Center',
        amount: 300,
        receipt: 'Issued',
        date: '2024-03-15',
      },
    ],
  },
  '3': {
    donorId: '3',
    fullName: 'Michael Chen',
    prefixTitle: 'Mr',
    birthday: '05/11/1992',
    gender: 'Male',
    occupation: 'Doctor',
    nationality: 'Malaysian',
    phoneNumber: '87654321',
    preferredCommunicationMethod: 'Email',
    cumulativeAmount: 8000,
    projects: ['Healthcare Initiative', 'Education Support Fund'],
    status: 'Active',
    donations: [
      {
        id: '9',
        project: 'Healthcare Initiative',
        amount: 1000,
        receipt: 'Issued',
        date: '2024-01-05',
      },
      {
        id: '10',
        project: 'Education Support Fund',
        amount: 500,
        receipt: 'Issued',
        date: '2024-02-20',
      },
    ],
  },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const donor = mockDonorDetails[id];

  if (!donor) {
    return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
  }

  return NextResponse.json(donor, { status: 200 });
}
