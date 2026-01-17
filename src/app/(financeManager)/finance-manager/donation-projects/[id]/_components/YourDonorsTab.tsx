'use client';

import Link from 'next/link';
import DataTable, { Column } from '@/components/table/DataTable';
import EditButton from '@/components/ui/EditButton';
import { ProjectDonor } from '@/types/DonationProjectData';
import FilterButton from '@/components/ui/FilterButton';
import { formatDateDDMMYYYY } from '@/lib/formatDate';

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

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  // Donors table columns
  const donorColumns: Column<ProjectDonor>[] = [
    {
      header: 'Donor Name',
      accessor: (donor: ProjectDonor) => (
        <Link
          href={`/finance-manager/donors/${donor.id}`}
          className="hover:underline"
          style={{ color: '#2C89A5' }}
        >
          {`${donor.firstName} ${donor.lastName}`}
        </Link>
      ),
    },
    {
      header: 'Email',
      accessor: (donor: ProjectDonor) => donor.email,
    },
    {
      header: 'Contact',
      accessor: (donor: ProjectDonor) =>
        `${donor.countryCode} ${donor.contactNumber}`,
    },
    {
      header: 'Total Donated',
      accessor: (donor: ProjectDonor) => formatCurrency(donor.totalDonated),
    },
    {
      header: 'Created At',
      accessor: (donor: ProjectDonor) => formatDateDDMMYYYY(donor.createdAt),
    },
    {
      header: '',
      accessor: (donor: ProjectDonor) => (
        <EditButton
          onClick={() => handleEditClick(donor.id)}
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
        getRowKey={(donor) => donor.id}
        headerBgColor="#206378"
        headerTextColor="#ffffff"
      />
    </div>
  );
}
