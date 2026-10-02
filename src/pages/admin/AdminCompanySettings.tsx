import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CompanySettings } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { 
  Building, 
  Palette, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Sparkles,
  Layers
} from 'lucide-react';

interface AdminCompanySettingsProps {
  onNavigate: (path: string) => void;
}

export const AdminCompanySettings: React.FC<AdminCompanySettingsProps> = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    id: 'company-default',
    name: 'Apex Technologies',
    tagline: 'Next-Generation Enterprise AI & Cloud Systems',
    logo: '',
    brandColor: '#2563eb',
    secondaryColor: '#4f46e5',
    website: 'https://apextechnologies.io',
    email: 'contact@apextechnologies.io',
    phone: '+1 (555) 942-8820',
    address: '100 Innovation Way, Suite 400, San Francisco, CA 94107',
    cardTheme: 'modern',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await api.getCompanySettings();
        setSettings(data);
      } catch {
        // Fallback to default
      } finally {
        setInitialLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await api.updateCompanySettings(settings);
      setSettings(updated);
      success('Company brand settings saved! All employee cards updated.');
    } catch {
      error('Failed to update company settings');
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

  const presetColors = [
    { name: 'Electric Blue', hex: '#2563eb' },
    { name: 'Indigo Purple', hex: '#6366f1' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Crimson Red', hex: '#dc2626' },
    { name: 'Amber Gold', hex: '#d97706' },
    { name: 'Midnight Slate', hex: '#334155' },
    { name: 'Rose Pink', hex: '#e11d48' },
    { name: 'Cyan Tech', hex: '#0891b2' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Company Brand &amp; Digital Card Style</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure default colors, logos, and business details across all employee cards.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Company Identity */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <Building className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-zinc-200">Company Identity</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                value={settings.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Acme Corporation"
                required
              />
              <Input
                label="Tagline / Industry"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Next-Generation Cloud Systems"
              />
              <Input
                label="Official Website"
                value={settings.website}
                onChange={(e) => handleChange('website', e.target.value)}
                leftIcon={<Globe className="w-4 h-4 text-zinc-400" />}
                placeholder="https://yourcompany.com"
              />
              <Input
                label="General Inquiries Email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-zinc-400" />}
                placeholder="info@yourcompany.com"
              />
              <Input
                label="Headquarters Phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-zinc-400" />}
                placeholder="+1 (555) 000-0000"
              />
              <Input
                label="Office Address"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                leftIcon={<MapPin className="w-4 h-4 text-zinc-400" />}
                placeholder="100 Main St, Suite 500, New York, NY"
              />
            </div>
          </div>

          {/* Section: Brand Aesthetics & Colors */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <Palette className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-semibold text-zinc-200">Color Palette &amp; Themes</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Primary Brand Color
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                    <input
                      type="color"
                      value={settings.brandColor}
                      onChange={(e) => handleChange('brandColor', e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono text-zinc-200">{settings.brandColor}</span>
                  </div>

                  {presetColors.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => handleChange('brandColor', p.hex)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                        settings.brandColor.toLowerCase() === p.hex.toLowerCase()
                          ? 'border-white bg-zinc-800 text-white font-semibold'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme selector */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Card Theme Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['modern', 'minimal', 'executive', 'vibrant'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleChange('cardTheme', t)}
                      className={`p-3.5 rounded-2xl border text-left transition-all capitalize ${
                        settings.cardTheme === t
                          ? 'border-blue-500 bg-blue-500/10 text-white shadow-sm'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold">{t}</span>
                        {settings.cardTheme === t && <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {t === 'modern' && 'Glassmorphism & gradients'}
                        {t === 'minimal' && 'Monochrome & clean lines'}
                        {t === 'executive' && 'Deep slate & corporate'}
                        {t === 'vibrant' && 'Dynamic high contrast'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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
              Update Brand Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
