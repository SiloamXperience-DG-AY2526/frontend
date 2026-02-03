'use client';

import { useEffect, useMemo, useState } from 'react';
import { getDonationHomepage, getFinanceManagerProjects } from '@/lib/api/donation';
import type { DonationHomepage } from '@/types/DonationData';
import type { DonationProjectsResponse } from '@/types/DonationProjectData';
import type { PartnerSummary } from '@/types/Partner';

type VolunteerApplication = {
  id: string;
  status: string;
  createdAt: string;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US');

const parseAmount = (value?: string | number | null) => {
  if (value === null || value === undefined) return 0;
  const numeric = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(numeric) ? numeric : 0;
};

export default function SuperAdminHomePage() {
  const [partners, setPartners] = useState<PartnerSummary[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [homepage, setHomepage] = useState<DonationHomepage | null>(null);
  const [projectsResponse, setProjectsResponse] =
    useState<DonationProjectsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const [partnersRes, applicationsRes, homepageData, projectsData] =
          await Promise.all([
            fetch('/api/partners'),
            fetch('/api/v1/volunteer-applications'),
            getDonationHomepage(),
            getFinanceManagerProjects(1, 20),
          ]);

        if (!partnersRes.ok || !applicationsRes.ok) {
          throw new Error('Failed to load dashboard data.');
        }

        const partnersData = await partnersRes.json();
        const applicationsData = await applicationsRes.json();

        if (!isMounted) return;

        setPartners((partnersData ?? []) as PartnerSummary[]);
        const list = Array.isArray(applicationsData?.data)
          ? applicationsData.data
          : applicationsData ?? [];
        setApplications(list as VolunteerApplication[]);
        setHomepage(homepageData);
        setProjectsResponse(projectsData);
        setErrorMessage(null);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Failed to load dashboard data.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const activePartners = useMemo(
    () => partners.filter((partner) => partner.status === 'Active').length,
    [partners]
  );

  const pendingApplications = useMemo(
    () => applications.filter((app) => app.status === 'reviewing').length,
    [applications]
  );

  const stats = homepage?.statistics;
  const totalRaised = stats ? currencyFormatter.format(parseAmount(stats.totalRaised)) : '--';
  const totalDonations = stats ? numberFormatter.format(stats.totalDonations) : '--';
  const activeProjects = stats ? numberFormatter.format(stats.activeProjects) : '--';
  const trackedProjects = projectsResponse
    ? numberFormatter.format(projectsResponse.pagination.totalCount)
    : '--';

  return (
    <div className="min-h-full bg-gray-50 px-6 py-8 lg:px-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Super admin dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Operations and finance snapshots across the organization.
        </p>
      </header>

      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
          Volunteer operations
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Total partners</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : partners.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Active partners</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : activePartners}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Applications</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : applications.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Pending review
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : pendingApplications}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
          Donation performance
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Total raised</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : totalRaised}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Total donations</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : totalDonations}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Active donation projects
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : activeProjects}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Projects tracked
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : trackedProjects}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
