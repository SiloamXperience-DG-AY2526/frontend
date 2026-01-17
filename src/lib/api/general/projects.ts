import { ProjectApprovalStatus } from '@/types/ProjectData';

export type FeedbackType = 'supervisor' | 'peer' | 'self';

// Get all volunteer projects for the current user
export async function getVolunteerProjects() {
  const res = await fetch('/api/v1/volunteer-projects');

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch volunteer projects');
  }

  return res.json();
}

// Change the approval status of a proposed volunteer project
export async function changeProposedProjectStatus(
  projectId: string,
  status: ProjectApprovalStatus
) {
  const res = await fetch(`/api/v1/volunteer-projects/${projectId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update project status');
  }

  return res.json();
}

// Submit peer feedback for a team member
export async function submitPeerFeedback(payload: {
  feedbackType: FeedbackType;
  reviewer: string;
  reviewee: string;
  score: number;
  strengths: string;
  improvements: string;
  submittedAt: string;
  projectId: string;
}) {
  const res = await fetch('/api/v1/volunteer-projects/peer-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to submit feedback');
  }

  return res.json();
}

// get peer feedback for a specific project
export async function getProjectPeerFeedback(projectId: string) {
  const res = await fetch(
    `/api/v1/volunteer-projects/peer-feedback/${projectId}`
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch peer feedback');
  }

  return res.json();
}
