'use client';

import { useState } from 'react';
import FinanceManagerSidebar from '@/components/FinanceManagerSidebar';
import PageHeader from '@/components/ui/PageHeader';
import SearchAndFilterBar from '@/components/ui/SearchAndFilterBar';
import DonorsDataTable from './_components/DonorsDataTable';
import { useDonors, useSearchFilter } from '@/hooks/useDonors';

export default function DonorsPage() {
  const { donors, loading, error } = useDonors();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredDonors = useSearchFilter(donors, searchQuery);

  const handleFilterClick = () => {
    console.log('Filter button clicked - filters to be implemented');
  };

  const handleEditClick = (donorId: string) => {
    console.log(`Edit donor ${donorId} - functionality to be implemented`);
  };

  if (error) {
    alert('Failed to load donors. Please try again.');
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
