'use client';

import FinanceManagerEditDonationProjectPage from '@/app/(financeManager)/finance-manager/donation-projects/[id]/edit/page';

export default function SuperAdminEditDonationProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <FinanceManagerEditDonationProjectPage params={params} />;
}
