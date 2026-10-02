import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Copy, Check, Share2, MessageSquare, Mail, Send, Linkedin, Twitter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  name: string;
  title: string;
  companyName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url,
  name,
  title,
  companyName,
}) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const shareText = `Connect with ${name}${title ? ` (${title})` : ''}${companyName ? ` at ${companyName}` : ''}: ${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Digital Business Card`,
          text: shareText,
          url,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      link: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      link: `mailto:?subject=${encodeURIComponent(`Contact card for ${name}`)}&body=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'SMS',
      icon: Send,
      color: 'bg-purple-600 hover:bg-purple-500 text-white',
      link: `sms:?body=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-sky-700 hover:bg-sky-600 text-white',
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-zinc-800 hover:bg-zinc-700 text-white',
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Digital Card" maxWidth="sm">
      <div className="space-y-4">
        {/* Copy link bar */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Direct Card Link</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono truncate">
              {url}
            </div>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* System share button if available */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="outline"
            className="w-full text-xs"
            leftIcon={<Share2 className="w-3.5 h-3.5 text-blue-400" />}
            onClick={handleNativeShare}
          >
            System Share Sheet
          </Button>
        )}

        {/* Quick Channels Grid */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">Send Via</label>
          <div className="grid grid-cols-2 gap-2">
            {shareChannels.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.name}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${c.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{c.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
