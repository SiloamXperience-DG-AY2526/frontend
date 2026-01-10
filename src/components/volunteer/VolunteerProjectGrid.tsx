import React from 'react';
import { VolunteerProject } from '@/types/Volunteer';
import VolunteerProjectCard from './VolunteerProjectCard';

export default function VolunteerProjectGrid({
  loading,
  projects,
}: {
  loading: boolean;
  projects: VolunteerProject[];
}) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
        Loading projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
        No projects found.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <VolunteerProjectCard key={p.id} p={p} />
      ))}
    </div>
  );
}
