import { ProjectApprovalStatus } from '@/types/ProjectData';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

type FeedbackType = 'supervisor' | 'peer' | 'self';

export const changeProposedProjectStatus = async (
    projectId: string,
    status: ProjectApprovalStatus
) => {

    const response = await fetch(`${BACKEND_URL}/volunteer-projects/${projectId}/ApprovalStatus`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update project status');
    }

    return response.json();
};


export const submitPeerFeedback = async (
    payload: {
        feedbackType: FeedbackType;
        reviewer: string;
        reviewee: string;
        score: number;
        strengths: string;
        improvements: string;
        submittedAt: string;
        projectId: string;
    }
) => {
    const response = await fetch(`${BACKEND_URL}/general/peer-feedback`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit feedback');
    }
};
