/**
 * @file CriteriaConfigurator.tsx
 * @description Dynamic criteria fine-tuning and strategy preset selector for AlphaSelector India.
 * Allows investors to calibrate metric threshold sliders (e.g. Rule of 40, NIM, ROCE, FCF Yield)
 * with industry median benchmark references, or apply curated 1-click strategy presets.
 */

import React from 'react';
import { 
  Sliders, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  TrendingUp, 
  ShieldCheck, 
  Tag, 
  Rocket,
  Coins,
  SunMedium,
  Wrench,
  Award,
  FlaskConical,
  DollarSign
} from 'lucide-react';
import { IndustryId, MetricDefinition, StrategyPreset } from '../types';
import { INDUSTRY_CRITERIA, INDUSTRIES } from '../data/industryCriteria';

/**
 * Properties for the CriteriaConfigurator component.
 */
interface CriteriaConfiguratorProps {
  /** Array of industries enabled by the investor */
  selectedIndustries: IndustryId[];
  /** Identifier of the industry currently in active focus for tuning */
  activeIndustry: IndustryId;
  /** Callback fired when user switches the active sector tuning tab */
  onSelectActiveIndustry: (id: IndustryId) => void;
  /** Current threshold mapping for each industry and metric ID */
  thresholds: Record<IndustryId, Record<string, number>>;
  /** Callback to update a single metric threshold value */
  onUpdateThreshold: (industryId: IndustryId, metricId: string, value: number) => void;
  /** Callback to apply a predefined strategy preset */
  onApplyPreset: (industryId: IndustryId, preset: StrategyPreset) => void;
  /** Callback to reset an industry's thresholds back to default baselines */
  onResetIndustry: (industryId: IndustryId) => void;
}

/**
 * CriteriaConfigurator provides an interactive parameter adjustment studio for sector metrics.
 */
export const CriteriaConfigurator: React.FC<CriteriaConfiguratorProps> = ({
  selectedIndustries,
  activeIndustry,
  onSelectActiveIndustry,
  thresholds,
  onUpdateThreshold,
  onApplyPreset,
  onResetIndustry
}) => {
  if (selectedIndustries.length === 0) {
    return (
      <div className="p-10 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
        Please select at least one industry from the <strong>Industries</strong> tab first.
      </div>
    );
  }

  const currentConfig = INDUSTRY_CRITERIA[activeIndustry];
  const currentIndustryInfo = INDUSTRIES.find(i => i.id === activeIndustry);
  const currentThresholds = thresholds[activeIndustry] || {};

  /**
   * Resolves the corresponding Lucide icon component for a strategy preset.
   */
  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return <Rocket className="w-3.5 h-3.5 text-blue-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Tag': return <Tag className="w-3.5 h-3.5 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Award': return <Award className="w-3.5 h-3.5 text-yellow-400" />;
      case 'Coins': return <Coins className="w-3.5 h-3.5 text-amber-400" />;
      case 'SunMedium': return <SunMedium className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Wrench': return <Wrench className="w-3.5 h-3.5 text-purple-400" />;
      case 'FlaskConical': return <FlaskConical className="w-3.5 h-3.5 text-rose-400" />;
      case 'DollarSign': return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Industry Switcher Tabs (if multiple selected) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-800">
        <span className="text-xs text-slate-400 font-semibold mr-1 uppercase tracking-wider whitespace-nowrap">
          Sectors:
        </span>
        {selectedIndustries.map((indId) => {
          const ind = INDUSTRIES.find(i => i.id === indId);
          const isActive = indId === activeIndustry;
          return (
            <button
              key={indId}
              onClick={() => onSelectActiveIndustry(indId)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <span>{ind?.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sector Header & Strategy Presets */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{currentIndustryInfo?.name} Criteria Tuning</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust benchmark thresholds below. Candidate stocks update immediately in the screener table.
            </p>
          </div>

          <button
            onClick={() => onResetIndustry(activeIndustry)}
            className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Strategy Presets */}
        {currentConfig.presets.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Instant Strategy Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {currentConfig.presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onApplyPreset(activeIndustry, preset)}
                  className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700 shrink-0 mt-0.5">
                    {getPresetIcon(preset.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 leading-tight mt-0.5">
                      {preset.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Metric Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentConfig.metrics.map((metric: MetricDefinition) => {
          const val = currentThresholds[metric.id] ?? metric.defaultThreshold;
          const isHigher = metric.higherIsBetter;

          return (
            <div
              key={metric.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{metric.label}</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {metric.unit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{metric.description}</p>
                </div>

                {/* Current Value Pill */}
                <div className="text-right">
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 font-mono text-xs font-bold shadow-sm">
                    <span>{isHigher ? '≥' : '≤'}</span>
                    <span>{val}</span>
                    <span>{metric.unit}</span>
                  </div>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={metric.min}
                  max={metric.max}
                  step={metric.step}
                  value={val}
                  onChange={(e) => onUpdateThreshold(activeIndustry, metric.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Min: {metric.min}{metric.unit}</span>
                  <span className="text-cyan-400/90 font-medium">
                    Industry Median: {metric.benchmarkMedian}{metric.unit}
                  </span>
                  <span>Max: {metric.max}{metric.unit}</span>
                </div>
              </div>

              {/* Why It Matters Rationale Tooltip/Card */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 flex items-start space-x-2">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-slate-200">Why it matters:</strong> {metric.whyItMatters}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
