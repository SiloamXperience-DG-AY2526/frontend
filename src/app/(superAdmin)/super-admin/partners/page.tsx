'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SearchAndFilterBar from '@/components/ui/SearchAndFilterBar';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import PartnersDataTable from '@/app/(generalManager)/general-manager/partners/_components/PartnersDataTable';
import DonorsDataTable from '@/app/(financeManager)/finance-manager/donors/_components/DonorsDataTable';
import { usePartners, usePartnerSearchFilter } from '@/hooks/usePartners';
import { useDonors, useSearchFilter } from '@/hooks/useDonors';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';
import { useRouter } from 'next/navigation';

type TabKey = 'volunteers' | 'donors';

export default function SuperAdminPartnersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('volunteers');
  const [searchQuery, setSearchQuery] = useState('');
  const { partners, loading: partnersLoading, error: partnersError, statusCode: partnersStatus } =
    usePartners();
  const { donors, loading: donorsLoading, error: donorsError, statusCode: donorsStatus } =
    useDonors();
  const basePath = useManagerBasePath('general');
  const router = useRouter();

  const filteredPartners = usePartnerSearchFilter(partners, searchQuery);
  const filteredDonors = useSearchFilter(donors, searchQuery);

  const isUnauthorized = useMemo(
    () => partnersStatus === 403 || donorsStatus === 403,
    [partnersStatus, donorsStatus]
  );

  const handleFilterClick = () => {
    console.log('Filter button clicked - filters to be implemented');
  };

  if (isUnauthorized) {
    return <UnauthorizedAccessCard />;
  }

  if ((partnersError && partnersStatus !== 403) || (donorsError && donorsStatus !== 403)) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-10 py-8">
          <PageHeader title="Partners" />
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">
              Failed to load partner data. Please try again.
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

        <div className="mt-6 mb-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('volunteers')}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              activeTab === 'volunteers'
                ? 'bg-[#0E5A4A] text-white border-[#0E5A4A]'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Volunteers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('donors')}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              activeTab === 'donors'
                ? 'bg-[#0E5A4A] text-white border-[#0E5A4A]'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Donors
          </button>
        </div>

        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleFilterClick}
          searchPlaceholder={activeTab === 'donors' ? 'Donor Name' : 'Partner Name'}
        />

        {activeTab === 'volunteers' ? (
          <PartnersDataTable partners={filteredPartners} loading={partnersLoading} />
        ) : (
          <DonorsDataTable
            donors={filteredDonors}
            loading={donorsLoading}
            onEditClick={(donorId) => router.push(`${basePath}/donors/${donorId}`)}
          />
        )}
      </main>
    </div>
  );
}
