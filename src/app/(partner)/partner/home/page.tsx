'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { getAvailableVolunteerProjects } from '@/lib/api/volunteer';
import { getDonationProjects } from '@/lib/api/donation';
import { VolunteerProject } from '@/types/Volunteer';
import { DonationProject } from '@/types/DonationProjectData';
import { fetchMyVolunteerApplications } from '@/lib/api/volunteer';
import { VolunteerApplicationDTO } from '@/types/Volunteer';
import { formatShortDate, formatTimeRange } from '@/lib/utils/date';

export default function PartnerHomePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [volunteerProjects, setVolunteerProjects] = useState<VolunteerProject[]>([]);
  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([]);
  const [upcomingJoined, setUpcomingJoined] = useState<VolunteerApplicationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const [volRes, donRes, joinedRes] = await Promise.allSettled([
          getAvailableVolunteerProjects(1, 3),
          getDonationProjects('all', 1, 3),
          fetchMyVolunteerApplications({ status: 'approved' }),
        ]);

        if (!mounted) return;

        if (volRes.status === 'fulfilled') {
          setVolunteerProjects(Array.isArray(volRes.value?.data) ? volRes.value.data : []);
        }
        if (donRes.status === 'fulfilled') {
          setDonationProjects(Array.isArray(donRes.value?.projects) ? donRes.value.projects.slice(0, 3) : []);
        }
        if (joinedRes.status === 'fulfilled') {
          // Filter to only upcoming projects
          const now = new Date();
          const upcoming = (joinedRes.value || []).filter(
            (a: VolunteerApplicationDTO) => new Date(a.project.startDate) > now
          );
          setUpcomingJoined(upcoming.slice(0, 3));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-10 py-8">
          <div className="rounded-2xl border bg-white p-8 text-sm text-gray-600 shadow-sm">
            Loading your workspace...
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 px-10 py-8">
          <div className="rounded-2xl border bg-white p-8 text-sm text-gray-600 shadow-sm">
            Please sign in to continue.
          </div>
        </main>
      </div>
    );
  }

  const firstName = user.firstName || 'Partner';

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(amount);

  const calculateProgress = (current: number, target: number | null) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  // Compute days until next upcoming joined event
  const nextJoined = upcomingJoined[0];
  const daysUntilNext = nextJoined
    ? Math.max(0, Math.ceil((new Date(nextJoined.project.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-8 py-8 overflow-y-auto">
        {/* Top section: Greeting + Upcoming panel */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Greeting + Stats */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, <span className="text-[#1F7A67]">{firstName}</span>
            </h1>

            {/* Impact Stats Cards */}
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-[#195D4B] to-[#2AAE92] p-6 text-white">
                <p className="text-center">
                  <span className="text-3xl font-bold">Over 1200 </span>
                  <span className="text-lg">beneficiaries supported last year</span>
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-[#195D4B] to-[#2AAE92] p-6 text-white">
                <p className="text-center">
                  <span className="text-3xl font-bold">300 </span>
                  <span className="text-lg">volunteers activated across our programmes</span>
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-[#195D4B] to-[#2AAE92] p-6 text-white">
                <p className="text-center">
                  <span className="text-3xl font-bold">95% </span>
                  <span className="text-lg">of beneficiaries reported improved wellbeing</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Upcoming projects you joined */}
          <div className="lg:w-[340px] flex-shrink-0">
            <h2 className="text-xl font-bold text-[#1F7A67] mb-4">
              Upcoming projects you joined
            </h2>
            {loading ? (
              <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
                Loading...
              </div>
            ) : nextJoined ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">
                  {nextJoined.project.title}
                </h3>
                {daysUntilNext !== null && (
                  <p className="mt-2 text-sm text-gray-600">
                    Event is coming up in{' '}
                    <span className="text-2xl font-bold text-[#1F7A67]">{daysUntilNext}</span>{' '}
                    days
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  {nextJoined.project.description}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-[#195D4B] px-4 py-2 text-sm text-white">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatShortDate(nextJoined.project.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#195D4B] px-4 py-2 text-sm text-white">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatTimeRange(nextJoined.project.startTime, nextJoined.project.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#195D4B] px-4 py-2 text-sm text-white">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{nextJoined.project.location || 'TBD'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
                No upcoming joined projects.
              </div>
            )}
          </div>
        </div>

        {/* Volunteer With Us Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Volunteer With Us</h2>
            <Link
              href="/partner/volunteers/projects/proposal"
              className="rounded-full border border-gray-400 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              If you have a project in mind, apply here
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
              Loading volunteer projects...
            </div>
          ) : volunteerProjects.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
              No volunteer projects available right now.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {volunteerProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-[#E4FAF4] shadow-sm"
                >
                  {/* Image */}
                  <div className="relative h-44 w-full bg-gray-100">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        No image
                      </div>
                    )}
                    {typeof p.projectAvailableSlots === 'number' && (
                      <div className="absolute left-3 top-3 rounded-md bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-gray-800 shadow">
                        {p.projectAvailableSlots} spot{p.projectAvailableSlots === 1 ? '' : 's'} left
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col px-5 pb-5 pt-4 flex-1">
                    <div className="text-xl font-bold text-gray-900">{p.title}</div>
                    <p className="mt-1 text-sm text-gray-700">
                      {p.aboutDesc || 'Join this volunteer opportunity.'}
                    </p>

                    <div className="mt-4 space-y-3 text-sm text-gray-800">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-gray-700" />
                        <span>{formatShortDate(p.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ClockIcon className="h-5 w-5 text-gray-700" />
                        <span>{formatTimeRange(p.startTime, p.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="h-5 w-5 text-gray-700" />
                        <span>{p.location ?? '—'}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end pt-5">
                      <Link
                        href={`/partner/volunteers/projects/${p.id}`}
                        className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] hover:from-[#1A6A59] hover:to-[#22997F] shadow-sm active:scale-[0.99] transition"
                      >
                        Join Now!
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donate Now Section */}
        <div className="mt-10 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Donate Now</h2>
            <Link
              href="/partner/donations/proposal"
              className="rounded-full border border-gray-400 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              If you have a project in mind, apply here
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
              Loading donation projects...
            </div>
          ) : donationProjects.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500">
              No donation projects available right now.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {donationProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-[2px] transition cursor-pointer"
                  onClick={() => window.location.href = `/partner/donations/${project.id}`}
                >
                  {/* Image */}
                  <div className="relative h-44 w-full bg-gray-100">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col px-5 pb-5 pt-4 flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {project.about}
                    </p>

                    {/* Amount raised */}
                    <div className="mt-4">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(parseFloat(project.totalRaised || '0'))}
                        {project.targetFund && (
                          <span className="text-sm font-normal text-gray-600">
                            {' '}raised of {formatCurrency(parseFloat(project.targetFund))}
                          </span>
                        )}
                      </p>
                      {project.targetFund && (
                        <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full transition-all duration-500"
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

                    <div className="mt-auto flex justify-end pt-5">
                      <Link
                        href={`/partner/donations/${project.id}/donate`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] hover:from-[#1A6A59] hover:to-[#22997F] shadow-sm active:scale-[0.99] transition"
                      >
                        Donate Now!
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
