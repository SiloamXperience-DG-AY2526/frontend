'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/table/DataTable';
import StatusBadge from '@/components/table/StatusBadge';
import DeleteButton from '@/components/ui/DeleteButton';
import EditButton from '@/components/ui/EditButton';
import { EmailCampaignSummary } from '@/types/EmailCampaign';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

interface EmailCampaignTableProps {
  campaigns: EmailCampaignSummary[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-GB');
};

const statusVariant = (status: string) => {
  if (status === 'sent') return 'success';
  if (status === 'scheduled') return 'info';
  if (status === 'cancelled') return 'error';
  return 'neutral';
};

const statusLabel = (status: string) => {
  if (status === 'sent') return 'Sent';
  if (status === 'scheduled') return 'Scheduled';
  if (status === 'cancelled') return 'Cancelled';
  return 'Draft';
};

export default function EmailCampaignTable({
  campaigns,
  loading,
  onDelete,
}: EmailCampaignTableProps) {
  const router = useRouter();
  const basePath = useManagerBasePath('general');
  const columns: Column<EmailCampaignSummary>[] = [
    {
      header: 'Email',
      accessor: (campaign) => (
        <Link
          href={`${basePath}/emails/${campaign.id}`}
          className="hover:underline"
          style={{ color: '#2C89A5' }}
        >
          {campaign.name}
        </Link>
      ),
    },
    {
      header: 'Time Period',
      accessor: (campaign) =>
        `${formatDate(campaign.createdAt)}-${
          campaign.scheduledAt ? formatDate(campaign.scheduledAt) : '-'
        }`,
    },
    {
      header: 'Status',
      accessor: (campaign) => (
        <StatusBadge
          label={statusLabel(campaign.status)}
          variant={statusVariant(campaign.status)}
        />
      ),
    },
    {
      header: 'Action',
      accessor: (campaign) => {
        const isSent = campaign.status === 'sent';
        return (
          <div className="flex items-center gap-3">
            {!isSent && (
              <EditButton
                onClick={() => router.push(`${basePath}/emails/${campaign.id}`)}
                ariaLabel="Edit campaign"
              />
            )}
            {!isSent && (
              <DeleteButton
                onClick={() => onDelete(campaign.id)}
                ariaLabel="Delete campaign"
              />
            )}
            {isSent && (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      loading={loading}
      emptyMessage="No email campaigns found"
      headerBgColor="#2F5F70"
      headerTextColor="#FFFFFF"
      getRowKey={(campaign) => campaign.id}
    />
  );
}
