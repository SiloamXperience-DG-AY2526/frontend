import {
  FeedbackPayload,
  FeedbackSubmitResponse,
  VolunteerApplicationDTO,
  VolunteerProjectDetailResponse,
  VolunteerProjectsResponse,
} from "../../types/Volunteer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAvailableVolunteerProjects(params: {
  page: number;
  limit: number;
  search?: string;
  signal?: AbortSignal;
}): Promise<VolunteerProjectsResponse> {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));
  if (params.search?.trim()) qs.set("search", params.search.trim());

  const res = await fetch(
    `${API_BASE}/api/v1/volunteer/projects/available?${qs.toString()}`,
    {
      signal: params.signal,
    }
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as VolunteerProjectsResponse;
}

export async function getVolunteerProjectDetail(projectId: string) {
  const res = await fetch(
    `${API_BASE}/api/v1/volunteer/projects/${projectId}/details`,
    {
      cache: "no-store",
    }
  );

  return (await res.json()) as VolunteerProjectDetailResponse;
}

export async function submitVolunteerApplication(args: {
  userId: string;
  projectId: string;
  positionId: string;
  sessionId?: string;
}) {
  const res = await fetch(
    `${API_BASE}/api/v1/volunteer/projects/${args.projectId}/application`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: args.userId,
        positionId: args.positionId,
        sessionId: args.sessionId,
      }),
    }
  );

  const bodyText = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${bodyText}`);

  return JSON.parse(bodyText) as any;
}

export async function submitVolunteerFeedback(args: {
  userId: string;
  projectId: string;
  payload: FeedbackPayload;
}): Promise<FeedbackSubmitResponse> {
  const res = await fetch(
    `${API_BASE}/api/v1/volunteer/projects/${args.projectId}/feedback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: args.userId,
        ...args.payload,
      }),
    }
  );

  const bodyText = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${bodyText}`);

  return JSON.parse(bodyText) as FeedbackSubmitResponse;
}

export async function fetchVolunteerApplications(args: {
  userId: string;
  status?: string;
}): Promise<VolunteerApplicationDTO[]> {
  const query = args.status ? `?status=${args.status}` : "";

  const res = await fetch(
    `${API_BASE}/api/v1/volunteer/${args.userId}/volunteer-applications${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`HTTP ${res.status} - ${bodyText}`);
  }

  const result = await res.json();
  return result.data as VolunteerApplicationDTO[];
}
