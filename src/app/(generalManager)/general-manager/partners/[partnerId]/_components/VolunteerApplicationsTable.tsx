import Link from 'next/link';
import DataTable, { Column } from '@/components/table/DataTable';
import StatusBadge from '@/components/table/StatusBadge';
import { PartnerVolunteerApplication } from '@/types/Partner';

interface VolunteerApplicationsTableProps {
  applications: PartnerVolunteerApplication[];
  loading: boolean;
  emptyMessage?: string;
}

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-SG', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const statusVariant = (status: string) => {
  if (status === 'approved' || status === 'active') return 'success';
  if (status === 'rejected') return 'error';
  if (status === 'reviewing') return 'info';
  return 'neutral';
};

export default function VolunteerApplicationsTable({
  applications,
  loading,
  emptyMessage = 'No volunteer applications found',
}: VolunteerApplicationsTableProps) {
  const columns: Column<PartnerVolunteerApplication>[] = [
    {
      header: 'Project',
      accessor: (app) =>
        app.position.projectId ? (
          <Link
            href={`/general-manager/projects/${app.position.projectId}`}
            className="hover:underline"
            style={{ color: '#2C89A5' }}
          >
            {app.position.projectTitle || 'View Project'}
          </Link>
        ) : (
          app.position.projectTitle || '-'
        ),
    },
    {
      header: 'Position',
      accessor: (app) => app.position.role,
    },
    {
      header: 'Applied',
      accessor: (app) => formatDate(app.createdAt),
    },
    {
      header: 'Availability',
      accessor: (app) => app.availability || '-',
    },
    {
      header: 'Status',
      accessor: (app) => (
        <StatusBadge label={app.status} variant={statusVariant(app.status)} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={applications}
      loading={loading}
      emptyMessage={emptyMessage}
      tableTitle="Volunteer Applications"
      headerBgColor="#1F6B7C"
      headerTextColor="#FFFFFF"
      getRowKey={(app) => app.id}
    />
  );
}
