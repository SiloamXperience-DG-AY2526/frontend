import { SectionCard, InfoRow } from '@/components/partnerInfo/common';

type PartnerProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  title?: string;
  dob?: string;
  gender?: string;
  occupation?: string;
  nationality?: string;
  countryCode?: string;
  contactNumber?: string;
  emergencyCountryCode?: string;
  emergencyContactNumber?: string;
  identificationNumber?: string;
  residentialAddress?: string;
  otherInterests?: string | null;
  otherReferrers?: string | null;
  otherContactModes?: string | null;
  hasVolunteerExperience?: boolean;
  volunteerAvailability?: string;
  consentUpdatesCommunications?: boolean;
  subscribeNewsletterEvents?: boolean;
  skills?: string[];
  languages?: string[];
  contactModes?: string[];
  interests?: string[];
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-GB');
};

const formatList = (value?: string[]) =>
  value && value.length > 0 ? value.join(', ') : '-';

const formatBool = (value?: boolean) => (value ? 'Yes' : 'No');

export default function PartnerProfileDetailsCard({
  profile,
}: {
  profile: Record<string, unknown>;
}) {
  const p = profile as PartnerProfile;
  const fullName = `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim();
  const contact =
    p.countryCode && p.contactNumber
      ? `${p.countryCode}${p.contactNumber}`
      : '-';
  const emergencyContact =
    p.emergencyCountryCode && p.emergencyContactNumber
      ? `${p.emergencyCountryCode}${p.emergencyContactNumber}`
      : '-';

  const rows = [
    { label: 'Full Name', value: fullName || '-' },
    { label: 'Title', value: p.title || '-' },
    { label: 'Email', value: p.email || '-' },
    { label: 'Date of Birth', value: formatDate(p.dob) },
    { label: 'Gender', value: p.gender || '-' },
    { label: 'Nationality', value: p.nationality || '-' },
    { label: 'Occupation', value: p.occupation || '-' },
    { label: 'Identification Number', value: p.identificationNumber || '-' },
    { label: 'Contact Number', value: contact },
    { label: 'Emergency Contact', value: emergencyContact },
    { label: 'Residential Address', value: p.residentialAddress || '-' },
    {
      label: 'Volunteer Experience',
      value: formatBool(p.hasVolunteerExperience),
    },
    { label: 'Volunteer Availability', value: p.volunteerAvailability || '-' },
    { label: 'Skills', value: formatList(p.skills) },
    { label: 'Languages', value: formatList(p.languages) },
    { label: 'Contact Modes', value: formatList(p.contactModes) },
    { label: 'Interests', value: formatList(p.interests) },
    { label: 'Other Interests', value: p.otherInterests || '-' },
    { label: 'Other Referrers', value: p.otherReferrers || '-' },
    { label: 'Other Contact Modes', value: p.otherContactModes || '-' },
    {
      label: 'Consent Updates',
      value: formatBool(p.consentUpdatesCommunications),
    },
    {
      label: 'Subscribe Newsletter',
      value: formatBool(p.subscribeNewsletterEvents),
    },
  ];

  return (
    <SectionCard title="Partner Profile">
      <div className="space-y-1">
        {rows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </SectionCard>
  );
}
