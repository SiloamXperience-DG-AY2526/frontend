'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import { getVolunteerProjectDetails } from '@/lib/api/volunteer';
import { formatShortDate, formatTimeRange } from '@/lib/utils/date';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import type { VolunteerProjectDetail } from '@/types/Volunteer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import capitalizeFirst from '@/lib/utils/capitalizeFirst';
import Section from '@/components/volunteer/project/Section';
import ObjectiveList from '@/components/volunteer/project/ObjectiveList';
import InfoRow from '@/components/volunteer/project/InfoRow';

export default function VolunteerProjectDetailPage({
  params,
}: {
  params: Promise<{ projectid: string }>;
}) {
  const { projectid } = use(params);
  const router = useRouter();

  const [data, setData] = useState<VolunteerProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await getVolunteerProjectDetails(projectid);
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
  }, [projectid]);

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

  const scrollToPositions = () => {
    const el = document.getElementById('positions');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="flex  h-screen overflow-y-auto bg-gray-50">
      <main className="w-full px-6 py-6 md:px-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
    mt-1 inline-flex h-8 w-8

    rounded-lg
 cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-teal-600/40
  "
            >
              <svg
                width="9"
                height="17"
                viewBox="0 0 9 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 15.0468L1 8.02338L8 1"
                  stroke="#333333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
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
              <div className="h-[280px] rounded-2xl border bg-white p-6 shadow-sm flex flex-col justify-center">
                {/* Info rows */}
                <div className="space-y-5">
                  <InfoRow icon={CalendarIcon} text={dateText} />
                  <InfoRow icon={ClockIcon} text={timeText} />
                  <InfoRow icon={MapPinIcon} text={data.location ?? '—'} />
                </div>

                <button
                  onClick={scrollToPositions}
                  className="
          mt-8 w-full rounded-lg
          bg-teal-600 px-4 py-3
          text-sm font-semibold text-white
          hover:bg-teal-700 active:bg-teal-800
        "
                >
                  I want to volunteer
                </button>
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
      </main>
    </div>
  );
}
