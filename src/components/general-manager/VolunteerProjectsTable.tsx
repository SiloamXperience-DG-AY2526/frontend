'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VolunteerProjectRow } from '@/types/Volunteer';
import { formatShortDate } from '@/lib/utils/date';
import { PencilSquareIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { duplicateVolunteerProject } from '@/lib/api/volunteer';
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
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message?: string }>({ open: false, type: 'success', title: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [duplicatingProjectId, setDuplicatingProjectId] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

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

  const handleDuplicateClick = (projectId: string) => {
    setDuplicatingProjectId(projectId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDuplicate = async () => {
    if (!duplicatingProjectId) return;

    setIsDuplicating(true);
    setShowConfirmDialog(false);

    try {
      const duplicatedProject = await duplicateVolunteerProject(duplicatingProjectId);
      setToast({ open: true, type: 'success', title: 'Project duplicated successfully' });
      // Redirect to the edit page of the duplicated project
      setTimeout(() => {
        router.push(`${basePath}/projects/${duplicatedProject.id}/edit`);
      }, 1000);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Failed to duplicate project',
        message: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsDuplicating(false);
      setDuplicatingProjectId(null);
    }
  };

  const handleCancelDuplicate = () => {
    setShowConfirmDialog(false);
    setDuplicatingProjectId(null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Toast open={toast.open} type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast((t) => ({ ...t, open: false }))} />
      <ConfirmDialog
        open={showConfirmDialog}
        title="Duplicate this project?"
        message="This will create a copy of the project in draft status. You can then edit the duplicated project."
        confirmText="Duplicate"
        cancelText="Cancel"
        onConfirm={handleConfirmDuplicate}
        onCancel={handleCancelDuplicate}
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
                        onClick={() => handleDuplicateClick(p.id)}
                        disabled={isDuplicating && duplicatingProjectId === p.id}
                        className="rounded-md p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Duplicate project"
                        title="Duplicate"
                      >
                        {isDuplicating && duplicatingProjectId === p.id ? (
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <DocumentDuplicateIcon className="h-5 w-5 text-blue-600" />
                        )}
                      </button>

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
