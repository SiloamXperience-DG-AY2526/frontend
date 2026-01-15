import {
  FeedbackPayload,
  FeedbackSubmitResponse,
  ProposeVolunteerProjectPayload,
  SubmitVolunteerApplicationResult,
  VolunteerApplicationDTO,
  VolunteerProjectDetailResponse,
  VolunteerProjectsResponse,
} from '../../types/Volunteer';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAvailableVolunteerProjects(
  page: number,
  limit: number,
  search?: string,
  signal?: AbortSignal
): Promise<VolunteerProjectsResponse> {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  if (search?.trim()) qs.set('search', search.trim());

  const res = await fetch(
    `${API_BASE}/volunteer/projects/available?${qs.toString()}`,
    { signal }
  );

  if (!res.ok)
    throw new Error(
      `Unable to retrieve available volunteer projects ${res.status}`
    );
  return (await res.json()) as VolunteerProjectsResponse;
}

export async function getVolunteerProjectDetails(projectId: string) {
  const res = await fetch(
    `${API_BASE}/volunteer/projects/${projectId}/details`,
    {
      cache: 'no-store',
    }
  );

  return (await res.json()) as VolunteerProjectDetailResponse;
}

export async function submitVolunteerApplication(
  userId: string,
  projectId: string,
  positionId: string,
  sessionId?: string
): Promise<SubmitVolunteerApplicationResult> {
  const res = await fetch(
    `${API_BASE}/volunteer/projects/${projectId}/application`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        positionId,
        sessionId,
      }),
    }
  );

  const bodyText = await res.text();
  if (!res.ok) {
    throw new Error(
      `Unable to submit volunteer interest ${res.status} - ${bodyText}`
    );
  }

  return JSON.parse(bodyText) as SubmitVolunteerApplicationResult;
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
