'use client';

import FinanceManagerDonorDetailPage from '@/app/(financeManager)/finance-manager/donors/[id]/page';

export default function SuperAdminDonorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <FinanceManagerDonorDetailPage params={params} />;
}
