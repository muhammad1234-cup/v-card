import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Employee, CompanySettings } from '../../types';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { 
  Radio, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Info,
  CreditCard,
  Wifi
} from 'lucide-react';

interface EmployeeNFCProps {
  onNavigate: (path: string) => void;
}

export const EmployeeNFC: React.FC<EmployeeNFCProps> = () => {
  const { employee: authEmp } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(authEmp);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [isNfcSupported, setIsNfcSupported] = useState<boolean>(false);
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    // Check for Web NFC API support
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setIsNfcSupported(true);
    } else {
      setIsNfcSupported(false);
    }

    const load = async () => {
      try {
        const data = await api.getMyProfile();
        setEmployee(data.employee);
        setCompany(data.company);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const cardUrl = employee ? `${window.location.origin}/card/${employee.slug}` : '';

  const handleWriteNFC = async () => {
    if (!cardUrl) return;

    if (!isNfcSupported) {
      error('Web NFC is not supported in this browser. Please use Chrome on Android or the NFC Tools app.');
      return;
    }

    try {
      setNfcStatus('scanning');
      setStatusMessage('Hold your physical NFC card or tag against the back of your phone...');

      // Dynamic invocation of Web NFC API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ndef = new (window as any).NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: 'url',
            data: cardUrl,
          },
        ],
      });

      setNfcStatus('success');
      setStatusMessage('NFC Card successfully encoded!');
      success('Your physical NFC card is ready to tap!');

      // Update backend tag record
      if (employee) {
        await api.updateNfcStatus(`TAG-${Date.now().toString(36)}`, 'written');
      }
    } catch (err: unknown) {
      setNfcStatus('error');
      const msg = err instanceof Error ? err.message : 'NFC write operation cancelled or failed';
      setStatusMessage(msg);
      error(msg);
    }
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Physical NFC Card Writer</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Encode physical contactless NFC business cards, keychains, and phone stickers.
        </p>
      </div>

      {/* Main Interactive NFC Writer Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col items-center text-center max-w-lg mx-auto">
          {/* Animated NFC Wave Icon */}
          <div className="relative mb-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                nfcStatus === 'scanning'
                  ? 'bg-blue-600/20 text-blue-400 animate-pulse border-2 border-blue-500'
                  : nfcStatus === 'success'
                  ? 'bg-emerald-600/20 text-emerald-400 border-2 border-emerald-500'
                  : nfcStatus === 'error'
                  ? 'bg-rose-600/20 text-rose-400 border-2 border-rose-500'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              <Radio className={`w-12 h-12 ${nfcStatus === 'scanning' ? 'animate-bounce' : ''}`} />
            </div>

            {nfcStatus === 'scanning' && (
              <span className="absolute inset-0 rounded-full border border-blue-500/40 animate-ping" />
            )}
          </div>

          <h2 className="text-xl font-bold text-zinc-100 mb-2">
            {nfcStatus === 'scanning'
              ? 'Ready to Tap NFC Tag'
              : nfcStatus === 'success'
              ? 'NFC Tag Written Successfully!'
              : nfcStatus === 'error'
              ? 'NFC Write Interrupted'
              : 'Write Card to Physical NFC Tag'}
          </h2>

          <p className="text-sm text-zinc-400 mb-6">
            {statusMessage ||
              'Hold an empty NTAG213, NTAG215, or NTAG216 card, badge, or sticker to write your live digital profile URL.'}
          </p>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            {isNfcSupported ? (
              <Button
                variant={nfcStatus === 'success' ? 'success' : 'primary'}
                size="lg"
                leftIcon={<Wifi className="w-5 h-5" />}
                onClick={handleWriteNFC}
                isLoading={nfcStatus === 'scanning'}
              >
                {nfcStatus === 'scanning' ? 'Listening for NFC Tap...' : 'Start NFC Write'}
              </Button>
            ) : (
              <div className="w-full bg-zinc-800/80 border border-zinc-700/60 p-4 rounded-2xl text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Direct Web NFC Requires Chrome on Android</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  Apple Safari restricts direct browser Web NFC writes. You can still easily program your tag in 10 seconds using any free NFC utility app below:
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 truncate">
                    {cardUrl}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    onClick={handleCopyLink}
                  >
                    {copied ? 'Copied' : 'Copy URL'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guide & Instructions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS & Android Free App Instructions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">
              Programming via NFC Tools (iOS &amp; Android)
            </h3>
          </div>
          <ol className="text-xs text-zinc-300 space-y-2.5 list-decimal list-inside leading-relaxed">
            <li>
              Download the free <strong className="text-white">NFC Tools</strong> app from the App Store or Google Play.
            </li>
            <li>Copy your digital card URL using the button above.</li>
            <li>In NFC Tools, select <strong className="text-white">Write</strong> → <strong className="text-white">Add a record</strong>.</li>
            <li>Select <strong className="text-white">URL / URI</strong> and paste your card URL.</li>
            <li>Tap <strong className="text-white">Write</strong> and hold your blank NFC card to the top of your phone.</li>
          </ol>
        </div>

        {/* Hardware & Compatibility */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">
              Supported Physical Cards &amp; Tags
            </h3>
          </div>
          <ul className="text-xs text-zinc-300 space-y-2.5 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">NTAG213 / NTAG215 / NTAG216:</strong> Works natively with all modern iPhones (XR and newer) and 99% of Android smartphones.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">No App Required to Read:</strong> The recipient simply taps their smartphone near the card to instantly open your digital profile and save your contact.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Rewritable:</strong> You can re-encode cards as often as you like without needing to replace hardware.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
