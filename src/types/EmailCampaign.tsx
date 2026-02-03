export type EmailCampaignStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled';

export type EmailCampaignSummary = {
  id: string;
  name: string;
  status: EmailCampaignStatus;
  createdAt: string;
  scheduledAt?: string | null;
};

export type EmailAudienceFilter = {
  projectId?: string | null;
  isActivePartner?: boolean | null;
  gender?: 'male' | 'female' | 'others' | null;
  nationality?: string | null;
  minAge?: number | null;
  maxAge?: number | null;
  volunteerInterests?: string[] | null;
  volunteerSkills?: string[] | null;
  languages?: string[] | null;
};

export type EmailCampaignDetail = {
  id: string;
  name: string;
  senderAddress: string;
  subject?: string | null;
  previewText?: string | null;
  body?: string | null;
  status: EmailCampaignStatus;
  scheduledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  audienceFilter?: EmailAudienceFilter | null;
};

export type EmailCampaignListResponse = {
  campaigns: EmailCampaignSummary[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};
