'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Button from '@/components/ui/Button';
import { getDonationProjectById } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProject';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  const [project, setProject] = useState<DonationProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const data = await getDonationProjectById(projectId);
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project details.');
      router.push('/partner/donations');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = () => {
    router.push(`/partner/donations/${projectId}/donate`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number | null) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 px-10 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading project details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 px-10 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Project not found</p>
          </div>
        </main>
      </div>
    );
  }

  // Parse objectives if it's a string
  const objectivesList = project.objectives ? project.objectives.split('\n').filter(o => o.trim()) : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">←</span>
          <span>Back</span>
        </button>

        {/* Project Title */}
        <h1 className="text-3xl font-bold mb-6">{project.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Image & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Image */}
            <div className="bg-gray-300 rounded-lg h-80 flex items-center justify-center">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-500">Project Image Placeholder</p>
              )}
            </div>

            {/* Organiser Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">Organiser</h2>
              <p className="text-gray-700">
                {project.initiatorName || 'Organisation Name'}
              </p>
              {project.organisingTeam && (
                <p className="text-gray-600 text-sm mt-2">
                  Team: {project.organisingTeam}
                </p>
              )}
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line">{project.about}</p>
            </div>

            {/* Objectives/Goals Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">Objectives/ Goals</h2>
              <div className="space-y-3">
                {objectivesList.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{objective}</p>
                  </div>
                ))}
                {objectivesList.length === 0 && (
                  <p className="text-gray-500 italic">No objectives specified</p>
                )}
              </div>
            </div>

            {/* Beneficiary Details Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-3">Beneficiary Details</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {project.beneficiaries || 'Details about the beneficiaries of this project.'}
              </p>
            </div>
          </div>

          {/* Right Column - Donation Widget */}
          <div className="lg:col-span-1">
            <div className="bg-gray-200 rounded-lg p-6 sticky top-8">
              {/* Deadline */}
              {project.deadline && (
                <div className="bg-gray-400 rounded p-3 mb-4">
                  <p className="text-sm text-gray-700">deadline</p>
                  <p className="font-semibold">{formatDate(project.deadline)}</p>
                </div>
              )}

              {/* Goal */}
              {project.targetFund && (
                <div className="bg-gray-400 rounded p-3 mb-4">
                  <p className="text-sm text-gray-700">goal</p>
                  <p className="font-semibold">{formatCurrency(project.targetFund)}</p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="bg-white rounded p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">
                    {formatCurrency(project.currentFund)}
                  </span>
                  {project.targetFund && (
                    <span className="text-gray-600">
                      {formatCurrency(project.targetFund)}
                    </span>
                  )}
                </div>
                {project.targetFund && (
                  <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black"
                      style={{
                        width: `${calculateProgress(project.currentFund, project.targetFund)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Donate Button */}
              <Button
                label="I want to donate"
                onClick={handleDonate}
                variant="primary"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
