import { DBEmployee, DBCompanySettings } from './db';

export function formatVCard(employee: DBEmployee, company: DBCompanySettings): string {
  const nameParts = employee.name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${employee.name}`,
    `ORG:${company.name || 'Company'}${employee.department ? `;${employee.department}` : ''}`,
    `TITLE:${employee.title}`,
    `EMAIL;type=INTERNET;type=WORK;type=pref:${employee.email}`,
  ];

  if (employee.phone) {
    lines.push(`TEL;type=CELL;type=VOICE;type=pref:${employee.phone}`);
  }

  if (employee.location) {
    lines.push(`ADR;type=WORK:;;${employee.location};;;;`);
  }

  if (employee.socials?.website || company.website) {
    lines.push(`URL:${employee.socials?.website || company.website}`);
  }

  if (employee.bio) {
    lines.push(`NOTE:${employee.bio.replace(/\n/g, '\\n')}`);
  }

  if (employee.avatar && employee.avatar.startsWith('http')) {
    lines.push(`PHOTO;VALUE=URI:${employee.avatar}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}
