'use client';

import { PartnershipInterest } from '@/types/PartnerInfo';
import { InterestRow, SectionCard } from './common';

export function PartnershipInterestsCard({
  interests,
}: {
  interests: PartnershipInterest[];
}) {
  return (
    <SectionCard title="Partnership interest">
      {interests.map((i) => (
        <InterestRow
          key={i.interest}
          label={i.interest}
          value={i.interested ? 'Yes' : 'No'}
        />
      ))}
    </SectionCard>
  );
}


