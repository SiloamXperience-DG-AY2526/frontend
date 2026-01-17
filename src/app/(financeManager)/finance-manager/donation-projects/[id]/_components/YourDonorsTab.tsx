'use client';

import Link from 'next/link';
import DataTable, { Column } from '@/components/table/DataTable';
import StatusBadge from '@/components/table/StatusBadge';
import EditButton from '@/components/ui/EditButton';
import { ProjectDonor } from '@/types/DonationProjectData';
import FilterButton from '@/components/ui/FilterButton';

interface YourDonorsTabProps {
  donors: ProjectDonor[];
}

export default function YourDonorsTab({ donors }: YourDonorsTabProps) {
  const handleFilterClick = () => {
    // Placeholder for filter functionality
    console.log('Filter button clicked - filters to be implemented');
  };

  const handleEditClick = (donorId: string) => {
    console.log(`Edit donor ${donorId} - functionality to be implemented`);
  };

  // Donors table columns (following the donors/page.tsx structure)
  const donorColumns: Column<ProjectDonor>[] = [
    {
      header: 'Partner Name',
      accessor: (donor: ProjectDonor) => (
        <Link
          href={`/finance-manager/donors/${donor.donorId}`}
          className="hover:underline"
          style={{ color: '#2C89A5' }}
        >
          {donor.partnerName}
        </Link>
      ),
    },
    {
      header: 'Projects',
      accessor: (donor: ProjectDonor) => donor.projects.join(', '),
    },
    {
      header: 'Cumulative Amount Donated',
      accessor: (donor: ProjectDonor) => `$${donor.cumulativeAmount}`,
    },
    {
      header: 'Gender',
      accessor: (donor: ProjectDonor) => donor.gender,
    },
    {
      header: 'Contact Number',
      accessor: (donor: ProjectDonor) => donor.contactNumber,
    },
    {
      header: 'Status',
      accessor: (donor: ProjectDonor) => (
        <StatusBadge
          label={donor.status}
          variant={donor.status === 'Active' ? 'success' : 'neutral'}
        />
      ),
    },
    {
      header: '',
      accessor: (donor: ProjectDonor) => (
        <EditButton
          onClick={() => handleEditClick(donor.donorId)}
          ariaLabel="Edit donor"
        />
      ),
    },
  ];

  return (
    <div>
      {/* Filter Pills */}
      <div className="mb-6 flex items-center gap-3">
        <FilterButton onClick={handleFilterClick} />
      </div>

      {/* Donors Table */}
      <DataTable<ProjectDonor>
        columns={donorColumns}
        data={donors}
        emptyMessage="No donors found"
        getRowKey={(donor) => donor.donorId}
        headerBgColor="#206378"
        headerTextColor="#ffffff"
      />
    </div>
  );
}
