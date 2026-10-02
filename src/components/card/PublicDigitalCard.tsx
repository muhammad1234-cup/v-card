import React, { useState } from 'react';
import { Employee, CompanySettings } from '../../types';
import { downloadVCard } from '../../lib/vcard';
import { api } from '../../lib/api';
import { QRCodeModal } from './QRCodeModal';
import { ShareModal } from './ShareModal';
import { useToast } from '../../context/ToastContext';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  QrCode,
  UserPlus,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Youtube,
  Send,
  Calendar,
  Building,
  ShieldCheck,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface PublicDigitalCardProps {
  employee: Employee;
  company: CompanySettings;
  previewMode?: boolean;
}

export const PublicDigitalCard: React.FC<PublicDigitalCardProps> = ({
  employee,
  company,
  previewMode = false,
}) => {
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { success } = useToast();

  const brandColor = employee.themeColor || company.brandColor || '#2563eb';
  const cardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/card/${employee.slug}`
    : `https://tapcard.io/card/${employee.slug}`;

  const handleSaveContact = () => {
    downloadVCard(employee, company);
    if (!previewMode) {
      api.trackCardAction(employee.slug, 'vcard');
    }
    success(`Saved ${employee.name}'s contact to your phone!`);
  };

  const socials = employee.socials || {};

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between pb-24 sm:pb-12">
      {/* Decorative ambient background blur */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 opacity-25 blur-3xl pointer-events-none rounded-full"
        style={{
          background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)`,
        }}
      />

      {/* Main Card Viewport */}
      <div className="w-full max-w-md mx-auto relative z-10 px-4 pt-4 sm:pt-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Header Banner */}
          <div
            className="h-36 sm:h-44 w-full relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${brandColor}cc 0%, #1e1b4b 100%)`,
            }}
          >
            {/* Subtle mesh pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* NFC & Verified Badges on Banner */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>NFC Enabled</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Card</span>
              </div>
            </div>

            {/* Quick Share and QR floating icons in banner */}
            <div className="absolute bottom-3 right-4 flex items-center gap-2">
              <button
                onClick={() => setShowQR(true)}
                title="View QR Code"
                className="p-2 rounded-xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/15 transition-transform hover:scale-105"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowShare(true)}
                title="Share Card"
                className="p-2 rounded-xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/15 transition-transform hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Section */}
          <div className="px-6 pt-0 pb-6 relative">
            {/* Floating Avatar */}
            <div className="relative -mt-16 sm:-mt-20 mb-4 inline-block">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-zinc-900 shadow-xl border border-zinc-700/60"
                style={{
                  boxShadow: `0 8px 30px -4px ${brandColor}40`,
                }}
              >
                <img
                  src={
                    employee.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(employee.name)}`
                  }
                  alt={employee.name}
                  className="w-full h-full object-cover rounded-xl bg-zinc-800"
                />
              </div>
              {employee.status === 'ACTIVE' && (
                <span
                  title="Active"
                  className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-zinc-900 rounded-full shadow-sm"
                />
              )}
            </div>

            {/* Name & Titles */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                {employee.name}
              </h1>
              <p className="text-sm font-medium text-blue-400 mt-0.5">
                {employee.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400">
                <span className="flex items-center gap-1 font-medium text-zinc-300">
                  <Building className="w-3.5 h-3.5 text-zinc-400" />
                  {company.name}
                </span>
                <span>•</span>
                <span>{employee.department}</span>
              </div>
            </div>

            {/* Bio */}
            {employee.bio && (
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-800/40 p-3.5 rounded-2xl border border-zinc-800 mb-5">
                {employee.bio}
              </p>
            )}

            {/* Primary Action Button: Save Contact */}
            <button
              onClick={handleSaveContact}
              className="w-full py-3.5 px-4 rounded-2xl font-semibold text-sm text-white shadow-lg flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01] active:scale-[0.98] mb-5"
              style={{
                backgroundColor: brandColor,
                boxShadow: `0 6px 20px -2px ${brandColor}60`,
              }}
            >
              <UserPlus className="w-5 h-5" />
              <span>Save to Contacts</span>
            </button>

            {/* Quick Action Grid (Call, Email, WhatsApp, Location) */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {employee.phone && (
                <a
                  href={`tel:${employee.phone}`}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-200 transition-all hover:border-blue-500/50 group"
                >
                  <Phone className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium text-zinc-300">Call</span>
                </a>
              )}
              {employee.email && (
                <a
                  href={`mailto:${employee.email}`}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-200 transition-all hover:border-blue-500/50 group"
                >
                  <Mail className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium text-zinc-300">Email</span>
                </a>
              )}
              {socials.whatsapp ? (
                <a
                  href={`https://api.whatsapp.com/send?phone=${socials.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-200 transition-all hover:border-emerald-500/50 group"
                >
                  <Send className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium text-zinc-300">WhatsApp</span>
                </a>
              ) : (
                <a
                  href={`sms:${employee.phone}`}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-200 transition-all hover:border-purple-500/50 group"
                >
                  <Send className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium text-zinc-300">Message</span>
                </a>
              )}
              {socials.calendly ? (
                <a
                  href={socials.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-200 transition-all hover:border-amber-500/50 group"
                >
                  <Calendar className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium text-zinc-300">Book</span>
                </a>
              ) : (
                <a
                  href={
                    employee.location
                      ? `https://maps.google.com/?q=${encodeURIComponent(employee.location)}`
                      : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-200 transition-all hover:border-rose-500/50 group"
                >
                  <MapPin className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium text-zinc-300">Office</span>
                </a>
              )}
            </div>

            {/* Direct Contact Details List */}
            <div className="space-y-2.5 mb-6">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
                Contact Information
              </h3>
              {employee.email && (
                <a
                  href={`mailto:${employee.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate">
                    <span className="text-[10px] text-zinc-400 block">Work Email</span>
                    <span className="font-medium text-zinc-200 truncate">{employee.email}</span>
                  </div>
                </a>
              )}
              {employee.phone && (
                <a
                  href={`tel:${employee.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate">
                    <span className="text-[10px] text-zinc-400 block">Mobile & WhatsApp</span>
                    <span className="font-medium text-zinc-200">{employee.phone}</span>
                  </div>
                </a>
              )}
              {employee.location && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 text-xs text-zinc-200">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-zinc-400 block">Office Location</span>
                    <span className="font-medium text-zinc-200">{employee.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social & Professional Links */}
            {(socials.linkedin ||
              socials.twitter ||
              socials.github ||
              socials.instagram ||
              socials.website ||
              socials.youtube ||
              socials.telegram) && (
              <div className="space-y-2.5 mb-6">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
                  Social & Web
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {socials.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-all hover:border-sky-500/40"
                    >
                      <Linkedin className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate font-medium">LinkedIn</span>
                    </a>
                  )}
                  {socials.twitter && (
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-all hover:border-zinc-500"
                    >
                      <Twitter className="w-4 h-4 text-zinc-300 shrink-0" />
                      <span className="truncate font-medium">Twitter / X</span>
                    </a>
                  )}
                  {socials.github && (
                    <a
                      href={socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-all hover:border-purple-500/40"
                    >
                      <Github className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="truncate font-medium">GitHub</span>
                    </a>
                  )}
                  {socials.website && (
                    <a
                      href={socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-all hover:border-blue-500/40"
                    >
                      <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate font-medium">Website</span>
                    </a>
                  )}
                  {socials.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-all hover:border-pink-500/40"
                    >
                      <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                      <span className="truncate font-medium">Instagram</span>
                    </a>
                  )}
                  {socials.youtube && (
                    <a
                      href={socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-all hover:border-red-500/40"
                    >
                      <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="truncate font-medium">YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Company Card Block */}
            <div className="p-4 rounded-2xl bg-zinc-800/30 border border-zinc-800/80 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-200">{company.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{company.tagline}</div>
                </div>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-zinc-500">
            Powered by{' '}
            <span className="font-semibold text-zinc-400">TapCard NFC Platform</span>
          </p>
          <a
            href="/login"
            className="inline-block mt-1 text-[11px] text-blue-400 hover:underline"
          >
            Employee / Admin Sign In
          </a>
        </div>
      </div>

      {/* Floating Save Button on Mobile */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
        <button
          onClick={handleSaveContact}
          className="w-full py-3.5 px-4 rounded-2xl font-semibold text-sm text-white shadow-2xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/20"
          style={{ backgroundColor: brandColor }}
        >
          <UserPlus className="w-4 h-4" />
          <span>Save Contact ({employee.name.split(' ')[0]})</span>
        </button>
      </div>

      {/* Modals */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        url={cardUrl}
        employeeName={employee.name}
        companyName={company.name}
        themeColor={brandColor}
      />
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={cardUrl}
        name={employee.name}
        title={employee.title}
        companyName={company.name}
      />
    </div>
  );
};
