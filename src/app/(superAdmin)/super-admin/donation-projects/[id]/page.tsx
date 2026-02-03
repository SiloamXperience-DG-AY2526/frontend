'use client';

import FinanceManagerDonationProjectDetailPage from '@/app/(financeManager)/finance-manager/donation-projects/[id]/page';

export default function SuperAdminDonationProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <FinanceManagerDonationProjectDetailPage params={params} />;
}
