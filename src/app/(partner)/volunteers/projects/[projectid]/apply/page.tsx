'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import {
  getVolunteerProjectDetails,
  submitVolunteerApplication,
} from '@/lib/api/volunteer';
import { formatShortDate, formatTimeRange } from '@/lib/utils/date';
import type { VolunteerProjectDetail } from '@/types/Volunteer';
import { useRouter } from 'next/navigation';
import capitalizeFirst from '@/lib/utils/capitalizeFirst';

export default function VolunteerApplication({
  params,
  searchParams,
}: {
  params: Promise<{ projectid: string }>;
  searchParams: Promise<{ positionId?: string }>;
}) {
  const { projectid } = use(params);
  const { positionId } = use(searchParams);

  const router = useRouter();

  const [data, setData] = useState<VolunteerProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  // const [sessionId, setSessionId] = useState<string | ''>('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState('');

  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastTitle, setToastTitle] = useState('');
  const [toastMsg, setToastMsg] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        if (!positionId) {
          throw new Error('Missing positionId in URL');
        }

        const res = await getVolunteerProjectDetails(projectid);
        if (!mounted) return;

        setData(res.data);

        // if (res.data.sessions?.length) {
        //   setSessionId(res.data.sessions[0].id);
        // }
      } catch (e: unknown) {
        if (!mounted) return;

        setData(null);
        setToastType('error');
        setToastTitle('Failed to load');

        setToastMsg(`Failed to retrieve data: ${e}`);

        setToastOpen(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [projectid, positionId]);

  const selectedPosition = useMemo(() => {
    if (!data || !positionId) return null;
    return data.positions.find((p) => p.id === positionId) ?? null;
  }, [data, positionId]);

  const dateTimeText = useMemo(() => {
    if (!data) return '—';

    const date =
      data.startDate && data.endDate
        ? `${formatShortDate(data.startDate)} - ${formatShortDate(
            data.endDate
          )}`
        : formatShortDate(data.startDate);

    const time = formatTimeRange(data.startTime, data.endTime);
    const freq = data.frequency ? capitalizeFirst(data.frequency) : null;

    return freq ? `${date}, ${time} (${freq})` : `${date}, ${time}`;
  }, [data]);

  async function onSubmit() {
    if (!data || !positionId) return;
    if (!consent) return;
    if (!availability.trim()) {
      setError('Availability is required');
      return;
    }
    try {
      setSubmitting(true);

      await submitVolunteerApplication(
        data.id,
        positionId,
        consent,
        availability?.trim(),
        [] //empty for now session id
      );

      setToastType('success');
      setToastTitle('Application submitted');
      setToastMsg('We’ll contact you soon with the next steps.');
      setToastOpen(true);

      setTimeout(() => {
        router.push(`/volunteers/projects/${data.id}`);
      }, 2000);
    } catch (e: unknown) {
      console.error(e);
      setToastType('error');
      setToastTitle('Submission failed');
      setToastMsg(e instanceof Error ? e.message : String(e));
      setToastOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />

      {/* Toast popup */}
      <Toast
        open={toastOpen}
        type={toastType}
        title={toastTitle}
        message={toastMsg}
        duration={3500}
        onClose={() => setToastOpen(false)}
      />

      <main className="w-full px-8 py-8 md:px-12">
        {/* Header */}
        <div className="mb-8 flex items-start gap-3">
          <div className="w-[5px] h-[44px] bg-[#56E0C2]" />
          <div className="w-full">
            <h1 className="text-3xl mt-1 font-bold text-gray-900">
              Volunteer Application Form
            </h1>

            <p className="mt-2 w-full text-sm text-gray-600">
              We’re excited that you’re considering volunteering with us. This
              project needs caring individuals like you to bring it to life.
              Fill in the form below and we’ll contact you soon with the next
              steps.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-gray-50 p-6 text-sm text-gray-600">
            Loading...
          </div>
        ) : !data ? (
          <div className="rounded-xl border bg-gray-50 p-6 text-sm text-gray-600">
            No data.
          </div>
        ) : !selectedPosition ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Invalid positionId. Please go back and select a position again.
          </div>
        ) : (
          <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-900">
              Opportunity details
            </h2>

            <div className="mt-6 space-y-6">
              <Input
                label="Project"
                value={data.title ?? '—'}
                readOnly
                disabled
              />
              <Input
                label="Volunteer Position"
                value={selectedPosition.role ?? '—'}
                readOnly
                disabled
              />

              <div>
                <label className="block text-black text-md mb-2 font-semibold">
                  Date and Time
                </label>
                <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  {dateTimeText}
                </div>
              </div>
              <Input
                label="Availability"
                value={availability}
                onChange={(value) => setAvailability(value)}
                placeholder="e.g. Weekends 9am–1pm"
                required
                error={error}
              />

              {/* later use */}
              {/* {data.sessions?.length ? (
                <div>
                  <label className="block text-black text-md mb-2 font-semibold">
                    Session
                  </label>
                  <select
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="
                      w-full rounded-md border border-gray-200
                      bg-white px-4 py-3 text-sm text-gray-800
                      outline-none transition
                      focus:border-green-800 focus:ring-1 focus:ring-green-800
                    "
                  >
                    {data.sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {formatShortDate(s.sessionDate)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null} */}

              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                />
                <span>
                  I understand that the organisation may contact me regarding
                  volunteer updates, briefings, and related matters.
                </span>
              </label>

              {/* register button only visible after consent */}
              {consent ? (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={onSubmit}
                    disabled={submitting || !consent || !availability.trim()}
                    className="
                      rounded-md bg-[#195D4B] px-10 py-3
                      text-sm font-semibold text-white
                      hover:bg-[#134A3B]
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  >
                    {submitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
