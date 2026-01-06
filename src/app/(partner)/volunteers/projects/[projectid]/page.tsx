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
import TargetIcon from "@/components/icons/TargetIcon";
import Link from "next/link";
function capitalizeFirst(s?: string | null) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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
function ObjectiveList({ text }: { text: string }) {
  const items = text
    .split("\n")
    .map((i) => i.replace(/^•\s*/, "").trim())
    .filter(Boolean);

  return (
    <ul className="mt-4 space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <TargetIcon className="mt-0.5 shrink-0" />
          <span className="text-sm md:text-[15px] text-gray-800 leading-6">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
export default function VolunteerProjectDetailPage({
  params,
}: {
  params: Promise<{ projectid: string }>;
}) {
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

    const freq = data.frequency ? capitalizeFirst(data.frequency) : null; 
    const time = formatTimeRange(data.startTime, data.endTime);

    return freq ? `${freq}, ${time}` : time;
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
              {data.objectives ? <ObjectiveList text={data.objectives} /> : "—"}
            </Section>

            <Section title="Beneficiary Details">
              {data.beneficiaries ?? "—"}
            </Section>

            {/* Volunteer positions */}
          </div>

          {/* RIGHT card */}
          <aside className="w-full lg:w-[340px]">
            <div className="mt-20">
              <div className="h-[280px] rounded-2xl border bg-white p-6 shadow-sm flex flex-col justify-center">
                {/* Info rows */}
                <div className="space-y-5">
                  <InfoRow icon={CalendarIcon} text={dateText} />
                  <InfoRow icon={ClockIcon} text={timeText} />
                  <InfoRow icon={MapPinIcon} text={data.location ?? "—"} />
                </div>

                {/* Button */}
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
                href={`/volunteers/projects/${data.id}/apply?positionId=${pos.id}`}
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
