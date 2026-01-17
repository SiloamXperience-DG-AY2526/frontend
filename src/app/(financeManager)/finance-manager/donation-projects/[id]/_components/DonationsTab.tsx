'use client';

import DataTable, { Column } from '@/components/table/DataTable';
import { ProjectDonation } from '@/types/DonationProjectData';
import { formatDateDDMMYYYY } from '@/lib/formatDate';
import FilterButton from '@/components/ui/FilterButton';

interface DonationsTabProps {
  donations: ProjectDonation[];
}

export default function DonationsTab({ donations }: DonationsTabProps) {
  const handleFilterClick = () => {
    // Placeholder for filter functionality
    console.log('Filter button clicked - filters to be implemented');
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  // Donations table columns
  const donationColumns: Column<ProjectDonation>[] = [
    {
      header: 'Donor ID',
      accessor: (donation: ProjectDonation) => (
        <span className="text-sm text-[#2C89A5]">{donation.donorId}</span>
      ),
    },
    {
      header: 'Type',
      accessor: (donation: ProjectDonation) => (
        <span className="text-sm text-gray-700 capitalize">
          {donation.type}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (donation: ProjectDonation) => (
        <span className="text-sm text-gray-700">
          {formatCurrency(donation.amount)}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (donation: ProjectDonation) => (
        <span className="text-sm text-gray-700">
          {formatDateDDMMYYYY(donation.date)}
        </span>
      ),
    },
    {
      header: 'Payment Mode',
      accessor: (donation: ProjectDonation) => (
        <span className="text-sm text-gray-700">{donation.paymentMode}</span>
      ),
    },
    {
      header: 'Receipt Status',
      accessor: (donation: ProjectDonation) => (
        <span className="text-sm text-gray-700 capitalize">
          {donation.receiptStatus}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: () => (
        <button
          onClick={() => {
            // TODO: Implement send receipt logic
          }}
          className="text-sm text-[#2C89A5] hover:underline"
        >
          Send receipt
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* Filter Pills */}
      <div className="mb-6 flex items-center gap-3">
        <FilterButton onClick={handleFilterClick} />
      </div>

      {/* Donations Table */}
      <DataTable<ProjectDonation>
        columns={donationColumns}
        data={donations}
        emptyMessage="No donations found"
        getRowKey={(donation) => donation.id}
        headerBgColor="#206378"
        headerTextColor="#ffffff"
      />
    </div>
  );
}
