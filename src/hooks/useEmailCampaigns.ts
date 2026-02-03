import { useCallback, useEffect, useState } from 'react';
import { EmailCampaignListResponse } from '@/types/EmailCampaign';

export function useEmailCampaigns() {
  const [data, setData] = useState<EmailCampaignListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/email-campaigns');
      setStatusCode(res.status);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to fetch campaigns');
      }
      const json = await res.json();
      setData(json as EmailCampaignListResponse);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { data, loading, error, statusCode, refetch: fetchCampaigns };
}
