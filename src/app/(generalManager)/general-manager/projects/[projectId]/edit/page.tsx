'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import {
  updateVolunteerProject,
  getVolunteerProjectDetails,
} from '@/lib/api/volunteer';
import {
  EditVolunteerProjectPayload,
  ProjectFrequency,
  VolunteerProjectDetail,
} from '@/types/Volunteer';
import RadioGroup from '@/components/ui/RadioGroup';
import SectionTitle from '@/components/ui/FormSectionTitle';
import UploadBox from '@/components/ui/UploadBox';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import TextArea from '@/components/ui/Textarea';
type TimePeriod = 'one-time' | 'ongoing';
type FrequencyUI = 'weekly' | 'monthly' | 'ad-hoc';

type PositionForm = {
  role: string;
  description: string;
  totalSlots: string;
  skills: string[];
};

import {
  ProjectApprovalStatus,
  ProjectOperationStatus,
} from '@/types/ProjectData'; // wherever yours lives

export const APPROVAL_STATUS_OPTIONS = [
  { value: ProjectApprovalStatus.pending, label: 'Pending' },
  { value: ProjectApprovalStatus.reviewing, label: 'Reviewing' },
  { value: ProjectApprovalStatus.approved, label: 'Approved' },
  { value: ProjectApprovalStatus.rejected, label: 'Rejected' },
] as const;

export const OPERATION_STATUS_OPTIONS = [
  { value: ProjectOperationStatus.notStarted, label: 'Not Started' },
  { value: ProjectOperationStatus.ongoing, label: 'Ongoing' },
  { value: ProjectOperationStatus.paused, label: 'Paused' },
  { value: ProjectOperationStatus.cancelled, label: 'Cancelled' },
  { value: ProjectOperationStatus.completed, label: 'Completed' },
] as const;

const TEMP_PDF_URL = 'https://example.com/sample-proposal.pdf';
const TEMP_IMAGE_URL =
  'https://nvpc.org.sg/wp-content/uploads/2025/04/two-women-gardening-1024x682.jpg';

const toDateInput = (d?: string | Date | null) => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const toTimeInput = (d?: string | Date | null) => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const parseBullets = (text?: string | null) => {
  if (!text) return [''];
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^-\s*/, ''));
  return lines.length ? lines : [''];
};

