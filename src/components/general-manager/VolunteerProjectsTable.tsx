'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VolunteerProjectRow } from '@/types/Volunteer';
import { formatShortDate } from '@/lib/utils/date';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';
import Toast from '@/components/ui/Toast';
import StatusBadge from '@/components/table/StatusBadge';

function getApprovalVariant(status?: string) {
  if (!status) return 'neutral' as const;
  switch (status.toLowerCase()) {
    case 'approved':
      return 'success' as const;
    case 'rejected':
      return 'error' as const;
    case 'pending':
      return 'neutral' as const;
    case 'reviewing':
    case 'under_review':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

function getSubmissionVariant(status?: string) {
  if (!status) return 'neutral' as const;
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'success' as const;
    case 'withdrawn':
      return 'error' as const;
    case 'draft':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

function getOperationVariant(status?: string) {
  if (!status) return 'neutral' as const;
  switch (status.toLowerCase()) {
    case 'notstarted':
      return 'neutral' as const;
    case 'ongoing':
      return 'success' as const;
    case 'paused':
      return 'warning' as const;
    case 'cancelled':
    case 'canceled':
      return 'error' as const;
    case 'completed':
      return 'info' as const;
    default:
      return 'neutral' as const;
  }
}

function formatEnumLabel(s?: string) {
  if (!s) return '-';
  // "under_review" -> "Under Review", "ongoing" -> "Ongoing"
  return s
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function VolunteerProjectTable({
  loading,
  projects,
}: {
  loading: boolean;
  projects: VolunteerProjectRow[];
}) {
  const basePath = useManagerBasePath('general');
  const router = useRouter();
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
  }>({ open: false, type: 'success', title: '' });

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
        Loading projects...
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
        No projects found.
      </div>
    );
  }

  const onDelete = (projectId: string) => {
    // await deleteVolunteerProject(projectId);
    setToast({
      open: true,
      type: 'success',
      title: `Deleted project ${projectId}`,
    });
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead>
            <tr className="bg-[#0F5E5E] text-left text-xs font-semibold text-white">
              <th className="px-5 py-4">Projects</th>
              <th className="px-5 py-4">Time Period</th>
              <th className="px-5 py-4">Capacity</th>
              <th className="px-5 py-4">Submission</th>
              <th className="px-5 py-4">Approval</th>
              <th className="px-5 py-4">Operation</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => {
              const filled = p.capacity?.filled ?? 0;
              const total = p.capacity?.total ?? 0;

              const submission = formatEnumLabel(p.submissionStatus);
              const approval = formatEnumLabel(
                p.approvalStatus as unknown as string,
              );
              const operation = formatEnumLabel(
                p.operationStatus as unknown as string,
              );

              return (
                <tr
                  key={p.id}
                  className="border-t border-gray-100 text-sm text-gray-800 hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`${basePath}/projects/${p.id}`}
                      className="font-semibold text-[#0F5E5E] hover:underline"
                    >
                      {p.title}
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatShortDate(p.startDate)} -{' '}
                    {formatShortDate(p.endDate)}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold">{filled}</span>{' '}
                    <span className="text-gray-500">/</span>
                    <span className="font-semibold">{total}</span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      label={submission}
                      variant={getSubmissionVariant(p.submissionStatus)}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      label={approval}
                      variant={getApprovalVariant(
                        p.approvalStatus as unknown as string,
                      )}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      label={operation}
                      variant={getOperationVariant(
                        p.operationStatus as unknown as string,
                      )}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`${basePath}/projects/${p.id}/edit`}
                        className="rounded-md p-2 hover:bg-gray-100"
                        aria-label="Edit project"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5 text-[#0F5E5E]" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete?.(p.id)}
                        className="rounded-md p-2 hover:bg-gray-100"
                        aria-label="Delete project"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5 text-[#0F5E5E]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
