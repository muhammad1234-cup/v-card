import fs from 'fs';
import path from 'path';

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string; // Plain/simple for demo
  name: string;
  role: 'ADMIN' | 'EMPLOYEE';
  employeeId?: string;
}

export interface DBSocials {
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

export interface DBEmployee {
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
  role: 'ADMIN' | 'EMPLOYEE';
  socials: DBSocials;
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

export interface DBCompanySettings {
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

export interface DBScanEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  department: string;
  avatar: string;
  action: 'scan' | 'vcard';
  timestamp: string;
}

interface DatabaseSchema {
  users: DBUser[];
  employees: DBEmployee[];
  company: DBCompanySettings;
  scans: DBScanEvent[];
}

const initialData: DatabaseSchema = {
  users: [
    {
      id: 'usr-admin',
      email: 'admin@company.com',
      passwordHash: 'admin123',
      name: 'System Administrator',
      role: 'ADMIN',
    },
    {
      id: 'usr-sarah',
      email: 'sarah@company.com',
      passwordHash: 'employee123',
      name: 'Sarah Chen',
      role: 'EMPLOYEE',
      employeeId: 'emp-sarah',
    },
    {
      id: 'usr-alex',
      email: 'alex@company.com',
      passwordHash: 'employee123',
      name: 'Alex Rivera',
      role: 'EMPLOYEE',
      employeeId: 'emp-alex',
    },
    {
      id: 'usr-marcus',
      email: 'marcus@company.com',
      passwordHash: 'employee123',
      name: 'Marcus Vance',
      role: 'EMPLOYEE',
      employeeId: 'emp-marcus',
    },
    {
      id: 'usr-elena',
      email: 'elena@company.com',
      passwordHash: 'employee123',
      name: 'Elena Rostova',
      role: 'EMPLOYEE',
      employeeId: 'emp-elena',
    },
  ],
  employees: [
    {
      id: 'emp-sarah',
      userId: 'usr-sarah',
      slug: 'sarah-chen',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      title: 'Lead Solutions Architect',
      department: 'Engineering & Cloud',
      bio: 'Enterprise cloud architect specializing in distributed AI systems, multi-region high availability, and secure edge infrastructure.',
      phone: '+1 (555) 349-8120',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      themeColor: '#2563eb',
      status: 'ACTIVE',
      role: 'EMPLOYEE',
      socials: {
        linkedin: 'https://linkedin.com/in/sarahchen-cloud',
        twitter: 'https://twitter.com/sarahchen_tech',
        github: 'https://github.com/sarahchen-dev',
        website: 'https://sarahchen.dev',
        whatsapp: '+15553498120',
        calendly: 'https://calendly.com/sarahchen-apex',
      },
      scanCount: 142,
      vcardDownloadCount: 89,
      lastScannedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      nfcConfig: {
        tagId: 'NTAG215-SF01',
        encodedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        writeStatus: 'written',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp-alex',
      userId: 'usr-alex',
      slug: 'alex-rivera',
      name: 'Alex Rivera',
      email: 'alex@company.com',
      title: 'VP of Product Strategy',
      department: 'Product Leadership',
      bio: 'Scaling frontier enterprise SaaS platforms from zero to global market leadership. Passionate about human-centric interfaces.',
      phone: '+1 (555) 782-9011',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      themeColor: '#4f46e5',
      status: 'ACTIVE',
      role: 'EMPLOYEE',
      socials: {
        linkedin: 'https://linkedin.com/in/alexrivera-product',
        twitter: 'https://twitter.com/alexrivera',
        website: 'https://alexrivera.io',
        calendly: 'https://calendly.com/alexrivera-product',
      },
      scanCount: 98,
      vcardDownloadCount: 64,
      lastScannedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      nfcConfig: {
        tagId: 'NTAG215-NY04',
        encodedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        writeStatus: 'written',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp-marcus',
      userId: 'usr-marcus',
      slug: 'marcus-vance',
      name: 'Marcus Vance',
      email: 'marcus@company.com',
      title: 'Head of Design & UX',
      department: 'Design & Brand',
      bio: 'Crafting memorable, intuitive user experiences and design systems for enterprise software and physical computing.',
      phone: '+1 (555) 412-6789',
      location: 'Austin, TX',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      themeColor: '#059669',
      status: 'ACTIVE',
      role: 'EMPLOYEE',
      socials: {
        linkedin: 'https://linkedin.com/in/marcusvance-ux',
        github: 'https://github.com/marcusvance',
        website: 'https://marcusvance.design',
      },
      scanCount: 76,
      vcardDownloadCount: 45,
      lastScannedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      nfcConfig: {
        writeStatus: 'written',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'emp-elena',
      userId: 'usr-elena',
      slug: 'elena-rostova',
      name: 'Elena Rostova',
      email: 'elena@company.com',
      title: 'Director of Strategic Partnerships',
      department: 'Business Development',
      bio: 'Connecting global tech ecosystems, strategic capital, and alliance networks for enterprise digital transformations.',
      phone: '+1 (555) 670-3321',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      themeColor: '#d97706',
      status: 'ACTIVE',
      role: 'EMPLOYEE',
      socials: {
        linkedin: 'https://linkedin.com/in/elena-rostova',
        twitter: 'https://twitter.com/elena_rostova',
        whatsapp: '+15556703321',
      },
      scanCount: 114,
      vcardDownloadCount: 82,
      lastScannedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  company: {
    id: 'company-default',
    name: 'Apex Technologies',
    tagline: 'Next-Generation Enterprise AI & Cloud Systems',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    brandColor: '#2563eb',
    secondaryColor: '#4f46e5',
    website: 'https://apextechnologies.io',
    email: 'contact@apextechnologies.io',
    phone: '+1 (555) 942-8820',
    address: '100 Innovation Way, Suite 400, San Francisco, CA 94107',
    cardTheme: 'modern',
  },
  scans: [
    {
      id: 'scn-1',
      employeeId: 'emp-sarah',
      employeeName: 'Sarah Chen',
      title: 'Lead Solutions Architect',
      department: 'Engineering & Cloud',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      action: 'scan',
      timestamp: '15 mins ago',
    },
    {
      id: 'scn-2',
      employeeId: 'emp-alex',
      employeeName: 'Alex Rivera',
      title: 'VP of Product Strategy',
      department: 'Product Leadership',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      action: 'vcard',
      timestamp: '42 mins ago',
    },
    {
      id: 'scn-3',
      employeeId: 'emp-elena',
      employeeName: 'Elena Rostova',
      title: 'Director of Strategic Partnerships',
      department: 'Business Development',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      action: 'scan',
      timestamp: '2 hours ago',
    },
  ],
};

class MemoryDB {
  private data: DatabaseSchema;
  private dbPath: string;

  constructor() {
    this.dbPath = path.resolve(process.cwd(), 'data', 'db.json');
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('Could not read from data/db.json, using defaults', e);
    }
    this.save(initialData);
    return initialData;
  }

  private save(data: DatabaseSchema) {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // In-memory fallback if fs fails
    }
  }

  // Users
  getUserByEmail(email: string): DBUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): DBUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  // Employees
  getEmployees(): DBEmployee[] {
    return this.data.employees;
  }

  getEmployeeById(id: string): DBEmployee | undefined {
    return this.data.employees.find((e) => e.id === id);
  }

  getEmployeeBySlug(slug: string): DBEmployee | undefined {
    return this.data.employees.find(
      (e) => e.slug.toLowerCase() === slug.toLowerCase()
    );
  }

  getEmployeeByUserId(userId: string): DBEmployee | undefined {
    return this.data.employees.find((e) => e.userId === userId);
  }

  createEmployee(data: Partial<DBEmployee>): DBEmployee {
    const slugBase = (data.name || 'card')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Ensure unique slug
    let uniqueSlug = slugBase;
    let counter = 1;
    while (this.data.employees.some((e) => e.slug === uniqueSlug)) {
      uniqueSlug = `${slugBase}-${counter++}`;
    }

    const newEmp: DBEmployee = {
      id: `emp-${Date.now().toString(36)}`,
      slug: uniqueSlug,
      name: data.name || 'Unnamed Employee',
      email: data.email || '',
      title: data.title || 'Team Member',
      department: data.department || 'General',
      bio: data.bio || '',
      phone: data.phone || '',
      location: data.location || '',
      avatar:
        data.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'card')}`,
      themeColor: data.themeColor || this.data.company.brandColor || '#2563eb',
      status: 'ACTIVE',
      role: 'EMPLOYEE',
      socials: data.socials || {},
      scanCount: 0,
      vcardDownloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    newEmp.id = `emp-${Date.now().toString(36)}`;
    newEmp.slug = uniqueSlug;

    // If user doesn't exist, create an employee user account
    if (newEmp.email && !this.getUserByEmail(newEmp.email)) {
      const newUser: DBUser = {
        id: `usr-${Date.now().toString(36)}`,
        email: newEmp.email,
        passwordHash: 'employee123',
        name: newEmp.name,
        role: 'EMPLOYEE',
        employeeId: newEmp.id,
      };
      newEmp.userId = newUser.id;
      this.data.users.push(newUser);
    }

    this.data.employees.push(newEmp);
    this.save(this.data);
    return newEmp;
  }

  updateEmployee(id: string, updates: Partial<DBEmployee>): DBEmployee {
    const index = this.data.employees.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }

    const current = this.data.employees[index];
    const updated: DBEmployee = {
      ...current,
      ...updates,
      id: current.id, // Immutable ID
      slug: updates.slug || current.slug,
      updatedAt: new Date().toISOString(),
    };

    this.data.employees[index] = updated;
    this.save(this.data);
    return updated;
  }

  deleteEmployee(id: string): boolean {
    const initialLen = this.data.employees.length;
    this.data.employees = this.data.employees.filter((e) => e.id !== id);
    this.save(this.data);
    return this.data.employees.length < initialLen;
  }

  incrementCardAction(slug: string, action: 'scan' | 'vcard'): void {
    const emp = this.getEmployeeBySlug(slug);
    if (!emp) return;

    if (action === 'scan') {
      emp.scanCount += 1;
      emp.lastScannedAt = new Date().toISOString();
    } else {
      emp.vcardDownloadCount += 1;
    }

    // Record scan event
    const scanEvent: DBScanEvent = {
      id: `scn-${Date.now().toString(36)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      title: emp.title,
      department: emp.department,
      avatar: emp.avatar,
      action,
      timestamp: 'Just now',
    };
    this.data.scans.unshift(scanEvent);
    if (this.data.scans.length > 20) {
      this.data.scans.pop();
    }

    this.save(this.data);
  }

  // Company Settings
  getCompanySettings(): DBCompanySettings {
    return this.data.company;
  }

  updateCompanySettings(updates: Partial<DBCompanySettings>): DBCompanySettings {
    this.data.company = {
      ...this.data.company,
      ...updates,
      id: 'company-default',
    };
    this.save(this.data);
    return this.data.company;
  }

  // Analytics Stats
  getStats() {
    const totalEmployees = this.data.employees.length;
    const activeCards = this.data.employees.filter((e) => e.status === 'ACTIVE').length;
    const totalScans = this.data.employees.reduce((acc, e) => acc + e.scanCount, 0);
    const totalDownloads = this.data.employees.reduce(
      (acc, e) => acc + e.vcardDownloadCount,
      0
    );

    return {
      totalEmployees,
      activeCards,
      totalScans,
      totalDownloads,
      recentScans: this.data.scans,
    };
  }
}

export const db = new MemoryDB();
