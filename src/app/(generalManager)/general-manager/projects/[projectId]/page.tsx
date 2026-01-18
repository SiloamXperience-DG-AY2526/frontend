'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import {
  getVolunteerProjectDetails,
  getVolunteerApplicationsForProject,
  updateVolunteerApplicationStatus,
} from '@/lib/api/volunteer';
import { formatShortDate, formatTimeRange } from '@/lib/utils/date';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import type { VolunteerProjectDetail } from '@/types/Volunteer';
import Image from 'next/image';

import Link from 'next/link';
import capitalizeFirst from '@/lib/utils/capitalizeFirst';
import Section from '@/components/volunteer/project/Section';
import ObjectiveList from '@/components/volunteer/project/ObjectiveList';
import InfoRow from '@/components/volunteer/project/InfoRow';
import { useRouter } from 'next/navigation';

export default function VolunteerProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  const [data, setData] = useState<VolunteerProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<
    Array<{
      id: string;
      status: string;
      createdAt: string;
      availability: string | null;
      volunteer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      position: {
        id: string;
        role: string;
        projectId: string;
      };
    }>
  >([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await getVolunteerProjectDetails(projectId);
        if (mounted) setData(res.data as VolunteerProjectDetail);
      } catch (e: unknown) {
        console.error(e);
        if (mounted) setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  useEffect(() => {
    let mounted = true;

    async function loadApplications() {
      try {
        setApplicationsLoading(true);
        setApplicationsError(null);
        const res = await getVolunteerApplicationsForProject(projectId);
        const list = Array.isArray(res) ? res : res?.data ?? res ?? [];
        if (!mounted) return;
        setApplications(list);
      } catch (e: unknown) {
        if (!mounted) return;
        setApplicationsError(
          e instanceof Error ? e.message : 'Failed to load applications'
        );
      } finally {
        if (mounted) setApplicationsLoading(false);
      }
    }

    if (projectId) loadApplications();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const dateText = useMemo(() => {
    if (!data) return '—';
    return data.startDate && data.endDate
      ? `${formatShortDate(data.startDate)} - ${formatShortDate(data.endDate)}`
      : formatShortDate(data.startDate);
  }, [data]);

  const timeText = useMemo(() => {
    if (!data) return '—';

    const freq = data.frequency ? capitalizeFirst(data.frequency) : null;
    const time = formatTimeRange(data.startTime, data.endTime);

    return freq ? `${freq}, ${time}` : time;
  }, [data]);

  const handleEditProject = () => {
    router.push(`/general-manager/projects/${data?.id}/edit`);
  };

  const handleStatusUpdate = async (
    applicationId: string,
    status: 'reviewing' | 'approved' | 'rejected'
  ) => {
    setUpdatingId(applicationId);
    try {
      await updateVolunteerApplicationStatus(applicationId, status);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (e) {
      alert(
        e instanceof Error
          ? e.message
          : 'Failed to update application status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
    
        <main className="w-full px-6 py-6 md:px-10">
          <div className="rounded-2xl border bg-white p-8 text-sm text-gray-600 shadow-sm">
            Loading project details...
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen bg-gray-50">
      
        <main className="w-full px-6 py-6 md:px-10">
          <div className="rounded-2xl border bg-white p-8 text-sm text-gray-600 shadow-sm">
            Project not found / failed to load.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="w-full px-6 py-6 md:px-10 pb-12">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="mb-8 flex items-start mt-1 gap-3">
              <div className="w-[5px] h-[39px] bg-[#56E0C2]" />
              <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
            </div>

            {/* Image */}
            <div className="mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="relative h-[280px] w-full bg-gray-100">
                {data.image ? (
                  <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Content sections */}
            <Section title="Organiser">{data.initiatorName ?? '—'}</Section>
            <Section title="About">{data.aboutDesc ?? '—'}</Section>
            <Section title="Objectives/ Goals">
              {data.objectives ? <ObjectiveList text={data.objectives} /> : '—'}
            </Section>

            <Section title="Beneficiary Details">
              {data.beneficiaries ?? '—'}
            </Section>

            {/* Volunteer positions */}
          </div>

          <aside className="w-full lg:w-[340px]">
            <div className="mt-20">
              <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col gap-6">
                {/* Info rows */}
                <div className="space-y-5">
                  <InfoRow icon={CalendarIcon} text={dateText} />
                  <InfoRow icon={ClockIcon} text={timeText} />
                  <InfoRow icon={MapPinIcon} text={data.location ?? '—'} />
                </div>

                <div className="grid gap-3">
                  <button
                    onClick={handleEditProject}
                    className="
            w-full rounded-lg
            bg-teal-600 px-4 py-2.5
            text-sm font-semibold text-white
            hover:bg-teal-700 active:bg-teal-800
          "
                  >
                    Edit Project
                  </button>
                  <Link
                    href={`/general-manager/projects/${data.id}/feedback`}
                    className="w-full inline-flex items-center justify-center rounded-lg border border-teal-600 px-4 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50"
                  >
                    View Feedback
                  </Link>
                  <Link
                    href={`/general-manager/projects/${data.id}/feedback/submit`}
                    className="w-full inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Submit Feedback
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
        <div
          id="positions"
          className="mt-12 rounded-2xl bg-[#E3F0EC] p-8 scroll-mt-24"
        >
          <h2 className="text-xl font-bold text-gray-900">
            Volunteer positions
          </h2>

          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {data.positions?.map((pos) => (
              <Link
                key={pos.id}
                href={`/partner/volunteers/projects/${data.id}/apply?positionId=${pos.id}`}
                className="
          relative block min-h-[340px]
          rounded-2xl bg-white border border-gray-200
          p-7 shadow-sm
          transition hover:shadow-md hover:-translate-y-[2px]
          active:scale-[0.99]
        "
              >
                {/* badge */}
                <span className="absolute top-5 right-5 rounded-full bg-[#7EDDC3] px-4 py-1.5 text-xs  text-black">
                  {pos.slotsAvailable} spots left
                </span>

                <h3 className="text-lg font-bold text-gray-900 pr-19">
                  {pos.role}
                </h3>

                <div className="mt-5 text-sm text-gray-700">
                  <div className="font-semibold text-teal-700 mb-1">
                    Description:
                  </div>
                  {pos.description}
                </div>

                <div className="mt-6 text-sm text-gray-700">
                  <div className="font-semibold text-teal-700 mb-2">
                    Skills needed:
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {pos.skills.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Volunteer applications
            </h2>
          </div>

          {applicationsLoading ? (
            <div className="mt-4 text-sm text-gray-600">Loading...</div>
          ) : applicationsError ? (
            <div className="mt-4 text-sm text-red-600">{applicationsError}</div>
          ) : applications.length === 0 ? (
            <div className="mt-4 text-sm text-gray-600">
              No applications yet.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="py-3 pr-4">Volunteer</th>
                    <th className="py-3 pr-4">Position</th>
                    <th className="py-3 pr-4">Applied</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => {
                    const name = `${app.volunteer.firstName ?? ''} ${
                      app.volunteer.lastName ?? ''
                    }`.trim();
                    const appliedAt = new Date(app.createdAt).toLocaleDateString(
                      'en-SG',
                      { month: 'short', day: '2-digit', year: 'numeric' }
                    );
                    const status = app.status as
                      | 'reviewing'
                      | 'approved'
                      | 'rejected';

                    return (
                      <tr key={app.id}>
                        <td className="py-4 pr-4">
                          <div className="font-semibold text-gray-900">
                            {name || 'Volunteer'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {app.volunteer.email}
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-gray-700">
                          {app.position.role}
                        </td>
                        <td className="py-4 pr-4 text-gray-700">
                          {appliedAt}
                        </td>
                        <td className="py-4 pr-4">
                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                            {status}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <select
                            value={status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                app.id,
                                e.target.value as 'reviewing' | 'approved' | 'rejected'
                              )
                            }
                            disabled={updatingId === app.id}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                          >
                            <option value="reviewing">Reviewing</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
