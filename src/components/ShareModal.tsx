/**
 * @file ShareModal.tsx
 * @description Secure invite link generator and modal for AlphaSelector India.
 * Generates direct auto-unlock URLs containing embedded access tokens, allowing authorized
 * reviewers to evaluate the application without manual password entry.
 */

import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, Share2 } from 'lucide-react';

/**
 * Properties for the ShareModal component.
 */
interface ShareModalProps {
  /** Visibility status of the share modal */
  isOpen: boolean;
  /** Callback fired to close the modal */
  onClose: () => void;
  /** Secret access key string required for authorization */
  accessKey: string;
  /** Base public application URL */
  publicUrl: string;
}

/**
 * ShareModal provides 1-click clipboard copying of the protected review link and standalone passcode.
 */
export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  accessKey,
  publicUrl
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  // Construct shareable link with access query parameter
  const shareableUrl = publicUrl.includes('?') 
    ? `${publicUrl}&access=${accessKey}` 
    : `${publicUrl}?access=${accessKey}`;

  /**
   * Copies the full auto-unlock link to user clipboard.
   */
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  /**
   * Copies standalone access passcode to user clipboard.
   */
  const handleCopyKey = () => {
    navigator.clipboard.writeText(accessKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-left p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Share Private Access Link</h3>
              <p className="text-xs text-slate-400">Restricted to people who have the shared link</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Guarantee Notice */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Link-Only Protection Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Anyone visiting the root domain without this token is locked out and cannot view your screened stocks, criteria, or forecasts.
          </p>
        </div>

        {/* Direct Link Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Direct Auto-Unlock Link:
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 truncate select-all">
              {shareableUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Recipients who click this link are logged in instantly without needing to enter a password.
          </p>
        </div>

        {/* Standalone Access Code */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Passcode (If entering manually):</span>
            <span className="text-sm font-mono font-bold text-white tracking-wider">{accessKey}</span>
          </div>

          <button
            onClick={handleCopyKey}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
