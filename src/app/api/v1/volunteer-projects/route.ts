import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET() {
    // Comment out real API call for now
    /*
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('access_token')?.value;
  
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
  
      const response = await fetch(`${BACKEND_URL}/volunteer-projects/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.message || 'Failed to fetch volunteer projects' },
          { status: response.status }
        );
      }
  
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error('Error fetching volunteer projects:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
    */

    // Return sample data for testing
    const sampleData = [
        {
            id: '1',
            name: 'Community Garden Initiative',
            startDate: '2025-11-18',
            endDate: '2025-12-19',
            location: 'Downtown Community Center',
            organisingTeam: 'Green Volunteers',
            initiatorName: 'John Smith',
            approvalStatus: 'pending',
        },
        {
            id: '2',
            name: 'Food Bank Drive',
            startDate: '2025-11-18',
            endDate: '2025-12-19',
            location: 'Central Food Hub',
            organisingTeam: 'Care Collective',
            initiatorName: 'Jane Doe',
            approvalStatus: 'reviewing',
        },
        {
            id: '3',
            name: 'Beach Cleanup Project',
            startDate: '2025-11-18',
            endDate: '2025-12-19',
            location: 'Sunset Beach',
            organisingTeam: 'Ocean Warriors',
            initiatorName: 'Mike Johnson',
            approvalStatus: 'approved',
        },
        {
            id: '4',
            name: 'Youth Mentorship Program',
            startDate: '2025-12-01',
            endDate: '2026-01-15',
            location: 'Community Youth Center',
            organisingTeam: 'Future Leaders',
            initiatorName: 'Sarah Williams',
            approvalStatus: 'pending',
        },
        {
            id: '5',
            name: 'Senior Care Support',
            startDate: '2025-11-25',
            endDate: '2025-12-25',
            location: 'Sunshine Senior Home',
            organisingTeam: 'Caring Hearts',
            initiatorName: 'David Brown',
            approvalStatus: 'rejected',
        },
    ];

    return NextResponse.json(sampleData, { status: 200 });
}