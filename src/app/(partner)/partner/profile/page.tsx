'use client';

import { getUserProfile } from '@/lib/api/user';
import { PartnerProfile } from '@/types/UserData';
import { useEffect, useState } from 'react';


const empty = '— — —';

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-center justify-between gap-6 py-2">
    <span className="text-sm font-semibold text-slate-900">{label}</span>
    <span className="text-sm text-slate-500">
      {value}
    </span>
  </div>
);

export default function ProfilePage() {

  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile>();

  useEffect(() => {
    const fetchProfile = async () => {
      const partnerProfile = await getUserProfile() as PartnerProfile;
      setPartnerProfile(partnerProfile);
    };

    fetchProfile();

  }, []);

  const profile = {
    lastUpdated: '04 Oct 2025',
    name: `${partnerProfile?.firstName} ${partnerProfile?.lastName}`,
    email: partnerProfile?.email,
    title: partnerProfile?.title,

    contactNumber: partnerProfile?.contactNumber,

    occupation: partnerProfile?.occupation,
    education: partnerProfile?.otherInterests,
    languages: partnerProfile?.languages?.join(', '),
    nationality: partnerProfile?.nationality,
    address: partnerProfile?.residentialAddress,

    availability: partnerProfile?.volunteerAvailability,
    expertise: partnerProfile?.skills?.join(', '),
    experience: partnerProfile?.hasVolunteerExperience,
  };

  const onEdit = () => {
    // Example: route to edit page
    // router.push("/profile/edit");
    alert('Edit clicked');
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Last updated: 04 Oct 2025
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Avatar placeholder */}
            <div className="flex items-start">
              <div className="relative h-44 w-44">
                {/* Outer circle */}
                <div className="absolute inset-0 rounded-full border-2 border-slate-300 bg-white" />
                {/* Head */}
                <div className="absolute left-1/2 top-[26%] h-12 w-12 -translate-x-1/2 rounded-full border-2 border-slate-300 bg-white" />
                {/* Shoulders */}
                <div className="absolute left-1/2 top-[56%] h-20 w-28 -translate-x-1/2 rounded-b-full border-2 border-t-0 border-slate-300 bg-white" />
              </div>
            </div>

            {/* My Profile card */}
            <div className="rounded-2xl bg-sky-50 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">My Profile</h2>

              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between gap-6 py-2">
                  <span className="text-sm font-semibold text-slate-900">
                    Name:
                  </span>
                  <span className="text-sm text-slate-500">
                    {profile.name?.trim() ? profile.name : empty}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-6 py-2">
                  <span className="text-sm font-semibold text-slate-900">
                    Email:
                  </span>
                  <span className="text-sm text-slate-500">
                    {profile.email?.trim() ? profile.email : empty}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-6 py-2">
                  <span className="text-sm font-semibold text-slate-900">
                    Contact No:
                  </span>
                  <span className="text-sm text-slate-500">
                    {profile.contactNumber?.trim() ? profile.contactNumber : empty}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onEdit}
                  className="rounded-lg bg-emerald-200 px-8 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300 active:scale-[0.99]"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* My Details */}
            <div className="rounded-2xl bg-sky-50 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">My Details</h2>

              <div className="mt-4">
                <Field label="Occupation:" value={profile.occupation} />
                <Field label="Education:" value={profile.education} />
                <Field label="Languages:" value={profile.languages} />
                <Field label="Nationality:" value={profile.nationality} />
                <Field label="Address:" value={profile.address} />
              </div>
            </div>

            {/* My Interests */}
            <div className="rounded-2xl bg-sky-50 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">My Interests</h2>

              <div className="mt-4">
                <Field label="Availability:" value={profile.availability} />
                <Field label="Expertise:" value={profile.expertise} />
                <Field label="Experience:" value={profile.experience} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
