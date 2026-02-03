'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/table/DataTable';
import { ProjectDonation } from '@/types/DonationProjectData';
import { formatDateDDMMYYYY } from '@/lib/formatDate';
import FilterButton from '@/components/ui/FilterButton';
import { updateDonationReceiptStatus } from '@/lib/api/donation';
import Toast from '@/components/ui/Toast';

interface DonationsTabProps {
  donations: ProjectDonation[];
  onRefresh?: () => void;
}

export default function DonationsTab({ donations, onRefresh }: DonationsTabProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'success', title: '' });

  const handleFilterClick = () => {
    console.log('Filter button clicked - filters to be implemented');
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  const handleMarkAsReceived = async (donationId: string) => {
    setUpdating(donationId);
    try {
      await updateDonationReceiptStatus(donationId, 'received');
      setToast({
        open: true,
        type: 'success',
        title: 'Status updated',
        message: 'Donation marked as received.',
      });
      onRefresh?.();
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Update failed',
        message: `${err}`,
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      received: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const donationColumns: Column<ProjectDonation>[] = [
    {
      header: 'Donor ID',
      accessor: (donation: ProjectDonation) => (
        <span className="text-sm text-[#2C89A5]">{donation.donorId.slice(0, 8)}...</span>
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
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(donation.receiptStatus)}`}>
          {donation.receiptStatus}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: (donation: ProjectDonation) => (
        <div className="flex gap-2">
          {donation.receiptStatus === 'pending' && (
            <button
              onClick={() => handleMarkAsReceived(donation.id)}
              disabled={updating === donation.id}
              className="text-sm text-green-600 hover:underline disabled:opacity-50"
            >
              {updating === donation.id ? 'Updating...' : 'Mark Received'}
            </button>
          )}
          {donation.receiptStatus === 'received' && (
            <span className="text-sm text-gray-400">Received</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <div className="mb-6 flex items-center gap-3">
        <FilterButton onClick={handleFilterClick} />
      </div>

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
