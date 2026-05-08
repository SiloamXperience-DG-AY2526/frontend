import { useState, useEffect, useCallback } from 'react';
import { Donor, DonorDetail } from '@/types/DonorData';

export function useDonors({
  search = '',
  page = 1,
  limit = 20,
}: { search?: string; page?: number; limit?: number } = {}) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/donors/?${params.toString()}`);
      setStatusCode(res.status);

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: 'Failed to fetch donors' }));
        throw new Error(errorData.error || 'Failed to fetch donors');
      }

      const data = await res.json();
      setDonors(data.donors ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  return {
    donors,
    loading,
    error,
    statusCode,
    totalPages,
    refetch: fetchDonors,
  };
}

export function useDonor(id: string) {
  const [donor, setDonor] = useState<DonorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const fetchDonor = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/donors/${id}`);
      setStatusCode(res.status);

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: 'Failed to fetch donor' }));
        throw new Error(errorData.error || 'Failed to fetch donor');
      }

      const data = await res.json();
      setDonor(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDonor();
  }, [fetchDonor]);

  return { donor, loading, error, statusCode, refetch: fetchDonor };
}

export function useSearchFilter(donors: Donor[], searchQuery: string) {
  return donors.filter((donor) =>
    donor.partnerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );
}
