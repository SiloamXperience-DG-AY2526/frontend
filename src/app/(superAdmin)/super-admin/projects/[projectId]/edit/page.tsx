'use client';

import GeneralManagerEditProjectPage from '@/app/(generalManager)/general-manager/projects/[projectId]/edit/page';

export default function SuperAdminEditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return <GeneralManagerEditProjectPage params={params} />;
}
