import { useState, useEffect } from 'react';
import { Donor, DonorDetail } from '@/types/DonorData';

export function useDonors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/donors');
      if (!res.ok) throw new Error('Failed to fetch donors');
      const data = await res.json();
      setDonors(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { donors, loading, error, refetch: fetchDonors };
}

export function useDonor(id: string) {
  const [donor, setDonor] = useState<DonorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonor();
  }, [id]);

  const fetchDonor = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/donors/${id}`);
      if (!res.ok) throw new Error('Failed to fetch donor');
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
  };

  return { donor, loading, error, refetch: fetchDonor };
}

export function useSearchFilter(donors: Donor[], searchQuery: string) {
  return donors.filter((donor) =>
    donor.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );
}
