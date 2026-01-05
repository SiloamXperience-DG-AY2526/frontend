import {
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
