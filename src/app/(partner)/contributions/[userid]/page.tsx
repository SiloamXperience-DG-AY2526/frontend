'use client';
import React, { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/sidebar';
import VolunteeringTab from '@/components/contribution/VolunteeringTab';
import ApplicationTab from '@/components/contribution/ApplicationTab';
import { useRouter } from 'next/navigation';
type TabKey = 'volunteering' | 'donations' | 'applications';

export default function MyContributions() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('volunteering');

  const tabs = useMemo(
    () => [
      { key: 'volunteering' as const, label: 'VOLUNTEERING' },
      { key: 'donations' as const, label: 'DONATIONS' },
      { key: 'applications' as const, label: 'APPLICATIONS' },
    ],
    []
  );
  if (!user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white text-sm text-gray-600">
        Kindly&nbsp;
        <button
          onClick={() => router.push('/login')}
          className="font-semibold text-teal-600 hover:underline cursor-pointer"
        >
          login
        </button>
        &nbsp;to volunteer
      </div>
    );
  }
  const { userId } = user;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

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
        {activeTab === 'volunteering' && <VolunteeringTab userId={userId} />}

        {activeTab === 'applications' && <ApplicationTab userId={userId} />}

        {activeTab === 'donations' && (
          <div className="text-sm text-gray-500 mt-6">
            No donation records yet.
          </div>
        )}
      </main>
    </div>
  );
}
