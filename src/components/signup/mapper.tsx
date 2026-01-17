// mapper.ts

type ContactMode =
  | 'email'
  | 'whatsapp'
  | 'telegram'
  | 'messenger'
  | 'phoneCall';

type Referrer =
  | 'friend'
  | 'socialMedia'
  | 'church'
  | 'website'
  | 'event'
  | 'other';

type Interest =
  | 'fundraise'
  | 'planTrips'
  | 'missionTrips'
  | 'longTerm'
  | 'admin'
  | 'publicity'
  | 'teaching'
  | 'training'
  | 'agriculture'
  | 'building'
  | 'others';

export function mapContactMode(v: string): ContactMode {
  const map: Record<string, ContactMode> = {
    Email: 'email',
    WhatsApp: 'whatsapp',
    Telegram: 'telegram',
    Messenger: 'messenger',
    'Phone Call': 'phoneCall',
  };

  return map[v];
}

export function mapReferrer(v: string): Referrer {
  const map: Record<string, Referrer> = {
    Friend: 'friend',
    'Social Media': 'socialMedia',
    Church: 'church',
    Website: 'website',
    Event: 'event',
    Other: 'other',
  };

  return map[v];
}

export function mapInterest(v: string): Interest {
  const map: Record<string, Interest> = {
    'Organizing fundraising events': 'fundraise',
    'Planning trips for your organization/group': 'planTrips',
    'Short-term mission trips (up to 14 days)': 'missionTrips',
    'Long-term commitments (6 months or more)': 'longTerm',
    'Behind-the-scenes administration': 'admin',
    'Marketing & social media magic': 'publicity',
    'Teaching & mentoring': 'teaching',
    'Training & program development': 'training',
    'Agriculture projects': 'agriculture',
    'Building & facilities work': 'building',
    Other: 'others',
  };

  return map[v];
}
