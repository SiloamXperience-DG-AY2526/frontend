'use client';

import { useEffect, useState } from 'react';
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
  duplicateDonationProject,
  cancelDonationProjectById,
} from '@/lib/api/donation';
import {
  DonationProject,
  DonationProjectType,
} from '@/types/DonationProjectData';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog';

function useDebouncedValue<T>(value: T, delayMs = 450) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export default function DonationProjectsPage() {
  const router = useRouter();
  const basePath = useManagerBasePath('finance');

  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 450);
  const [typeFilter, setTypeFilter] = useState<DonationProjectType | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'success', title: '' });

  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [duplicatingProjectId, setDuplicatingProjectId] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, typeFilter]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getFinanceManagerProjects(
          currentPage,
          ITEMS_PER_PAGE,
          typeFilter || undefined,
          debouncedSearch || undefined,
          controller.signal,
        );

        if (!mounted) return;
        setProjects(response.projects);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
      controller.abort();
    };
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

  const handleDuplicateClick = (projectId: string) => {
    setDuplicatingProjectId(projectId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDuplicate = async () => {
    if (!duplicatingProjectId) return;

    setIsDuplicating(true);
    setShowConfirmDialog(false);

    try {
      const duplicatedProject = await duplicateDonationProject(duplicatingProjectId);
      setToast({
        open: true,
        type: 'success',
        title: 'Project duplicated successfully',
      });
      // Redirect to the edit page of the duplicated project.
      setTimeout(() => {
        router.push(`${basePath}/donation-projects/${duplicatedProject.id}/edit`);
      }, 1000);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Failed to duplicate project',
        message: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsDuplicating(false);
      setDuplicatingProjectId(null);
    }
  };

  const handleCancelDuplicate = () => {
    setShowConfirmDialog(false);
    setDuplicatingProjectId(null);
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
            <p className="text-red-800">Failed to load projects. Please try again.</p>
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
            onClick={() => router.push(`${basePath}/donation-projects/new`)}
            className="rounded-full bg-[#0E5A4A] px-6 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Add project
          </button>
        </div>

        <div className="mt-4 flex w-full items-center gap-3 rounded-xl bg-[#F0F0F2] px-4 py-3 shadow-sm md:w-1/2">
          <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mb-4 mt-3">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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
              <span className="mr-1 text-sm font-medium text-gray-600">Type:</span>
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
                  onClick={() => setTypeFilter(value)}
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
          onDuplicateClick={handleDuplicateClick}
          isDuplicating={isDuplicating}
          duplicatingProjectId={duplicatingProjectId}
        />

        {!loading && projects.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <Toast
          open={toast.open}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
        />

        <ConfirmDialog
          open={showConfirmDialog}
          title="Duplicate this project?"
          message="This will create a copy of the project in draft status. You can then edit the duplicated project."
          confirmText="Duplicate"
          cancelText="Cancel"
          onConfirm={handleConfirmDuplicate}
          onCancel={handleCancelDuplicate}
        />
      </main>

      {projectToDelete && (
        <DeleteConfirmDialog
          onConfirm={handleConfirmDelete}
          onClose={() => setProjectToDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
