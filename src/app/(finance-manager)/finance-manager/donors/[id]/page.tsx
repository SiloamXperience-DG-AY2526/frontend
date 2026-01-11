'use client';

import { use } from 'react';
import FinanceManagerSidebar from '@/components/FinanceManagerSidebar';
import PageHeader from '@/components/ui/PageHeader';
import BackButton from '@/components/ui/BackButton';
import { useDonor } from '@/hooks/useDonors';
import PersonalParticulars from './_components/PersonalParticulars';
import DonationsTable from './_components/DonationsTable';

export default function DonorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { donor, loading, error } = useDonor(id);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <FinanceManagerSidebar />
        <main className="flex-1 px-10 py-8">
          <div className="text-center py-20">Loading donor details...</div>
        </main>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <FinanceManagerSidebar />
        <main className="flex-1 px-10 py-8">
          <div className="text-center py-20 text-red-600">
            Error loading donor details. Please try again.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FinanceManagerSidebar />

      <main className="flex-1 px-10 py-8">
        <BackButton label="Back to Donors" href="/finance-manager/donors" />

        <PageHeader title={donor.fullName} />

        <PersonalParticulars donor={donor} />
        <DonationsTable donations={donor.donations} />
      </main>
    </div>
  );
}
