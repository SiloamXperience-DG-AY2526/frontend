import { useState, useEffect } from 'react';
import { Donor } from '@/types/DonorData';

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

export function useSearchFilter(donors: Donor[], searchQuery: string) {
  return donors.filter((donor) =>
    donor.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );
}
