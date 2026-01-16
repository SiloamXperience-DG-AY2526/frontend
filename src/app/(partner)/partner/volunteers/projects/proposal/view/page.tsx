'use client';

import { useEffect, useMemo, useState } from 'react';
import { changeProposedProjectStatus } from '@/lib/api/general/projects';
import { getMyProposedProjects } from '@/lib/api/project';
import { ProjectApprovalStatus } from '@/types/ProjectData';
import { MyProposedProject } from '@/types/Volunteer';

export default function Projects() {
  const [projects, setProjects] = useState<MyProposedProject[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<
    Record<string, ProjectApprovalStatus>
  >({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
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

        const nextStatuses: Record<string, ProjectApprovalStatus> = {};
        for (const p of list) {
          nextStatuses[p.id] =
            p.approvalStatus as unknown as ProjectApprovalStatus;
        }
        setProjectStatuses(nextStatuses);
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

  const handleStatusChange = async (
    projectId: string,
    newStatus: ProjectApprovalStatus
  ) => {
    setLoadingId(projectId);

    try {
      setProjectStatuses((prev) => ({ ...prev, [projectId]: newStatus }));
      await changeProposedProjectStatus(projectId, newStatus);
    } catch (error) {
      console.error('Error updating project status:', error);

      const original = projects.find((p) => p.id === projectId)?.approvalStatus;
      if (original) {
        setProjectStatuses((prev) => ({
          ...prev,
          [projectId]: original as unknown as ProjectApprovalStatus,
        }));
      }

      alert('Failed to update project status. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status: ProjectApprovalStatus) => {
    switch (status) {
      case ProjectApprovalStatus.approved:
        return 'text-emerald-700';
      case ProjectApprovalStatus.rejected:
        return 'text-rose-700';
      case ProjectApprovalStatus.reviewing:
        return 'text-sky-700';
      case ProjectApprovalStatus.pending:
        return 'text-orange-700';
      default:
        return 'text-slate-700';
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
   <div className="flex h-screen bg-gray-50">

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

        {/* Filters button (UI only) */}
        <button
          type="button"
          className="hidden sm:inline-flex items-center gap-2 mb-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          title="Filters"
        >
          Filters
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-80"
          >
            <path
              d="M4 5h16M7 12h10M10 19h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
     

      {/* States */}
      {pageLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Loading proposed projects...
        </div>
      ) : pageError ? (
        <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-rose-700">Failed to load</div>
          <div className="mt-1 text-sm text-slate-700">{pageError}</div>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          No proposed projects yet.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
  
          <div className="w-full overflow-x-auto">
            <table className="min-w-[980px] w-full">
              <thead>
          
                <tr className="bg-[#1F6B7C]">
                  <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                    Project Title
                  </th>
                  <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                    Location
                  </th>
                  <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                    Capacity (Accepted)
                  </th>
                  <th className="px-7 py-4 text-left text-white font-semibold text-sm">
                    Organisation
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
                  const status =
                    projectStatuses[project.id] ??
                    (project.approvalStatus as unknown as ProjectApprovalStatus);

                  const start = formatDate(project.startDate);
                  const end = formatDate(project.endDate);
                  const accepted = project.acceptedCount ?? 0;
                  const total = project.totalCapacity ?? 0;

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
      
                      <td className="px-7 py-5 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-semibold text-[#2C89A5]">
                            {project.name}
                          </div>
                          <div className="text-xs text-slate-600">
                            <span className="font-medium text-slate-700">
                              {start}
                            </span>{' '}
                            <span className="text-slate-400">→</span>{' '}
                            <span className="font-medium text-slate-700">
                              {end}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-7 py-5 align-top">
                        <div className="text-sm font-semibold text-slate-800">
                          {project.location || '-'}
                        </div>
                      </td>

            
                      <td className="px-7 py-5 align-top">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-bold text-slate-800">
                          {total > 0 ? `${accepted}/${total}` : '-'}
                        </span>
                      </td>

                      <td className="px-7 py-5 align-top">
                        <div className="text-sm font-semibold text-slate-800">
                          {project.initiatorName || '-'}
                        </div>
                      </td>

                      {/* Status dropdown  */}
                      <td className="px-7 py-5 align-top">
                        <div className="inline-flex flex-col">
                          <select
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(
                                project.id,
                                e.target.value as ProjectApprovalStatus
                              )
                            }
                            disabled={loadingId === project.id}
                            className={[
                              'w-[160px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm',
                              'focus:outline-none focus:ring-2 focus:ring-[#56E0C2] focus:border-[#56E0C2]',
                              getStatusColor(status),
                              loadingId === project.id
                                ? 'opacity-60 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-slate-50',
                            ].join(' ')}
                          >
                            <option value={ProjectApprovalStatus.pending}>
                              Pending
                            </option>
                            <option value={ProjectApprovalStatus.reviewing}>
                              Reviewing
                            </option>
                            <option value={ProjectApprovalStatus.approved}>
                              Approved
                            </option>
                            <option value={ProjectApprovalStatus.rejected}>
                              Rejected
                            </option>
                          </select>

                          {loadingId === project.id && (
                            <div className="mt-2 text-xs text-slate-500">
                              Updating...
                            </div>
                          )}
                        </div>
                      </td>

           
                      <td className="px-7 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <button
                            className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm hover:bg-slate-50 transition"
                            title="Edit"
                            type="button"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.2873 0.351835L1.19785 12.4417C1.01713 12.622 0.89862 12.8552 0.859568 13.1075L0.0138559 18.6186C-0.0146819 18.8047 0.000999985 18.9949 0.0596322 19.1739C0.118264 19.3528 0.2182 19.5155 0.351352 19.6486C0.484505 19.7818 0.647134 19.8817 0.826079 19.9404C1.00502 19.999 1.19526 20.0147 1.38139 19.9861L6.89351 19.1404C7.14563 19.1017 7.37885 18.9836 7.55929 18.8033L19.6488 6.71346C19.8737 6.4885 20 6.18342 20 5.86532C20 5.54723 19.8737 5.24215 19.6488 5.01719L14.9824 0.350636C14.7575 0.126107 14.4526 0 14.1349 0C13.8171 0 13.5122 0.126107 13.2873 0.350636M2.63376 17.3674L3.17118 13.8596L14.1354 2.89505L17.1044 5.86532L6.14017 16.8299L2.63376 17.3674Z"
                                fill="#00657A"
                              />
                              <path
                                d="M11.1797 4.88601L12.4513 3.6132L16.3403 7.5L15.0676 8.77281L11.1797 4.88601Z"
                                fill="#00657A"
                              />
                            </svg>
                          </button>

                          <button
                            className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm hover:bg-slate-50 transition"
                            title="Delete"
                            type="button"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 23 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18.8957 5.10645L17.65 17.935C17.6102 18.2972 17.4476 18.6312 17.1931 18.8735C16.9385 19.1159 16.6098 19.2497 16.2692 19.2497H6.2285C5.8879 19.2497 5.55914 19.1159 5.30461 18.8735C5.05009 18.6312 4.88749 18.2972 4.84769 17.935L3.60156 5.10645"
                                stroke="#00657A"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M20.5357 1.25H1.96429C1.5698 1.25 1.25 1.59539 1.25 2.02145V4.33581C1.25 4.76187 1.5698 5.10726 1.96429 5.10726H20.5357C20.9302 5.10726 21.25 4.76187 21.25 4.33581V2.02145C21.25 1.59539 20.9302 1.25 20.5357 1.25Z"
                                stroke="#00657A"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M13.6043 8.96484L8.89844 15.3936M13.6043 15.3936L8.89844 8.96484"
                                stroke="#00657A"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
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
