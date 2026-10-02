import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Employee, CompanySettings } from '../../types';
import { Button } from '../../components/common/Button';
import { QRCodeModal } from '../../components/card/QRCodeModal';
import { ShareModal } from '../../components/card/ShareModal';
import { useToast } from '../../context/ToastContext';
import {
  ExternalLink,
  QrCode,
  Radio,
  Copy,
  Edit3,
  Eye,
  Download,
  Share2,
  Sparkles,
  Check,
  Building,
  Mail,
  Phone,
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigate: (path: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { user, employee: authEmployee, updateCurrentEmployee } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(authEmployee);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(!authEmployee);
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getMyProfile();
        setEmployee(data.employee);
        setCompany(data.company);
        updateCurrentEmployee(data.employee);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleCopyLink = async () => {
    if (!employee) return;
    const url = `${window.location.origin}/card/${employee.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      success('Your card link has been copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-zinc-400">
        No active card profile linked to this user.
      </div>
    );
  }

  const cardUrl = `${window.location.origin}/card/${employee.slug}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <img
            src={
              employee.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(employee.name)}`
            }
            alt={employee.name}
            className="w-20 h-20 rounded-2xl object-cover bg-zinc-800 border-2 border-blue-500/40 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Card Active
              </span>
              <span className="text-xs text-zinc-400">/{employee.slug}</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100">{employee.name}</h1>
            <p className="text-sm text-blue-400 font-medium">
              {employee.title} • {employee.department}
            </p>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopyLink}
          >
            {copied ? 'Copied' : 'Copy Link'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<QrCode className="w-3.5 h-3.5" />}
            onClick={() => setShowQR(true)}
          >
            Show QR
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => setShowShare(true)}
          >
            Share
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => onNavigate(`/card/${employee.slug}`)}
          >
            View Live Card
          </Button>
        </div>
      </div>

      {/* Engagement Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Total Card Views</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-100">{employee.scanCount}</div>
          <p className="text-xs text-zinc-400 mt-1">Via NFC taps and QR code scans</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Contacts Downloaded</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-100">{employee.vcardDownloadCount}</div>
          <p className="text-xs text-zinc-400 mt-1">Saved directly to people's address books</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">NFC Tag Status</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-semibold text-zinc-100 mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>NFC Ready</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Click below to program physical NFC card</p>
        </div>
      </div>

      {/* Two Column Layout: Tools & Profile Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation / Feature Shortcuts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Quick Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate('/employee/nfc')}
                className="flex flex-col items-start p-4 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5" />
                </div>
                <div className="font-semibold text-zinc-100 text-sm">Program NFC Tag</div>
                <div className="text-xs text-zinc-400 mt-1">
                  Write your URL directly into a physical card or tag
                </div>
              </button>

              <button
                onClick={() => onNavigate('/employee/qrcode')}
                className="flex flex-col items-start p-4 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="font-semibold text-zinc-100 text-sm">Printable QR Badge</div>
                <div className="text-xs text-zinc-400 mt-1">
                  High-res QR code for trade show badges & flyers
                </div>
              </button>

              <button
                onClick={() => onNavigate('/employee/profile')}
                className="flex flex-col items-start p-4 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div className="font-semibold text-zinc-100 text-sm">Edit Card Info</div>
                <div className="text-xs text-zinc-400 mt-1">
                  Update phone, bio, office, and social links
                </div>
              </button>
            </div>
          </div>

          {/* Contact Information Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">Live Contact Details</h2>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => onNavigate('/employee/profile')}
              >
                Edit
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40">
                <Mail className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-zinc-400">Email</div>
                  <div className="font-medium text-zinc-200">{employee.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40">
                <Phone className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-zinc-400">Phone Number</div>
                  <div className="font-medium text-zinc-200">{employee.phone || 'Not set'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40">
                <Building className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-zinc-400">Company & Department</div>
                  <div className="font-medium text-zinc-200">
                    {company?.name} • {employee.department}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Mini Card Preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Card Mockup
            </span>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ExternalLink className="w-3 h-3 text-blue-400" />}
              onClick={() => onNavigate(`/card/${employee.slug}`)}
            >
              Open Live
            </Button>
          </div>

          {/* Mini Phone Screen Wrapper */}
          <div className="w-full max-w-[280px] bg-zinc-950 rounded-3xl border-4 border-zinc-800 overflow-hidden shadow-2xl p-1">
            <div className="bg-zinc-900 rounded-2xl overflow-hidden text-center pb-4">
              <div
                className="h-16 w-full"
                style={{
                  backgroundColor: employee.themeColor || company?.brandColor || '#2563eb',
                }}
              />
              <div className="relative -mt-8 mb-2 flex justify-center">
                <img
                  src={
                    employee.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`
                  }
                  alt={employee.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-zinc-900 shadow-md bg-zinc-800"
                />
              </div>
              <div className="px-3">
                <div className="font-bold text-sm text-zinc-100">{employee.name}</div>
                <div className="text-[11px] text-blue-400 font-medium">{employee.title}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{company?.name}</div>

                <div className="mt-3 py-1.5 px-3 rounded-xl bg-blue-600 text-white text-[11px] font-semibold">
                  Save Contact
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQR && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          url={cardUrl}
          employeeName={employee.name}
          companyName={company?.name}
          themeColor={employee.themeColor || company?.brandColor}
        />
      )}

      {showShare && (
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          url={cardUrl}
          name={employee.name}
          title={employee.title}
          companyName={company?.name}
        />
      )}
    </div>
  );
};
