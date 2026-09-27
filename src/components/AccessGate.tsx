/**
 * @file AccessGate.tsx
 * @description Security access gatekeeper component for AlphaSelector India.
 * Restricts application usage to authorized reviewers with link-only access tokens
 * or manual verification passcodes.
 */

import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * Properties for the AccessGate component.
 */
interface AccessGateProps {
  /** Callback invoked once authorization is successfully established */
  onUnlock: () => void;
  /** Secret access key string required to grant access */
  expectedKey: string;
}

/**
 * AccessGate component displays an authentication modal when visitors access the root URL
 * without the appropriate link query parameters or active session.
 */
export const AccessGate: React.FC<AccessGateProps> = ({ onUnlock, expectedKey }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState(false);

  /**
   * Handles manual passcode submission, verifies match (case-insensitive),
   * sets the session flag, and unlocks the application.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().toLowerCase() === expectedKey.toLowerCase()) {
      sessionStorage.setItem('alpha_access_granted', 'true');
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <TrendingUp className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center justify-center space-x-2">
              <span className="font-extrabold tracking-tight text-white text-xl">ALPHA SELECTOR</span>
              <span className="text-emerald-400 font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/60 uppercase">
                India
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Adaptive Stock Screener & Compounding Forecaster</p>
          </div>
        </div>

        {/* Lock Notice */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-left">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Lock className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Private Evaluation Access</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            This deployment is restricted to invited reviewers. If you received a direct invite link, the access token is embedded automatically.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Enter Access Key:</span>
              <span className="text-[10px] text-slate-500">Provided by author</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g., alpha-feedback-2026"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setError(false);
                }}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border text-xs text-white font-mono focus:outline-none transition-colors ${
                  error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-emerald-500/60'
                }`}
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-400 flex items-center space-x-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Invalid access key. Please check the invite link or enter the correct code.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>Unlock Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Link-restricted feedback environment</span>
        </div>
      </div>
    </div>
  );
};
