"use client";

import { use } from 'react';
import EmailCampaignWizard from '../_components/EmailCampaignWizard';

export default function EditEmailCampaignPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = use(params);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-10 py-8">
        <EmailCampaignWizard initialCampaignId={campaignId} />
      </main>
    </div>
  );
}
