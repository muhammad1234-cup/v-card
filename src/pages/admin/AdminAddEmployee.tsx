import React, { useState } from 'react';
import { api } from '../../lib/api';
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
  Save 
} from 'lucide-react';

interface AdminAddEmployeeProps {
  onNavigate: (path: string) => void;
}

export const AdminAddEmployee: React.FC<AdminAddEmployeeProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    department: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
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
  const { success, error } = useToast();

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
    if (!formData.name || !formData.email || !formData.title) {
      error('Please complete all required fields (Name, Email, Job Title)');
      return;
    }

    setIsLoading(true);
    try {
      const created = await api.createEmployee({
        ...formData,
        avatar:
          formData.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`,
      });
      success(`Digital card created for ${created.name}!`);
      onNavigate('/admin/employees');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create employee';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => onNavigate('/admin/employees')}
        >
          Back to Employee List
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6 pb-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-zinc-100">Add New Team Member</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Provision a new digital business card and NFC profile for this employee.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Info */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Elena Rostova"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Work Email *"
                type="email"
                placeholder="elena@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
              <Input
                label="Job Title *"
                placeholder="e.g. Director of Strategic Partnerships"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                leftIcon={<Briefcase className="w-4 h-4" />}
                required
              />
              <Input
                label="Department"
                placeholder="e.g. Executive, Sales, Engineering"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                leftIcon={<Building className="w-4 h-4" />}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 234-5678"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <Input
                label="Office Location"
                placeholder="San Francisco, CA or Remote"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Section: Bio & Photo */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Profile & Avatar
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  About / Professional Bio
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Short professional summary displayed on their public digital card..."
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                />
              </div>

              <Input
                label="Avatar URL (Optional - defaults to avatar generator)"
                placeholder="https://images.unsplash.com/... or leave empty"
                value={formData.avatar}
                onChange={(e) => handleChange('avatar', e.target.value)}
              />
            </div>
          </div>

          {/* Section: Social Profiles */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Social Links & Channels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/in/username"
                value={formData.socials.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                leftIcon={<Linkedin className="w-4 h-4 text-sky-400" />}
              />
              <Input
                label="X / Twitter"
                placeholder="https://twitter.com/username"
                value={formData.socials.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                leftIcon={<Twitter className="w-4 h-4 text-zinc-300" />}
              />
              <Input
                label="GitHub"
                placeholder="https://github.com/username"
                value={formData.socials.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                leftIcon={<Github className="w-4 h-4 text-purple-400" />}
              />
              <Input
                label="Personal / Portfolio Website"
                placeholder="https://elenarostova.dev"
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
              Save &amp; Generate Card
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
