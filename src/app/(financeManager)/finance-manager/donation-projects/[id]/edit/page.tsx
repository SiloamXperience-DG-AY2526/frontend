'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import SectionTitle from '@/components/ui/FormSectionTitle';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/Textarea';
import Toast from '@/components/ui/Toast';
import LoadingTableState from '@/components/table/LoadingTableState';
import {
  DonationProject,
  DonationProjectType,
  DonationProjectApprovalStatus,
  DonationProjectSubmissionStatus,
} from '@/types/DonationProjectData';
import {
  getDonationProjectById,
  updateDonationProjectById,
} from '@/lib/api/donation';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

const toDateInput = (d?: string | null) => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const parseObjectives = (text?: string | null) => {
  if (!text) return [''];
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^-\s*/, ''));
  return lines.length ? lines : [''];
};

const PROJECT_TYPES: { value: DonationProjectType; label: string }[] = [
  { value: 'brick', label: 'Brick' },
  { value: 'sponsor', label: 'Sponsor' },
  { value: 'partnerLed', label: 'Partner-led' },
];

export default function EditDonationProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const router = useRouter();
  const basePath = useManagerBasePath('finance');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const [title, setTitle] = useState('');
  const [initiatorName, setInitiatorName] = useState('');
  const [organisingTeam, setOrganisingTeam] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<DonationProjectType>('brick');
  const [targetFund, setTargetFund] = useState('');
  const [brickSize, setBrickSize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deadline, setDeadline] = useState('');

  const [aboutDesc, setAboutDesc] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [objectives, setObjectives] = useState<string[]>(['']);

  const [imageUrl, setImageUrl] = useState('');
  const [attachmentsUrl, setAttachmentsUrl] = useState('');
  const [submissionStatus, setSubmissionStatus] =
    useState<DonationProjectSubmissionStatus>('draft');
  const [approvalStatus, setApprovalStatus] =
    useState<DonationProjectApprovalStatus>('pending');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'success', title: '' });

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      try {
        setLoading(true);
        const data = (await getDonationProjectById(
          projectId
        )) as DonationProject;
        if (!mounted) return;

        setTitle(data.title ?? '');
        setInitiatorName(data.initiatorName ?? '');
        setOrganisingTeam(data.organisingTeam ?? '');
        setLocation(data.location ?? '');
        setType(data.type ?? 'brick');
        setTargetFund(data.targetFund ?? '');
        setBrickSize(data.brickSize ?? '');
        setStartDate(toDateInput(data.startDate));
        setEndDate(toDateInput(data.endDate));
        setDeadline(toDateInput(data.deadline ?? data.endDate));
        setAboutDesc(data.about ?? '');
        setBeneficiaries(data.beneficiaries ?? '');
        setObjectives(parseObjectives(data.objectives));
        setImageUrl(data.image ?? '');
        setAttachmentsUrl(data.attachments ?? '');
        setSubmissionStatus(data.submissionStatus ?? 'draft');
        setApprovalStatus(data.approvalStatus ?? 'pending');
      } catch (error) {
        console.error('Failed to load donation project:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProject();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const addObjective = () => setObjectives((prev) => [...prev, '']);
  const removeObjective = (idx: number) =>
    setObjectives((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    if (!location.trim()) nextErrors.location = 'Location is required';
    if (!aboutDesc.trim()) nextErrors.aboutDesc = 'Problem statement is required';
    if (!startDate) nextErrors.startDate = 'Start date is required';
    if (!endDate) nextErrors.endDate = 'End date is required';
    if (type === 'partnerLed' && !targetFund.trim()) {
      nextErrors.targetFund = 'Goal is required for partner-led projects';
    }

    if (targetFund.trim()) {
      const goalVal = Number(targetFund);
      if (!Number.isFinite(goalVal) || goalVal <= 0) {
        nextErrors.targetFund = 'Goal must be a positive number';
      }
    }

    if (type === 'brick') {
      const brickVal = Number(brickSize);
      if (!brickSize.trim()) {
        nextErrors.brickSize = 'Brick size is required for brick projects';
      } else if (!Number.isFinite(brickVal) || brickVal <= 0) {
        nextErrors.brickSize = 'Brick size must be a positive number';
      }
    }

    if (startDate && endDate) {
      const sd = new Date(startDate);
      const ed = new Date(endDate);
      if (sd > ed) nextErrors.endDate = 'End date must be after start date';
    }

    const cleanObjectives = objectives.map((o) => o.trim()).filter(Boolean);
    if (cleanObjectives.length === 0) {
      nextErrors.objectives = 'Add at least 1 objective';
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const buildPayload = (status?: DonationProjectSubmissionStatus) => {
    const base = {
      title: title.trim(),
      initiatorName: initiatorName.trim() || null,
      organisingTeam: organisingTeam.trim() || null,
      location: location.trim(),
      type,
      targetFund: targetFund.trim() ? Number(targetFund) : null,
      brickSize:
        type === 'brick' && brickSize.trim() ? Number(brickSize) : null,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      about: aboutDesc.trim(),
      beneficiaries: beneficiaries.trim() || null,
      objectives: objectives
        .map((o) => o.trim())
        .filter(Boolean)
        .map((o) => `- ${o}`)
        .join('\n'),
      image: imageUrl.trim() || null,
      attachments: attachmentsUrl.trim() || null,
      approvalStatus,
    };

    // Only include submissionStatus when actually changing it (draft → submitted).
    // Sending 'submitted' on an already-submitted project resets approvalStatus.
    if (status) {
      return {
        ...base,
        submissionStatus: status,
        ...(status === 'submitted' && {
          approvalStatus:
            approvalStatus === 'approved' ? 'approved' : 'pending',
        }),
      };
    }
    return base;
  };

  const onSaveDraft = async () => {
    try {
      setSavingDraft(true);
      await updateDonationProjectById(projectId, buildPayload('draft'));
      setSubmissionStatus('draft');
      setToast({
        open: true,
        type: 'success',
        title: 'Draft saved',
        message: 'You can continue editing this draft anytime.',
      });
    } catch (error) {
      setToast({
        open: true,
        type: 'error',
        title: 'Save failed',
        message: String(error),
      });
    } finally {
      setSavingDraft(false);
    }
  };

  const isUpdate = submissionStatus !== 'draft';

  const onSubmit = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setToast({
        open: true,
        type: 'error',
        title: 'Please fix the highlighted fields',
      });
      return;
    }

    try {
      setSubmitting(true);
      await updateDonationProjectById(
        projectId,
        buildPayload(isUpdate ? undefined : 'submitted'),
      );
      if (!isUpdate) setSubmissionStatus('submitted');
      setToast({
        open: true,
        type: 'success',
        title: isUpdate ? 'Project updated' : 'Project submitted',
        message: 'Donation project details have been saved.',
      });
      setTimeout(() => {
        router.push(`${basePath}/donation-projects/${projectId}`);
      }, 800);
    } catch (error) {
      setToast({
        open: true,
        type: 'error',
        title: isUpdate ? 'Update failed' : 'Submission failed',
        message: String(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!location.trim()) return false;
    if (!aboutDesc.trim()) return false;
    if (!startDate || !endDate) return false;
    if (type === 'partnerLed' && !targetFund.trim()) return false;
    if (type === 'brick' && !brickSize.trim()) return false;
    if (objectives.every((o) => !o.trim())) return false;
    return true;
  }, [
    title,
    location,
    aboutDesc,
    startDate,
    endDate,
    targetFund,
    type,
    brickSize,
    objectives,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <PageHeader title="Loading..." />
        <div className="mt-6">
          <LoadingTableState message="Loading project details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader title="Edit donation project" />

      <div className="space-y-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle>Project details</SectionTitle>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Donation project title"
              value={title}
              onChange={(v) => {
                setTitle(v);
                if (errors.title) setErrors((p) => ({ ...p, title: '' }));
              }}
              required
              error={errors.title}
            />
            <Input
              label="Initiator"
              value={initiatorName}
              onChange={setInitiatorName}
              placeholder="Your name / organisation"
            />
            <Input
              label="Organising team"
              value={organisingTeam}
              onChange={setOrganisingTeam}
              placeholder="Optional team name"
            />
            <Input
              label="Location"
              value={location}
              onChange={(v) => {
                setLocation(v);
                if (errors.location) setErrors((p) => ({ ...p, location: '' }));
              }}
              required
              error={errors.location}
            />
            <div>
              <label className="block text-black text-md mb-2 font-semibold">
                Project type <span className="text-red-600">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DonationProjectType)}
                className="w-full rounded-md border border-green-700 bg-white px-3 py-3 text-sm outline-none transition focus:border-green-800 focus:ring-1 focus:ring-green-800"
              >
                {PROJECT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Goal (USD)"
              value={targetFund}
              onChange={(v) => {
                setTargetFund(v);
                if (errors.targetFund) {
                  setErrors((p) => ({ ...p, targetFund: '' }));
                }
              }}
              type="number"
              required
              error={errors.targetFund}
            />
            {type === 'brick' && (
              <Input
                label="Brick size"
                value={brickSize}
                onChange={(v) => {
                  setBrickSize(v);
                  if (errors.brickSize) {
                    setErrors((p) => ({ ...p, brickSize: '' }));
                  }
                }}
                type="number"
                required
                error={errors.brickSize}
              />
            )}
            <Input
              label="Start date"
              value={startDate}
              onChange={(v) => {
                setStartDate(v);
                if (errors.startDate) setErrors((p) => ({ ...p, startDate: '' }));
              }}
              type="date"
              required
              error={errors.startDate}
            />
            <Input
              label="End date"
              value={endDate}
              onChange={(v) => {
                setEndDate(v);
                if (errors.endDate) setErrors((p) => ({ ...p, endDate: '' }));
              }}
              type="date"
              required
              error={errors.endDate}
            />
            <Input
              label="Deadline"
              value={deadline}
              onChange={setDeadline}
              type="date"
              placeholder="Optional"
              error={errors.deadline}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle>Project plan</SectionTitle>
          <div className="space-y-6">
            <TextArea
              label="Problem statement"
              value={aboutDesc}
              onChange={(v) => {
                setAboutDesc(v);
                if (errors.aboutDesc) {
                  setErrors((p) => ({ ...p, aboutDesc: '' }));
                }
              }}
              rows={4}
              required
              error={errors.aboutDesc}
            />
            <TextArea
              label="Beneficiary details"
              value={beneficiaries}
              onChange={setBeneficiaries}
              rows={3}
            />

            <div>
              <label className="block text-black font-semibold text-md mb-2">
                Objectives / goals <span className="text-red-600">*</span>
              </label>
              <div className="space-y-3">
                {objectives.map((objective, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input
                      value={objective}
                      onChange={(e) => {
                        const next = [...objectives];
                        next[idx] = e.target.value;
                        setObjectives(next);
                        if (errors.objectives) {
                          setErrors((p) => ({ ...p, objectives: '' }));
                        }
                      }}
                      placeholder={`Objective ${idx + 1}`}
                      className="w-full rounded-md border border-green-700 px-3 py-2 text-sm outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                    />
                    {objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeObjective(idx)}
                        className="rounded-lg border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {errors.objectives && (
                  <p className="text-xs text-red-600">{errors.objectives}</p>
                )}
                <button
                  type="button"
                  onClick={addObjective}
                  className="rounded-lg border border-[#0E5A4A] px-4 py-2 text-sm font-semibold text-[#0E5A4A] hover:bg-[#E6F5F1]"
                >
                  Add objective
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle>Additional info</SectionTitle>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Cover image URL"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://..."
            />
            <Input
              label="Attachments URL"
              value={attachmentsUrl}
              onChange={setAttachmentsUrl}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            router.push(`${basePath}/donation-projects/${projectId}`)
          }
          disabled={submitting || savingDraft}
          className={[
            'rounded-xl px-8 py-3 font-bold',
            'border border-gray-300 bg-white text-gray-700',
            'hover:bg-gray-50 transition',
            submitting || savingDraft ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={!canSubmit || submitting || savingDraft}
          className={[
            'rounded-xl px-8 py-3 font-bold',
            'border border-[#0E5A4A] text-[#0E5A4A]',
            'hover:bg-[#E6F5F1] transition',
            !canSubmit || submitting || savingDraft
              ? 'opacity-50 cursor-not-allowed'
              : '',
          ].join(' ')}
        >
          {savingDraft ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || submitting || savingDraft}
          className={[
            'rounded-xl px-10 py-3 text-white font-bold',
            'bg-[#0E5A4A] hover:opacity-95 transition',
            !canSubmit || submitting || savingDraft
              ? 'opacity-50 cursor-not-allowed'
              : '',
          ].join(' ')}
        >
          {submitting
            ? isUpdate ? 'Updating...' : 'Submitting...'
            : isUpdate ? 'Update' : 'Submit for Review'}
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
