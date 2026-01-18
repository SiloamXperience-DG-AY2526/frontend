'use client';

import EmailCampaignWizard from '../_components/EmailCampaignWizard';

export default function CreateEmailCampaignPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-10 py-8">
        <EmailCampaignWizard />
      </main>
    </div>
  );
}
