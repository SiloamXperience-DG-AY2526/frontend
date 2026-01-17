'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import { useManagers, useSearchFilter } from '@/hooks/useManagers';
import ManagersDataTable from './_components/ManagersDataTable';
import AddManagerDialog from './_components/AddManagerDialog';
import SearchBar from '@/components/ui/SearchBar';
import Button from '@/components/ui/Button';

export default function ManagersPage() {
  const { managers, loading, error, statusCode, refetch } = useManagers();
  const [search, setSearch] = useState('');
  const filtered = useSearchFilter(managers, search);
  const [openAdd, setOpenAdd] = useState(false);

  if (statusCode === 403) {
    return <UnauthorizedAccessCard />;
  }
  
  if (error && statusCode !== 403) {
    return (
      <>
        <PageHeader title="Managers" />
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">
            Failed to load Managers. Please try again.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-10 py-8">
        <div className="flex items-center justify-between">
          <PageHeader title="Managers" />
          <Button label="Add a New Manager" onClick={() => setOpenAdd(true)} />
        </div>

        <div className="flex justify-end">
          <SearchBar
              searchQuery={search}
              onSearchChange={setSearch}
              searchPlaceholder="Manager Name"
            />
        </div>

        <ManagersDataTable
          managers={filtered}
          loading={loading}
          onRefresh={refetch}
        />

        <AddManagerDialog open={openAdd} onClose={() => setOpenAdd(false)} onSuccess={refetch}/>
      </main>
    </div>
  );
}
