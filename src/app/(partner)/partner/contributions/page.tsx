'use client';
import React, { useMemo, useState } from 'react';

import VolunteeringTab from '@/components/contribution/VolunteeringTab';
import ApplicationTab from '@/components/contribution/ApplicationTab';
import DonationsTab from '@/components/contribution/DonationsTab';
import Link from 'next/link';

type TabKey = 'volunteering' | 'donations' | 'applications';

export default function MyContributions() {


  const [activeTab, setActiveTab] = useState<TabKey>('volunteering');

  const tabs = useMemo(
    () => [
      { key: 'volunteering' as const, label: 'VOLUNTEERING' },
      { key: 'donations' as const, label: 'DONATIONS' },
      { key: 'applications' as const, label: 'APPLICATIONS' },
    ],
    []
  );




  return (
    <div className="flex  h-screen overflow-y-auto bg-gray-50">
     

      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

        <div className="mb-6 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
          <h1 className="text-2xl mt-2 font-bold">My Contributions</h1>
        </div>
 <Link
            href="/partner/volunteers/projects/proposal/view"
            className="inline-flex items-center justify-center
        rounded-xl px-6 py-2.5 text-sm font-bold text-white
        bg-gradient-to-r from-[#1F7A67] to-[#2AAE92]
        hover:from-[#1A6A59] hover:to-[#22997F]
        shadow-sm
        active:scale-[0.99]
        transition cursor-pointer"
          >
            View My Proposed Projects
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="grid grid-cols-3 w-full">
            {tabs.map((t) => {
              const isActive = activeTab === t.key;

              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={[
                    'relative py-4 text-center transition',
                    'text-base font-semibold tracking-wide',
                    isActive
                      ? 'text-gray-900'
                      : 'text-gray-400 hover:text-gray-700',
                  ].join(' ')}
                >
                  {t.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#195D4B]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'volunteering' && <VolunteeringTab  />}

        {activeTab === 'applications' && <ApplicationTab  />}

        {activeTab === 'donations' && <DonationsTab />}
      </main>
    </div>
  );
}
