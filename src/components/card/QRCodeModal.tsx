import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Download, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  employeeName: string;
  companyName?: string;
  themeColor?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  employeeName,
  companyName,
  themeColor = '#2563eb',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = React.useState(false);
  const { success } = useToast();

  useEffect(() => {
    if (isOpen && canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 260,
        margin: 2,
        color: {
          dark: '#09090b',
          light: '#ffffff',
        },
      });
    }
  }, [isOpen, url]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const pngUrl = canvasRef.current.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${employeeName.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    success('QR Code downloaded!');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      success('Card URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Card QR Code" maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs text-zinc-400 mb-4">
          Scan with any mobile camera to instantly open and save {employeeName}'s digital card.
        </p>

        {/* QR Code Container with sleek white card frame */}
        <div className="p-4 bg-white rounded-2xl shadow-xl border border-zinc-200 flex flex-col items-center">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
          {companyName && (
            <div className="mt-2 text-xs font-semibold text-zinc-800 tracking-wide">
              {companyName}
            </div>
          )}
          <div className="text-[11px] text-zinc-500">{employeeName}</div>
        </div>

        {/* Quick URL preview */}
        <div className="mt-4 px-3 py-1.5 bg-zinc-800/80 rounded-lg border border-zinc-700/60 max-w-full">
          <span className="text-[11px] text-zinc-300 font-mono truncate block max-w-xs">
            {url}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5 w-full mt-5">
          <Button
            variant="outline"
            className="flex-1 text-xs"
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopyLink}
          >
            {copied ? 'Copied' : 'Copy Link'}
          </Button>
          <Button
            variant="primary"
            className="flex-1 text-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownload}
            style={{ backgroundColor: themeColor }}
          >
            Download PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
};
