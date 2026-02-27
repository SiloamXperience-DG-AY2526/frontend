'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import Toast from '@/components/ui/Toast';
import LoadingTableState from '@/components/table/LoadingTableState';
import { useDonor } from '@/hooks/useDonors';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

export default function EditDonorPage() {
  const params = useParams<{ id: string }>();
  const donorId = params.id;
  const router = useRouter();
  const basePath = useManagerBasePath('finance');

  const { donor, loading } = useDonor(donorId);

  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'success', title: '' });

  useEffect(() => {
    if (!donor) return;
    setIsActive(donor.status === 'Active');
  }, [donor]);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await fetch(`/api/donors/${donorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update donor');
      }

      setToast({
        open: true,
        type: 'success',
        title: 'Donor updated',
        message: 'Partner status has been saved.',
      });
      setTimeout(() => {
        router.push(`${basePath}/donors/${donorId}`);
      }, 800);
    } catch (error) {
      setToast({
        open: true,
        type: 'error',
        title: 'Update failed',
        message: String(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <PageHeader title="Loading..." />
        <div className="mt-6">
          <LoadingTableState message="Loading donor details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader title={`Edit — ${donor?.fullName ?? 'Donor'}`} />

      <div className="space-y-6">
        {/* Partner Status */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Partner status
          </h2>
          <div className="flex items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                name="status"
                value="active"
                checked={isActive}
                onChange={() => setIsActive(true)}
                className="h-4 w-4 accent-[#0E5A4A]"
              />
              <span className="text-green-700">Active</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={!isActive}
                onChange={() => setIsActive(false)}
                className="h-4 w-4 accent-red-600"
              />
              <span className="text-red-600">Inactive</span>
            </label>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Inactive partners will not be able to log in or submit donations.
          </p>
        </div>

        {/* Managed Projects */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-gray-800">
            Managed projects
          </h2>
          <p className="mb-4 text-xs text-gray-400">
            Donation projects currently assigned to this partner. To reassign a
            project, edit the project directly.
          </p>

          {!donor?.projects.length ? (
            <p className="text-sm italic text-gray-400">
              No projects assigned to this partner.
            </p>
          ) : (
            <ul className="space-y-2">
              {donor.projects.map((project) => (
                <li key={project.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <Link
                    href={`${basePath}/donation-projects/${project.id}`}
                    className="text-sm font-medium text-[#2C89A5] hover:underline"
                  >
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={submitting}
          className={[
            'rounded-xl px-8 py-3 font-bold',
            'border border-gray-300 bg-white text-gray-700',
            'transition hover:bg-gray-50',
            submitting ? 'cursor-not-allowed opacity-50' : '',
          ].join(' ')}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className={[
            'rounded-xl px-10 py-3 font-bold text-white',
            'bg-[#0E5A4A] transition hover:opacity-95',
            submitting ? 'cursor-not-allowed opacity-50' : '',
          ].join(' ')}
        >
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
