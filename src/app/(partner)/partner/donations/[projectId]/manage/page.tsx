'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';

type ProjectData = {
  id: string;
  title: string;
  location: string;
  targetFund: string | null;
  totalRaised: string;
  operationStatus: string;
  approvalStatus: string;
};

type Donor = {
  id: string;
  firstName: string;
  lastName: string;
  donationCount: number;
};

export default function ManageDonationProjectPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'success', title: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project details
        const projectRes = await fetch(`/api/v1/donation-projects/${projectId}`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject({
            ...projectData.project,
            totalRaised: projectData.totalRaised || '0',
          });
        }

        // Fetch donors for this project (without amounts)
        const donorsRes = await fetch(`/api/v1/donation-projects/${projectId}/donors/summary`);
        if (donorsRes.ok) {
          const donorsData = await donorsRes.json();
          setDonors(donorsData.donors || []);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setToast({
          open: true,
          type: 'error',
          title: 'Failed to load',
          message: 'Could not load project data.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(numAmount || 0);
  };

  const calculateProgress = () => {
    if (!project?.targetFund || !project?.totalRaised) return 0;
    const current = parseFloat(project.totalRaised);
    const target = parseFloat(project.targetFund);
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      notStarted: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-sm text-gray-600">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-sm text-red-600">Project not found.</div>
        <Link
          href="/partner/donations/proposal/view"
          className="text-sm text-[#1F7A67] hover:underline mt-4 block"
        >
          Back to My Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/partner/donations/proposal/view"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 block"
        >
          &larr; Back to My Projects
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
        <p className="text-sm text-gray-600 mt-1">{project.location}</p>
        <div className="flex gap-2 mt-3">
          <span
            className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(project.operationStatus)}`}
          >
            {project.operationStatus}
          </span>
        </div>
      </div>

      {/* Funds Raised Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Funds Raised
        </h2>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-teal-600">
            {formatCurrency(project.totalRaised)}
          </span>
          {project.targetFund && (
            <span className="text-sm text-gray-500">
              of {formatCurrency(project.targetFund)} goal
            </span>
          )}
        </div>
        {project.targetFund && (
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        )}
        <p className="text-sm text-gray-600 mt-4">
          Total donors: <span className="font-semibold">{donors.length}</span>
        </p>
      </div>

      {/* Donors List (without amounts) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Donors</h2>
        {donors.length === 0 ? (
          <p className="text-sm text-gray-500">No donations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Donations
                  </th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor) => (
                  <tr
                    key={donor.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {donor.firstName} {donor.lastName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {donor.donationCount}{' '}
                      {donor.donationCount === 1 ? 'donation' : 'donations'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
