import { DonationProject } from '@/types/DonationProject';
import DataTable, { Column } from '@/components/table/DataTable';
import StatusBadge from '@/components/table/StatusBadge';
import EditButton from '@/components/ui/EditButton';
import DeleteButton from '@/components/ui/DeleteButton';
import { formatDateDDMMYYYY } from '@/lib/formatDate';
import Link from 'next/link';

interface ProjectsDataTableProps {
  projects: DonationProject[];
  loading: boolean;
  onEditClick: (projectId: string) => void;
  onDeleteClick: (projectId: string) => void;
}

export default function ProjectsDataTable({
  projects,
  loading,
  onEditClick,
  onDeleteClick,
}: ProjectsDataTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const formatTimePeriod = (startDate: string, endDate: string) => {
    return `${formatDateDDMMYYYY(startDate)}-${formatDateDDMMYYYY(endDate)}`;
  };

  const columns: Column<DonationProject>[] = [
    {
      header: 'Projects',
      accessor: (project) => (
        <Link
          href={`/finance-manager/donation-projects/${project.id}`}
          className="hover:underline"
          style={{ color: '#2C89A5' }}
        >
          {project.title}
        </Link>
      ),
    },
    {
      header: 'Time Period',
      accessor: (project) =>
        formatTimePeriod(project.startDate, project.endDate),
    },
    {
      header: 'Target',
      accessor: (project) =>
        project.targetFund ? `$${project.targetFund}` : '-',
    },
    {
      header: 'Funds Raised',
      accessor: (project) =>
        project.currentFund ? `$${project.currentFund} raised` : '-',
    },
    {
      header: 'Status',
      accessor: (project) => (
        <StatusBadge
          label={project.approvalStatus}
          variant={getStatusVariant(project.approvalStatus)}
        />
      ),
    },
    {
      header: 'Action',
      accessor: (project) => (
        <div className="flex items-center gap-2">
          <EditButton
            onClick={() => onEditClick(project.id)}
            ariaLabel={`Edit ${project.title}`}
          />
          <DeleteButton
            onClick={() => onDeleteClick(project.id)}
            ariaLabel={`Delete ${project.title}`}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={projects}
      loading={loading}
      emptyMessage="No projects found"
      getRowKey={(project) => project.id}
      headerBgColor="#206378"
    />
  );
}
