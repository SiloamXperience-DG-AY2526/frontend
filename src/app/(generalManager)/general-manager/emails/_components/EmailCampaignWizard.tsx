'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import MultiSelect from '@/components/ui/MultiSelect';
import {
  createEmailCampaign,
  getEmailCampaign,
  previewAudience,
  publishCampaign,
  sendTestEmail,
  updateAudience,
  updateContent,
  updateDelivery,
} from '@/lib/api/emailCampaign';
import { getAllVolunteerProjects } from '@/lib/api/volunteer';
import { EmailCampaignDetail, EmailCampaignStatus } from '@/types/EmailCampaign';
import { useManagerBasePath } from '@/lib/utils/managerBasePath';

type Step = 1 | 2 | 3 | 4;

const INTEREST_OPTIONS = [
  { value: 'fundraise', label: 'Organizing fundraising events' },
  { value: 'planTrips', label: 'Planning trips for your organization/group' },
  { value: 'missionTrips', label: 'Short-term mission trips (up to 14 days)' },
  { value: 'longTerm', label: 'Long-term commitments (6 months or more)' },
  { value: 'admin', label: 'Behind-the-scenes administration' },
  { value: 'publicity', label: 'Marketing & social media magic' },
  { value: 'teaching', label: 'Teaching & mentoring' },
  { value: 'training', label: 'Training & program development' },
  { value: 'agriculture', label: 'Agriculture projects' },
  { value: 'building', label: 'Building & facilities work' },
  { value: 'others', label: 'Other' },
] as const;

const INTEREST_LABELS = INTEREST_OPTIONS.map((opt) => opt.label);
const interestLabelToValue = INTEREST_OPTIONS.reduce<Record<string, string>>(
  (acc, opt) => {
    acc[opt.label] = opt.value;
    return acc;
  },
  {}
);
const interestValueToLabel = INTEREST_OPTIONS.reduce<Record<string, string>>(
  (acc, opt) => {
    acc[opt.value] = opt.label;
    return acc;
  },
  {}
);

const GENDER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
] as const;

const TIMEZONES = [{ value: 'SGT', label: 'Singapore Timezone (SGT)' }];

const sectionTitle = 'text-sm font-semibold text-slate-800';
const label = 'text-xs font-semibold text-slate-700';
const inputStyle =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#2F6E62] focus:ring-1 focus:ring-[#2F6E62]';

