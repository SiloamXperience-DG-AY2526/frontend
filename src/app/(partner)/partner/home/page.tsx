'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  HeartIcon,
  HandRaisedIcon,
  ClipboardDocumentListIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function PartnerHomePage() {
  const { user, isLoading: authLoading } = useAuth();

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

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-10 py-8">
        <div className="mb-10 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-2" />
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">
              Welcome back{displayName ? `, ${displayName}` : ''}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your volunteer projects, donation campaigns, and community
              impact in one place.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Volunteer Opportunities',
              description: 'Browse projects and invite volunteers to join.',
              href: '/partner/volunteers',
              Icon: HandRaisedIcon,
            },
            {
              title: 'Donation Campaigns',
              description: 'Support fundraising initiatives and track goals.',
              href: '/partner/donations',
              Icon: HeartIcon,
            },
            {
              title: 'My Contributions',
              description: 'Review your volunteer activity and donations.',
              href: '/partner/contributions',
              Icon: ClipboardDocumentListIcon,
            },
            {
              title: 'Propose a Project',
              description: 'Submit a new volunteer or donation idea.',
              href: '/partner/volunteers/projects/proposal',
              Icon: RocketLaunchIcon,
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-[2px]"
            >
              <card.Icon className="h-6 w-6 text-[#195D4B]" />
              <div className="mt-4 text-lg font-semibold text-gray-900">
                {card.title}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {card.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-[#1F7A67]">
                Get started
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                Launch a new initiative with a proposal.
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Propose volunteer or donation projects and track their approval
                status.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/partner/volunteers/projects/proposal"
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] hover:from-[#1A6A59] hover:to-[#22997F] shadow-sm transition"
              >
                Propose Volunteer Project
              </Link>
              <Link
                href="/partner/donations/proposal"
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] hover:from-[#1A6A59] hover:to-[#22997F] shadow-sm transition"
              >
                Propose Donation Project
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
