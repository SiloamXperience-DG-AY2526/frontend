'use client';

import GeneralManagerEditEmailPage from '@/app/(generalManager)/general-manager/emails/[campaignId]/page';

export default function SuperAdminEditEmailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  return <GeneralManagerEditEmailPage params={params} />;
}
