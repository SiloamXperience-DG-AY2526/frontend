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

export async function fetchMyVolunteerApplications(args?: {
  status?: string;
}): Promise<VolunteerApplicationDTO[]> {
  const qs = new URLSearchParams();
  if (args?.status) qs.set("status", args.status);

  const res = await fetch(`/api/contribution/volunteerApplication${qs.toString() ? `?${qs}` : ""}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
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
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
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

// export async function submitVolunteerFeedback(args: {
//   userId: string;
//   projectId: string;
//   payload: FeedbackPayload;
// }): Promise<FeedbackSubmitResponse> {
//   const res = await fetch(
//     `${API_BASE}/volunteer-projects/${args.projectId}/feedback`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId: args.userId,
//         ...args.payload,
//       }),
//     }
//   );

//   const bodyText = await res.json();
//   if (!res.ok) throw new Error(`Unable to Submit Feedback ${res.status} - ${bodyText}`);

//   return JSON.parse(bodyText) as FeedbackSubmitResponse;
// }


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
