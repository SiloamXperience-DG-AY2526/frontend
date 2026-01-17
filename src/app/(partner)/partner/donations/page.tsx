'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/sidebar';
import Button from '@/components/ui/Button';
import { getDonationHomepage, getDonationProjects } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProjectData';

export default function DonationsPage() {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statistics, setStatistics] = useState({
    totalDonations: 0,
    totalProjects: 0,
    totalDonors: 0,
  });
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load homepage statistics
      const homepage = await getDonationHomepage();
      if (homepage.statistics) {
        setStatistics(homepage.statistics);
      }

      // Load projects
      const response = await getDonationProjects('all');
      setProjects(response.projects);
    } catch (error) {
      console.error('Failed to load donation data:', error);
      alert('Failed to load donation data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/partner/donations/${projectId}`);
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

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.about.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            Make a Difference Today
          </h1>
          <p className="text-center text-gray-600">
            Support causes that matter to you. Every donation helps create
            positive change in our community.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">💼</div>
            <div className="text-3xl font-bold mb-1">
              {statistics.totalProjects}
            </div>
            <div className="text-gray-700 font-semibold">
              Beneficiaries Supported
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(statistics.totalDonations)}
            </div>
            <div className="text-gray-700 font-semibold">
              Total Funds Raised
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🎁</div>
            <div className="text-3xl font-bold mb-1">
              {statistics.totalDonors}
            </div>
            <div className="text-gray-700 font-semibold">Active Donors</div>
          </div>
        </div>

        {/* Fund a Project Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Fund a Project Today</h2>

          {/* Search Bar */}
          <div className="mb-6 bg-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">🔍</span>
              <input
                type="text"
                placeholder="Search through all projects to find one you'd like to support"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading donation projects...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                {/* Project Image */}
                <div className="h-48 bg-white flex items-center justify-center relative overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <p className="text-gray-400">Project Image</p>
                  )}
                </div>

                {/* Project Details */}
                <div className="bg-gray-300 p-4">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-black mb-2">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {project.about}
                  </p>

                  {/* Raised Amount */}
                  <div className="mb-3">
                    <p className="text-xl font-bold">
                      {formatCurrency(project.currentFund)}
                      {project.targetFund && (
                        <span className="text-sm font-normal text-gray-600">
                          {' '}
                          raised of {formatCurrency(project.targetFund)}
                        </span>
                      )}
                    </p>
                    {project.targetFund && (
                      <div className="w-full h-2 bg-gray-400 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-black"
                          style={{
                            width: `${calculateProgress(
                              project.currentFund,
                              project.targetFund
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Donor Count */}
                  <p className="text-sm text-gray-700 mb-4">234 donors</p>

                  {/* Donate Button */}
                  <div className="w-full">
                    <Button
                      label="Donate Now!"
                      onClick={() => handleDonate(project.id)}
                      variant="primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 mb-2">No donation projects found</p>
            <p className="text-sm text-gray-400">
              {searchQuery
                ? 'Try a different search term'
                : 'Check back later for new projects'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
