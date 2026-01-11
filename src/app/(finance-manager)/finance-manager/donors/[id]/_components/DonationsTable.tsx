import { Donation } from '@/types/DonorData';
import DataTable, { Column } from '@/components/table/DataTable';

interface DonationsTableProps {
  donations: Donation[];
}

export default function DonationsTable({ donations }: DonationsTableProps) {
  const columns: Column<Donation>[] = [
    {
      header: 'Project',
      accessor: (donation) => donation.project,
    },
    {
      header: 'Donation',
      accessor: (donation) => `$${donation.amount}`,
    },
    {
      header: 'Receipt',
      accessor: (donation) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            donation.receipt === 'Issued'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {donation.receipt}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <DataTable
        tableTitle="Donations"
        tableTitleBgColor="#2C89A5"
        headerBgColor="#C2F0FD"
        headerTextColor="#000000"
        columns={columns}
        data={donations}
        emptyMessage="No donations found"
        getRowKey={(donation) => donation.id}
      />
    </div>
  );
}
