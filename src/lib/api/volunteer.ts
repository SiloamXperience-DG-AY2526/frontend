import {
  FeedbackPayload,
  FeedbackSubmitResponse,
  ProposeVolunteerProjectPayload,
  VolunteerApplicationDTO,
  VolunteerProjectDetailResponse,

} from '@/types/Volunteer';

const API_BASE = process.env.BACKEND_URL;

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

export async function submitVolunteerFeedback(args: {
  userId: string;
  projectId: string;
  payload: FeedbackPayload;
}): Promise<FeedbackSubmitResponse> {
  const res = await fetch(
    `${API_BASE}/volunteer/projects/${args.projectId}/feedback`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: args.userId,
        ...args.payload,
      }),
    }
  );

  const bodyText = await res.json();
  if (!res.ok) throw new Error(`Unable to Submit Feedback ${res.status} - ${bodyText}`);

  return JSON.parse(bodyText) as FeedbackSubmitResponse;
}

export async function fetchVolunteerApplications(args: {
  userId: string;
  status?: string;
}): Promise<VolunteerApplicationDTO[]> {
  const query = args.status ? `?status=${args.status}` : '';

  const res = await fetch(
    `${API_BASE}/volunteer/${args.userId}/volunteer-applications${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    const bodyText = await res.json();
    throw new Error(`Unable to fetch volunteer applications ${res.status} - ${bodyText}`);
  }

  const result = await res.json();
  return result.data as VolunteerApplicationDTO[];
}
export async function proposeVolunteerProject(
  payload: ProposeVolunteerProjectPayload
) {
  const res = await fetch(`${API_BASE}/volunteer/project/proposal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const bodyText = await res.json();
  if (!res.ok) throw new Error(`Unable to submit project proposal ${res.status} - ${bodyText}`);

  return JSON.parse(bodyText);
}
