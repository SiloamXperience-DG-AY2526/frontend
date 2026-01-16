'use client';

import React, { useEffect, useState } from 'react';
import { fetchMyVolunteerApplications } from '@/lib/api/volunteer';
import { VolunteerApplicationDTO } from '@/types/Volunteer';
import { StatusBadge, formatProjectDateTime } from './ui';
import {
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function ApplicationsTab() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<VolunteerApplicationDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchMyVolunteerApplications({
          status: 'reviewing',
        });
        if (mounted) setItems(data);
      } catch (e: unknown) {
        if (!mounted) return;

        const msg = e instanceof Error ? e.message : 'Unknown error';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="space-y-5">
        {items.map((item) => (
          <div
            key={item.applicationId}
            className="w-full rounded-xl border border-black bg-white px-6 py-7"
          >
            {/* TOP ROW */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black mb-2">
                  {item.project.title}
                </h3>

                <p className="mt-1 text-sm text-black">
                  {item.project.description}
                </p>

                <div className="mt-4 space-y-2 text-sm text-black">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-black" />
                    <span>{item.project.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-black" />
                    <span>{item.position.role}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4 text-black" />
                    <span>
                      {formatProjectDateTime(
                        item.project.startDate,
                        item.project.startTime,
                        item.project.endTime
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <StatusBadge label="Pending Approval from Admin" tone="pending" />
            </div>

            {/* ✅ FULL-WIDTH DIVIDER */}
            <div className="my-5 border-t border-black w-full" />

            {/* BOTTOM ROW */}
            <div className="text-sm text-black">
              Applied on{' '}
              {new Date(item.appliedAt).toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
