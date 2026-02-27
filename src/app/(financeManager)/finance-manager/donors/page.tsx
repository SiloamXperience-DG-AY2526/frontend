'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import SearchAndFilterBar from '@/components/ui/SearchAndFilterBar';
import DonorsDataTable from './_components/DonorsDataTable';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import { useDonors, useSearchFilter } from '@/hooks/useDonors';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

export default function DonorsPage() {
  const router = useRouter();
  const basePath = useManagerBasePath('finance');
  const { donors, loading, error, statusCode } = useDonors();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredDonors = useSearchFilter(donors, searchQuery);

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
          donors={filteredDonors}
          loading={loading}
          onEditClick={handleEditClick}
        />
      </main>
    </div>
  );
}
