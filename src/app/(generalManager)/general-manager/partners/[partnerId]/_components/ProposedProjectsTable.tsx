'use client';

import Link from 'next/link';
import DataTable, { Column } from '@/components/table/DataTable';
import StatusBadge from '@/components/table/StatusBadge';
import { MyProposedProject } from '@/types/Volunteer';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

interface ProposedProjectsTableProps {
  projects: MyProposedProject[];
  loading: boolean;
  emptyMessage?: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-GB');
};

const statusVariant = (status?: string | null) => {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'error';
  if (status === 'reviewing') return 'info';
  return 'warning';
};

export default function ProposedProjectsTable({
  projects,
  loading,
  emptyMessage = 'No proposed projects found',
}: ProposedProjectsTableProps) {
  const basePath = useManagerBasePath('general');

  const columns: Column<MyProposedProject>[] = [
    {
      header: 'Project',
      accessor: (project) => (
        <Link
          href={`${basePath}/projects/${project.id}`}
          className="hover:underline"
          style={{ color: '#2C89A5' }}
        >
          {project.name}
        </Link>
      ),
    },
    {
      header: 'Location',
      accessor: (project) => project.location || '-',
    },
    {
      header: 'Dates',
      accessor: (project) =>
        `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`,
    },
    {
      header: 'Status',
      accessor: (project) => (
        <StatusBadge
          label={project.approvalStatus}
          variant={statusVariant(project.approvalStatus)}
        />
      ),
    },
    {
      header: 'Capacity',
      accessor: (project) => `${project.acceptedCount} / ${project.totalCapacity}`,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={projects}
      loading={loading}
      emptyMessage={emptyMessage}
      tableTitle="Proposed Projects"
      headerBgColor="#1F6B7C"
      headerTextColor="#FFFFFF"
      getRowKey={(project) => project.id}
    />
  );
}
