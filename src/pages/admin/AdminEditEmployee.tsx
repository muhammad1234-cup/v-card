import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Employee } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  User,
  Mail,
  Briefcase,
  Building,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Save,
  ExternalLink,
} from 'lucide-react';

interface AdminEditEmployeeProps {
  employeeId: string;
  onNavigate: (path: string) => void;
}

export const AdminEditEmployee: React.FC<AdminEditEmployeeProps> = ({
  employeeId,
  onNavigate,
}) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    department: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    themeColor: '#2563eb',
    socials: {
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      whatsapp: '',
      calendly: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const emp = await api.getEmployee(employeeId);
        setEmployee(emp);
        setFormData({
          name: emp.name || '',
          email: emp.email || '',
          title: emp.title || '',
          department: emp.department || '',
          phone: emp.phone || '',
          location: emp.location || '',
          bio: emp.bio || '',
          avatar: emp.avatar || '',
          status: emp.status || 'ACTIVE',
          themeColor: emp.themeColor || '#2563eb',
          socials: {
            linkedin: emp.socials?.linkedin || '',
            twitter: emp.socials?.twitter || '',
            github: emp.socials?.github || '',
            website: emp.socials?.website || '',
            whatsapp: emp.socials?.whatsapp || '',
            calendly: emp.socials?.calendly || '',
          },
        });
      } catch {
        error('Failed to load employee details');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchEmp();
  }, [employeeId, error]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [network]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await api.updateEmployee(employeeId, formData);
      setEmployee(updated);
      success('Employee card updated successfully!');
      onNavigate('/admin/employees');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update employee';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-zinc-400">
        Employee not found.
        <div className="mt-4">
          <Button variant="outline" onClick={() => onNavigate('/admin/employees')}>
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => onNavigate('/admin/employees')}
        >
          Back to Employee List
        </Button>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<ExternalLink className="w-3.5 h-3.5 text-blue-400" />}
          onClick={() => onNavigate(`/card/${employee.slug}`)}
        >
          Preview Public Card
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6 pb-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Edit {employee.name}'s Profile</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Changes reflect instantly on their live digital card and NFC taps.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-mono bg-zinc-800 text-zinc-300">
            /{employee.slug}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Status Toggle */}
          <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-zinc-200">Card Status</div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Disable to temporarily deactivate this employee's public link and NFC card.
              </div>
            </div>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'ACTIVE' | 'INACTIVE')}
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 focus:outline-none"
            >
              <option value="ACTIVE">ACTIVE (Live)</option>
              <option value="INACTIVE">INACTIVE (Disabled)</option>
            </select>
          </div>

          {/* Section: Basic Info */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Work Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
              <Input
                label="Job Title *"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                leftIcon={<Briefcase className="w-4 h-4" />}
                required
              />
              <Input
                label="Department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                leftIcon={<Building className="w-4 h-4" />}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <Input
                label="Office Location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Section: Bio & Photo */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Profile &amp; Avatar
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  About / Bio
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                />
              </div>

              <Input
                label="Avatar URL"
                value={formData.avatar}
                onChange={(e) => handleChange('avatar', e.target.value)}
              />
            </div>
          </div>

          {/* Section: Social Profiles */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Social Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="LinkedIn Profile URL"
                value={formData.socials.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                leftIcon={<Linkedin className="w-4 h-4 text-sky-400" />}
              />
              <Input
                label="X / Twitter"
                value={formData.socials.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                leftIcon={<Twitter className="w-4 h-4 text-zinc-300" />}
              />
              <Input
                label="GitHub"
                value={formData.socials.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                leftIcon={<Github className="w-4 h-4 text-purple-400" />}
              />
              <Input
                label="Personal Website"
                value={formData.socials.website}
                onChange={(e) => handleSocialChange('website', e.target.value)}
                leftIcon={<Globe className="w-4 h-4 text-blue-400" />}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('/admin/employees')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
