import { DonationProject } from '@/types/DonationProjectData';
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
  const getApprovalStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'neutral';
      case 'reviewing':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getSubmissionStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'success';
      case 'withdrawn':
        return 'error';
      case 'draft':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getOperationStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'notstarted':
        return 'neutral';
      case 'ongoing':
        return 'success';
      case 'paused':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const formatType = (type: string) => {
    if (type === 'partnerLed') return 'Partner Led';
    return type.charAt(0).toUpperCase() + type.slice(1);
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
        project.totalRaised ? `$${project.totalRaised}` : '$0',
    },
    {
      header: 'Type',
      accessor: (project) => formatType(project.type), // Display plain text for type
    },
    {
      header: 'Submission',
      accessor: (project) => (
        <StatusBadge
          label={
            project.submissionStatus.charAt(0).toUpperCase() +
            project.submissionStatus.slice(1)
          }
          variant={getSubmissionStatusVariant(project.submissionStatus)}
        />
      ),
    },
    {
      header: 'Approval',
      accessor: (project) => (
        <StatusBadge
          label={
            project.approvalStatus.charAt(0).toUpperCase() +
            project.approvalStatus.slice(1)
          }
          variant={getApprovalStatusVariant(project.approvalStatus)}
        />
      ),
    },
    {
      header: 'Operation',
      accessor: (project) => (
        <StatusBadge
          label={
            project.operationStatus.charAt(0).toUpperCase() +
            project.operationStatus.slice(1)
          }
          variant={getOperationStatusVariant(project.operationStatus)}
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
