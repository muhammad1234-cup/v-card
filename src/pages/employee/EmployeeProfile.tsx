import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Save,
  MessageSquare,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface EmployeeProfileProps {
  onNavigate: (path: string) => void;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = () => {
  const { employee: authEmployee, updateCurrentEmployee } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
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
  const [initialLoading, setInitialLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getMyProfile();
        const emp = data.employee;
        setFormData({
          name: emp.name || '',
          title: emp.title || '',
          phone: emp.phone || '',
          location: emp.location || '',
          bio: emp.bio || '',
          avatar: emp.avatar || '',
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
        error('Failed to load profile');
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [error]);

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
      const updated = await api.updateMyProfile(formData);
      updateCurrentEmployee(updated);
      success('Your card details have been updated!');
    } catch {
      error('Failed to save profile changes');
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Edit Your Digital Card</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Update the contact information and social links shared when someone taps your card.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Contact &amp; Title
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Job Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                leftIcon={<Briefcase className="w-4 h-4" />}
                required
              />
              <Input
                label="Mobile Phone (for Call &amp; SMS)"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <Input
                label="Office Location"
                placeholder="e.g. San Francisco HQ or Remote"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* About / Bio */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              About &amp; Summary
            </h2>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Bio / Pitch (visible on your card)
              </label>
              <textarea
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Write a brief introduction, your specialty, or what you're working on..."
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            </div>
          </div>

          {/* Social & Scheduling Links */}
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Direct Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="LinkedIn Profile"
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
                label="WhatsApp Number or Link"
                placeholder="+15551234567"
                value={formData.socials.whatsapp}
                onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}
              />
              <Input
                label="Calendly / Booking Link"
                placeholder="https://calendly.com/username"
                value={formData.socials.calendly}
                onChange={(e) => handleSocialChange('calendly', e.target.value)}
                leftIcon={<Calendar className="w-4 h-4 text-amber-400" />}
              />
              <Input
                label="GitHub"
                placeholder="https://github.com/username"
                value={formData.socials.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                leftIcon={<Github className="w-4 h-4 text-purple-400" />}
              />
              <Input
                label="Personal Website"
                placeholder="https://yourwebsite.com"
                value={formData.socials.website}
                onChange={(e) => handleSocialChange('website', e.target.value)}
                leftIcon={<Globe className="w-4 h-4 text-blue-400" />}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
