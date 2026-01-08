import { ProjectApprovalStatus } from '@/types/ProjectData';


const BACKEND_URL = process.env.BACKEND_URL!;

export const changeProposedProjectStatus = async (
    projectId: string,
    status: ProjectApprovalStatus
) => {

    const response = await fetch(`${BACKEND_URL}/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials : 'include',
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update project status');
    }

    return response.json();
};