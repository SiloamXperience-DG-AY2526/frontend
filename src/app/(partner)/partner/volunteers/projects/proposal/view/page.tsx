'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getMyProposedProjects } from '@/lib/api/project';
import { MyProposedProject } from '@/types/Volunteer';

export default function Projects() {
  const [projects, setProjects] = useState<MyProposedProject[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setPageLoading(true);
        setPageError(null);

        const res = await getMyProposedProjects();
        const list = (res?.data ?? res ?? []) as MyProposedProject[];

        if (!isMounted) return;

        setProjects(list);
      } catch (e: unknown) {
        if (!isMounted) return;
        setPageError(`unable to load projects ${e}`);
      } finally {
        setPageLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case 'draft':
        return 'text-slate-500';
      case 'approved':
        return 'text-emerald-700';
      case 'rejected':
        return 'text-rose-700';
      case 'reviewing':
        return 'text-sky-700';
      case 'pending':
      default:
        return 'text-orange-700';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-GB');
  };

  const rows = useMemo(() => projects, [projects]);

  return (
    <div className="flex h-screen overflow-y-auto bg-gray-50">
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        <div className="mb-10 flex items-start gap-3">
          <div className="w-[5px] h-[30px] sm:h-[39px] bg-[#56E0C2] mt-1.5" />
          <div>
            <h1 className="text-3xl sm:text-[40px] font-bold text-[#0F172A]">
              Proposed Projects
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review your submitted proposals and track approval status.
            </p>
          </div>
        </div>

        {/* States */}
        {pageLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            Loading proposed projects...
          </div>
        ) : pageError ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold text-rose-700">
              Failed to load
            </div>
            <div className="mt-1 text-sm text-slate-700">{pageError}</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            No proposed projects yet.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[860px] w-full">
                <thead>
                  <tr className="bg-[#1F6B7C]">
                    <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                      Project Title
                    </th>
                    <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                      Location
                    </th>
                    <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                      Date
                    </th>
                    <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                      Status
                    </th>
                    <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {rows.map((project) => {
                    const start = formatDate(project.startDate);
                    const end = formatDate(project.endDate);
                    const submissionStatus =
                      project.submissionStatus ?? 'submitted';
                    const status =
                      submissionStatus === 'draft'
                        ? 'draft'
                        : project.approvalStatus ?? 'pending';

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="px-7 py-5 align-top">
                          <div className="text-sm font-semibold text-slate-900">
                            {project.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {project.initiatorName || '-'}
                          </div>
                        </td>

                        <td className="px-7 py-5 align-top">
                          <div className="text-sm font-semibold text-slate-800">
                            {project.location || '-'}
                          </div>
                        </td>

                        <td className="px-7 py-5 align-top">
                          <div className="text-sm text-slate-700">
                            {start} - {end}
                          </div>
                        </td>

                        <td className="px-7 py-5 align-top">
                          <span className={getStatusColor(status)}>
                            {status}
                          </span>
                        </td>
                        <td className="px-7 py-5 align-top">
                          {submissionStatus === 'draft' ? (
                            <Link
                              href={`/partner/volunteers/projects/proposal?projectId=${project.id}`}
                              className="text-sm font-semibold text-[#1F7A67] hover:text-[#195D4B]"
                            >
                              Edit draft
                            </Link>
                          ) : (
                            <span className="text-sm text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="h-6 bg-white" />
          </div>
        )}
      </main>
    </div>
  );
}
