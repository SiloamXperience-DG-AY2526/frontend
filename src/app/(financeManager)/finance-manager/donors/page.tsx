'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import SearchAndFilterBar from '@/components/ui/SearchAndFilterBar';
import DonorsDataTable from './_components/DonorsDataTable';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import { useDonors } from '@/hooks/useDonors';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

function useDebouncedValue<T>(value: T, delayMs = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function DonorsPage() {
  const router = useRouter();
  const basePath = useManagerBasePath('finance');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 450);
  const { donors, loading, error, statusCode } = useDonors({
    search: debouncedSearch,
  });

  const handleEditClick = (donorId: string) => {
    router.push(`${basePath}/donors/${donorId}/edit`);
  };

  if (statusCode === 403) {
    return <UnauthorizedAccessCard />;
  }

  if (error && statusCode !== 403) {
    return (
      <>
        <PageHeader title="Donors" />
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">
            Failed to load donors. Please try again.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-10 py-8">
        <PageHeader title="Donors" />

        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Partner Name"
        />

        <DonorsDataTable
          donors={donors}
          loading={loading}
          onEditClick={handleEditClick}
        />
      </main>
    </div>
  );
}
