'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import LoadingTableState from '@/components/table/LoadingTableState';
import { getDonationProjectFinance, duplicateDonationProject } from '@/lib/api/donation';
import { DonationProjectWithFinance } from '@/types/DonationProjectData';
import TotalFundsRaisedCard from './_components/TotalFundsRaisedCard';
import DonationsTab from './_components/DonationsTab';
import YourDonorsTab from './_components/YourDonorsTab';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

type TabKey = 'donations' | 'donors';

const tabs: { key: TabKey; label: string }[] = [
    { key: 'donations', label: 'Donations' },
    { key: 'donors', label: 'Your Donors' },
];

export default function DonationProjectDetail() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const router = useRouter();
  const basePath = useManagerBasePath('finance');

  const [projectData, setProjectData] =
    useState<DonationProjectWithFinance | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('donations');
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message?: string }>({ open: false, type: 'success', title: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

    const fetchProjectData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getDonationProjectFinance(projectId);
            setProjectData(data);
        } catch (error) {
            console.error('Error fetching project finance data:', error);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const handleRefresh = () => {
        fetchProjectData();
    };

  const handleDuplicateClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDuplicate = async () => {
    setIsDuplicating(true);
    setShowConfirmDialog(false);

    try {
      const duplicatedProject = await duplicateDonationProject(projectId);
      setToast({ open: true, type: 'success', title: 'Project duplicated successfully' });
      // Redirect to the edit page of the duplicated project
      setTimeout(() => {
        router.push(`${basePath}/donation-projects/${duplicatedProject.id}/edit`);
      }, 1000);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Failed to duplicate project',
        message: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleCancelDuplicate = () => {
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <PageHeader title="Loading..." />
        <div className="mt-6">
          <LoadingTableState message="Loading project details..." />
        </div>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Page Header with Funds Card */}
            <div className="flex items-start justify-between gap-6 mb-6">
                <PageHeader title={projectData.project.title} />
                <div className="flex w-full max-w-md flex-col items-end gap-3">
                    <Link
                        href={`${basePath}/donation-projects/${projectId}/edit`}
                        className="rounded-full border border-[#0E5A4A] px-6 py-2 text-sm font-semibold text-[#0E5A4A] hover:bg-[#E6F5F1]"
                    >
                        Edit project
                    </Link>
                    <TotalFundsRaisedCard
                        currentFund={parseFloat(projectData.totalRaised)}
                        targetFund={
                            projectData.project.targetFund
                                ? parseFloat(projectData.project.targetFund)
                                : null
                        }
                    />
                </div>
            </div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page Header with Funds Card */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <PageHeader title={projectData.project.title} />
        <div className="flex w-full max-w-md flex-col items-end gap-3">
          <div className="flex gap-2">
            <Link
              href={`${basePath}/donation-projects/${projectId}/edit`}
              className="rounded-full border border-[#0E5A4A] px-6 py-2 text-sm font-semibold text-[#0E5A4A] hover:bg-[#E6F5F1]"
            >
              Edit project
            </Link>
            <button
              onClick={handleDuplicateClick}
              disabled={isDuplicating}
              className="rounded-full border border-blue-600 px-6 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDuplicating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Duplicating...
                </>
              ) : (
                <>
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  Duplicate
                </>
              )}
            </button>
          </div>
          <TotalFundsRaisedCard
            currentFund={parseFloat(projectData.totalRaised)}
            targetFund={
              projectData.project.targetFund
                ? parseFloat(projectData.project.targetFund)
                : null
            }
          />
        </div>
      </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'donations' && (
                    <DonationsTab donations={projectData.donations} onRefresh={handleRefresh} />
                )}
                {activeTab === 'donors' && (
                    <YourDonorsTab donors={projectData.donors} />
                )}
            </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'donations' && (
          <DonationsTab donations={projectData.donations} onRefresh={handleRefresh} />
        )}
        {activeTab === 'donors' && (
          <YourDonorsTab donors={projectData.donors} />
        )}
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <ConfirmDialog
        open={showConfirmDialog}
        title="Duplicate this project?"
        message="This will create a copy of the project in draft status. You can then edit the duplicated project."
        confirmText="Duplicate"
        cancelText="Cancel"
        onConfirm={handleConfirmDuplicate}
        onCancel={handleCancelDuplicate}
      />
    </div>
  );
}
