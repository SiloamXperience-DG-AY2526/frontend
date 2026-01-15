'use client';

import React, { useMemo, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { proposeVolunteerProject } from '@/lib/api/volunteer';
import {
  ProjectFrequency,
  ProposeVolunteerProjectPayload,
} from '@/types/Volunteer';
import RadioGroup from '@/components/ui/RadioGroup';
import SectionTitle from '@/components/ui/FormSectionTitle';
import UploadBox from '@/components/ui/UploadBox';

const USER_ID_TEMP = 'ccecd54a-b014-4a4c-a56c-588a0d197fec';

type TimePeriod = 'one-time' | 'ongoing';
type FrequencyUI = 'weekly' | 'monthly' | 'ad-hoc';

type PositionForm = {
  role: string;
  description: string;
  skills: string[];
};
const TEMP_PDF_URL = 'https://example.com/sample-proposal.pdf';
const TEMP_IMAGE_URL =
  'https://nvpc.org.sg/wp-content/uploads/2025/04/two-women-gardening-1024x682.jpg';

export default function VolunteerProjectProposalPage() {
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
    { role: '', description: '', skills: [''] },
  ]);
  //used when s3 set up
  // const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
  // const [coverImage, setCoverImage] = useState<File[]>([]);
  const [, setSupportingDocs] = useState<File[]>([]);
  const [, setCoverImage] = useState<File[]>([]);

  // submit state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      (p) => p.role.trim() && p.description.trim()
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
      { role: '', description: '', skills: [''] },
    ]);

  const removePosition = (idx: number) =>
    setPositions((prev) => prev.filter((_, i) => i !== idx));

  const addSkill = (posIdx: number) =>
    setPositions((prev) =>
      prev.map((p, i) =>
        i === posIdx ? { ...p, skills: [...p.skills, ''] } : p
      )
    );

  const removeSkill = (posIdx: number, skillIdx: number) =>
    setPositions((prev) =>
      prev.map((p, i) =>
        i === posIdx
          ? { ...p, skills: p.skills.filter((_, si) => si !== skillIdx) }
          : p
      )
    );

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg(null);

      const payload: ProposeVolunteerProjectPayload = {
        userId: USER_ID_TEMP,

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
          skills: p.skills.map((s) => s.trim()).filter(Boolean),
        })),
      };

      await proposeVolunteerProject(payload);
      setSuccessMsg('Project proposal submitted successfully.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Submit failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

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
                          prev.map((x, i) => (i === idx ? v : x))
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
                        prev.map((x, i) => (i === pIdx ? { ...x, role: v } : x))
                      )
                    }
                  />

                  <TextArea
                    label="Role Description"
                    value={pos.description}
                    onChange={(v) =>
                      setPositions((prev) =>
                        prev.map((x, i) =>
                          i === pIdx ? { ...x, description: v } : x
                        )
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
                                            si === sIdx ? v : sv
                                          ),
                                        }
                                      : x
                                  )
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

                  {/* <TextArea
                    label="Logistics Required"
                    value=""
                    onChange={() => {}}
                  />
                  <Input
                    label="Estimated Number of Volunteers Needed *"
                    value=""
                    readOnly
                  /> */}
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
        </div>

        {/* Submit */}
        <div className="mt-10 flex items-center justify-end">
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={onSubmit}
            className={[
              'rounded-xl px-10 py-4 text-white font-bold',
              'bg-[#0E5A4A] hover:opacity-95 transition',
              !canSubmit || submitting ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {submitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </div>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        {successMsg && (
          <div className="mt-4 text-sm text-green-700">{successMsg}</div>
        )}
      </main>
    </div>
  );
}
