'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDonationProjectById, submitDonation } from '@/lib/api/donation';
import { DonationProject } from '@/types/DonationProjectData';
import { DonationType } from '@/types/DonationData';

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export default function DonatePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  const [project, setProject] = useState<DonationProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Review, 4: Complete

  // Form state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [donationType] = useState<DonationType>('individual');
  const [countryOfResidence] = useState('Singapore');

  // Success/Failure state
  const [donationResult, setDonationResult] = useState<{
    success: boolean;
    receiptId?: string;
    amount?: number;
    projectTitle?: string;
  } | null>(null);

  const paymentOptions = [
    {
      id: 'card',
      label: 'Card',
      hint: 'Visa, Mastercard, AMEX',
    },
    {
      id: 'bank',
      label: 'Bank Transfer',
      hint: 'Local transfer',
    },
    {
      id: 'qr',
      label: 'Online QR Code',
      hint: 'PayNow/QR',
    },
  ];

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/partner/login');
      return;
    }

    if (!projectId || !user) return;
    
    const loadProjectDetails = async () => {
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

    loadProjectDetails();
  }, [projectId, router, user, authLoading]);

  const getDonationAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount);
    return 0;
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleContinueFromAmount = () => {
    const amount = getDonationAmount();
    if (!amount || amount <= 0) {
      alert('Please select or enter a donation amount');
      return;
    }
    setStep(2);
  };

  const handleContinueFromPayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setStep(3);
  };

  const handleConfirmDonation = async () => {
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
        paymentMode: paymentDetails
          ? `${paymentMethod} - ${paymentDetails}`
          : paymentMethod,
        amount: getDonationAmount(),
      };

      await submitDonation(donationData);

      // Simulate success/failure (80% success rate for demo)
      const isSuccess = Math.random() > 0.2;

      setDonationResult({
        success: isSuccess,
        receiptId: isSuccess
          ? `DN${Math.floor(Math.random() * 1000000)}`
          : undefined,
        amount: getDonationAmount(),
        projectTitle: project?.title,
      });
      setStep(4);
    } catch (error: unknown) {
      console.error('Failed to submit donation:', error);
      setDonationResult({
        success: false,
        amount: getDonationAmount(),
        projectTitle: project?.title,
      });
      setStep(4);
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
      <main className="w-full px-6 py-6 md:px-10">
        {/* Back Button */}
        {step < 4 && (
          <button
            onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
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
        )}

        {/* Header */}
        <div className="mb-8 mt-1 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Complete Your Donation
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              You&apos;re one step away from creating meaningful change.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Project Title Box */}
          <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500">Project</p>
              <h2 className="text-lg font-semibold text-gray-900">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border ${
                      step === s
                        ? 'bg-teal-600 text-white border-teal-600'
                        : step > s
                        ? 'bg-[#E3F0EC] text-[#195D4B] border-[#E3F0EC]'
                        : 'bg-white text-gray-400 border-gray-300'
                    }`}
                  >
                    {s}
                  </div>
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      step === s ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {s === 1 && 'Amount'}
                    {s === 2 && 'Payment'}
                    {s === 3 && 'Review'}
                    {s === 4 && 'Complete'}
                  </p>
                </div>
                {s < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > s ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            {/* STEP 1: Amount */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Choose your donation amount
                </h2>

                {/* Preset Amount Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-5 rounded-xl border text-lg font-semibold transition cursor-pointer ${
                        selectedAmount === amount
                          ? 'border-teal-600 bg-[#E3F0EC] text-[#195D4B]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-8">
                  <label className="block font-semibold mb-3">
                    Or enter a custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="0"
                      className="w-full py-4 pl-10 pr-4 text-lg font-semibold border border-gray-200 rounded-xl focus:border-teal-600 outline-none transition"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleContinueFromAmount}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Select payment method
                </h2>

                {/* Payment Method List */}
                <div className="space-y-4 mb-6">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setPaymentMethod(option.label)}
                      className={`w-full rounded-xl border p-4 text-left flex items-center gap-3 transition ${
                        paymentMethod === option.label
                          ? 'border-teal-600 bg-[#E3F0EC]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">
                        {option.id === 'card'
                          ? '💳'
                          : option.id === 'bank'
                            ? '🏦'
                            : '🔳'}
                      </span>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {option.hint}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional details (optional)
                  </label>
                  <input
                    type="text"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    placeholder="e.g., Bank name or card type"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-teal-600 transition"
                  />
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleContinueFromPayment}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Review your donation
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold">Project</span>
                    <span className="font-bold">{project.title}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold">Donation Amount</span>
                    <span className="font-bold">
                      {formatCurrency(getDonationAmount())}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">
                      {formatCurrency(getDonationAmount())}
                    </span>
                  </div>
                  <div className="py-3">
                    <p className="font-semibold mb-2">Payment method</p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <span>💳</span>
                      <span>
                        {paymentDetails
                          ? `${paymentMethod} - ${paymentDetails}`
                          : paymentMethod}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmDonation}
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                >
                  {submitting ? 'Processing...' : 'Confirm donation'}
                </button>
              </div>
            )}

            {/* STEP 4: Complete (Success/Failure) */}
            {step === 4 && donationResult && (
              <div className="text-center">
                {donationResult.success ? (
                  <>
                    {/* Success */}
                    <div className="text-5xl mb-6 text-teal-600">✓</div>
                    <h2 className="text-3xl font-bold mb-4">
                      Donation Successful
                    </h2>
                    <p className="text-gray-600 mb-2">
                      Thank you for your interest in supporting{' '}
                      {donationResult.projectTitle}.
                    </p>
                    <p className="text-gray-700 font-semibold mb-6">
                      We will reach out with more details.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => router.push('/partner/donations')}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                      >
                        Home
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Failure */}
                    <div className="text-5xl mb-6 text-red-500">✗</div>
                    <h2 className="text-3xl font-bold mb-4">
                      Your donation was unsuccessful
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Please try again. The merchant will redirect in 5
                      seconds...
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
