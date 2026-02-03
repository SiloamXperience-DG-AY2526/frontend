'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';

type ProjectDetails = {
  id: string;
  title: string;
  location: string;
  startDate: string | null;
  endDate: string | null;
  aboutDesc: string | null;
  operationStatus: string;
  approvalStatus: string;
  positions: Array<{
    id: string;
    role: string;
    description: string;
    totalSlots: number;
    slotsFilled: number;
    slotsAvailable: number;
  }>;
};

type Volunteer = {
  id: string;
  volunteerId: string;
  status: string;
  hasConsented: boolean;
  volunteer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  position: {
    id: string;
    role: string;
  };
};

export default function ManageProjectPage() {
  const params = useParams<{ projectid: string }>();
  const projectId = params.projectid;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
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
        const projectRes = await fetch(`/api/v1/volunteer-projects/${projectId}`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
        }

        // Fetch volunteers/applications for this project
        const volunteersRes = await fetch(`/api/v1/volunteer-projects/${projectId}/applications`);
        if (volunteersRes.ok) {
          const volunteersData = await volunteersRes.json();
          setVolunteers(volunteersData.applications || []);
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

  const handleApproveVolunteer = async (applicationId: string) => {
    try {
      const res = await fetch(`/api/v1/volunteer-projects/me/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (res.ok) {
        setToast({
          open: true,
          type: 'success',
          title: 'Approved',
          message: 'Volunteer application approved.',
        });
        // Refresh volunteers list
        const volunteersRes = await fetch(`/api/v1/volunteer-projects/${projectId}/applications`);
        if (volunteersRes.ok) {
          const volunteersData = await volunteersRes.json();
          setVolunteers(volunteersData.applications || []);
        }
      } else {
        const errorData = await res.json();
        setToast({
          open: true,
          type: 'error',
          title: 'Failed',
          message: errorData.error || 'Could not approve application.',
        });
      }
    } catch (error) {
      setToast({
        open: true,
        type: 'error',
        title: 'Failed',
        message: `${error}`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
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
        <Link href="/partner/volunteers/projects/proposal/view" className="text-sm text-[#1F7A67] hover:underline mt-4 block">
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
        <Link href="/partner/volunteers/projects/proposal/view" className="text-sm text-gray-500 hover:text-gray-700 mb-2 block">
          &larr; Back to My Projects
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
        <p className="text-sm text-gray-600 mt-1">{project.location}</p>
        <div className="flex gap-2 mt-3">
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(project.operationStatus)}`}>
            {project.operationStatus}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
        <p className="text-sm text-gray-600">{project.aboutDesc || 'No description available.'}</p>
      </div>

      {/* Positions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Positions</h2>
        <div className="space-y-3">
          {project.positions.map((pos) => (
            <div key={pos.id} className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">{pos.role}</div>
                <div className="text-sm text-gray-500">{pos.description}</div>
              </div>
              <div className="text-sm text-gray-600">
                {pos.slotsFilled} / {pos.totalSlots} filled
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer Applications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Applications</h2>
        {volunteers.length === 0 ? (
          <p className="text-sm text-gray-500">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Position</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {v.volunteer.firstName} {v.volunteer.lastName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{v.volunteer.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{v.position.role}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {(v.status === 'pending' || v.status === 'reviewing') && (
                        <button
                          onClick={() => handleApproveVolunteer(v.id)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                      )}
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
