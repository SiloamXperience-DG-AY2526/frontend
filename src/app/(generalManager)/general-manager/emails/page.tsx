"use client";

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import Toast from '@/components/ui/Toast';
import { useEmailCampaigns } from '@/hooks/useEmailCampaigns';
import EmailCampaignTable from './_components/EmailCampaignTable';
import { deleteCampaign } from '@/lib/api/emailCampaign';
import Link from 'next/link';

export default function EmailCampaignsPage() {
  const { data, loading, error, statusCode, refetch } = useEmailCampaigns();
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'success', title: '' });

  const handleDelete = async (campaignId: string) => {
    const ok = window.confirm('Delete this email campaign?');
    if (!ok) return;

    try {
      await deleteCampaign(campaignId);
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
            href="/general-manager/emails/create"
            className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white bg-[#2F6E62] hover:bg-[#275D53] transition"
          >
            Create an email
          </Link>
        </div>

        <div className="mt-6">
          <EmailCampaignTable
            campaigns={campaigns}
            loading={loading}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}