export default function EmailCampaignWizard({
  initialCampaignId,
}: {
  initialCampaignId?: string;
}) {
  const router = useRouter();
  const basePath = useManagerBasePath('general');
  const [step, setStep] = useState<Step>(1);
  const [campaignId, setCampaignId] = useState<string | undefined>(
    initialCampaignId
  );
  const [loading, setLoading] = useState(Boolean(initialCampaignId));
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<EmailCampaignStatus>('draft');

  const [campaignName, setCampaignName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');

  const [projectId, setProjectId] = useState('');
  const [isActivePartner, setIsActivePartner] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [volunteerInterests, setVolunteerInterests] = useState<string[]>([]);
  const [volunteerSkills, setVolunteerSkills] = useState('');
  const [languages, setLanguages] = useState('');

  const [audienceCount, setAudienceCount] = useState(0);
  const [audienceEmails, setAudienceEmails] = useState<string[]>([]);
  const [audienceUpdated, setAudienceUpdated] = useState(false);

  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timezone, setTimezone] = useState(TIMEZONES[0].value);

  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [body, setBody] = useState('');

  const [testEmail, setTestEmail] = useState('');

  const [projects, setProjects] = useState<Array<{ id: string; title: string }>>(
    []
  );

  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    message?: string;
  }>({ open: false, type: 'success', title: '' });
  const filterInitRef = useRef(true);
  const allInterests = volunteerInterests.length === 0;

  useEffect(() => {
    const controller = new AbortController();
    getAllVolunteerProjects(1, 100, undefined, controller.signal)
      .then((res) => {
        const list: Array<{ id: string; title: string }> =
          res?.data ?? res?.projects ?? [];
        setProjects(
          list.map((p) => ({
            id: p.id,
            title: p.title,
          }))
        );
      })
      .catch(() => null);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!initialCampaignId) return;
    let mounted = true;
    setLoading(true);
    getEmailCampaign(initialCampaignId)
      .then((data) => {
        if (!mounted || !data) return;
        const campaign = data as EmailCampaignDetail;
        setCampaignId(campaign.id);
        setCampaignStatus(campaign.status);
        setCampaignName(campaign.name ?? '');
        setSenderAddress(campaign.senderAddress ?? '');
        setSubject(campaign.subject ?? '');
        setPreviewText(campaign.previewText ?? '');
        setBody(campaign.body ?? '');

        if (campaign.scheduledAt) {
          const d = new Date(campaign.scheduledAt);
          setScheduledDate(d.toISOString().slice(0, 10));
          setScheduledTime(d.toTimeString().slice(0, 5));
        }

        const filter = campaign.audienceFilter;
        if (filter) {
          setProjectId(filter.projectId ?? '');
          setIsActivePartner(
            filter.isActivePartner === undefined || filter.isActivePartner === null
              ? ''
              : filter.isActivePartner
              ? 'true'
              : 'false'
          );
          setGender(filter.gender ?? '');
          setNationality(filter.nationality ?? '');
          setMinAge(filter.minAge ? String(filter.minAge) : '');
          setMaxAge(filter.maxAge ? String(filter.maxAge) : '');
          setVolunteerInterests(
            (filter.volunteerInterests ?? []).map(
              (value) => interestValueToLabel[value] ?? value
            )
          );
          setVolunteerSkills((filter.volunteerSkills ?? []).join(', '));
          setLanguages((filter.languages ?? []).join(', '));
        }

        if (campaign.id) {
          handlePreviewAudience(campaign.id, true);
        }
      })
      .catch((err) => {
        setToast({
          open: true,
          type: 'error',
          title: 'Failed to load campaign',
          message: err instanceof Error ? err.message : String(err),
        });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [initialCampaignId]);

  useEffect(() => {
    if (loading) return;
    if (filterInitRef.current) {
      filterInitRef.current = false;
      return;
    }
    setAudienceUpdated(false);
  }, [
    projectId,
    isActivePartner,
    gender,
    nationality,
    minAge,
    maxAge,
    volunteerInterests,
    volunteerSkills,
    languages,
    loading,
  ]);

  const steps = useMemo(
    () => [
      { id: 1, label: 'Target Audience', note: 'Who will receive this email' },
      { id: 2, label: 'Delivery Method', note: 'Set timing and timezone' },
      { id: 3, label: 'Content', note: 'Write the email message' },
      { id: 4, label: 'Results', note: 'Review and send' },
    ],
    []
  );

  const selectedProject = projects.find((p) => p.id === projectId);

  const toScheduledAt = () => {
    if (!scheduledDate || !scheduledTime) return undefined;
    const [y, m, d] = scheduledDate.split('-').map(Number);
    const [hh, mm] = scheduledTime.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0).toISOString();
  };

  const ensureCampaign = async () => {
    if (campaignId) return campaignId;
    if (!campaignName.trim() || !senderAddress.trim()) {
      throw new Error('Campaign name and sender address are required.');
    }
    const created = await createEmailCampaign({
      name: campaignName.trim(),
      senderAddress: senderAddress.trim(),
    });
    setCampaignId(created.id);
    return created.id;
  };

  const handlePreviewAudience = async (id: string, markUpdated = false) => {
    try {
      const res = await previewAudience(id);
      setAudienceCount(res.audienceCount ?? 0);
      setAudienceEmails(res.emails ?? []);
      if (markUpdated) setAudienceUpdated(true);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Preview failed',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleAudienceUpdate = async () => {
    try {
      setSaving(true);
      const id = await ensureCampaign();
      await updateAudience(id, {
        projectId: projectId ? projectId : null,
        isActivePartner:
          isActivePartner === ''
            ? null
            : isActivePartner === 'true',
        gender: gender || null,
        nationality: nationality.trim() || null,
        minAge: minAge ? Number(minAge) : null,
        maxAge: maxAge ? Number(maxAge) : null,
        volunteerInterests: volunteerInterests.length
          ? volunteerInterests
              .map((label) => interestLabelToValue[label] ?? label)
              .filter(Boolean)
          : [],
        volunteerSkills: volunteerSkills
          ? volunteerSkills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        languages: languages
          ? languages
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      });
      await handlePreviewAudience(id, true);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Save failed',
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAudienceNext = () => {
    if (!audienceUpdated) {
      setToast({
        open: true,
        type: 'error',
        title: 'Update audience first',
        message: 'Please update the audience to preview before continuing.',
      });
      return;
    }
    setStep(2);
  };

  const handleDeliveryDone = async () => {
    try {
      if (!scheduledDate || !scheduledTime) {
        setToast({
          open: true,
          type: 'error',
          title: 'Missing schedule',
          message: 'Please select a date and time.',
        });
        return;
      }
      setSaving(true);
      if (!campaignId) throw new Error('Save audience first.');
      await updateDelivery(campaignId, {
        scheduledAt: toScheduledAt(),
        timezone,
      });
      setStep(3);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Save failed',
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeliverySave = async () => {
    try {
      if (!scheduledDate || !scheduledTime) {
        setToast({
          open: true,
          type: 'error',
          title: 'Missing schedule',
          message: 'Please select a date and time.',
        });
        return;
      }
      setSaving(true);
      if (!campaignId) throw new Error('Save audience first.');
      await updateDelivery(campaignId, {
        scheduledAt: toScheduledAt(),
        timezone,
      });
      setToast({
        open: true,
        type: 'success',
        title: 'Draft saved',
      });
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Save failed',
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleContentDone = async () => {
    try {
      if (!subject.trim() || !body.trim()) {
        setToast({
          open: true,
          type: 'error',
          title: 'Missing content',
          message: 'Subject and body are required.',
        });
        return;
      }
      setSaving(true);
      if (!campaignId) throw new Error('Save audience first.');
      await updateContent(campaignId, {
        subject: subject.trim(),
        previewText: previewText.trim() || undefined,
        body: body.trim(),
      });
      setStep(4);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Save failed',
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleContentSave = async () => {
    try {
      if (!subject.trim() || !body.trim()) {
        setToast({
          open: true,
          type: 'error',
          title: 'Missing content',
          message: 'Subject and body are required.',
        });
        return;
      }
      setSaving(true);
      if (!campaignId) throw new Error('Save audience first.');
      await updateContent(campaignId, {
        subject: subject.trim(),
        previewText: previewText.trim() || undefined,
        body: body.trim(),
      });
      setToast({
        open: true,
        type: 'success',
        title: 'Draft saved',
      });
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Save failed',
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (step === 1) {
      await handleAudienceUpdate();
      setToast({
        open: true,
        type: 'success',
        title: 'Draft saved',
      });
      return;
    }
    if (step === 2) {
      await handleDeliverySave();
      return;
    }
    if (step >= 3) {
      await handleContentSave();
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      if (!campaignId) throw new Error('Campaign not ready to publish.');
      await publishCampaign(campaignId);
      setToast({
        open: true,
        type: 'success',
        title: 'Campaign scheduled',
      });
      setTimeout(() => {
        router.push(`${basePath}/emails`);
      }, 1200);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Publish failed',
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleSendTest = async () => {
    if (!campaignId) return;
    try {
      setSaving(true);
      await sendTestEmail(campaignId, testEmail.trim());
      setToast({
        open: true,
        type: 'success',
        title: 'Test email sent',
      });
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        title: 'Test failed',
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const isPublishDisabled =
    !campaignId || !subject.trim() || !body.trim() || publishing;
  const readOnly = campaignStatus === 'sent';

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-600">
        Loading email campaign...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={3500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-[32px] w-[5px] bg-[#56E0C2]" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create an email
            </h1>
            <p className="text-sm text-slate-500">
              Build, preview, and schedule outreach to partners.
            </p>
          </div>
        </div>
        {readOnly ? (
          <div className="rounded-md bg-gray-100 border border-gray-300 px-4 py-2 text-sm text-gray-600">
            This campaign has been sent and cannot be edited.
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className={[
                'rounded-md px-5 py-2 text-sm font-semibold',
                'border border-[#1F6B59] text-[#1F6B59]',
                'hover:bg-[#E6F5F1] transition',
                saving ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isPublishDisabled}
              onClick={handlePublish}
              className={[
                'rounded-md px-5 py-2 text-sm font-semibold text-white',
                'bg-[#1F6B59] hover:bg-[#195746] transition',
                isPublishDisabled ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              {publishing ? 'Publishing...' : 'Review and Publish'}
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-[#E6EFEA]">
        <div className="grid grid-cols-4 text-xs font-semibold text-slate-500">
          {steps.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id as Step)}
              className={[
                'px-4 py-3 text-left border-r border-slate-200 last:border-r-0',
                step === s.id
                  ? 'bg-white text-slate-800'
                  : 'hover:bg-[#DBE7E1]',
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    'inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]',
                    step === s.id
                      ? 'border-slate-700 text-slate-700'
                      : 'border-slate-400 text-slate-400',
                  ].join(' ')}
                >
                  {s.id}
                </span>
                {s.label}
              </div>
              <div className="mt-1 text-[11px] font-normal text-slate-500">
                {s.note}
              </div>
            </button>
          ))}
        </div>
      </div>

      {step === 1 && (
        <fieldset disabled={readOnly} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <p className={sectionTitle}>Campaign Details</p>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>Campaign name *</label>
                    <input
                      className={inputStyle}
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Email Name"
                      disabled={Boolean(campaignId)}
                    />
                  </div>
                  <div>
                    <label className={label}>Sender address *</label>
                    <input
                      className={inputStyle}
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      placeholder="hello@yourorg.org"
                      disabled={Boolean(campaignId)}
                    />
                  </div>
                </div>
                {campaignId && (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Campaign name and sender address are set once created.
                  </p>
                )}
              </div>

              <div>
                <p className={sectionTitle}>Audience</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Leave any filter empty or choose All to include everyone.
                </p>
                <div className="mt-3 space-y-4">
                  <div>
                    <label className={label}>Project</label>
                    <select
                      className={inputStyle}
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                    >
                      <option value="">All projects</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                    {selectedProject && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        Users who joined {selectedProject.title}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                    <label className={label}>Gender</label>
                    <select
                      className={inputStyle}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      {GENDER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={label}>Active Partners</label>
                      <select
                        className={inputStyle}
                        value={isActivePartner}
                        onChange={(e) => setIsActivePartner(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="true">Active only</option>
                        <option value="false">Inactive only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
                    <div>
                      <label className={label}>Age</label>
                      <input
                        className={inputStyle}
                        value={minAge}
                        onChange={(e) => setMinAge(e.target.value)}
                        placeholder="Minimum"
                        type="number"
                        min={0}
                      />
                    </div>
                    <div className="mt-6 text-center text-xs text-slate-400">
                      to
                    </div>
                    <div>
                      <label className={label}>&nbsp;</label>
                      <input
                        className={inputStyle}
                        value={maxAge}
                        onChange={(e) => setMaxAge(e.target.value)}
                        placeholder="Maximum"
                        type="number"
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={label}>Nationality</label>
                    <input
                      className={inputStyle}
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="All nationalities"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Leave blank to include all nationalities.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className={label}>Volunteer Interest</label>
                      <label className="flex items-center gap-2 text-[11px] text-slate-500">
                        <input
                          type="checkbox"
                          checked={allInterests}
                          onChange={(e) => {
                            if (e.target.checked) setVolunteerInterests([]);
                          }}
                        />
                        All interests
                      </label>
                    </div>
                    <MultiSelect
                      label=""
                      options={INTEREST_LABELS}
                      value={volunteerInterests}
                      onChange={setVolunteerInterests}
                      placeholder="All interests"
                    />
                  </div>

                  <div>
                    <label className={label}>Expertise</label>
                    <input
                      className={inputStyle}
                      value={volunteerSkills}
                      onChange={(e) => setVolunteerSkills(e.target.value)}
                      placeholder="Teaching, First aid, Logistics"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Leave blank for all skills. Separate multiple skills with commas.
                    </p>
                  </div>

                  <div>
                    <label className={label}>Languages</label>
                    <input
                      className={inputStyle}
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="All languages"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Leave blank for all languages. Separate multiple with commas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleAudienceUpdate}
                  disabled={saving}
                  className={[
                    'rounded-md px-8 py-2 text-sm font-semibold text-white',
                    'bg-[#1F6B59] hover:bg-[#195746] transition',
                    saving ? 'opacity-50 cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  {saving ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={handleAudienceNext}
                  disabled={!audienceUpdated || saving}
                  className={[
                    'rounded-md px-8 py-2 text-sm font-semibold text-white',
                    'bg-[#2F5F70] hover:bg-[#264D5B] transition',
                    !audienceUpdated || saving
                      ? 'opacity-50 cursor-not-allowed'
                      : '',
                  ].join(' ')}
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-[#E8F6FB] p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-800">
              Audience Insights
            </div>
            <div className="mt-3 text-3xl font-bold text-slate-900">
              {audienceCount}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-600">
              List of Users
            </div>
            <ul className="mt-2 max-h-44 space-y-1 overflow-y-auto text-xs text-slate-600">
              {audienceEmails.length === 0 ? (
                <li>No preview available yet.</li>
              ) : (
                audienceEmails
                  .slice(0, 8)
                  .map((email) => <li key={email}>• {email}</li>)
              )}
            </ul>
            {audienceEmails.length > 8 && (
              <p className="mt-2 text-[11px] text-slate-500">
                +{audienceEmails.length - 8} more
              </p>
            )}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset disabled={readOnly} className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-xl space-y-6">
            <p className={sectionTitle}>Delivery</p>
            <div>
              <label className={label}>Date *</label>
              <input
                type="date"
                className={inputStyle}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Time *</label>
                <input
                  type="time"
                  className={inputStyle}
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Timezone *</label>
                <select
                  className={inputStyle}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDeliveryDone}
                disabled={saving}
                className={[
                  'rounded-md px-8 py-2 text-sm font-semibold text-white',
                  'bg-[#1F6B59] hover:bg-[#195746] transition',
                  saving ? 'opacity-50 cursor-not-allowed' : '',
                ].join(' ')}
              >
                {saving ? 'Saving...' : 'Done'}
              </button>
            </div>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset disabled={readOnly} className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-md border border-[#1F6B59] bg-white px-4 py-1.5 text-xs font-semibold text-[#1F6B59]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="rounded-md bg-[#2F5F70] px-4 py-1.5 text-xs font-semibold text-white"
            >
              Preview and Test
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className={label}>Subject *</label>
              <input
                className={inputStyle}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className={label}>Preview Text</label>
              <input
                className={inputStyle}
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Short preview text"
              />
            </div>
            <div>
              <label className={label}>Body *</label>
              <textarea
                className={`${inputStyle} min-h-[200px] resize-none`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleContentDone}
              disabled={saving}
              className={[
                'rounded-md px-8 py-2 text-sm font-semibold text-white',
                'bg-[#1F6B59] hover:bg-[#195746] transition',
                saving ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              {saving ? 'Saving...' : 'Done'}
            </button>
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset disabled={readOnly} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-md border border-[#1F6B59] bg-white px-4 py-1.5 text-xs font-semibold text-[#1F6B59]"
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-md bg-[#2F5F70] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Preview and Test
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className={label}>Send a test email to</label>
                <input
                  className={inputStyle}
                  placeholder="Enter your email address here"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={!testEmail.trim() || saving}
                  className={[
                    'rounded-md px-6 py-2 text-sm font-semibold text-white',
                    'bg-[#1F6B59] hover:bg-[#195746] transition',
                    !testEmail.trim() || saving
                      ? 'opacity-50 cursor-not-allowed'
                      : '',
                  ].join(' ')}
                >
                  Send Test Message
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-slate-500 bg-white p-5 shadow-sm">
            <div className="flex gap-2 pb-3">
              <span className="h-3 w-3 rounded-full bg-slate-400" />
              <span className="h-3 w-3 rounded-full bg-slate-400" />
              <span className="h-3 w-3 rounded-full bg-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {subject || 'Email Subject'}
            </h3>
            {previewText && (
              <p className="mt-1 text-xs text-slate-500">{previewText}</p>
            )}
            <div className="mt-4 whitespace-pre-wrap text-sm text-slate-700">
              {body || 'Email body preview will appear here.'}
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
