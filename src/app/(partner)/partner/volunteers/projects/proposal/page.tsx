'use client';

import { useMemo, useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/Textarea';    
import { proposeVolunteerProject, updateVolunteerProposal } from '@/lib/api/volunteer';
import {
  ProjectFrequency,
  ProposeVolunteerProjectPayload,
} from '@/types/Volunteer';
import RadioGroup from '@/components/ui/RadioGroup';
import SectionTitle from '@/components/ui/FormSectionTitle';
import UploadBox from '@/components/ui/UploadBox';
import { useRouter, useSearchParams } from 'next/navigation';
import Toast from '@/components/ui/Toast';

type TimePeriod = 'one-time' | 'ongoing';
type FrequencyUI = 'weekly' | 'monthly' | 'ad-hoc';

type PositionForm = {
  id?: string;
  role: string;
  description: string;
  totalSlots: string;
  skills: string[];
};

// TEMP placeholders (until S3 ready)
const TEMP_PDF_URL = 'https://example.com/sample-proposal.pdf';
const TEMP_IMAGE_URL =
  'https://nvpc.org.sg/wp-content/uploads/2025/04/two-women-gardening-1024x682.jpg';

export default function VolunteerProjectProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('projectId');

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

  // Uploads (unused until S3)
  const [, setSupportingDocs] = useState<File[]>([]);
  const [, setCoverImage] = useState<File[]>([]);

  // Validation + toast
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'error', title: '' });

  // submit state
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDraft() {
      if (!draftId) return;
      try {
        const res = await fetch(`/api/v1/volunteer-projects/${draftId}`);
        const data = await res.json();
        if (!res.ok || !data) return;
        const draft = data.project ?? data;
        if (!mounted) return;
        setTitle(draft.title ?? '');
        setInitiatorName(draft.initiatorName ?? '');
        setLocation(draft.location ?? '');
        setAboutDesc(draft.aboutDesc ?? '');
        setBeneficiaries(draft.beneficiaries ?? '');
        setProposedPlan(draft.proposedPlan ?? '');
        setObjectives(
          draft.objectives
            ? draft.objectives
                .split('\n')
                .map((o: string) => o.replace(/^-\s*/, '').trim())
                .filter(Boolean)
            : ['']
        );
        if (draft.startDate) {
          setStartDate(draft.startDate.slice(0, 10));
        }
        if (draft.endDate) {
          setEndDate(draft.endDate.slice(0, 10));
        }
        if (draft.startTime) {
          setStartTime(draft.startTime.slice(11, 16));
        }
        if (draft.endTime) {
          setEndTime(draft.endTime.slice(11, 16));
        }
        if (Array.isArray(draft.positions) && draft.positions.length > 0) {
          setPositions(
            draft.positions.map((pos: any) => {
              const skills =
                Array.isArray(pos.skills) && pos.skills.length > 0
                  ? pos.skills
                      .map((s: any) => (typeof s === 'string' ? s : s?.skill))
                      .filter(Boolean)
                  : [''];
              return {
                id: pos.id,
                role: pos.role ?? '',
                description: pos.description ?? '',
                totalSlots: String(pos.totalSlots ?? 1),
                skills,
              };
            })
          );
        }
      } catch {
        // ignore draft load errors
      }
    }

    loadDraft();
    return () => {
      mounted = false;
    };
  }, [draftId]);

  const frequency: ProjectFrequency = useMemo(() => {
    if (timePeriod === 'one-time') return 'once';
    if (frequencyUI === 'weekly') return 'weekly';
    if (frequencyUI === 'monthly') return 'monthly';
    return 'once';
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
  const pad2 = (n: number) => String(n).padStart(2, '0');

  // Local YYYY-MM-DD (avoids timezone shifting issues)
  const toYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    return `${y}-${m}-${day}`;
  };

  const tomorrowMin = (() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    t.setDate(t.getDate() + 1);
    return toYYYYMMDD(t);
  })();

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

    // Required project details
    if (!title.trim()) e.title = 'Project title is required';
    if (!initiatorName.trim()) e.initiatorName = 'Initiator is required';
    if (!location.trim()) e.location = 'Location is required';

    if (!startDate) e.startDate = 'Start date is required';
    if (!endDate) e.endDate = 'End date is required';
    if (!startTime) e.startTime = 'Start time is required';
    if (!endTime) e.endTime = 'End time is required';

    // Date logic
    if (startDate && endDate) {
      const sd = new Date(startDate);
      const ed = new Date(endDate);
      if (sd > ed) e.endDate = 'End date must be after start date';
    }

    // Time logic (same-day range)
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const startMins = sh * 60 + sm;
      const endMins = eh * 60 + em;
      if (endMins <= startMins) e.endTime = 'End time must be after start time';
    }

    // Time period + frequency validation (select-like)
    if (!timePeriod) e.timePeriod = 'Time period is required';
    if (timePeriod === 'ongoing' && !frequencyUI)
      e.frequencyUI = 'Frequency is required';

    // Project plan
    if (!aboutDesc.trim()) e.aboutDesc = 'Problem statement is required';
    if (!beneficiaries.trim())
      e.beneficiaries = 'Beneficiary details are required';
    if (!proposedPlan.trim()) e.proposedPlan = 'Project plan is required';

    // Objectives: at least 1 non-empty
    const cleanObjectives = objectives.map((o) => o.trim()).filter(Boolean);
    if (cleanObjectives.length === 0) e.objectives = 'Add at least 1 objective';

    // Positions: at least 1, each must be valid
    if (!positions || positions.length === 0)
      e.positions = 'Add at least 1 volunteer position';

    positions.forEach((p, idx) => {
      const n = idx + 1;

      if (!p.role.trim())
        e[`positions.${idx}.role`] = `Role title is required (Position ${n})`;

      if (!p.description.trim())
        e[
          `positions.${idx}.description`
        ] = `Role description is required (Position ${n})`;

      const slots = Number(p.totalSlots);
      if (!Number.isFinite(slots) || slots < 1)
        e[
          `positions.${idx}.totalSlots`
        ] = `Slots must be a number, at least 1 (Position ${n})`;

      const skillsClean = (p.skills ?? []).map((s) => s.trim()).filter(Boolean);
      if (skillsClean.length === 0)
        e[`positions.${idx}.skills`] = `Add at least 1 skill (Position ${n})`;
    });

    setErrors(e);
    return e;
  };

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

  const inputBase = 'w-full rounded-md px-3 py-2 outline-none transition';
  const okBorder =
    'border border-[#0E5A4A] focus:border-[#0E5A4A] focus:ring-1 focus:ring-[#0E5A4A]';
  const errBorder =
    'border border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600';

  const buildPayload = (): ProposeVolunteerProjectPayload => ({
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
    image: TEMP_IMAGE_URL,
    positions: positions.map((p) => ({
      id: p.id,
      role: p.role.trim(),
      description: p.description.trim(),
      totalSlots: Math.max(1, Number(p.totalSlots) || 1),
      skills: p.skills.map((s) => s.trim()).filter(Boolean),
    })),
  });

  const onSaveDraft = async () => {
    try {
      setSavingDraft(true);
      const payload = buildPayload();
      if (draftId) {
        await updateVolunteerProposal(draftId, payload);
      } else {
        const res = await proposeVolunteerProject(payload);
        const newId = res?.data?.id ?? res?.id;
        if (newId) {
          router.replace(`/partner/volunteers/projects/proposal?projectId=${newId}`);
        }
      }
      setToast({
        open: true,
        type: 'success',
        title: 'Draft saved',
        message: 'You can continue editing this draft anytime.',
      });
    } catch (err: unknown) {
      setToast({
        open: true,
        type: 'error',
        title: 'Save failed',
        message: `Failed to save draft: ${String(err)}`,
      });
    } finally {
      setSavingDraft(false);
    }
  };

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
      const payload = buildPayload();

      if (draftId) {
        await updateVolunteerProposal(draftId, {
          ...payload,
          submissionStatus: 'submitted',
        });
      } else {
        const res = await proposeVolunteerProject(payload);
        const newId = res?.data?.id ?? res?.id;
        if (newId) {
          await updateVolunteerProposal(newId, {
            submissionStatus: 'submitted',
          });
        }
      }

      setToast({
        open: true,
        type: 'success',
        title: 'Application submitted',
        message: 'We’ll contact you soon with the next steps.',
      });

      setTimeout(() => {
        router.push('/partner/volunteers/projects/proposal/view');
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
              Create Your Project
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Share an initiative you care about and invite others to volunteer
              with you.
            </p>
          </div>
        </div>

        {/* Project Details */}
        <SectionTitle>Project Details</SectionTitle>

        <div className="space-y-6">
          <Input
            label="Volunteering Project Title"
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

                    // If endDate is earlier than the new startDate, auto-set it to startDate
                    if (endDate && next && endDate < next) {
                      setEndDate(next);
                    }
                  }}
                  className={[
                    inputBase,
                    errors.startDate ? errBorder : okBorder,
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
                    inputBase,
                    errors.endDate ? errBorder : okBorder,
                  ].join(' ')}
                />

                {errors.endDate ? (
                  <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <RadioGroup
              label="Time Period"
              options={[
                { value: 'one-time', label: 'One-time' },
                { value: 'ongoing', label: 'Ongoing' },
              ]}
              value={timePeriod}
              onChange={(v) => {
                setTimePeriod(v as TimePeriod);
                clearError('timePeriod');
              }}
              required
            />
            {errors.timePeriod ? (
              <p className="mt-1 text-xs text-red-600">{errors.timePeriod}</p>
            ) : null}
          </div>

          <div>
            <RadioGroup
              label="Frequency"
              options={[
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'ad-hoc', label: 'Ad Hoc' },
              ]}
              value={frequencyUI}
              onChange={(v) => {
                setFrequencyUI(v as FrequencyUI);
                clearError('frequencyUI');
              }}
              required
            />
            {errors.frequencyUI ? (
              <p className="mt-1 text-xs text-red-600">{errors.frequencyUI}</p>
            ) : null}

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
              Time <span className="text-red-600">*</span>
            </label>

            <div className="flex items-center gap-8">
              <div className="w-[240px]">
                <input
                  type="time"
                  value={startTime}
                  onChange={(ev) => {
                    setStartTime(ev.target.value);
                    clearError('startTime');
                    clearError('endTime');
                  }}
                  required
                  className={[
                    inputBase,
                    errors.startTime ? errBorder : okBorder,
                  ].join(' ')}
                />
                {errors.startTime ? (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.startTime}
                  </p>
                ) : null}
              </div>

              <span className="text-gray-700 font-medium">to</span>

              <div className="w-[240px]">
                <input
                  type="time"
                  value={endTime}
                  onChange={(ev) => {
                    setEndTime(ev.target.value);
                    clearError('endTime');
                  }}
                  className={[
                    inputBase,
                    errors.endTime ? errBorder : okBorder,
                  ].join(' ')}
                />
                {errors.endTime ? (
                  <p className="mt-1 text-xs text-red-600">{errors.endTime}</p>
                ) : null}
              </div>
            </div>
          </div>

          <Input
            label="Location Address"
            value={location}
            onChange={(v) => {
              setLocation(v);
              clearError('location');
            }}
            placeholder="Where will the activity take place?"
            required
            error={errors.location}
          />
        </div>

        {/* Project Plan */}
        <SectionTitle className="mt-14">Project Plan</SectionTitle>

        <div className="space-y-6">
          <TextArea
            label="Problem Statement "
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
            label="Beneficiary Details "
            value={beneficiaries}
            placeholder="Who will benefit from this project? (e.g. individuals, communities, groups)"
            onChange={(v) => {
              setBeneficiaries(v);
              clearError('beneficiaries');
            }}
            required
            error={errors.beneficiaries}
          />

          <TextArea
            label="How will this project be carried out? "
            value={proposedPlan}
            placeholder="If you have a rough plan, briefly outline your approach or activities.. If you’re still exploring, that’s okay too."
            onChange={(v) => {
              setProposedPlan(v);
              clearError('proposedPlan');
            }}
            required
            error={errors.proposedPlan}
          />

          {/* Objectives points */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-black font-semibold text-md mb-2">
                Objectives (points) <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  addObjective();
                  clearError('objectives');
                }}
                className="text-sm font-bold text-[#0E5A4A] hover:opacity-80"
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
                        // re-validate objectives after removal
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

        {/* Volunteer Positions */}
        <SectionTitle className="mt-14">Volunteer Positions</SectionTitle>

        <div className="rounded-xl border border-green-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-bold text-gray-800">
              Volunteer Positions
            </div>

            <button
              type="button"
              onClick={() => {
                addPosition();
                clearError('positions');
              }}
              className="text-sm font-bold text-[#0E5A4A] hover:opacity-80"
            >
              + Add another position
            </button>
          </div>

          {errors.positions ? (
            <p className="mb-4 text-xs text-red-600">{errors.positions}</p>
          ) : null}

          <div className="space-y-10">
            {positions.map((pos, pIdx) => {
              const roleKey = `positions.${pIdx}.role`;
              const descKey = `positions.${pIdx}.description`;
              const slotsKey = `positions.${pIdx}.totalSlots`;
              const skillsKey = `positions.${pIdx}.skills`;

              return (
                <div key={pIdx} className="relative">
                  {positions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        removePosition(pIdx);
                        // no perfect key cleanup needed; validate on submit
                      }}
                      className="absolute right-0 top-0 text-sm font-bold text-gray-700 hover:text-red-600"
                    >
                      −
                    </button>
                  )}

                  <div className="space-y-5">
                    <Input
                      label="Role Title "
                      value={pos.role}
                      onChange={(v) => {
                        setPositions((prev) =>
                          prev.map((x, i) =>
                            i === pIdx ? { ...x, role: v } : x
                          )
                        );
                        clearError(roleKey);
                      }}
                      required
                      error={errors[roleKey]}
                    />

                    <TextArea
                      label="Role Description "
                      value={pos.description}
                      onChange={(v) => {
                        setPositions((prev) =>
                          prev.map((x, i) =>
                            i === pIdx ? { ...x, description: v } : x
                          )
                        );
                        clearError(descKey);
                      }}
                      required
                      error={errors[descKey]}
                    />

                    {/* Skills Required */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-black font-semibold text-md mb-2">
                          Skills Required{' '}
                          <span className="text-red-600">*</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            addSkill(pIdx);
                            clearError(skillsKey);
                          }}
                          className="text-sm font-bold text-[#0E5A4A] hover:opacity-80"
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
                                onChange={(v) => {
                                  setPositions((prev) =>
                                    prev.map((x, i) =>
                                      i === pIdx
                                        ? {
                                            ...x,
                                            skills: x.skills.map((sv, si) =>
                                              si === sIdx ? v : sv
                                            ),
                                          }
                                        : x
                                    )
                                  );
                                  clearError(skillsKey);
                                }}
                              />
                            </div>

                            {pos.skills.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  removeSkill(pIdx, sIdx);
                                  clearError(skillsKey);
                                }}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                              >
                                −
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {errors[skillsKey] ? (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[skillsKey]}
                        </p>
                      ) : null}
                    </div>

                    <Input
                      label="Estimated Number of Volunteers Needed "
                      placeholder="e.g. 5"
                      value={pos.totalSlots}
                      onChange={(v) => {
                        setPositions((prev) =>
                          prev.map((x, i) =>
                            i === pIdx ? { ...x, totalSlots: v } : x
                          )
                        );
                        clearError(slotsKey);
                      }}
                      required
                      error={errors[slotsKey]}
                    />
                  </div>

                  {pIdx !== positions.length - 1 && (
                    <div className="mt-8 border-t border-gray-200" />
                  )}
                </div>
              );
            })}
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
        <div className="mt-10 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={savingDraft}
            onClick={onSaveDraft}
            className={[
              'rounded-xl px-10 py-4 font-bold',
              'border border-gray-300 bg-white text-gray-700',
              'hover:bg-gray-50 transition',
              savingDraft ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {savingDraft ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={onSubmit}
            className={[
              'rounded-xl px-10 py-4 text-white font-bold',
              'bg-gradient-to-r from-[#1F7A67] to-[#2AAE92] hover:from-[#1A6A59] hover:to-[#22997F] transition',
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
