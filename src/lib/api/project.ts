import { ProjectApprovalStatus } from '@/types/ProjectData';

export async function getMyProposedProjects() {
  const res = await fetch('/api/volunteer/project/proposal/me', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Request failed ${res.status}`);
  return json;
}

export async function changeProposedProjectStatus(
  projectId: string,
  approvalStatus: ProjectApprovalStatus
) {
  const res = await fetch(
    `/api/volunteer/project/proposal/me/status/${projectId}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalStatus }),
    }
  );

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Request failed ${res.status}`);
  return json;
}