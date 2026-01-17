'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/sidebar';
import Button from '@/components/ui/Button';
import { getDonationHomepage, getDonationProjects } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProject';
import { useAuth } from '@/contexts/AuthContext';

export default function DonationsPage() {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statistics, setStatistics] = useState({
    totalRaised: '0',
    totalDonations: 0,
    activeProjects: 0,
  });
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/partner/login');
      return;
    }

    // Load data only when authenticated
    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

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
      setProjects(response.projectsWithTotals);
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

  const filteredProjects = (projects || []).filter((project) =>
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
            Support causes that matter to you. Every donation helps create positive change in our community.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-1">
              {statistics.activeProjects}
            </div>
            <div className="text-gray-700 font-semibold">
              Active Projects
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(parseFloat(statistics.totalRaised))}
            </div>
            <div className="text-gray-700 font-semibold">
              Total Funds Raised
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-1">
              {statistics.totalDonations}
            </div>
            <div className="text-gray-700 font-semibold">
              Total Donations
            </div>
          </div>
        </div>

        {/* Fund a Project Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Fund a Project Today</h2>
          
          {/* Search Bar */}
          <div className="mb-6 bg-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
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
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col"
              >
                {/* Project Image */}
                <div className="h-56 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <p className="text-gray-400 text-lg">Project Image</p>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {project.about}
                  </p>

                  {/* Raised Amount */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {formatCurrency(parseFloat(project.totalRaised || '0'))}
                      {project.targetFund && (
                        <span className="text-base font-normal text-gray-600">
                          {' '}raised of {formatCurrency(parseFloat(project.targetFund))}
                        </span>
                      )}
                    </p>
                    {project.targetFund && (
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-800 rounded-full transition-all duration-500"
                          style={{
                            width: `${calculateProgress(
                              parseFloat(project.totalRaised || '0'),
                              parseFloat(project.targetFund)
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Donor Count */}
                  <p className="text-sm text-gray-600 mb-5">234 donors</p>

                  {/* Donate Button */}
                  <div className="mt-auto flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDonate(project.id);
                      }}
                      className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                    >
                      Donate Now!
                    </button>
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
