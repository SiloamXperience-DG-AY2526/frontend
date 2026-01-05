"use client";

import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";

// import { UserIcon, ClockIcon, HeartIcon } from "@heroicons/react/24/solid";
import VolunteerSearch from "@/components/volunteer/Search";
import VolunteerProjectGrid from "@/components/volunteer/VolunteerProjectGrid";
import VolunteerPagination from "@/components/volunteer/VolunteerPagination";

import { getAvailableVolunteerProjects } from "@/lib/api/volunteer";
import { VolunteerProject } from "@/types/Volunteer";
import StatCard from "@/components/volunteer/StatCard";
import HumanStatIcon from "@/components/icons/HumanIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import HeartIcon from "@/components/icons/HeartIcon";


function useDebouncedValue<T>(value: T, delayMs = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
const stats = [
  {
    value: "6000+",
    label: "Volunteers Currently Engaged",
    Icon: HumanStatIcon,
  },
  {
    value: "200+",
    label: "Total Hours Volunteered",
    Icon: ClockIcon,
  },
  {
    value: "450+",
    label: "Lives Touched",
    Icon: HeartIcon,
  },
] as const;

export default function VolunteerPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 450);

  const [page, setPage] = useState(1);
  const limit = 6;

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<VolunteerProject[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => setPage(1), [debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const json = await getAvailableVolunteerProjects({
          page,
          limit,
          search: debouncedSearch,
          signal: controller.signal,
        });

        setProjects(Array.isArray(json.data) ? json.data : []);
        setTotalPages(json.pagination?.totalPages ?? 1);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          console.error(e);
          setProjects([]);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit, debouncedSearch]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="w-full px-6 py-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Volunteer</h1>
            <p className="mt-1 text-gray-600">Join our volunteer community.</p>
          </div>

          <button className="inline-flex w-full items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 md:w-auto">
            Have a project idea? We’d love to hear it.
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stats.map((s, idx) => (
            <StatCard key={idx} value={s.value} label={s.label} Icon={s.Icon} />
          ))}
        </div>

        {/* Needed Most */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Volunteer Where You’re Needed Most
          </h2>

          <VolunteerSearch value={search} onChange={setSearch} />

          <div className="mt-6">
            <VolunteerProjectGrid loading={loading} projects={projects} />
            <VolunteerPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
