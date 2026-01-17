'use client';

import { PersonalParticulars } from '@/types/PartnerInfo';
import { formatGender, formatPreferredComms } from '@/app/(partner)/partner/[slug]/utils';
import { InfoRow, SectionCard } from './common';

export function PersonalParticularsCard({
  personalParticulars,
}: {
  personalParticulars: PersonalParticulars;
}) {
  return (
    <SectionCard title="Personal Particulars">
      <InfoRow label="Full Name" value={personalParticulars.fullName} />
      <InfoRow label="Prefix Title" value={personalParticulars.prefixTitle} />
      <InfoRow label="Birthday" value={personalParticulars.birthday} />
      <InfoRow label="Gender" value={formatGender(personalParticulars.gender)} />
      <InfoRow label="Occupation" value={personalParticulars.occupation} />
      <InfoRow label="Nationality" value={personalParticulars.nationality} />
      <InfoRow label="Phone Number" value={personalParticulars.phoneNumber} />
      <InfoRow
        label="Preferred Communication Method"
        value={formatPreferredComms(personalParticulars.preferredCommunicationMethod)}
      />
    </SectionCard>
  );
}


