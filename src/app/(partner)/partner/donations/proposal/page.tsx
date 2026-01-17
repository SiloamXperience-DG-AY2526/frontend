'use client';

import { useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/Textarea';
import UploadBox from '@/components/ui/UploadBox';
import SectionTitle from '@/components/ui/FormSectionTitle';
import Toast from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import {
  ProposeDonationProjectPayload,
  proposeDonationProject,
} from '@/lib/api/donation';

// TEMP placeholders (until S3 ready)
const TEMP_PDF_URL = 'https://example.com/sample-proposal.pdf';
const TEMP_IMAGE_URL =
  'https://nvpc.org.sg/wp-content/uploads/2025/04/two-women-gardening-1024x682.jpg';

export default function DonationProjectProposalPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [initiatorName, setInitiatorName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetFund, setTargetFund] = useState('');

  const [aboutDesc, setAboutDesc] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [objectives, setObjectives] = useState<string[]>(['']);

  const [, setSupportingDocs] = useState<File[]>([]);
  const [, setCoverImage] = useState<File[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });

  const [submitting, setSubmitting] = useState(false);

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const toYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    return `${y}-${m}-${day}`;
  };

  const tomorrowMin = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    t.setDate(t.getDate() + 1);
    return toYYYYMMDD(t);
  }, []);

  const endDateMin = useMemo(
    () => startDate || tomorrowMin,
    [startDate, tomorrowMin]
  );

  const clearError = (key: string) => {
    if (!errors[key]) return;
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!title.trim()) e.title = 'Donation project title is required';
    if (!initiatorName.trim()) e.initiatorName = 'Initiator is required';
    if (!location.trim()) e.location = 'Location is required';
    if (!startDate) e.startDate = 'Start date is required';
    if (!endDate) e.endDate = 'End date is required';
    if (!targetFund.trim()) e.targetFund = 'Goal is required';
    if (!aboutDesc.trim()) e.aboutDesc = 'Problem statement is required';
    if (!beneficiaries.trim())
      e.beneficiaries = 'Beneficiary details are required';

    const goalVal = Number(targetFund);
    if (!Number.isFinite(goalVal) || goalVal <= 0) {
      e.targetFund = 'Goal must be a positive number';
    }

    if (startDate && endDate) {
      const sd = new Date(startDate);
      const ed = new Date(endDate);
      if (sd > ed) e.endDate = 'End date must be after start date';
    }

    const cleanObjectives = objectives.map((o) => o.trim()).filter(Boolean);
    if (cleanObjectives.length === 0) e.objectives = 'Add at least 1 objective';

    setErrors(e);
    return e;
  };

  const addObjective = () => setObjectives((prev) => [...prev, '']);
  const removeObjective = (idx: number) =>
    setObjectives((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length > 0) {
      const msgs = Object.values(e).filter(Boolean);
      const top = msgs.slice(0, 6);
      const more = msgs.length - top.length;

      setToast({
        open: true,
        type: 'error',
        title: `Please fix ${msgs.length} issue(s)`,
        message:
          `• ${top.join('\n• ')}` + (more > 0 ? `\n• +${more} more...` : ''),
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload: ProposeDonationProjectPayload = {
        title: title.trim(),
        initiatorName: initiatorName.trim(),
        location: location.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        targetFund: Number(targetFund),
        about: aboutDesc.trim(),
        beneficiaries: beneficiaries.trim(),
        objectives: objectives
          .map((o) => o.trim())
          .filter(Boolean)
          .map((o) => `- ${o}`)
          .join('\n'),
        attachments: TEMP_PDF_URL,
        image: TEMP_IMAGE_URL,
      };

      await proposeDonationProject(payload);

      setToast({
        open: true,
        type: 'success',
        title: 'Proposal submitted',
        message: 'We’ll contact you soon with the next steps.',
      });

      setTimeout(() => {
        router.push('/partner/donations/proposal/view');
      }, 2000);
    } catch (err: unknown) {
      setToast({
        open: true,
        type: 'error',
        title: 'Submission failed',
        message: `Failed to submit project: ${String(err)}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <main className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="mb-10 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-2" />
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">
              Create Your Donation Project
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Share a fundraising idea and invite the community to support it.
            </p>
          </div>
        </div>

        {/* Project Details */}
        <SectionTitle>Project Details</SectionTitle>

        <div className="space-y-6">
          <Input
            label="Donation Project Title"
            placeholder="Give your project a clear and descriptive name"
            value={title}
            onChange={(v) => {
              setTitle(v);
              clearError('title');
            }}
            required
            error={errors.title}
          />

          <Input
            label="Initiator"
            placeholder="Your name or organisation"
            value={initiatorName}
            onChange={(v) => {
              setInitiatorName(v);
              clearError('initiatorName');
            }}
            required
            error={errors.initiatorName}
          />

          <Input
            label="Location Address"
            placeholder="Where will the fundraising project take place?"
            value={location}
            onChange={(v) => {
              setLocation(v);
              clearError('location');
            }}
            required
            error={errors.location}
          />

          {/* Date range */}
          <div>
            <label className="block text-black text-md mb-2 font-semibold">
              Date <span className="text-red-600">*</span>
            </label>

            <div className="flex items-center gap-8">
              <div className="w-[240px]">
                <input
                  type="date"
                  min={tomorrowMin}
                  value={startDate}
                  onChange={(ev) => {
                    const next = ev.target.value;
                    setStartDate(next);
                    clearError('startDate');
                    clearError('endDate');
                    if (endDate && next && endDate < next) {
                      setEndDate(next);
                    }
                  }}
                  className={[
                    'w-full rounded-md border px-3 py-2 outline-none transition',
                    errors.startDate
                      ? 'border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                      : 'border-green-700 focus:border-green-800 focus:ring-1 focus:ring-green-800',
                  ].join(' ')}
                />
                {errors.startDate ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.startDate}
                  </p>
                ) : null}
              </div>

              <span className="text-gray-700 font-medium">to</span>

              <div className="w-[240px]">
                <input
                  type="date"
                  min={endDateMin}
                  value={endDate}
                  onChange={(ev) => {
                    setEndDate(ev.target.value);
                    clearError('endDate');
                  }}
                  className={[
                    'w-full rounded-md border px-3 py-2 outline-none transition',
                    errors.endDate
                      ? 'border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600'
                      : 'border-green-700 focus:border-green-800 focus:ring-1 focus:ring-green-800',
                  ].join(' ')}
                />
                {errors.endDate ? (
                  <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
                ) : null}
              </div>
            </div>
          </div>

          <Input
            label="Goal (USD)"
            placeholder="Enter your fundraising goal"
            type="number"
            value={targetFund}
            onChange={(v) => {
              setTargetFund(v);
              clearError('targetFund');
            }}
            required
            error={errors.targetFund}
          />
        </div>

        {/* Project Plan */}
        <SectionTitle className="mt-14">Project Plan</SectionTitle>

        <div className="space-y-6">
          <TextArea
            label="Problem Statement"
            value={aboutDesc}
            placeholder="Describe the issue you’re trying to address and why it matters."
            onChange={(v) => {
              setAboutDesc(v);
              clearError('aboutDesc');
            }}
            required
            error={errors.aboutDesc}
          />

          <TextArea
            label="Beneficiary Details"
            value={beneficiaries}
            placeholder="Who will benefit from this project? (e.g. individuals, communities, groups)"
            onChange={(v) => {
              setBeneficiaries(v);
              clearError('beneficiaries');
            }}
            required
            error={errors.beneficiaries}
          />

          {/* Objectives points */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-black font-semibold text-md mb-2">
                Objectives / Goals <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  addObjective();
                  clearError('objectives');
                }}
                className="text-sm font-bold text-green-800 hover:underline"
              >
                + Add objective
              </button>
            </div>

            {errors.objectives ? (
              <p className="mb-2 text-xs text-red-600">{errors.objectives}</p>
            ) : null}

            <div className="space-y-3">
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      label=""
                      placeholder="What do you hope to achieve through this project?"
                      value={obj}
                      onChange={(v) => {
                        setObjectives((prev) =>
                          prev.map((x, i) => (i === idx ? v : x))
                        );
                        clearError('objectives');
                      }}
                    />
                  </div>

                  {objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        removeObjective(idx);
                        clearError('objectives');
                      }}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                    >
                      −
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <SectionTitle className="mt-14">Additional Information</SectionTitle>

        <div className="space-y-8">
          <UploadBox
            title="Do you have any proposals or supporting documents?"
            subtitle="Upload files to help us better understand your project."
            hint="Compatible formats: DOCX, PDF, XLSX, JPEG"
            accept=".doc,.docx,.pdf,.xlsx,.jpeg,.jpg"
            multiple
            onFilesChange={setSupportingDocs}
          />

          <UploadBox
            title="Cover Image"
            subtitle="Upload a cover image to represent your project visually."
            hint="Compatible formats: PNG, JPEG"
            accept="image/png,image/jpeg"
            multiple={false}
            onFilesChange={setCoverImage}
          />
        </div>

        {/* Submit */}
        <div className="mt-10 flex items-center justify-end">
          <button
            type="button"
            disabled={submitting}
            onClick={onSubmit}
            className={[
              'rounded-xl px-10 py-4 text-white font-bold',
              'bg-[#0E5A4A] hover:opacity-95 transition',
              submitting ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {submitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </div>
      </main>
    </div>
  );
}
