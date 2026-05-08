'use client';

import GeneralManagerProjectDetailPage from '@/app/(generalManager)/general-manager/projects/[projectId]/page';

export default function SubAdminProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return <GeneralManagerProjectDetailPage params={params} />;
}
