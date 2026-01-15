'use client';

import Sidebar from '@/components/sidebar';
import React, { useEffect, useState } from 'react';

import VolunteerSearch from '@/components/volunteer/Search';
import VolunteerProjectGrid from '@/components/volunteer/VolunteerProjectGrid';
import VolunteerPagination from '@/components/volunteer/VolunteerPagination';

import { getAvailableVolunteerProjects } from '@/lib/api/volunteer';
import { VolunteerProject } from '@/types/Volunteer';
import StatCard from '@/components/volunteer/StatCard';
import HumanStatIcon from '@/components/icons/HumanIcon';
import ClockIcon from '@/components/icons/ClockIcon';
import HeartIcon from '@/components/icons/HeartIcon';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';

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
    value: '6000+',
    label: 'Volunteers Currently Engaged',
    Icon: HumanStatIcon,
  },
  {
    value: '200+',
    label: 'Total Hours Volunteered',
    Icon: ClockIcon,
  },
  {
    value: '450+',
    label: 'Lives Touched',
    Icon: HeartIcon,
  },
] as const;

export default function VolunteerPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 450);

  const [page, setPage] = useState(1);
  const limit = 6;

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<VolunteerProject[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastTitle, setToastTitle] = useState('');
  const [toastMsg, setToastMsg] = useState<string | undefined>(undefined);

  useEffect(() => setPage(1), [debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const { data, pagination } = await getAvailableVolunteerProjects(
          page,
          limit,
          debouncedSearch,
          controller.signal
        );

        setProjects(Array.isArray(data) ? data : []);
        setTotalPages(pagination?.totalPages ?? 1);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setToastType('error');
        setToastTitle('Unable to load');
        setToastMsg(`Unable to load projects: ${e}`);
        setToastOpen(true);

        setProjects([]);
        setTotalPages(1);
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
      <Toast
        open={toastOpen}
        type={toastType}
        title={toastTitle}
        message={toastMsg}
        duration={3500}
        onClose={() => setToastOpen(false)}
      />

      <main className="w-full px-6 py-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Volunteer</h1>
            <p className="mt-1 text-gray-600">Join our volunteer community</p>
          </div>

          <Link
            href="/volunteers/projects/proposal"
            className="inline-flex items-center justify-center
        rounded-xl px-6 py-2.5 text-sm font-bold text-white
        bg-gradient-to-r from-[#1F7A67] to-[#2AAE92]
        hover:from-[#1A6A59] hover:to-[#22997F]
        shadow-sm
        active:scale-[0.99]
        transition cursor-pointer"
          >
            Have a project idea? We’d love to hear it.
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stats.map((s, idx) => (
            <StatCard key={idx} value={s.value} label={s.label} Icon={s.Icon} />
          ))}
        </div>

        {/* activities */}
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
