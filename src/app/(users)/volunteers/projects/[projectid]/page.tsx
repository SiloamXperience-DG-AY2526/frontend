"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/sidebar";
import { getVolunteerProjectDetail } from "@/lib/api/volunteer";
import { formatShortDate, formatTimeRange } from "@/lib/utils/date";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import type { VolunteerProjectDetail } from "@/types/Volunteer";

function InfoRow({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#195D4B]">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span>{text}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-teal-700 tracking-tight">
        {title}
      </h2>
      <div className="mt-2 text-sm md:text-[15px] text-gray-700 leading-6">
        {children}
      </div>
    </section>
  );
}

export default function VolunteerProjectDetailPage({
  params,
}: {
  params: Promise<{ projectid: string }>;
}) {
  // ✅ Next.js new params Promise behavior
  const { projectid } = use(params);

  const [data, setData] = useState<VolunteerProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await getVolunteerProjectDetail(projectid);
        if (mounted) setData(res.data as any);
      } catch (e) {
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
    if (!data) return "—";
    return data.startDate && data.endDate
      ? `${formatShortDate(data.startDate)} - ${formatShortDate(data.endDate)}`
      : formatShortDate(data.startDate);
  }, [data]);

  const timeText = useMemo(() => {
    if (!data) return "—";
    return formatTimeRange(data.startTime, data.endTime);
  }, [data]);

  const scrollToPositions = () => {
    const el = document.getElementById("positions");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
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
        <Sidebar />
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
      <Sidebar />

      <main className="w-full px-6 py-6 md:px-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* LEFT */}
          <div className="flex-1">
            <div className="mb-8 flex items-start mt-1 gap-3">
              <div className="w-[5px] h-[39px] bg-[#56E0C2]" />
              <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
            </div>

            {/* Image */}
            <div className="mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="relative h-[280px] w-full bg-gray-100">
                {data.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.image}
                    alt={data.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Content sections */}
            <Section title="Organiser">{data.initiatorName ?? "—"}</Section>
            <Section title="About">{data.aboutDesc ?? "—"}</Section>
            <Section title="Objectives/ Goals">
              {data.objectives ?? "—"}
            </Section>
            <Section title="Beneficiary Details">
              {data.beneficiaries ?? "—"}
            </Section>

            {/* Volunteer positions */}
            <div
              id="positions"
              className="mt-10 rounded-2xl bg-teal-50 p-6 scroll-mt-24"
            >
              <h2 className="text-lg font-bold text-gray-900">
                Volunteer positions
              </h2>

              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {data.positions?.map((pos) => (
                  <div
                    key={pos.id}
                    className="rounded-2xl bg-white p-5 shadow-sm border"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-gray-900">
                        {pos.role}
                      </div>
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                        {pos.slotsAvailable} spots left
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                      <div className="font-semibold text-teal-700">
                        Description:
                      </div>
                      <div className="mt-1">{pos.description}</div>
                    </div>

                    <div className="mt-4 text-sm text-gray-700">
                      <div className="font-semibold text-teal-700">
                        Skills needed:
                      </div>
                      {pos.skills?.length ? (
                        <ul className="mt-2 list-disc pl-5">
                          {pos.skills.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-1">—</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT card */}
          <aside className="w-full lg:w-[340px]">
            <div className="mt-20">
              <div className="max-h-[calc(100vh-48px)] overflow-auto rounded-2xl border bg-white p-5 shadow-sm">
                <div className="space-y-4">
                  <InfoRow icon={CalendarIcon} text={dateText} />
                  <InfoRow icon={ClockIcon} text={timeText} />
                  <InfoRow icon={MapPinIcon} text={data.location ?? "—"} />
                </div>

                <button
                  onClick={scrollToPositions}
                  className="mt-5 w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 active:bg-teal-800"
                >
                  I want to volunteer
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
