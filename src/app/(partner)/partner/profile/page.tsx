'use client';

import Button from '@/components/ui/Button';
import { getUserProfile, updateUserProfile } from '@/lib/api/user';
import { PartnerProfile } from '@/types/UserData';
import { useEffect, useState } from 'react';
import FieldBox from '@/components/partner/FieldBox';
import DropdownFieldBox from '@/components/partner/DropdownFieldBox';

export default function ProfilePage() {
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    occupation: '',
    education: '',
    languages: '',
    nationality: '',
    address: '',
    availability: '',
    skills: '',
    experience: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const p = (await getUserProfile()) as PartnerProfile;
      setPartnerProfile(p);

      setForm({
        firstName: p?.firstName ?? '',
        lastName: p?.lastName ?? '',
        email: p?.email ?? '',
        contactNumber: p?.contactNumber ?? '',
        occupation: p?.occupation ?? '',
        education: p?.otherInterests ?? '',
        languages: (p?.languages ?? []).join(', '),
        nationality: p?.nationality ?? '',
        address: p?.residentialAddress ?? '',
        availability: p?.volunteerAvailability ?? '',
        skills: (p?.skills ?? []).join(', '),
        experience: p?.hasVolunteerExperience ? 'Yes' : 'No',
      });
    };

    fetchProfile();
  }, []);

  const onCancel = () => {
    // reset to original values
    if (!partnerProfile) return;
    setForm({
      firstName: partnerProfile.firstName ?? '',
      lastName: partnerProfile.lastName ?? '',
      email: partnerProfile.email ?? '',
      contactNumber: partnerProfile.contactNumber ?? '',
      occupation: partnerProfile.occupation ?? '',
      education: partnerProfile.otherInterests ?? '',
      languages: (partnerProfile.languages ?? []).join(', '),
      nationality: partnerProfile.nationality ?? '',
      address: partnerProfile.residentialAddress ?? '',
      availability: partnerProfile.volunteerAvailability ?? '',
      skills: (partnerProfile.skills ?? []).join(', '),
      experience: partnerProfile.hasVolunteerExperience ? 'Yes' : 'No',
    });
    setIsEditing(false);
  };

  const onSave = async () => {
    const payload = {
      ...partnerProfile,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      contactNumber: form.contactNumber.trim(),
      occupation: form.occupation.trim(),
      otherInterests: form.education.trim() || undefined,
      languages: form.languages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      nationality: form.nationality.trim(),
      residentialAddress: form.address.trim(),
      volunteerAvailability: form.availability.trim(),
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      hasVolunteerExperience: form.experience.toLocaleLowerCase() == 'yes' ? true : false,
    };

    const updated = await updateUserProfile(payload);
    setPartnerProfile(updated as PartnerProfile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const volunteerExperienceOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="mt-1 text-sm text-slate-500">
              Last updated: 04 Oct 2025
            </p>
          </div>

          {!isEditing ? (
            <Button
              label="Edit Profile Details"
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <div className="flex gap-3">
              <Button label="Cancel" onClick={onCancel} />
              <Button label="Save Profile Details" onClick={onSave} />
            </div>
          )}
        </div>

        {/* SAME layout for view + edit */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* avatar */}
          <div className="flex items-start justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-40 w-40 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="16" cy="16" r="14" />
              <circle cx="16" cy="12" r="4" />
              <path d="M6 26c2.5-5 17.5-5 20 0" />
            </svg>
          </div>

          {/* My Profile */}
          <div className="rounded-2xl bg-sky-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">My Profile</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldBox
                label="First Name"
                value={form.firstName}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, firstName: v }))}
              />
              <FieldBox
                label="Last Name"
                value={form.lastName}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, lastName: v }))}
              />
              <FieldBox
                label="Email"
                value={form.email}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, email: v }))}
              />
              <FieldBox
                label="Contact Number"
                value={form.contactNumber}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, contactNumber: v }))}
              />
            </div>
          </div>

          {/* My Interests */}
          <div className="rounded-2xl bg-sky-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">My Interests</h2>

            <div className="mt-4 space-y-4">
              <FieldBox
                label="Availability"
                value={form.availability}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, availability: v }))}
              />
              <DropdownFieldBox
                label="Volunteer Experience"
                value={form.experience}
                editable={isEditing}
                options={volunteerExperienceOptions}
                onChange={(v) => setForm((p) => ({ ...p, experience: v }))}
              />
              <FieldBox
                label="Volunteer Skills"
                value={form.skills}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, skills: v }))}
              />
            </div>
          </div>

          {/* My Details */}
          <div className="rounded-2xl bg-sky-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">My Details</h2>

            <div className="mt-4 space-y-4">
              <FieldBox
                label="Address"
                value={form.address}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, address: v }))}
              />
              <FieldBox
                label="Languages"
                value={form.languages}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, languages: v }))}
              />
              <FieldBox
                label="Occupation"
                value={form.occupation}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, occupation: v }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
