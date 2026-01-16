'use client';
import React, { useMemo, useState } from 'react';

import VolunteeringTab from '@/components/contribution/VolunteeringTab';
import ApplicationTab from '@/components/contribution/ApplicationTab';

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
    <div className="flex min-h-screen bg-gray-50">
     

      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
          <h1 className="text-2xl mt-2 font-bold">My Contributions</h1>
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

        {activeTab === 'donations' && (
          <div className="text-sm text-gray-500 mt-6">
            No donation records yet.
          </div>
        )}
      </main>
    </div>
  );
}
