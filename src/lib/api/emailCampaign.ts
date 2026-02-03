import {
  EmailCampaignDetail,
  EmailCampaignListResponse,
  EmailCampaignSummary,
} from '@/types/EmailCampaign';

export async function listEmailCampaigns(args?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<EmailCampaignListResponse> {
  const qs = new URLSearchParams();
  if (args?.page) qs.set('page', String(args.page));
  if (args?.limit) qs.set('limit', String(args.limit));
  if (args?.status) qs.set('status', args.status);

  const res = await fetch(`/api/email-campaigns${qs.toString() ? `?${qs}` : ''}`);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to fetch campaigns');
  }
  return json as EmailCampaignListResponse;
}

export async function createEmailCampaign(payload: {
  name: string;
  senderAddress: string;
}): Promise<EmailCampaignSummary> {
  const res = await fetch('/api/email-campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to create campaign');
  }
  return json as EmailCampaignSummary;
}

export async function getEmailCampaign(campaignId: string) {
  const res = await fetch(`/api/email-campaigns/${campaignId}`);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to fetch campaign');
  }
  return json as EmailCampaignDetail;
}

export async function updateAudience(
  campaignId: string,
  payload: Record<string, unknown>
) {
  const res = await fetch(`/api/email-campaigns/${campaignId}/audience`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to update audience');
  }
  return json;
}

export async function updateDelivery(
  campaignId: string,
  payload: Record<string, unknown>
) {
  const res = await fetch(`/api/email-campaigns/${campaignId}/delivery`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to update delivery');
  }
  return json;
}

export async function updateContent(
  campaignId: string,
  payload: Record<string, unknown>
) {
  const res = await fetch(`/api/email-campaigns/${campaignId}/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to update content');
  }
  return json;
}

export async function previewAudience(campaignId: string) {
  const res = await fetch(`/api/email-campaigns/${campaignId}/preview`);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to preview audience');
  }
  return json as { audienceCount: number; emails: string[] };
}

export async function sendTestEmail(campaignId: string, email: string) {
  const res = await fetch(`/api/email-campaigns/${campaignId}/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to send test email');
  }
  return json;
}

export async function publishCampaign(campaignId: string) {
  const res = await fetch(`/api/email-campaigns/${campaignId}/publish`, {
    method: 'POST',
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to publish campaign');
  }
  return json;
}

export async function deleteCampaign(campaignId: string) {
  const res = await fetch(`/api/email-campaigns/${campaignId}`, {
    method: 'DELETE',
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? 'Failed to delete campaign');
  }
  return json;
}
