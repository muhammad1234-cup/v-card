export type Role = 'ADMIN' | 'EMPLOYEE';

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
  whatsapp?: string;
  telegram?: string;
  calendly?: string;
}

export interface Employee {
  id: string;
  userId?: string;
  slug: string;
  name: string;
  email: string;
  title: string;
  department: string;
  bio: string;
  phone: string;
  location: string;
  avatar: string;
  coverImage?: string;
  themeColor?: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: Role;
  socials: SocialLinks;
  scanCount: number;
  vcardDownloadCount: number;
  lastScannedAt?: string;
  nfcConfig?: {
    tagId?: string;
    encodedAt?: string;
    writeStatus?: 'written' | 'pending';
  };
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  brandColor: string;
  secondaryColor: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  cardTheme: 'modern' | 'minimal' | 'executive' | 'vibrant';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  employeeId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  employee?: Employee;
}

export interface AnalyticsStats {
  totalEmployees: number;
  activeCards: number;
  totalScans: number;
  totalDownloads: number;
  recentScans: Array<{
    id: string;
    employeeName: string;
    title: string;
    department: string;
    avatar: string;
    timestamp: string;
  }>;
}
