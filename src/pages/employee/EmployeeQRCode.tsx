import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Employee, CompanySettings } from '../../types';
import QRCode from 'qrcode';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { Download, Printer, Copy, Check, Sparkles, Building } from 'lucide-react';

interface EmployeeQRCodeProps {
  onNavigate: (path: string) => void;
}

export const EmployeeQRCode: React.FC<EmployeeQRCodeProps> = () => {
  const { employee: authEmp } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(authEmp);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(!authEmp);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getMyProfile();
        setEmployee(data.employee);
        setCompany(data.company);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cardUrl = employee ? `${window.location.origin}/card/${employee.slug}` : '';

  useEffect(() => {
    if (canvasRef.current && cardUrl) {
      QRCode.toCanvas(canvasRef.current, cardUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    }
  }, [cardUrl]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current || !employee) return;
    const png = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = png;
    link.download = `${employee.slug}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('High-resolution QR code downloaded!');
  };

  const handlePrintBadge = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    if (!cardUrl) return;
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      success('Card URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (loading || !employee) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  const brandColor = employee.themeColor || company?.brandColor || '#2563eb';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">QR Code &amp; Printable Badge</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Export your personal QR code for presentations, trade show badges, and email signatures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Digital QR Code Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Direct QR Code</h2>

          <div className="p-4 bg-white rounded-3xl shadow-2xl border border-zinc-200 inline-block mb-6">
            <canvas ref={canvasRef} className="rounded-xl" />
          </div>

          <p className="text-xs text-zinc-400 max-w-xs mb-6">
            Scan with any smartphone camera to open and save your contact card.
          </p>

          <div className="flex gap-3 w-full max-w-xs">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyLink}
            >
              {copied ? 'Copied' : 'Copy URL'}
            </Button>
            <Button
              variant="primary"
              className="flex-1 text-xs"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownloadPNG}
              style={{ backgroundColor: brandColor }}
            >
              Download PNG
            </Button>
          </div>
        </div>

        {/* Printable Physical Badge Mockup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Printable Conference Badge Preview
            </span>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={handlePrintBadge}
            >
              Print Badge
            </Button>
          </div>

          {/* Physical Badge Layout */}
          <div
            ref={badgeRef}
            className="w-full max-w-sm mx-auto bg-white text-zinc-900 rounded-3xl border-2 border-zinc-300 shadow-2xl overflow-hidden print:m-0 print:border-none print:shadow-none"
          >
            {/* Lanyard punch hole preview */}
            <div className="pt-3 flex justify-center">
              <div className="w-10 h-2 rounded-full bg-zinc-200 border border-zinc-300" />
            </div>

            {/* Badge Top Header */}
            <div
              className="mt-3 p-5 text-center text-white"
              style={{ backgroundColor: brandColor }}
            >
              <div className="text-xs font-bold uppercase tracking-widest text-white/90 flex items-center justify-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                {company?.name || 'Company'}
              </div>
            </div>

            {/* Badge Body */}
            <div className="p-6 text-center">
              <img
                src={
                  employee.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`
                }
                alt={employee.name}
                className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-zinc-200 shadow-md mb-4 bg-zinc-100"
              />

              <h3 className="text-xl font-extrabold text-zinc-900">{employee.name}</h3>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">{employee.title}</p>
              <p className="text-[11px] text-zinc-500">{employee.department}</p>

              {/* Mini embedded QR in badge */}
              <div className="mt-6 pt-5 border-t border-zinc-200 flex flex-col items-center">
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">
                  Scan for Digital Card &amp; vCard
                </div>
                <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[11px] font-mono text-zinc-600 truncate max-w-[220px]">
                    {cardUrl}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
