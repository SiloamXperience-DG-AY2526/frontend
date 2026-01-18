'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SearchAndFilterBar from '@/components/ui/SearchAndFilterBar';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import PartnersDataTable from './_components/PartnersDataTable';
import { usePartners, usePartnerSearchFilter } from '@/hooks/usePartners';

export default function PartnersPage() {
  const { partners, loading, error, statusCode } = usePartners();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredPartners = usePartnerSearchFilter(partners, searchQuery);

  const handleFilterClick = () => {
    console.log('Filter button clicked - filters to be implemented');
  };

  if (statusCode === 403) {
    return <UnauthorizedAccessCard />;
  }

  if (error && statusCode !== 403) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-10 py-8">
          <PageHeader title="Partners" />
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">
              Failed to load partners. Please try again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-10 py-8">
        <PageHeader title="Partners" />

        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleFilterClick}
          searchPlaceholder="Partner Name"
        />

        <PartnersDataTable partners={filteredPartners} loading={loading} />
      </main>
    </div>
  );
}
