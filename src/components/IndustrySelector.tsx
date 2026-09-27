/**
 * @file IndustrySelector.tsx
 * @description Sector selection and scope configuration screen for AlphaSelector India.
 * Enables investors to activate context-aware evaluation models across 6 major Indian industries
 * (Technology & SaaS, BFSI, Healthcare & Pharma, FMCG, Energy, Auto & Manufacturing).
 */

import React from 'react';
import { 
  Cpu, 
  Landmark, 
  Activity, 
  ShoppingBag, 
  Zap, 
  Car, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  HelpCircle 
} from 'lucide-react';
import { IndustryId } from '../types';
import { INDUSTRIES } from '../data/industryCriteria';
import { STOCKS_DATA } from '../data/stocksData';

/**
 * Properties for the IndustrySelector component.
 */
interface IndustrySelectorProps {
  /** Array of currently chosen industry sector IDs */
  selectedIndustries: IndustryId[];
  /** Callback fired to toggle an industry's selected state */
  onToggleIndustry: (id: IndustryId) => void;
  /** Callback to select all available industry sectors */
  onSelectAll: () => void;
  /** Callback to clear all industries except the first default */
  onClear: () => void;
  /** Callback to advance to the criteria configuration screen */
  onProceed: () => void;
}

/**
 * IndustrySelector presents interactive sector cards outlining key evaluation philosophies,
 * stock universe counts, and specialized metric summaries.
 */
export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  selectedIndustries,
  onToggleIndustry,
  onSelectAll,
  onClear,
  onProceed
}) => {
  /**
   * Resolves the corresponding Lucide icon component by name string.
   */
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-emerald-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-rose-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'Car': return <Car className="w-5 h-5 text-purple-400" />;
      default: return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  /**
   * Computes the number of candidate stocks belonging to a specific industry.
   */
  const getStockCountForIndustry = (indId: IndustryId) => {
    return STOCKS_DATA.filter(s => s.industry === indId).length;
  };

  return (
    <div className="space-y-8 py-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Context-Aware Indian Stock Screening Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Select Your Target Industries
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Generic stock screeners evaluate all companies with the same rigid formulas. In reality, evaluating a 
            <span className="text-emerald-400 font-semibold"> Bank on Debt/Equity</span> or a 
            <span className="text-blue-400 font-semibold"> SaaS titan on Price-to-Earnings</span> leads to severe misjudgments. 
            Choose the sectors below to activate scientifically tailored criteria.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Market Universe: <strong className="text-slate-200">NSE / BSE Indian Equities (₹)</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Available Sectors: <strong className="text-slate-200">{INDUSTRIES.length} Specialized Verticals</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Industries ({selectedIndustries.length} Selected)</span>
            {selectedIndustries.length > 0 && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                Ready for criteria
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">Click individual cards to toggle on/off</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
          >
            Select All
          </button>
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800 cursor-pointer"
          >
            Clear
          </button>

          <button
            onClick={onProceed}
            disabled={selectedIndustries.length === 0}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedIndustries.length > 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Criteria</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Industry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INDUSTRIES.map((ind) => {
          const isSelected = selectedIndustries.includes(ind.id);
          const stockCount = getStockCountForIndustry(ind.id);

          return (
            <div
              key={ind.id}
              onClick={() => onToggleIndustry(ind.id)}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200 border text-left ${
                isSelected
                  ? 'bg-slate-900/90 border-emerald-500/70 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl bg-slate-800/90 border ${
                      isSelected ? 'border-emerald-500/40' : 'border-slate-700'
                    }`}>
                      {getIcon(ind.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                        {ind.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {stockCount} stocks in universe
                      </span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950'
                      : 'border border-slate-700 group-hover:border-slate-500'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950" />}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {ind.tagline}
                </p>

                <p className="text-[11px] text-slate-400 leading-normal">
                  {ind.description}
                </p>
              </div>

              {/* Dynamic Criteria Preview Pills */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                    Tailored Criteria
                  </span>
                  <HelpCircle className="w-3 h-3 text-slate-500" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ind.metricsSummary.map((m, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors ${
                        isSelected
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                          : 'bg-slate-800/70 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      {selectedIndustries.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div className="text-xs text-slate-300">
            Selected <strong className="text-emerald-400">{selectedIndustries.length} industries</strong>. Next, refine industry-specific metric thresholds or pick preset strategies.
          </div>
          <button
            onClick={onProceed}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <span>Proceed to Criteria Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
