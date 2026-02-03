"use client";

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import Toast from '@/components/ui/Toast';
import { useEmailCampaigns } from '@/hooks/useEmailCampaigns';
import EmailCampaignTable from './_components/EmailCampaignTable';
import { deleteCampaign } from '@/lib/api/emailCampaign';
import Link from 'next/link';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

export default function EmailCampaignsPage() {
  const basePath = useManagerBasePath('general');
  const { data, loading, error, statusCode, refetch } = useEmailCampaigns();
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'success', title: '' });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRequest = (campaignId: string) => {
    setPendingDeleteId(campaignId);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;
    try {
      setDeleting(true);
      await deleteCampaign(pendingDeleteId);
      setToast({
        open: true,
        type: 'success',
        title: 'Campaign deleted',
      });
      refetch();
    } catch (err: unknown) {
      setToast({
        open: true,
        type: 'error',
        title: 'Delete failed',
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  if (statusCode === 403) {
    return <UnauthorizedAccessCard />;
  }

  if (error && statusCode !== 403) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-10 py-8">
          <PageHeader title="Email" />
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">
              Failed to load campaigns. Please try again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const campaigns = data?.campaigns ?? [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={3500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      <main className="flex-1 px-10 py-8">
        <div className="flex items-start justify-between gap-4">
          <PageHeader title="Email" />
          <Link
            href={`${basePath}/emails/create`}
            className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white bg-[#2F6E62] hover:bg-[#275D53] transition"
          >
            Create an email
          </Link>
        </div>

        <div className="mt-6">
          <EmailCampaignTable
            campaigns={campaigns}
            loading={loading}
            onDelete={handleDeleteRequest}
          />
        </div>
      </main>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-[340px] rounded-md bg-white p-5 shadow-md">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Delete campaign
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this email campaign? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                disabled={deleting}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className={[
                  'rounded-md px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition',
                  deleting ? 'opacity-50 cursor-not-allowed' : '',
                ].join(' ')}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
