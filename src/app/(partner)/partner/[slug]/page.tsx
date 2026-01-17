'use client';

import Sidebar from '@/components/sidebar';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { examplePartnerInfoResponse } from './example';
import { ProjectsCard } from '@/components/partnerInfo/ProjectsCard';
import { PersonalParticularsCard } from '@/components/partnerInfo/PersonalParticularsCard';
import { PartnershipInterestsCard } from '@/components/partnerInfo/PartnershipInterestsCard';
import { PerformanceCard } from '@/components/partnerInfo/PerformanceCard';
import { AnalyticsSection } from '@/components/partnerInfo/AnalyticsSection';
import { AttendanceStatus, PartnerInfoResponse, ProjectSession } from '@/types/PartnerInfo';
import { calcHoursRounded } from './utils';

export default function PartnerInfoPage() {
  const params = useParams<{ slug: string }>();
  const partnerId = params?.slug ?? '';
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfoResponse>(examplePartnerInfoResponse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!partnerId) return;

    const ctrl = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch via Next.js route handler proxy (uses httpOnly cookie server-side)
        const res = await fetch(`/api/profile/${partnerId}`, {
          method: 'GET',
          signal: ctrl.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.errMsg ?? 'Failed to load partner profile.');
          return;
        }

        setPartnerInfo(data as PartnerInfoResponse);
      } catch (e) {
        if ((e as { name?: string })?.name === 'AbortError') return;
        setError('Failed to load partner profile.');
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ctrl.abort();
  }, [partnerId]);

  const personalParticulars = partnerInfo.personalParticulars;
  const partnerName = personalParticulars.fullName || 'Partner Name';

  const attendanceOptions: AttendanceStatus[] = ['Attended', 'Did not attend', 'Unknown'];

  const timeOptions = useMemo(() => {
    const base = [
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM',
      '6:00 PM',
      '7:00 PM',
    ];
    return base;
  }, []);

  const updateSession = ( // Updates locally in the browser. Not sent to backend. (Else we need route to edit partner info)
    projectId: string,
    sessionIndex: number,
    patch: Partial<ProjectSession>
  ) => {
    setPartnerInfo((prev) => {
      const projects = prev.projects.map((p) => {
        if (p.projectId !== projectId) return p;
        const sessions = p.sessions.map((s, i) => {
          if (i !== sessionIndex) return s;
          const next: ProjectSession = { ...s, ...patch };
          const attended = next.attendance === 'Attended';
          const hours = attended ? calcHoursRounded(next.startTime, next.endTime) : 0;
          return { ...next, hoursCompleted: patch.hoursCompleted ?? hours };
        });
        const totalHours =
          Math.round(sessions.reduce((sum, s) => sum + (s.hoursCompleted || 0), 0) * 100) /
          100;
        return { ...p, sessions, totalHours };
      });
      return { ...prev, projects };
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 px-10 py-8">

        {/* Header with green bar */}
        <div className="mb-8 flex items-start gap-3">
          <div className="mt-1 h-[39px] w-[5px] bg-[#56E0C2]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{partnerName}</h1>
            {loading && <p className="mt-1 text-sm text-gray-500">Loading partner info…</p>}
            {error && (
              <p className="mt-1 text-sm text-red-600">{error} (showing example data)</p>
            )}
          </div>
        </div>

        {/* Partner info boxes */}
        <section className="w-full max-w-none space-y-6">
          <PersonalParticularsCard personalParticulars={personalParticulars} />
          <ProjectsCard
            projects={partnerInfo.projects}
            attendanceOptions={attendanceOptions}
            timeOptions={timeOptions}
            onUpdateSession={updateSession}
          />
          <PartnershipInterestsCard interests={partnerInfo.partnershipInterests} />
          <PerformanceCard performance={partnerInfo.performance} />
          <AnalyticsSection partnerInfo={partnerInfo} />
        </section>
      </main>
    </div>
  );
}
