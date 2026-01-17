'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import LoadingTableState from '@/components/table/LoadingTableState';
import { getDonationProjectFinance } from '@/lib/api/donation';
import { DonationProjectWithFinance } from '@/types/DonationProjectData';
import TotalFundsRaisedCard from './_components/TotalFundsRaisedCard';
import DonationsTab from './_components/DonationsTab';
import YourDonorsTab from './_components/YourDonorsTab';

type TabKey = 'donations' | 'donors';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'donations', label: 'Donations' },
  { key: 'donors', label: 'Your Donors' },
];

export default function DonationProjectDetail() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [projectData, setProjectData] =
    useState<DonationProjectWithFinance | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('donations');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const data = await getDonationProjectFinance(projectId);
        setProjectData(data);
      } catch (error) {
        console.error('Error fetching project finance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

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

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <PageHeader title="Error" />
        <div className="mt-6 text-center text-gray-600">
          Failed to load project data.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page Header with Funds Card */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <PageHeader title={projectData.project.title} />
        <div className="w-full max-w-md">
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

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'px-8 py-3 rounded-full text-sm font-medium border-2 transition cursor-pointer',
                  isActive
                    ? 'bg-[#B8E6E0] text-[#195D4B] border-[#195D4B]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                ].join(' ')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'donations' && (
          <DonationsTab donations={projectData.donations} />
        )}
        {activeTab === 'donors' && (
          <YourDonorsTab donors={projectData.donors} />
        )}
      </div>
    </div>
  );
}
