'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getDonationHomepage, getDonationProjects } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProject';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/volunteer/StatCard';
import HumanStatIcon from '@/components/icons/HumanIcon';
import ClockIcon from '@/components/icons/ClockIcon';
import HeartIcon from '@/components/icons/HeartIcon';
import Toast from '@/components/ui/Toast';

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
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/partner/login');
      return;
    }
  }, [user, authLoading, router]);

  // Debounce the search input so we only hit the API after 450 ms of no typing
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const cancelledRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 450);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load homepage stats once after authentication
  useEffect(() => {
    if (!user) return;
    getDonationHomepage()
      .then((homepage) => {
        if (homepage.statistics) setStatistics(homepage.statistics);
      })
      .catch(() => {
        /* stats are non-critical */
      });
  }, [user]);

  // Reload projects whenever the debounced search term changes (server-side)
  useEffect(() => {
    if (!user) return;
    cancelledRef.current = false;
    setLoading(true);
    getDonationProjects('all', 1, 50, debouncedSearch || undefined)
      .then((response) => {
        if (!cancelledRef.current) setProjects(response.projects);
      })
      .catch((error) => {
        if (!cancelledRef.current) {
          console.error('Failed to load donation projects:', error);
          setToast({
            open: true,
            type: 'error',
            title: 'Failed to load donation data',
            message: 'Please try again.',
          });
        }
      })
      .finally(() => {
        if (!cancelledRef.current) setLoading(false);
      });
    return () => {
      cancelledRef.current = true;
    };
  }, [user, debouncedSearch]);

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

  return (
    <div className="flex h-screen overflow-y-auto bg-gray-50">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
      <main className="w-full px-6 py-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="mt-1 flex items-start gap-3">
            <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-2" />
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">Donations</h1>
              <p className="mt-2 text-sm text-gray-600">
                Support causes that matter to you and create lasting impact.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/partner/donations/proposal')}
            className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] hover:from-[#1A6A59] hover:to-[#22997F] shadow-sm active:scale-[0.99] transition cursor-pointer"
          >
            Have a fundraising idea? Propose a project.
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            value={String(statistics.activeProjects)}
            label="Active Projects"
            Icon={HumanStatIcon}
          />
          <StatCard
            value={formatCurrency(parseFloat(statistics.totalRaised))}
            label="Total Funds Raised"
            Icon={ClockIcon}
          />
          <StatCard
            value={String(statistics.totalDonations)}
            label="Total Donations"
            Icon={HeartIcon}
          />
        </div>

        {/* Fund a Project Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Fund a Project Today
          </h2>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="flex w-full md:w-1/2 items-center gap-3 rounded-xl bg-[#F0F0F2] px-4 py-3 shadow-sm">
              <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                type="text"
                placeholder="Search donation projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 rounded-2xl border bg-white p-8 text-sm text-gray-600 shadow-sm">
              Loading donation projects...
            </div>
          )}

          {/* Projects Grid */}
          {!loading && projects.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition hover:shadow-md hover:-translate-y-[2px] cursor-pointer flex flex-col"
                >
                  {/* Project Image */}
                  <div className="relative h-[220px] w-full bg-gray-100 overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {project.about}
                    </p>

                    {/* Raised Amount */}
                    <div className="mb-4">
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        {formatCurrency(parseFloat(project.totalRaised || '0'))}
                        {project.targetFund && (
                          <span className="text-sm font-normal text-gray-600">
                            {' '}
                            raised of{' '}
                            {formatCurrency(parseFloat(project.targetFund))}
                          </span>
                        )}
                      </p>
                      {project.targetFund && (
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full transition-all duration-500"
                            style={{
                              width: `${calculateProgress(
                                parseFloat(project.totalRaised || '0'),
                                parseFloat(project.targetFund),
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
                        className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                      >
                        Donate Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="mt-6 rounded-2xl border bg-white p-8 text-sm text-gray-600 shadow-sm">
              <p className="font-semibold text-gray-700">
                No donation projects found
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery
                  ? 'Try a different search term.'
                  : 'Check back later for new projects.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
