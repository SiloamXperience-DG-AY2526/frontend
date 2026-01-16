'use client';

import Button from '@/components/ui/Button';
import { getUserProfile, updateUserProfile } from '@/lib/api/user';
import { StaffProfile } from '@/types/UserData';
import { useEffect, useState } from 'react';
import FieldBox from '@/components/partner/FieldBox';

export default function ProfileGrid() {
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const p = (await getUserProfile()) as StaffProfile;
      setStaffProfile(p);

      setForm({
        firstName: p?.firstName ?? '',
        lastName: p?.lastName ?? '',
        email: p?.email ?? '',
      });
    };

    fetchProfile();
  }, []);

  const onCancel = () => {
    // reset to original values
    if (!staffProfile) return;
    setForm({
      firstName: staffProfile.firstName ?? '',
      lastName: staffProfile.lastName ?? '',
      email: staffProfile.email ?? '',
    });
    setIsEditing(false);
  };

  const onSave = async () => {
    const payload = {
      ...staffProfile,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
    };

    const updated = await updateUserProfile(payload);
    setStaffProfile(updated as StaffProfile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
