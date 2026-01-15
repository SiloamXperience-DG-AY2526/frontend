'use client';

import { useState } from 'react';
import FinanceManagerSidebar from '@/components/FinanceManagerSidebar';
import PageHeader from '@/components/ui/PageHeader';
import SearchAndFilterBar from '@/components/ui/SearchAndFilterBar';
import DonorsDataTable from './_components/DonorsDataTable';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import { useDonors, useSearchFilter } from '@/hooks/useDonors';

export default function DonorsPage() {
  const { donors, loading, error, statusCode } = useDonors();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredDonors = useSearchFilter(donors, searchQuery);

  const handleFilterClick = () => {
    console.log('Filter button clicked - filters to be implemented');
  };

  const handleEditClick = (donorId: string) => {
    console.log(`Edit donor ${donorId} - functionality to be implemented`);
  };

  if (statusCode === 403) {
    return <UnauthorizedAccessCard />;
  }

  if (error && statusCode !== 403) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <FinanceManagerSidebar />
        <main className="flex-1 px-10 py-8">
          <PageHeader title="Donors" />
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">
              Failed to load donors. Please try again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FinanceManagerSidebar />

      <main className="flex-1 px-10 py-8">
        <PageHeader title="Donors" />

        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleFilterClick}
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
