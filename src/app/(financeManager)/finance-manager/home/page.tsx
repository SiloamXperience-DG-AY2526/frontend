'use client';

import { useEffect, useMemo, useState } from 'react';
import { getDonationHomepage, getFinanceManagerProjects } from '@/lib/api/donation';
import type { DonationHomepage } from '@/types/DonationData';
import type { DonationProject, DonationProjectsResponse } from '@/types/DonationProjectData';

type DashboardState = {
  homepage: DonationHomepage | null;
  projectsResponse: DonationProjectsResponse | null;
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

export default function FinanceManagerHomePage() {
  const [data, setData] = useState<DashboardState>({
    homepage: null,
    projectsResponse: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const [homepage, projectsResponse] = await Promise.all([
          getDonationHomepage(),
          getFinanceManagerProjects(1, 20),
        ]);

        if (isMounted) {
          setData({ homepage, projectsResponse });
          setErrorMessage(null);
        }
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

  const topProjects = useMemo(() => {
    const projects = data.projectsResponse?.projects ?? [];
    return [...projects]
      .sort((a, b) => parseAmount(b.totalRaised) - parseAmount(a.totalRaised))
      .slice(0, 5);
  }, [data.projectsResponse]);

  const stats = data.homepage?.statistics;
  const totalRaised = stats ? currencyFormatter.format(parseAmount(stats.totalRaised)) : '--';
  const totalDonations = stats ? numberFormatter.format(stats.totalDonations) : '--';
  const activeProjects = stats ? numberFormatter.format(stats.activeProjects) : '--';
  const trackedProjects = data.projectsResponse
    ? numberFormatter.format(data.projectsResponse.pagination.totalCount)
    : '--';

  return (
    <div className="min-h-full bg-gray-50 px-6 py-8 lg:px-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Finance dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Live snapshot of donation performance and project funding.
        </p>
      </header>

      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Active projects</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoading ? 'Loading...' : activeProjects}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Projects tracked</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoading ? 'Loading...' : trackedProjects}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Top funded projects</h2>
            <p className="text-sm text-gray-500">Sorted by total raised.</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase tracking-[0.16em] text-gray-400">
              <tr>
                <th className="px-2 py-3">Project</th>
                <th className="px-2 py-3">Type</th>
                <th className="px-2 py-3">Raised</th>
                <th className="px-2 py-3">Target</th>
                <th className="px-2 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-2 py-4 text-gray-500" colSpan={5}>
                    Loading projects...
                  </td>
                </tr>
              ) : topProjects.length ? (
                topProjects.map((project: DonationProject) => (
                  <tr key={project.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-2 py-3 font-medium text-gray-900">{project.title}</td>
                    <td className="px-2 py-3 capitalize text-gray-600">{project.type}</td>
                    <td className="px-2 py-3 text-gray-700">
                      {currencyFormatter.format(parseAmount(project.totalRaised))}
                    </td>
                    <td className="px-2 py-3 text-gray-700">
                      {project.targetFund
                        ? currencyFormatter.format(parseAmount(project.targetFund))
                        : '--'}
                    </td>
                    <td className="px-2 py-3 text-gray-600">
                      {project.operationStatus ?? project.approvalStatus ?? '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-2 py-4 text-gray-500" colSpan={5}>
                    No projects available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
