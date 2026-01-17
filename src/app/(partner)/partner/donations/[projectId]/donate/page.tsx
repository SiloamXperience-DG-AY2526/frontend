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
  const [donationType] = useState<DonationType>('individual');
  const [countryOfResidence] = useState('Singapore');

  // Success/Failure state
  const [donationResult, setDonationResult] = useState<{
    success: boolean;
    receiptId?: string;
    amount?: number;
    projectTitle?: string;
  } | null>(null);

  // Dummy payment methods (saved cards)
  const savedCards = [
    { id: '1', type: 'visa', last4: '1234' },
    { id: '2', type: 'visa', last4: '5678' },
    { id: '3', type: 'visa', last4: '9012' },
    { id: '4', type: 'visa', last4: '3456' },
    { id: '5', type: 'visa', last4: '7890' },
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
        paymentMode: paymentMethod,
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
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading project details...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-10 py-8 overflow-y-auto">
        {/* Back Button */}
        {step < 4 && (
          <button
            onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
            className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 cursor-pointer"
          >
            <span className="text-2xl">←</span>
            <span>Back</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Complete Your Donation</h1>
          <p className="text-gray-600">
            You&apos;re one step away from creating meaningful change.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Project Title Box (Top Right) */}
          <div className="flex justify-end mb-6">
            <div className="bg-gray-300 rounded-lg px-8 py-4">
              <h2 className="font-bold">{project.title}</h2>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${
                      step === s
                        ? 'bg-black text-white border-black'
                        : step > s
                        ? 'bg-gray-400 text-gray-700 border-gray-400'
                        : 'bg-white text-gray-400 border-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      step === s ? 'text-black' : 'text-gray-400'
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
                    className={`w-20 h-1 mx-2 ${
                      step > s ? 'bg-black' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg border-2 border-black p-12">
            {/* STEP 1: Amount */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Choose your donation amount
                </h2>

                {/* Preset Amount Buttons */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-6 rounded-lg border-2 font-bold text-xl transition cursor-pointer ${
                        selectedAmount === amount
                          ? 'border-black bg-gray-100'
                          : 'border-gray-300 hover:border-gray-400'
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-600">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="xx"
                      className="w-full py-4 pl-10 pr-4 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#195D4B] outline-none transition"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleContinueFromAmount}
                    className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
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
                <div className="space-y-4 mb-8">
                  {savedCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() =>
                        setPaymentMethod(`${card.type} ****${card.last4}`)
                      }
                      className={`w-full p-4 border-b-2 text-left flex items-center gap-3 hover:bg-gray-50 transition ${
                        paymentMethod === `${card.type} ****${card.last4}`
                          ? 'border-black bg-gray-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">💳</span>
                      <span className="font-semibold">
                        [icon] {card.type} {card.last4}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleContinueFromPayment}
                    className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
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
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-semibold">Project</span>
                    <span className="font-bold">{project.title}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-semibold">Donation Amount</span>
                    <span className="font-bold">
                      {formatCurrency(getDonationAmount())}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
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
                        [icon] credit card ******** {paymentMethod.slice(-4)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmDonation}
                  disabled={submitting}
                  className="w-full px-8 py-3 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
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
                    <div className="text-6xl mb-6">✓</div>
                    <h2 className="text-3xl font-bold mb-4">
                      Donation Successful !
                    </h2>
                    <p className="text-gray-600 mb-2">
                      Thank you for your generous donation of{' '}
                      {formatCurrency(donationResult.amount || 0)} to{' '}
                      {donationResult.projectTitle}
                    </p>
                    <p className="text-gray-700 font-semibold mb-6">
                      Receipt ID: #{donationResult.receiptId}
                    </p>

                    {/* Subscribe Checkbox */}
                    <div className="mb-8">
                      <label className="flex items-center justify-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm text-gray-600">
                          Subscribe for email reminder emails for recurring
                          donations?
                        </span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => router.push('/partner/donations')}
                        className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                      >
                        Request Receipt
                      </button>
                      <button
                        onClick={() => router.push('/partner/donations')}
                        className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200"
                      >
                        Home
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Failure */}
                    <div className="text-6xl mb-6">✗</div>
                    <h2 className="text-3xl font-bold mb-4">
                      Your donation was unsuccessful!
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
  );
}
