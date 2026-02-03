'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getDonationProjectById } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProject';
import { useAuth } from '@/contexts/AuthContext';
import Section from '@/components/volunteer/project/Section';
import ObjectiveList from '@/components/volunteer/project/ObjectiveList';
import InfoRow from '@/components/volunteer/project/InfoRow';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Toast from '@/components/ui/Toast';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;
  const { user, isLoading: authLoading } = useAuth();

  const [project, setProject] = useState<DonationProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; title: string }>({ open: false, type: 'error', title: '' });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/partner/login');
      return;
    }

    if (!projectId || !user) return;
    
    const loadProject = async () => {
      setLoading(true);
      try {
        const data = await getDonationProjectById(projectId);
        setProject(data);
      } catch (error) {
        console.error('Failed to load project:', error);
        setToast({ open: true, type: 'error', title: 'Failed to load project details.' });
        setTimeout(() => router.push('/partner/donations'), 1500);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, router, user, authLoading]);
  const handleDonate = () => {
    router.push(`/partner/donations/${projectId}/donate`);
  };

  const formatCurrency = (amount: string | number | null) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount || 0;
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(numAmount);
  };

  const calculateProgress = (current: string | null, target: string | null) => {
    if (!target || !current) return 0;
    const currentNum = parseFloat(current);
    const targetNum = parseFloat(target);
    if (targetNum === 0) return 0;
    return Math.min((currentNum / targetNum) * 100, 100);
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
        <main className="w-full px-6 py-6 md:px-10">
          <div className="rounded-2xl border bg-white p-8 text-sm text-gray-600 shadow-sm">
            Loading project details...
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="w-full px-6 py-6 md:px-10">
          <div className="rounded-2xl border bg-white p-8 text-sm text-gray-600 shadow-sm">
            Project not found.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-y-auto bg-gray-50">
      <Toast open={toast.open} type={toast.type} title={toast.title} onClose={() => setToast((t) => ({ ...t, open: false }))} />
      <main className="w-full px-6 py-6 md:px-10">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="mt-1 inline-flex h-8 w-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600/40"
        >
          <svg
            width="9"
            height="17"
            viewBox="0 0 9 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 15.0468L1 8.02338L8 1"
              stroke="#333333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="mb-8 mt-1 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Support this project with a donation.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column */}
          <div className="flex-1">
            {/* Project Image */}
            <div className="mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="relative h-[280px] w-full bg-gray-100">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>

            <Section title="Organiser">
              <p>{project.initiatorName || 'Organisation Name'}</p>
              {project.organisingTeam && (
                <p className="mt-2 text-sm text-gray-600">
                  Team: {project.organisingTeam}
                </p>
              )}
            </Section>

            <Section title="About">
              <p className="whitespace-pre-line">{project.about}</p>
            </Section>

            <Section title="Objectives/ Goals">
              {project.objectives ? (
                <ObjectiveList text={project.objectives} />
              ) : (
                '—'
              )}
            </Section>

            <Section title="Beneficiary Details">
              {project.beneficiaries ||
                'Details about the beneficiaries of this project.'}
            </Section>
          </div>

          {/* Right Column */}
          <aside className="w-full lg:w-[340px]">
            <div className="mt-6 lg:mt-16 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="space-y-5">
                {project.deadline && (
                  <InfoRow
                    icon={CalendarIcon}
                    text={`Deadline: ${formatDate(project.deadline)}`}
                  />
                )}
                {project.targetFund && (
                  <InfoRow
                    icon={CurrencyDollarIcon}
                    text={`Goal: ${formatCurrency(
                      parseFloat(project.targetFund)
                    )}`}
                  />
                )}
                <InfoRow icon={MapPinIcon} text={project.location} />
              </div>

              <div className="mt-6 rounded-xl bg-[#F0F0F2] p-4">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(project.totalRaised || '0')}
                  </span>
                  {project.targetFund && (
                    <span className="text-gray-600">
                      {formatCurrency(parseFloat(project.targetFund))}
                    </span>
                  )}
                </div>
                {project.targetFund && (
                  <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600"
                      style={{
                        width: `${calculateProgress(
                          project.totalRaised || '0',
                          project.targetFund
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleDonate}
                className="mt-6 w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 active:bg-teal-800"
              >
                I want to donate
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
