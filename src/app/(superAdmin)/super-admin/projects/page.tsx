'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import VolunteerSearch from '@/components/volunteer/Search';
import VolunteerPagination from '@/components/volunteer/VolunteerPagination';
import VolunteerProjectsTable from '@/components/general-manager/VolunteerProjectsTable';
import ProjectsDataTable from '@/app/(financeManager)/finance-manager/donation-projects/_components/ProjectsDataTable';
import Pagination from '@/components/ui/Pagination';
import { getAllVolunteerProjects } from '@/lib/api/volunteer';
import { getFinanceManagerProjects } from '@/lib/api/donation';
import { VolunteerProjectRow } from '@/types/Volunteer';
import {
  DonationProject,
  DonationProjectType,
} from '@/types/DonationProjectData';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

type TabKey = 'volunteer' | 'donation';

function useDebouncedValue<T>(value: T, delayMs = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function SuperAdminProjectsPage() {
  const router = useRouter();
  const basePath = useManagerBasePath('general');
  const financeBasePath = useManagerBasePath('finance');

  const [activeTab, setActiveTab] = useState<TabKey>('volunteer');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 450);

  const [page, setPage] = useState(1);
  const limit = 6;
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<VolunteerProjectRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [volunteerError, setVolunteerError] = useState<string | null>(null);

  const [donationProjects, setDonationProjects] = useState<DonationProject[]>(
    [],
  );
  const [donationLoading, setDonationLoading] = useState(true);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [donationPage, setDonationPage] = useState(1);
  const [donationTotalPages, setDonationTotalPages] = useState(1);
  const [donationTypeFilter, setDonationTypeFilter] = useState<
    DonationProjectType | ''
  >('');
  const donationLimit = 20;

  // Track previous search to avoid firing two requests when search changes on a non-first page.
  const prevDebouncedSearch = useRef(debouncedSearch);

  useEffect(() => {
    const controller = new AbortController();

    // If search changed and page isn't 1 yet, reset to page 1 and bail.
    // The resulting page-change re-render will fire this effect again with page=1.
    const searchChanged = prevDebouncedSearch.current !== debouncedSearch;
    if (searchChanged) {
      prevDebouncedSearch.current = debouncedSearch;
      if (page !== 1) {
        setPage(1);
        return () => controller.abort();
      }
    }

    async function loadVolunteerProjects() {
      setLoading(true);
      setVolunteerError(null);
      try {
        const { data, pagination } = await getAllVolunteerProjects(
          page,
          limit,
          debouncedSearch,
          controller.signal,
        );

        setProjects(Array.isArray(data) ? data : []);
        setTotalPages(pagination?.totalPages ?? 1);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setVolunteerError('Unable to load volunteer projects.');
        setProjects([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    loadVolunteerProjects();
    return () => controller.abort();
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    const loadDonationProjects = async () => {
      try {
        setDonationLoading(true);
        setDonationError(null);
        const response = await getFinanceManagerProjects(
          donationPage,
          donationLimit,
          donationTypeFilter || undefined,
        );
        setDonationProjects(response.projects);
        setDonationTotalPages(response.pagination.totalPages);
      } catch {
        setDonationError('Unable to load donation projects.');
        setDonationProjects([]);
        setDonationTotalPages(1);
      } finally {
        setDonationLoading(false);
      }
    };

    loadDonationProjects();
  }, [donationPage, donationLimit, donationTypeFilter]);

  const handleDonationEdit = (projectId: string) => {
    router.push(`${financeBasePath}/donation-projects/${projectId}`);
  };

  const handleDonationDelete = (projectId: string) => {
    console.log(
      `Delete project ${projectId} - functionality to be implemented`,
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="w-full px-6 py-6 md:px-10">
        <PageHeader title="Projects" />

        <div className="mt-6 mb-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('volunteer')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm active:scale-[0.99] ${
              activeTab === 'volunteer'
                ? 'bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] text-white hover:from-[#1A6A59] hover:to-[#22997F]'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Volunteer Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('donation')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm active:scale-[0.99] ${
              activeTab === 'donation'
                ? 'bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] text-white hover:from-[#1A6A59] hover:to-[#22997F]'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Donation Projects
          </button>
        </div>

        {activeTab === 'volunteer' ? (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  All Projects
                </h2>
                <p className="mt-1 text-gray-600">
                  Manage all Volunteer Projects
                </p>
              </div>

              <Link
                href={`${basePath}/projects/new`}
                className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] hover:from-[#1A6A59] hover:to-[#22997F] shadow-sm active:scale-[0.99] transition"
              >
                Add Volunteer Project
              </Link>
            </div>

            <div className="mt-10">
              <VolunteerSearch value={search} onChange={setSearch} />

              {volunteerError ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  {volunteerError}
                </div>
              ) : null}

              <div className="mt-6">
                <VolunteerProjectsTable loading={loading} projects={projects} />
                <VolunteerPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Donation Projects
                </h2>
                <p className="mt-1 text-gray-600">
                  Manage all Donation Projects
                </p>
              </div>
              <Link
                href={`${financeBasePath}/donation-projects/create`}
                className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] hover:from-[#1A6A59] hover:to-[#22997F] shadow-sm active:scale-[0.99] transition"
              >
                Add Donation Project
              </Link>
            </div>

            <div className="mt-4 mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={donationTypeFilter}
                onChange={(e) => {
                  setDonationTypeFilter(
                    e.target.value as DonationProjectType | '',
                  );
                  setDonationPage(1);
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#0E5A4A] focus:ring-1 focus:ring-[#0E5A4A]"
              >
                <option value="">All types</option>
                <option value="brick">Brick</option>
                <option value="sponsor">Sponsor</option>
                <option value="partnerLed">Partner Led</option>
              </select>
            </div>

            {donationError ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {donationError}
              </div>
            ) : null}

            <ProjectsDataTable
              projects={donationProjects}
              loading={donationLoading}
              onEditClick={handleDonationEdit}
              onDeleteClick={handleDonationDelete}
            />

            {!donationLoading && donationProjects.length > 0 && (
              <Pagination
                currentPage={donationPage}
                totalPages={donationTotalPages}
                onPageChange={setDonationPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
