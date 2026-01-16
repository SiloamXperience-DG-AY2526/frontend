'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import ProjectsDataTable from './_components/ProjectsDataTable';
import Pagination from '@/components/ui/Pagination';
import { getFinanceManagerProjects } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProject';
import { FunnelIcon } from '@heroicons/react/24/outline';

export default function DonationProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFinanceManagerProjects(
        currentPage,
        ITEMS_PER_PAGE
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
  }, [currentPage]);

  const handleFilterClick = () => {
    // Placeholder for filter functionality
    console.log('Filter button clicked - filters to be implemented');
  };

  const handleEditClick = (projectId: string) => {
    router.push(`/finance-manager/donation-projects/${projectId}`);
  };

  const handleDeleteClick = (projectId: string) => {
    // Placeholder for delete functionality
    console.log(
      `Delete project ${projectId} - functionality to be implemented`
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
        <PageHeader title="All Projects" />

        <div className="mt-6 mb-4">
          <button
            onClick={handleFilterClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">Filters</span>
          </button>
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
