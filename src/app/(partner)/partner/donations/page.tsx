'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/ui/Button';
import { getDonationProjects } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProject';

export default function DonationsPage() {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'specific'>('all');
  const router = useRouter();

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await getDonationProjects(filter);
      setProjects(response.projects);
    } catch (error) {
      console.error('Failed to load donation projects:', error);
      alert('Failed to load donation projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (projectId: string) => {
    router.push(`/partner/donations/${projectId}/donate`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number | null) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
          <div>
            <h1 className="text-2xl font-bold">
              Donation <span className="bg-yellow-300 px-1">Projects</span>
            </h1>
            <p className="text-sm text-gray-500">
              Support our projects and make a difference
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === 'all'
                ? 'bg-[#195D4B] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('ongoing')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === 'ongoing'
                ? 'bg-[#195D4B] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setFilter('specific')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              filter === 'specific'
                ? 'bg-[#195D4B] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Specific Projects
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading donation projects...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition"
              >
                {/* Project Image */}
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-400">No Image</p>
                  </div>
                )}

                {/* Project Details */}
                <div className="p-5">
                  {/* Type Badge */}
                  <div className="mb-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        project.type === 'ONGOING'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {project.type === 'ONGOING' ? 'Ongoing' : 'Specific Project'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-gray-600 mb-3">
                    📍 {project.location}
                  </p>

                  {/* About (truncated) */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {project.about}
                  </p>

                  {/* Progress Bar (if target fund exists) */}
                  {project.targetFund && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-700">
                          {formatCurrency(project.currentFund)}
                        </span>
                        <span className="text-gray-500">
                          of {formatCurrency(project.targetFund)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#56E0C2] transition-all"
                          style={{
                            width: `${calculateProgress(
                              project.currentFund,
                              project.targetFund
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Deadline */}
                  <p className="text-xs text-gray-500 mb-4">
                    Deadline: {formatDate(project.deadline)}
                  </p>

                  {/* Donate Button */}
                  <Button
                    label="Donate Now"
                    onClick={() => handleDonate(project.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 mb-2">No donation projects found</p>
            <p className="text-sm text-gray-400">
              {filter !== 'all'
                ? `Try changing the filter to see more projects`
                : `Check back later for new projects`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
