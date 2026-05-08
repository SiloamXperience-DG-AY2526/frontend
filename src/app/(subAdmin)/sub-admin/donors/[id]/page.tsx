'use client';

import FinanceManagerDonorDetailPage from '@/app/(financeManager)/finance-manager/donors/[id]/page';

export default function SubAdminDonorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <FinanceManagerDonorDetailPage params={params} />;
}
