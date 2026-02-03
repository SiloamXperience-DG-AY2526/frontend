import { useEffect, useState } from 'react';
import { PartnerSummary } from '@/types/Partner';

export function usePartners() {
  const [partners, setPartners] = useState<PartnerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/partners');
      setStatusCode(res.status);

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: 'Failed to fetch partners' }));
        throw new Error(errorData.error || 'Failed to fetch partners');
      }

      const data = await res.json();
      setPartners(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { partners, loading, error, statusCode, refetch: fetchPartners };
}

export function usePartnerSearchFilter(
  partners: PartnerSummary[],
  searchQuery: string
) {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return partners;
  return partners.filter(
    (partner) =>
      partner.fullName.toLowerCase().includes(q) ||
      partner.email.toLowerCase().includes(q)
  );
}
