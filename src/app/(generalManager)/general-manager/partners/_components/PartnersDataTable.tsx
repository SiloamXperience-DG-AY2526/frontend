'use client';

import Link from 'next/link';
import DataTable, { Column } from '@/components/table/DataTable';
import StatusBadge from '@/components/table/StatusBadge';
import { PartnerSummary } from '@/types/Partner';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

interface PartnersDataTableProps {
  partners: PartnerSummary[];
  loading: boolean;
}

export default function PartnersDataTable({
  partners,
  loading,
}: PartnersDataTableProps) {
  const basePath = useManagerBasePath('general');

  const columns: Column<PartnerSummary>[] = [
    {
      header: 'Partner Name',
      accessor: (partner) => (
        <Link
          href={`${basePath}/partners/${partner.partnerId}`}
          className="hover:underline"
          style={{ color: '#2C89A5' }}
        >
          {partner.fullName}
        </Link>
      ),
    },
    {
      header: 'Email',
      accessor: (partner) => partner.email,
    },
    {
      header: 'Contact Number',
      accessor: (partner) => partner.contactNumber || '-',
    },
    {
      header: 'Nationality',
      accessor: (partner) => partner.nationality || '-',
    },
    {
      header: 'Availability',
      accessor: (partner) => partner.volunteerAvailability || '-',
    },
    {
      header: 'Status',
      accessor: (partner) => (
        <StatusBadge
          label={partner.status}
          variant={partner.status === 'Active' ? 'success' : 'neutral'}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={partners}
      loading={loading}
      emptyMessage="No partners found"
      getRowKey={(partner) => partner.partnerId}
    />
  );
}
