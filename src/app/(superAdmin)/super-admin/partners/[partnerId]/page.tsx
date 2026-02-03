'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import BackButton from '@/components/ui/BackButton';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';
import { PartnerInfoResponse } from '@/types/PartnerInfo';
import { MyProposedProject } from '@/types/Volunteer';
import { PartnerVolunteerApplication } from '@/types/Partner';
import PartnerProfileDetailsCard from '@/app/(generalManager)/general-manager/partners/[partnerId]/_components/PartnerProfileDetailsCard';
import VolunteerApplicationsTable from '@/app/(generalManager)/general-manager/partners/[partnerId]/_components/VolunteerApplicationsTable';
import ProposedProjectsTable from '@/app/(generalManager)/general-manager/partners/[partnerId]/_components/ProposedProjectsTable';
import { PartnershipInterestsCard } from '@/components/partnerInfo/PartnershipInterestsCard';
import PersonalParticulars from '@/app/(financeManager)/finance-manager/donors/[id]/_components/PersonalParticulars';
import DonationsTable from '@/app/(financeManager)/finance-manager/donors/[id]/_components/DonationsTable';
import { useDonor } from '@/hooks/useDonors';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

type TabKey = 'volunteer' | 'donor';

export default function SuperAdminPartnerDetailPage() {
  const params = useParams<{ partnerId: string }>();
  const partnerId = params?.partnerId ?? '';
  const basePath = useManagerBasePath('general');

  const [partnerInfo, setPartnerInfo] = useState<PartnerInfoResponse | null>(
    null
  );
  const [applications, setApplications] = useState<
    PartnerVolunteerApplication[]
  >([]);
  const [proposals, setProposals] = useState<MyProposedProject[]>([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const [profileError, setProfileError] = useState<string | null>(null);
  const [applicationsError, setApplicationsError] = useState<string | null>(
    null
  );
  const [proposalsError, setProposalsError] = useState<string | null>(null);

  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('volunteer');

  const {
    donor,
    loading: donorLoading,
    error: donorError,
    statusCode: donorStatusCode,
  } = useDonor(partnerId);

  useEffect(() => {
    if (!partnerId) return;
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await fetch(`/api/profile/${partnerId}`, {
          method: 'GET',
        });
        setStatusCode(res.status);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.errMsg ?? 'Failed to load partner profile');
        }
        if (isMounted) setPartnerInfo(data as PartnerInfoResponse);
      } catch (e: unknown) {
        if (isMounted) {
          setProfileError(
            e instanceof Error ? e.message : 'Failed to load partner profile'
          );
        }
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    const loadApplications = async () => {
      try {
        setLoadingApplications(true);
        const qs = new URLSearchParams({ userId: partnerId });
        const res = await fetch(`/api/v1/volunteer-applications?${qs}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message ?? 'Failed to load applications');
        }
        if (isMounted) {
          setApplications((data ?? []) as PartnerVolunteerApplication[]);
        }
      } catch (e: unknown) {
        if (isMounted) {
          setApplicationsError(
            e instanceof Error ? e.message : 'Failed to load applications'
          );
        }
      } finally {
        if (isMounted) setLoadingApplications(false);
      }
    };

    const loadProposals = async () => {
      try {
        setLoadingProposals(true);
        const res = await fetch(
          `/api/v1/volunteer-projects/partner/${partnerId}/proposals`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message ?? 'Failed to load proposals');
        }
        if (isMounted) {
          setProposals((data?.data ?? data ?? []) as MyProposedProject[]);
        }
      } catch (e: unknown) {
        if (isMounted) {
          setProposalsError(
            e instanceof Error ? e.message : 'Failed to load proposals'
          );
        }
      } finally {
        if (isMounted) setLoadingProposals(false);
      }
    };

    loadProfile();
    loadApplications();
    loadProposals();

    return () => {
      isMounted = false;
    };
  }, [partnerId]);

  if (statusCode === 403) {
    return <UnauthorizedAccessCard />;
  }

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-10 py-8">
          <div className="text-center py-20">Loading partner details...</div>
        </main>
      </div>
    );
  }

  if (profileError || !partnerInfo) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-10 py-8">
          <div className="text-center py-20 text-red-600">
            {profileError || 'Error loading partner details.'}
          </div>
        </main>
      </div>
    );
  }

  const profileRecord = partnerInfo.profile as Record<string, unknown>;
  const profileFirst = (profileRecord.firstName as string | undefined) ?? '';
  const profileLast = (profileRecord.lastName as string | undefined) ?? '';
  const fallbackName = `${profileFirst} ${profileLast}`.trim();

  const partnerName =
    partnerInfo.personalParticulars?.fullName || fallbackName || 'Partner';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-10 py-8">
        <BackButton label="Back to Partners" href={`${basePath}/partners`} />
        <PageHeader title={partnerName} />

        <div className="mt-6 space-y-6">
          <PartnerProfileDetailsCard profile={partnerInfo.profile} />
          <PartnershipInterestsCard interests={partnerInfo.partnershipInterests} />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('volunteer')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeTab === 'volunteer'
                  ? 'bg-[#1F6B7C] text-white'
                  : 'border border-gray-200 bg-white text-gray-700'
              }`}
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('donor')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeTab === 'donor'
                  ? 'bg-[#1F6B7C] text-white'
                  : 'border border-gray-200 bg-white text-gray-700'
              }`}
            >
              Donor
            </button>
          </div>

          {activeTab === 'volunteer' ? (
            <>
              {applicationsError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                  {applicationsError}
                </div>
              ) : (
                <VolunteerApplicationsTable
                  applications={applications}
                  loading={loadingApplications}
                />
              )}

              {proposalsError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                  {proposalsError}
                </div>
              ) : (
                <ProposedProjectsTable
                  projects={proposals}
                  loading={loadingProposals}
                />
              )}
            </>
          ) : donorStatusCode === 403 ? (
            <UnauthorizedAccessCard />
          ) : donorLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Loading donor details...
            </div>
          ) : donorError || !donor ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              {donorError || 'Failed to load donor details.'}
            </div>
          ) : (
            <>
              <PersonalParticulars donor={donor} />
              <DonationsTable donations={donor.donations} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
