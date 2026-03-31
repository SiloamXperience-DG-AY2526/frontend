'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  FunnelIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/ui/PageHeader';
import ProjectsDataTable from './_components/ProjectsDataTable';
import Pagination from '@/components/ui/Pagination';
import {
  getFinanceManagerProjects,
  cancelDonationProjectById,
} from '@/lib/api/donation';
import {
  DonationProject,
  DonationProjectType,
} from '@/types/DonationProjectData';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog';
import Toast from '@/components/ui/Toast';

const ITEMS_PER_PAGE = 20;

function useDebouncedValue<T>(value: T, delayMs = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function DonationProjectsPage() {
  const router = useRouter();
  const basePath = useManagerBasePath('finance');
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<DonationProjectType | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 450);
  const prevDebouncedSearch = useRef(debouncedSearch);
  const [refreshKey, setRefreshKey] = useState(0);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
  }>({ open: false, type: 'success', title: '' });

  useEffect(() => {
    const searchChanged = prevDebouncedSearch.current !== debouncedSearch;
    if (searchChanged) {
      prevDebouncedSearch.current = debouncedSearch;
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
    }
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const response = await getFinanceManagerProjects(
          currentPage,
          ITEMS_PER_PAGE,
          typeFilter || undefined,
          debouncedSearch || undefined,
        );
        setProjects(response.projects);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load projects',
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [currentPage, typeFilter, debouncedSearch, refreshKey]);

  const handleEditClick = (projectId: string) => {
    router.push(`${basePath}/donation-projects/${projectId}/edit`);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      await cancelDonationProjectById(projectToDelete);
      setProjectToDelete(null);
      setToast({
        open: true,
        type: 'success',
        title: 'Project cancelled successfully.',
      });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: err instanceof Error ? err.message : 'Failed to cancel project.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-10 py-8">
          <PageHeader title="All Projects" />
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">
              Failed to load projects. Please try again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-10 py-8">
        <div className="flex items-start justify-between gap-6">
          <PageHeader title="All Projects" />
          <button
            type="button"
            onClick={() => router.push(`${basePath}/donation-projects/create`)}
            className="rounded-full bg-[#0E5A4A] px-6 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Add project
          </button>
        </div>

        <div className="mt-4 flex w-full md:w-1/2 items-center gap-3 rounded-xl bg-[#F0F0F2] px-4 py-3 shadow-sm">
          <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mt-3 mb-4">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
            {typeFilter && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0E5A4A] text-xs font-semibold text-white">
                1
              </span>
            )}
            {showFilters ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>

          {showFilters && (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <span className="mr-1 text-sm font-medium text-gray-600">
                Type:
              </span>
              {(
                [
                  { value: '', label: 'All types' },
                  { value: 'brick', label: 'Brick' },
                  { value: 'sponsor', label: 'Sponsor' },
                  { value: 'partnerLed', label: 'Partner Led' },
                ] as { value: DonationProjectType | ''; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value || 'all'}
                  type="button"
                  onClick={() => {
                    setTypeFilter(value);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    typeFilter === value
                      ? 'bg-[#0E5A4A] text-white'
                      : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <ProjectsDataTable
          projects={projects}
          loading={loading}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />

        {!loading && projects.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {projectToDelete && (
        <DeleteConfirmDialog
          onConfirm={handleConfirmDelete}
          onClose={() => setProjectToDelete(null)}
          loading={deleting}
        />
      )}

      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
}
