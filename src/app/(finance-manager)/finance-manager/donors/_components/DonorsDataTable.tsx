import { Donor } from '@/types/DonorData';
import DataTable, { Column } from '@/components/table/DataTable';
import StatusBadge from '@/components/table/StatusBadge';
import EditButton from '../../../../../components/ui/EditButton';
import Link from 'next/link';

interface DonorsDataTableProps {
  donors: Donor[];
  loading: boolean;
  onEditClick: (donorId: string) => void;
}

export default function DonorsDataTable({
  donors,
  loading,
  onEditClick,
}: DonorsDataTableProps) {
  const columns: Column<Donor>[] = [
    {
      header: 'Partner Name',
      accessor: (donor) => (
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
      accessor: (donor) => donor.projects.join(', '),
    },
    {
      header: 'Cumulative Amount Donated',
      accessor: (donor) => `$${donor.cumulativeAmount}`,
    },
    {
      header: 'Gender',
      accessor: (donor) => donor.gender,
    },
    {
      header: 'Contact Number',
      accessor: (donor) => donor.contactNumber,
    },
    {
      header: 'Status',
      accessor: (donor) => (
        <StatusBadge
          label={donor.status}
          variant={donor.status === 'Active' ? 'success' : 'neutral'}
        />
      ),
    },
    {
      header: '',
      accessor: (donor) => (
        <EditButton
          onClick={() => onEditClick(donor.donorId)}
          ariaLabel="Edit donor"
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={donors}
      loading={loading}
      emptyMessage="No donors found"
      getRowKey={(donor) => donor.donorId}
    />
  );
}
