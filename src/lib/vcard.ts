import { Employee, CompanySettings } from '../types';

export function generateVCard(employee: Employee, company?: CompanySettings): string {
  const nameParts = employee.name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const companyName = company?.name || 'Company';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${employee.name}`,
    `ORG:${companyName}${employee.department ? `;${employee.department}` : ''}`,
    `TITLE:${employee.title}`,
    `EMAIL;type=INTERNET;type=WORK;type=pref:${employee.email}`,
  ];

  if (employee.phone) {
    lines.push(`TEL;type=CELL;type=VOICE;type=pref:${employee.phone}`);
  }

  if (employee.location) {
    lines.push(`ADR;type=WORK:;;${employee.location};;;;`);
  }

  if (employee.socials?.website || company?.website) {
    lines.push(`URL:${employee.socials.website || company?.website}`);
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

export function downloadVCard(employee: Employee, company?: CompanySettings): void {
  const vcardData = generateVCard(employee, company);
  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `${employee.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_contact.vcf`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