export default function EditVolunteerProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();

  // Project details
  const [title, setTitle] = useState('');
  const [initiatorName, setInitiatorName] = useState('');
  const [location, setLocation] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [timePeriod, setTimePeriod] = useState<TimePeriod>('one-time');
  const [frequencyUI, setFrequencyUI] = useState<FrequencyUI>('weekly');
  const [frequencyNotes, setFrequencyNotes] = useState('');

  // Project plan
  const [aboutDesc, setAboutDesc] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [proposedPlan, setProposedPlan] = useState('');

  // Objectives as points
  const [objectives, setObjectives] = useState<string[]>(['']);

  // Positions
  const [positions, setPositions] = useState<PositionForm[]>([
    { role: '', description: '', totalSlots: '1', skills: [''] },
  ]);

  // Status
  const [approvalStatus, setApprovalStatus] = useState<ProjectApprovalStatus>(
    ProjectApprovalStatus.pending,
  );
  const [operationStatus, setOperationStatus] =
    useState<ProjectOperationStatus>(ProjectOperationStatus.ongoing);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastTitle, setToastTitle] = useState('');
  const [toastMsg, setToastMsg] = useState<string | undefined>(undefined);
  //used when s3 set up
  // const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
  // const [coverImage, setCoverImage] = useState<File[]>([]);
  const [, setSupportingDocs] = useState<File[]>([]);
  const [, setCoverImage] = useState<File[]>([]);

  // submit state
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    'draft' | 'submitted' | 'withdrawn'
  >('draft');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getVolunteerProjectDetails(projectId);
        console.log(res);
        const p = res.data as VolunteerProjectDetail;

        if (!mounted) return;

        setTitle(p.title ?? '');
        setInitiatorName(p.initiatorName ?? '');
        setLocation(p.location ?? '');

        setStartDate(toDateInput(p.startDate));
        setEndDate(toDateInput(p.endDate));
        setStartTime(toTimeInput(p.startTime));
        setEndTime(toTimeInput(p.endTime));

        // timePeriod + frequency UI mapping
        const isOnce = p.frequency === 'once';
        setTimePeriod(isOnce ? 'one-time' : 'ongoing');

        if (p.frequency === 'weekly') setFrequencyUI('weekly');
        else if (p.frequency === 'monthly') setFrequencyUI('monthly');
        else setFrequencyUI('ad-hoc');

        setFrequencyNotes(p.dayOfWeek ?? '');

        setAboutDesc(p.aboutDesc ?? '');
        setBeneficiaries(p.beneficiaries ?? '');
        setProposedPlan(p.proposedPlan ?? '');

        // TODO: objectives currently stored as a bullet string in db        
        setObjectives(parseBullets(p.objectives));

        // expecting p.positions like: { role, description, totalSlots, skills: string[] }
        setPositions(
          (p.positions?.length ? p.positions : []).map((pos) => ({
            role: pos.role ?? '',
            description: pos.description ?? '',
            totalSlots: String(pos.totalSlots ?? 1),
            skills: pos.skills?.length ? pos.skills : [''],
          })) || [{ role: '', description: '', totalSlots: '1', skills: [''] }],
        );

        setApprovalStatus(p.approvalStatus);
        setOperationStatus(p.operationStatus);
        setSubmissionStatus(p.submissionStatus ?? 'draft');
      } catch (e: unknown) {
        console.error(e);
        setToastType('error');
        setToastTitle('Failed to load');
        setToastMsg(e instanceof Error ? e.message : String(e));
        setToastOpen(true);
      }
    }

    if (projectId) load();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const frequency: ProjectFrequency = useMemo(() => {
    if (timePeriod === 'one-time') return 'once';
    if (frequencyUI === 'weekly') return 'weekly';
    if (frequencyUI === 'monthly') return 'monthly';
    return 'once'; // ad-hoc fallback
  }, [timePeriod, frequencyUI]);

  const toISODateOnly = (dateYYYYMMDD: string) => {
    const [y, m, d] = dateYYYYMMDD.split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0).toISOString();
  };

  const toISODateTime = (dateYYYYMMDD: string, timeHHMM: string) => {
    const [y, m, d] = dateYYYYMMDD.split('-').map(Number);
    const [hh, mm] = timeHHMM.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0).toISOString();
  };

  const canSubmit = useMemo(() => {
    const basicOk =
      title.trim() &&
      aboutDesc.trim() &&
      beneficiaries.trim() &&
      location.trim() &&
      startDate &&
      endDate &&
      startTime &&
      endTime;

    const positionsOk = positions.every(
      (p) =>
        p.role.trim() &&
        p.description.trim() &&
        Number.isFinite(Number(p.totalSlots)) &&
        Number(p.totalSlots) >= 1,
    );

    return Boolean(basicOk && positionsOk);
  }, [
    title,
    aboutDesc,
    beneficiaries,
    location,
    startDate,
    endDate,
    startTime,
    endTime,
    positions,
  ]);

  // Objectives handlers
  const addObjective = () => setObjectives((prev) => [...prev, '']);
  const removeObjective = (idx: number) =>
    setObjectives((prev) => prev.filter((_, i) => i !== idx));

  // Position handlers
  const addPosition = () =>
    setPositions((prev) => [
      ...prev,
      { role: '', description: '', totalSlots: '1', skills: [''] },
    ]);

  const removePosition = (idx: number) =>
    setPositions((prev) => prev.filter((_, i) => i !== idx));

  const addSkill = (posIdx: number) =>
    setPositions((prev) =>
      prev.map((p, i) =>
        i === posIdx ? { ...p, skills: [...p.skills, ''] } : p,
      ),
    );

  const removeSkill = (posIdx: number, skillIdx: number) =>
    setPositions((prev) =>
      prev.map((p, i) =>
        i === posIdx
          ? { ...p, skills: p.skills.filter((_, si) => si !== skillIdx) }
          : p,
      ),
    );

  const buildPayload = (status: 'draft' | 'submitted') => ({
    title: title.trim(),
    initiatorName: initiatorName.trim() || undefined,
    location: location.trim(),

    aboutDesc: aboutDesc.trim(),
    beneficiaries: beneficiaries.trim(),
    proposedPlan: proposedPlan.trim() || undefined,

    objectives: objectives
      .map((o) => o.trim())
      .filter(Boolean)
      .map((o) => `- ${o}`)
      .join('\n'),

    startDate: toISODateOnly(startDate),
    endDate: toISODateOnly(endDate),
    startTime: toISODateTime(startDate, startTime),
    endTime: toISODateTime(startDate, endTime),

    frequency,
    dayOfWeek: frequencyNotes.trim() || undefined,
    attachments: TEMP_PDF_URL,
    image: TEMP_IMAGE_URL, //replace with s3 link
    positions: positions.map((p) => ({
      role: p.role.trim(),
      description: p.description.trim(),

      totalSlots: Math.max(1, Number(p.totalSlots) || 1),
      skills: p.skills.map((s) => s.trim()).filter(Boolean),
    })),

    approvalStatus,
    operationStatus,
    submissionStatus: status,
  });

  const onSaveDraft = async () => {
    try {
      setSavingDraft(true);
      const payload: EditVolunteerProjectPayload = buildPayload('draft');
      await updateVolunteerProject(projectId, payload);

      setToastType('success');
      setToastTitle('Draft Saved');
      setToastMsg('You can continue editing this draft anytime.');
      setToastOpen(true);
    } catch (e: unknown) {
      setToastType('error');
      setToastTitle('Save failed');
      setToastMsg(`Failed to save draft: ${e} `);
      setToastOpen(true);
    } finally {
      setSavingDraft(false);
    }
  };

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const payload: EditVolunteerProjectPayload = buildPayload('submitted');
      await updateVolunteerProject(projectId, payload);

      setToastType('success');
      setToastTitle('Project Submitted');
      setToastOpen(true);
      setTimeout(() => {
        router.push('/general-manager/projects');
      }, 2000);
    } catch (e: unknown) {
      setToastType('error');
      setToastTitle('Submission failed');
      setToastMsg(`Failed to submit project: ${e} `);
      setToastOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = () => {
    router.push('/general-manager/projects');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast popup */}
      <Toast
        open={toastOpen}
        type={toastType}
        title={toastTitle}
        message={toastMsg}
        duration={3500}
        onClose={() => setToastOpen(false)}
      />
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-2" />
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">
              Edit Volunteer Project
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Edit volunteer project details.
            </p>
          </div>
        </div>

        {/* Project Details */}
        <SectionTitle>Project Details</SectionTitle>

        <div className="space-y-6">
          <Input
            label="Volunteering Project Title *"
            placeholder="Give your project a clear and descriptive name"
            value={title}
            onChange={setTitle}
          />
          <Input
            label="Initiator *"
            placeholder="Your name or organisation"
            value={initiatorName}
            onChange={setInitiatorName}
          />

          {/* Date range */}
          <div>
            <label className="block text-black text-md mb-2 font-semibold">
              Date *
            </label>
            <div className="flex items-center gap-8">
              <div className="w-[240px]">
                <input
                  type="date"
                  placeholder="01/01/1991"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-green-700 px-3 py-2 outline-none transition focus:border-green-800 focus:ring-1 focus:ring-green-800"
                />
              </div>

              <span className="text-gray-700 font-medium">to</span>

              <div className="w-[240px]">
                <input
                  type="date"
                  placeholder="01/01/1991"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-green-700 px-3 py-2 outline-none transition focus:border-green-800 focus:ring-1 focus:ring-green-800"
                />
              </div>
            </div>
          </div>

          <RadioGroup
            label="Time Period *"
            options={[
              { value: 'one-time', label: 'One-time' },
              { value: 'ongoing', label: 'Ongoing' },
            ]}
            value={timePeriod}
            onChange={(v) => setTimePeriod(v as TimePeriod)}
          />

          <div>
            <RadioGroup
              label="Frequency *"
              options={[
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'ad-hoc', label: 'Ad Hoc' },
              ]}
              value={frequencyUI}
              onChange={(v) => setFrequencyUI(v as FrequencyUI)}
            />
            <div className="mt-3">
              <Input
                label=""
                placeholder="Please specify further here (Example: Every Monday, Wednesday and Friday)"
                value={frequencyNotes}
                onChange={setFrequencyNotes}
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-black text-md mb-2 font-semibold">
              Time *
            </label>
            <div className="flex items-center gap-8">
              <div className="w-[240px]">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-md border border-green-700 px-3 py-2 outline-none transition focus:border-green-800 focus:ring-1 focus:ring-green-800"
                />
              </div>

              <span className="text-gray-700 font-medium">to</span>

              <div className="w-[240px]">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-md border border-green-700 px-3 py-2 outline-none transition focus:border-green-800 focus:ring-1 focus:ring-green-800"
                />
              </div>
            </div>
          </div>

          <Input
            label="Location Address"
            value={location}
            onChange={setLocation}
            placeholder="Where will the activity take place?"
          />
        </div>

        {/* Project Plan */}
        <SectionTitle className="mt-14">Project Plan</SectionTitle>

        <div className="space-y-6">
          <TextArea
            label="Problem Statement *"
            value={aboutDesc}
            placeholder="Describe the issue you’re trying to address and why it matters."
            onChange={setAboutDesc}
          />
          <TextArea
            label="Beneficiary Details *"
            value={beneficiaries}
            placeholder="Who will benefit from this project? (e.g. individuals, communities, groups)"
            onChange={setBeneficiaries}
          />
          <TextArea
            label="How will this project be carried out? *"
            value={proposedPlan}
            placeholder="If you have a rough plan, briefly outline your approach or activities.. If you’re still exploring, that’s okay too."
            onChange={setProposedPlan}
          />

          {/* Objectives points */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-black font-semibold text-md mb-2">
                Objectives (points) *
              </label>
              <button
                type="button"
                onClick={addObjective}
                className="text-sm font-bold text-green-800 hover:underline"
              >
                + Add objective
              </button>
            </div>

            <div className="space-y-3">
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      label=""
                      placeholder="What do you hope to achieve through this project?"
                      value={obj}
                      onChange={(v) =>
                        setObjectives((prev) =>
                          prev.map((x, i) => (i === idx ? v : x)),
                        )
                      }
                    />
                  </div>
                  {objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(idx)}
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

        {/* Volunteer Positions */}
        <SectionTitle className="mt-14">Volunteer Positions</SectionTitle>

        <div className="rounded-xl border border-green-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-bold text-gray-800">
              Volunteer Positions
            </div>

            <button
              type="button"
              onClick={addPosition}
              className="text-sm font-bold text-green-800 hover:underline"
            >
              + Add another position
            </button>
          </div>

          <div className="space-y-10">
            {positions.map((pos, pIdx) => (
              <div key={pIdx} className="relative">
                {positions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePosition(pIdx)}
                    className="absolute right-0 top-0 text-sm font-bold text-gray-700 hover:text-red-600"
                  >
                    −
                  </button>
                )}

                <div className="space-y-5">
                  <Input
                    label="Role Title"
                    value={pos.role}
                    onChange={(v) =>
                      setPositions((prev) =>
                        prev.map((x, i) =>
                          i === pIdx ? { ...x, role: v } : x,
                        ),
                      )
                    }
                  />

                  <TextArea
                    label="Role Description"
                    value={pos.description}
                    onChange={(v) =>
                      setPositions((prev) =>
                        prev.map((x, i) =>
                          i === pIdx ? { ...x, description: v } : x,
                        ),
                      )
                    }
                  />

                  {/* Skills Required */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-black font-semibold text-md mb-2">
                        Skills Required *
                      </label>

                      <button
                        type="button"
                        onClick={() => addSkill(pIdx)}
                        className="text-sm font-bold text-green-800 hover:underline"
                      >
                        + Add another skill
                      </button>
                    </div>

                    <div className="space-y-3">
                      {pos.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              label=""
                              value={skill}
                              onChange={(v) =>
                                setPositions((prev) =>
                                  prev.map((x, i) =>
                                    i === pIdx
                                      ? {
                                          ...x,
                                          skills: x.skills.map((sv, si) =>
                                            si === sIdx ? v : sv,
                                          ),
                                        }
                                      : x,
                                  ),
                                )
                              }
                            />
                          </div>

                          {pos.skills.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSkill(pIdx, sIdx)}
                              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                            >
                              −
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Estimated Number of Volunteers Needed *"
                    placeholder="e.g. 5"
                    value={pos.totalSlots}
                    onChange={(v) =>
                      setPositions((prev) =>
                        prev.map((x, i) =>
                          i === pIdx ? { ...x, totalSlots: v } : x,
                        ),
                      )
                    }
                  />
                </div>

                {pIdx !== positions.length - 1 && (
                  <div className="mt-8 border-t border-gray-200" />
                )}
              </div>
            ))}
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Approval Status */}
            <div>
              <label className="block text-black text-md mb-2 font-semibold">
                Approval Status
              </label>
              <select
                value={approvalStatus}
                onChange={(e) =>
                  setApprovalStatus(e.target.value as ProjectApprovalStatus)
                }
                className="w-full rounded-md border border-green-700 bg-white px-3 py-2 text-sm outline-none transition focus:border-green-800 focus:ring-1 focus:ring-green-800"
              >
                {APPROVAL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Operation Status */}
            <div>
              <label className="block text-black text-md mb-2 font-semibold">
                Operation Status
              </label>
              <select
                value={operationStatus}
                onChange={(e) =>
                  setOperationStatus(e.target.value as ProjectOperationStatus)
                }
                className="w-full rounded-md border border-green-700 bg-white px-3 py-2 text-sm outline-none transition focus:border-green-800 focus:ring-1 focus:ring-green-800"
              >
                {OPERATION_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-10 flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting || savingDraft}
            className={[
              'rounded-xl px-10 py-4 font-bold',
              'border border-gray-300 bg-white text-gray-700',
              'hover:bg-gray-50 transition',
              submitting || savingDraft ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit || savingDraft || submitting || submissionStatus !== 'draft'}
            onClick={onSaveDraft}
            className={[
              'rounded-xl px-10 py-4 font-bold',
              'border border-[#0E5A4A] text-[#0E5A4A]',
              'hover:bg-[#E6F5F1] transition',
              !canSubmit || savingDraft || submitting || submissionStatus !== 'draft'
                ? 'opacity-50 cursor-not-allowed'
                : '',
            ].join(' ')}
          >
            {savingDraft ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={!canSubmit || submitting || savingDraft}
            onClick={onSubmit}
            className={[
              'rounded-xl px-10 py-4 text-white font-bold',
              'bg-[#0E5A4A] hover:opacity-95 transition',
              !canSubmit || submitting || savingDraft
                ? 'opacity-50 cursor-not-allowed'
                : '',
            ].join(' ')}
          >
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </main>
    </div>
  );
}
