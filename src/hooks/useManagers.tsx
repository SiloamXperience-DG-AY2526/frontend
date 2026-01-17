import { useEffect, useState } from 'react';
import { Manager } from '@/types/Managers';

export function useManagers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/managers/');
      setStatusCode(res.status);

      if (!res.ok) throw new Error('Failed to fetch managers');

      const data = await res.json();
      setManagers(data);
      setError(null);
    } catch (e) {
      setError('Failed to load managers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return { managers, loading, error, statusCode, refetch: fetchManagers };
}

export function useSearchFilter(managers: Manager[], searchQuery: string) {
  return managers.filter((managers) =>
    managers.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}
