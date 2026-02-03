import {
  EditVolunteerProjectPayload,
  FeedbackPayload,
  FeedbackSubmitResponse,
  ProposeVolunteerProjectPayload,
  VolunteerApplicationDTO,
  VolunteerProjectDetailResponse,

} from '@/types/Volunteer';



export async function getAllVolunteerProjects(
  page: number,
  limit: number,
  search?: string,
  signal?: AbortSignal
) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  if (search?.trim()) qs.set('search', search.trim());

  const res = await fetch(`/api/volunteer/all?${qs.toString()}`, {
    signal,
     credentials: 'include'
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Request failed ${res.status}`);
  return json;
}

export async function getAvailableVolunteerProjects(
  page: number,
  limit: number,
  search?: string,
  signal?: AbortSignal
) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  if (search?.trim()) qs.set('search', search.trim());

  const res = await fetch(`/api/volunteer/available?${qs.toString()}`, {
    signal,
     credentials: 'include'
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Request failed ${res.status}`);
  return json;
}

export async function submitVolunteerApplication(
  projectId: string,
  positionId: string,
  hasConsented: boolean,
  availability: string,
  sessionIds: string[] = []
) {
  const res = await fetch('/api/volunteer/me/submitApplication', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId,
      positionId,
      hasConsented,
      availability,
      sessionIds,
    }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Request failed ${res.status}`);
  return json;
}

export async function getVolunteerProjectDetails(
  projectId: string
): Promise<VolunteerProjectDetailResponse> {
  const res = await fetch(`/api/volunteer/project/${projectId}`, {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message ?? `Failed to fetch project details (${res.status})`);
  }

  return json as VolunteerProjectDetailResponse;
}

export async function getVolunteerApplicationsForProject(projectId: string) {
  const qs = new URLSearchParams({ projectId });
  const res = await fetch(`/api/v1/volunteer-applications?${qs.toString()}`);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? 'Failed to fetch volunteer applications');
  }
  return json;
}

export async function updateVolunteerApplicationStatus(
  matchId: string,
  status: 'reviewing' | 'approved' | 'rejected' | 'active' | 'inactive'
) {
  const res = await fetch(`/api/v1/volunteer-applications/${matchId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      json?.message ?? 'Failed to update volunteer application status'
    );
  }
  return json;
}

export async function fetchMyVolunteerApplications(args?: {
  status?: string;
}): Promise<VolunteerApplicationDTO[]> {
  const qs = new URLSearchParams();
  if (args?.status) qs.set('status', args.status);

  const res = await fetch(`/api/contribution/volunteerApplication${qs.toString() ? `?${qs}` : ''}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message ?? `Unable to fetch applications (${res.status})`);
  }


    return (json?.data ?? []) as VolunteerApplicationDTO[];
}

export async function submitVolunteerFeedback(args: {
  projectId: string;
  payload: FeedbackPayload; 
}): Promise<FeedbackSubmitResponse> {
  const res = await fetch(
    `/api/volunteer/feedback/${args.projectId}`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args.payload), 
    }
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.message ?? `Unable to submit feedback (${res.status})`
    );
  }

  return json as FeedbackSubmitResponse;
}


export async function proposeVolunteerProject(payload: ProposeVolunteerProjectPayload) {
  const res = await fetch('/api/volunteer/project/proposal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Unable to submit proposal (${res.status})`);
  return json;
}

export async function updateVolunteerProposal(
  projectId: string,
  payload: Partial<ProposeVolunteerProjectPayload> & {
    submissionStatus?: 'draft' | 'submitted' | 'withdrawn';
  }
) {
  const res = await fetch(`/api/volunteer/project/proposal/${projectId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? `Unable to update proposal (${res.status})`);
  }
  return json;
}

export async function createVolunteerProject(payload: EditVolunteerProjectPayload) {
  const res = await fetch('/api/volunteer/project/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Failed to create project (${res.status})`);
  return json;
}

export async function updateVolunteerProject(projectId: string, payload: EditVolunteerProjectPayload) {
  const res = await fetch(`/api/volunteer/project/${projectId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? `Failed to edit project (${res.status})`);
  return json;
}
