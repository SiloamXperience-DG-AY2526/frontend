import { PreferredCommunicationMethod, PersonalParticulars } from '@/types/PartnerInfo';

export function formatTimestampUTC(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDateShortUTC(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export function formatTimeLabelUTC(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(undefined, {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatGender(g: PersonalParticulars['gender']) {
  return g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Others';
}

export function formatPreferredComms(m: PreferredCommunicationMethod) {
  const map: Record<PreferredCommunicationMethod, string> = {
    email: 'Email',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    messenger: 'Messenger',
    phoneCall: 'Phone Call',
  };
  return map[m] ?? m;
}

export function parseTimeLabel(timeLabel: string) {
  const m = timeLabel.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  const hourRaw = Number(m[1]);
  const minute = Number(m[2]);
  const ampm = m[3].toUpperCase();
  let hour = hourRaw % 12;
  if (ampm === 'PM') hour += 12;
  return { hour, minute };
}

export function setTimeOnIsoDateUTC(baseIso: string, timeLabel: string) {
  const parsed = parseTimeLabel(timeLabel);
  const base = new Date(baseIso);
  if (!parsed || Number.isNaN(base.getTime())) return baseIso;
  base.setUTCHours(parsed.hour, parsed.minute, 0, 0);
  return base.toISOString();
}

export function calcHoursRounded(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const ms = end.getTime() - start.getTime();
  if (ms <= 0) return 0;
  return Math.round((ms / 36e5) * 100) / 100;
}


