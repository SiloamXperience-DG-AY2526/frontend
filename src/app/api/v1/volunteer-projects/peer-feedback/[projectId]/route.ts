import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  // Comment out real API call for now
  /*
  try {
    const { projectId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/volunteer-projects/${projectId}/feedback`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch peer feedback' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching peer feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
  */

  // Return sample data matching Prisma schema
  const { projectId } = await params;

  const sampleFeedback = [
    {
      id: 'fb-uuid-001',
      reviewerId: 'user-uuid-001',
      revieweeId: 'user-uuid-002',
      projectId: projectId,
      reviewer: {
        id: 'user-uuid-001',
        email: 'alice.johnson@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        title: 'Ms.',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      reviewee: {
        id: 'user-uuid-002',
        email: 'bob.smith@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        title: 'Mr.',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
      },
      project: {
        id: projectId,
        name: 'Community Garden Initiative',
        description: 'A project to create community gardens in urban areas',
        startDate: '2025-11-18T00:00:00Z',
        endDate: '2025-12-19T00:00:00Z',
        location: 'Downtown Community Center',
        organisingTeam: 'Green Volunteers',
        approvalStatus: 'approved',
        createdAt: '2024-11-01T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
      },
      score: 5,
      type: 'peer',
      strengths: 'Excellent communication skills and great team player. Always willing to help others and takes initiative on tasks.',
      improvements: 'Could improve time management during peak project hours. Sometimes takes on too many tasks at once.',
      tags: [
        {
          id: 'tag-001',
          name: 'Communication',
          feedbackId: 'fb-uuid-001',
          createdAt: '2025-01-10T14:30:00Z',
        },
        {
          id: 'tag-002',
          name: 'Teamwork',
          feedbackId: 'fb-uuid-001',
          createdAt: '2025-01-10T14:30:00Z',
        },
      ],
      createdAt: '2025-01-10T14:30:00Z',
      updatedAt: '2025-01-10T14:30:00Z',
    },
    {
      id: 'fb-uuid-002',
      reviewerId: 'user-uuid-003',
      revieweeId: 'user-uuid-002',
      projectId: projectId,
      reviewer: {
        id: 'user-uuid-003',
        email: 'charlie.davis@example.com',
        firstName: 'Charlie',
        lastName: 'Davis',
        title: 'Mr.',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
      },
      reviewee: {
        id: 'user-uuid-002',
        email: 'bob.smith@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        title: 'Mr.',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
      },
      project: {
        id: projectId,
        name: 'Community Garden Initiative',
        description: 'A project to create community gardens in urban areas',
        startDate: '2025-11-18T00:00:00Z',
        endDate: '2025-12-19T00:00:00Z',
        location: 'Downtown Community Center',
        organisingTeam: 'Green Volunteers',
        approvalStatus: 'approved',
        createdAt: '2024-11-01T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
      },
      score: 5,
      type: 'peer',
      strengths: 'Outstanding problem-solving abilities. Very reliable and consistent in delivering quality work.',
      improvements: 'Would benefit from delegating more tasks to other team members instead of doing everything alone.',
      tags: [
        {
          id: 'tag-003',
          name: 'Problem Solving',
          feedbackId: 'fb-uuid-002',
          createdAt: '2025-01-11T09:15:00Z',
        },
        {
          id: 'tag-004',
          name: 'Reliability',
          feedbackId: 'fb-uuid-002',
          createdAt: '2025-01-11T09:15:00Z',
        },
      ],
      createdAt: '2025-01-11T09:15:00Z',
      updatedAt: '2025-01-11T09:15:00Z',
    },
    {
      id: 'fb-uuid-003',
      reviewerId: 'supervisor-uuid-001',
      revieweeId: 'user-uuid-002',
      projectId: projectId,
      reviewer: {
        id: 'supervisor-uuid-001',
        email: 'diana.martinez@example.com',
        firstName: 'Diana',
        lastName: 'Martinez',
        title: 'Dr.',
        createdAt: '2023-12-01T10:00:00Z',
        updatedAt: '2023-12-01T10:00:00Z',
      },
      reviewee: {
        id: 'user-uuid-002',
        email: 'bob.smith@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        title: 'Mr.',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
      },
      project: {
        id: projectId,
        name: 'Community Garden Initiative',
        description: 'A project to create community gardens in urban areas',
        startDate: '2025-11-18T00:00:00Z',
        endDate: '2025-12-19T00:00:00Z',
        location: 'Downtown Community Center',
        organisingTeam: 'Green Volunteers',
        approvalStatus: 'approved',
        createdAt: '2024-11-01T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
      },
      score: 5,
      type: 'supervisor',
      strengths: 'Shows strong leadership qualities and excellent project coordination. Always meets deadlines and maintains high standards.',
      improvements: 'Could work on providing more detailed progress updates during team meetings.',
      tags: [
        {
          id: 'tag-005',
          name: 'Leadership',
          feedbackId: 'fb-uuid-003',
          createdAt: '2025-01-12T16:45:00Z',
        },
        {
          id: 'tag-006',
          name: 'Organization',
          feedbackId: 'fb-uuid-003',
          createdAt: '2025-01-12T16:45:00Z',
        },
      ],
      createdAt: '2025-01-12T16:45:00Z',
      updatedAt: '2025-01-12T16:45:00Z',
    },
    {
      id: 'fb-uuid-004',
      reviewerId: 'user-uuid-002',
      revieweeId: 'user-uuid-002',
      projectId: projectId,
      reviewer: {
        id: 'user-uuid-002',
        email: 'bob.smith@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        title: 'Mr.',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
      },
      reviewee: {
        id: 'user-uuid-002',
        email: 'bob.smith@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        title: 'Mr.',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
      },
      project: {
        id: projectId,
        name: 'Community Garden Initiative',
        description: 'A project to create community gardens in urban areas',
        startDate: '2025-11-18T00:00:00Z',
        endDate: '2025-12-19T00:00:00Z',
        location: 'Downtown Community Center',
        organisingTeam: 'Green Volunteers',
        approvalStatus: 'approved',
        createdAt: '2024-11-01T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
      },
      score: 4,
      type: 'self',
      strengths: 'I feel confident in my ability to coordinate tasks and communicate with team members effectively.',
      improvements: 'I need to work on better work-life balance and not overcommitting to too many responsibilities at once.',
      tags: [
        {
          id: 'tag-007',
          name: 'Self-Awareness',
          feedbackId: 'fb-uuid-004',
          createdAt: '2025-01-13T10:00:00Z',
        },
      ],
      createdAt: '2025-01-13T10:00:00Z',
      updatedAt: '2025-01-13T10:00:00Z',
    },
    {
      id: 'fb-uuid-005',
      reviewerId: 'user-uuid-004',
      revieweeId: 'user-uuid-001',
      projectId: projectId,
      reviewer: {
        id: 'user-uuid-004',
        email: 'eve.wilson@example.com',
        firstName: 'Eve',
        lastName: 'Wilson',
        title: 'Ms.',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-01T10:00:00Z',
      },
      reviewee: {
        id: 'user-uuid-001',
        email: 'alice.johnson@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        title: 'Ms.',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      project: {
        id: projectId,
        name: 'Community Garden Initiative',
        description: 'A project to create community gardens in urban areas',
        startDate: '2025-11-18T00:00:00Z',
        endDate: '2025-12-19T00:00:00Z',
        location: 'Downtown Community Center',
        organisingTeam: 'Green Volunteers',
        approvalStatus: 'approved',
        createdAt: '2024-11-01T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
      },
      score: 5,
      type: 'peer',
      strengths: 'Great attention to detail and very organized. Creates clear documentation for all processes.',
      improvements: 'Sometimes hesitant to speak up in group discussions. Could be more assertive with ideas.',
      tags: [
        {
          id: 'tag-008',
          name: 'Attention to Detail',
          feedbackId: 'fb-uuid-005',
          createdAt: '2025-01-14T13:20:00Z',
        },
        {
          id: 'tag-009',
          name: 'Documentation',
          feedbackId: 'fb-uuid-005',
          createdAt: '2025-01-14T13:20:00Z',
        },
      ],
      createdAt: '2025-01-14T13:20:00Z',
      updatedAt: '2025-01-14T13:20:00Z',
    },
  ];

  return NextResponse.json(sampleFeedback, { status: 200 });
}