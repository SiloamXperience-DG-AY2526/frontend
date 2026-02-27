'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import ProjectsDataTable from './_components/ProjectsDataTable';
import Pagination from '@/components/ui/Pagination';
import { getFinanceManagerProjects } from '@/lib/api/donation';
import {
  DonationProject,
  DonationProjectType,
} from '@/types/DonationProjectData';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

export default function DonationProjectsPage() {
  const router = useRouter();
  const basePath = useManagerBasePath('finance');
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<DonationProjectType | ''>('');
  const ITEMS_PER_PAGE = 20;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFinanceManagerProjects(
        currentPage,
        ITEMS_PER_PAGE,
        typeFilter || undefined,
      );
      setProjects(response.projects);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, typeFilter]);

  const handleEditClick = (projectId: string) => {
    router.push(`${basePath}/donation-projects/${projectId}`);
  };

  const handleDeleteClick = (projectId: string) => {
    // Placeholder for delete functionality
    console.log(
      `Delete project ${projectId} - functionality to be implemented`,
    );
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

        <div className="mt-2 mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as DonationProjectType | '');
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#0E5A4A] focus:ring-1 focus:ring-[#0E5A4A]"
          >
            <option value="">All types</option>
            <option value="brick">Brick</option>
            <option value="sponsor">Sponsor</option>
            <option value="partnerLed">Partner Led</option>
          </select>
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
    </div>
  );
}
