import React from 'react';
import VolunteerProjectRowCard from './VolunteerProjectRow';
import { VolunteerProjectRow } from '@/types/Volunteer';

export default function VolunteerProjectRowsGrid({
  loading,
  projects,
}: {
  loading: boolean;
  projects: VolunteerProjectRow[];
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
        <VolunteerProjectRowCard key={p.id} p={p} />
      ))}
    </div>
  );
}
