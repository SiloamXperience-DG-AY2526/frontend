'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { getDonationProjectById, submitDonation } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProject';
import { DonationType } from '@/types/DonationData';
import { fetchNationalities } from '@/lib/countries';

const PAYMENT_MODES = [
  'Credit Card',
  'Debit Card',
  'PayNow',
  'Bank Transfer',
  'PayPal',
  'Other',
];

const DONATION_TYPES: { value: DonationType; label: string }[] = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'FUNDRAISING_EVENTS', label: 'Fundraising Events' },
];

export default function DonatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  const [project, setProject] = useState<DonationProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [donationType, setDonationType] = useState<DonationType>('INDIVIDUAL');
  const [paymentMode, setPaymentMode] = useState('');
  const [amount, setAmount] = useState('');
  const [brickCount, setBrickCount] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [countries, setCountries] = useState<string[]>([]);

  // Load countries
  useEffect(() => {
    fetchNationalities().then(setCountries);
  }, []);

  // Load project details
  useEffect(() => {
    if (!projectId) return;
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    setLoading(true);
    try {
      const projectData = await getDonationProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project details. Please try again.');
      router.push('/partner/donations');
    } finally {
      setLoading(false);
    }
  };

  const calculateBrickAmount = () => {
    if (!project?.brickSize || !brickCount) return 0;
    const count = parseInt(brickCount);
    if (isNaN(count)) return 0;
    return project.brickSize * count;
  };

  const handleBrickCountChange = (value: string) => {
    setBrickCount(value);
    if (project?.brickSize) {
      const count = parseInt(value);
      if (!isNaN(count)) {
        setAmount((project.brickSize * count).toString());
      } else {
        setAmount('');
      }
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    // Clear brick count if amount is manually changed
    if (project?.brickSize) {
      const amt = parseFloat(value);
      if (!isNaN(amt) && amt > 0) {
        const calculatedBricks = Math.floor(amt / project.brickSize);
        setBrickCount(calculatedBricks.toString());
      }
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!paymentMode) {
      alert('Please select a payment mode');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    if (!countryOfResidence) {
      alert('Please select your country of residence');
      return;
    }

    if (!user) {
      alert('You must be logged in to make a donation');
      router.push('/login');
      return;
    }

    setSubmitting(true);

    try {
      const donationData = {
        projectId: projectId,
        type: donationType,
        countryOfResidence: countryOfResidence,
        paymentMode: paymentMode,
        amount: parseFloat(amount),
        ...(brickCount && { brickCount: parseInt(brickCount) }),
      };

      await submitDonation(donationData);

      alert('Donation application submitted successfully! You will receive payment instructions shortly.');
      router.push('/partner/donations');
    } catch (error: unknown) {
      console.error('Failed to submit donation:', error);
      alert(`Failed to submit donation. Please try again.\n${error}`);
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
          <div>
            <h1 className="text-2xl font-bold">
              Make a <span className="bg-yellow-300 px-1">Donation</span>
            </h1>
            <p className="text-sm text-gray-500">
              Support this project with your generous contribution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Project Details</h2>

              {/* Project Image */}
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <p className="text-gray-400">No Image</p>
                </div>
              )}

              {/* Project Title */}
              <h3 className="font-bold text-lg mb-2">{project.title}</h3>

              {/* Location */}
              <p className="text-sm text-gray-600 mb-3">
                📍 {project.location}
              </p>

              {/* Type Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    project.type === 'ONGOING'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {project.type === 'ONGOING' ? 'Ongoing' : 'Specific Project'}
                </span>
              </div>

              {/* Progress (if target exists) */}
              {project.targetFund && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">
                      {formatCurrency(project.currentFund)}
                    </span>
                    <span className="text-gray-500">
                      of {formatCurrency(project.targetFund)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#56E0C2] transition-all"
                      style={{
                        width: `${calculateProgress(
                          project.currentFund,
                          project.targetFund
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* About */}
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">About:</p>
                <p>{project.about}</p>
              </div>

              {/* Brick Size Info (if applicable) */}
              {project.brickSize && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-semibold text-blue-900">
                    Brick-by-Brick Donation
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Each brick: {formatCurrency(project.brickSize)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-8">
              <h2 className="text-xl font-bold mb-6">Donation Information</h2>

              <div className="space-y-6">
                {/* Pre-filled User Information (Read-only) */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Your Information (from account):
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>{' '}
                      <span className="font-semibold">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>{' '}
                      <span className="font-semibold">{user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Donation Type */}
                <Select
                  label="Donation Type"
                  value={donationType}
                  options={DONATION_TYPES.map((t) => t.label)}
                  onChange={(value) => {
                    const selected = DONATION_TYPES.find((t) => t.label === value);
                    if (selected) setDonationType(selected.value);
                  }}
                />

                {/* Country of Residence */}
                <Select
                  label="Country of Residence"
                  value={countryOfResidence}
                  options={countries}
                  onChange={setCountryOfResidence}
                />

                {/* Payment Mode */}
                <Select
                  label="Preferred Payment Mode"
                  value={paymentMode}
                  options={PAYMENT_MODES}
                  onChange={setPaymentMode}
                />

                {/* Brick Count (if brick-by-brick donation available) */}
                {project.brickSize && (
                  <div>
                    <Input
                      label={`Number of Bricks (${formatCurrency(project.brickSize)} each)`}
                      value={brickCount}
                      onChange={handleBrickCountChange}
                      type="number"
                    />
                    {brickCount && parseInt(brickCount) > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        Total: {formatCurrency(calculateBrickAmount())}
                      </p>
                    )}
                  </div>
                )}

                {/* Amount */}
                <div>
                  <Input
                    label="Donation Amount (SGD)"
                    value={amount}
                    onChange={handleAmountChange}
                    type="number"
                  />
                  {project.brickSize && (
                    <p className="text-xs text-gray-500 mt-1">
                      You can also specify the number of bricks above
                    </p>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> After submitting this application, you
                    will receive payment instructions via email. Your donation
                    will be marked as &quot;in-progress&quot; until payment is
                    confirmed.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    label="Cancel"
                    onClick={() => router.push('/partner/donations')}
                  />
                  <Button
                    label={submitting ? 'Submitting...' : 'Submit Donation'}
                    onClick={handleSubmit}
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
