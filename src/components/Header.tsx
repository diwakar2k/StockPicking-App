import React from 'react';
import { Layers, Sliders, PieChart, TrendingUp, RefreshCw, Share2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'industries' | 'screener' | 'basket' | 'forecaster';
  onTabChange: (tab: 'industries' | 'screener' | 'basket' | 'forecaster') => void;
  selectedIndustriesCount: number;
  basketCount: number;
  onReset: () => void;
  onOpenShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  selectedIndustriesCount,
  basketCount,
  onReset,
  onOpenShare
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-white text-lg">ALPHA</span>
                <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50 uppercase tracking-wider">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Indian Equities Screener & Wealth Forecaster</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => onTabChange('industries')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'industries'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Industries</span>
              {selectedIndustriesCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'industries' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-emerald-400'
                }`}>
                  {selectedIndustriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('screener')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'screener'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>2. Criteria & Screener</span>
            </button>

            <button
              onClick={() => onTabChange('basket')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'basket'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>3. Portfolio Basket</span>
              {basketCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'basket' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {basketCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('forecaster')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'forecaster'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>4. Corpus Forecaster</span>
            </button>
          </nav>

          {/* Right Controls: Share, Indian Market Badge & Reset */}
          <div className="flex items-center space-x-2">
            {/* Share Private Link Button */}
            <button
              onClick={onOpenShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              title="Share Private Access Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Link</span>
            </button>

            {/* Indian Market Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
              <span>🇮🇳</span>
              <span className="hidden sm:inline">NSE / BSE (₹)</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset All Selections & Criteria"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-900 overflow-x-auto space-x-2 text-xs">
          <button
            onClick={() => onTabChange('industries')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'industries' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            1. Industries ({selectedIndustriesCount})
          </button>
          <button
            onClick={() => onTabChange('screener')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'screener' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            2. Screener
          </button>
          <button
            onClick={() => onTabChange('basket')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'basket' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            3. Basket ({basketCount})
          </button>
          <button
            onClick={() => onTabChange('forecaster')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'forecaster' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            4. Forecaster
          </button>
        </div>
      </div>
    </header>
  );
};
