'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PartnerSummary } from '@/types/Partner';

type VolunteerApplication = {
  id: string;
  status: string;
  createdAt: string;
  position?: {
    role?: string | null;
    projectTitle?: string | null;
  };
  volunteer?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  };
};

export default function GeneralManagerHomePage() {
  const [partners, setPartners] = useState<PartnerSummary[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const [partnersRes, applicationsRes] = await Promise.all([
          fetch('/api/partners'),
          fetch('/api/v1/volunteer-applications'),
        ]);

        if (!partnersRes.ok || !applicationsRes.ok) {
          throw new Error('Failed to load dashboard data.');
        }

        const partnersData = await partnersRes.json();
        const applicationsData = await applicationsRes.json();

        if (isMounted) {
          setPartners((partnersData ?? []) as PartnerSummary[]);
          const list = Array.isArray(applicationsData?.data)
            ? applicationsData.data
            : applicationsData ?? [];
          setApplications(list as VolunteerApplication[]);
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

  const activePartners = useMemo(
    () => partners.filter((partner) => partner.status === 'Active').length,
    [partners]
  );

  const pendingApplications = useMemo(
    () => applications.filter((app) => app.status === 'reviewing').length,
    [applications]
  );

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [applications]);

  return (
    <div className="min-h-full bg-gray-50 px-6 py-8 lg:px-10">
      <header className="mb-8 flex items-start gap-3">
        <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Partner network health and volunteer activity at a glance.
          </p>
        </div>
      </header>

      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Total partners</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoading ? 'Loading...' : partners.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Active partners</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoading ? 'Loading...' : activePartners}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Applications</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoading ? 'Loading...' : applications.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Pending review
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoading ? 'Loading...' : pendingApplications}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-[#195D4B] bg-white overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent volunteer applications
          </h2>
          <p className="text-sm text-gray-500">Newest submissions across projects.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#206378] text-white text-xs uppercase tracking-[0.16em]">
              <tr>
                <th className="px-4 py-3 font-bold text-left">Volunteer</th>
                <th className="px-4 py-3 font-bold text-left">Project</th>
                <th className="px-4 py-3 font-bold text-left">Role</th>
                <th className="px-4 py-3 font-bold text-left">Status</th>
                <th className="px-4 py-3 font-bold text-left">Applied</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-2 py-4 text-gray-500" colSpan={5}>
                    Loading applications...
                  </td>
                </tr>
              ) : recentApplications.length ? (
                recentApplications.map((application) => {
                  const volunteerName = `${application.volunteer?.firstName ?? ''} ${
                    application.volunteer?.lastName ?? ''
                  }`.trim();
                  return (
                    <tr
                      key={application.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {volunteerName || application.volunteer?.email || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {application.position?.projectTitle ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {application.position?.role ?? '—'}
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600">
                        {application.status}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-2 py-4 text-gray-500" colSpan={5}>
                    No applications available.
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
