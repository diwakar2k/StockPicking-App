import React from 'react';
import { X, CheckCircle, XCircle, TrendingUp, DollarSign, Building2, Plus, Check } from 'lucide-react';
import { Market, ScoredStock } from '../types';
import { INDUSTRY_CRITERIA, INDUSTRIES } from '../data/industryCriteria';
import { formatCurrency } from '../utils/calculator';

interface StockDetailModalProps {
  stock: ScoredStock | null;
  onClose: () => void;
  isInBasket: boolean;
  onToggleBasket: (stock: ScoredStock) => void;
  thresholds: Record<string, number>;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  isInBasket,
  onToggleBasket,
  thresholds
}) => {
  if (!stock) return null;

  const industryConfig = INDUSTRY_CRITERIA[stock.industry];
  const industryInfo = INDUSTRIES.find(i => i.id === stock.industry);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold text-white">{stock.name}</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                {stock.ticker}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>{industryInfo?.name}</span>
              <span>•</span>
              <span>NSE / BSE Indian Equities</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Current Price</span>
              <span className="text-base font-bold text-white font-mono">
                {formatCurrency(stock.price, 'IN', false)}
              </span>
              <span className={`text-[11px] font-mono block ${stock.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.change24h >= 0 ? '+' : ''}{stock.change24h}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Composite Quality</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-extrabold text-emerald-400 font-mono">{stock.score}</span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-400">Sector-relative score</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">P/E Ratio</span>
              <span className="text-base font-bold text-slate-200 font-mono">{stock.peRatio}x</span>
              <span className="text-[10px] text-slate-400">Div: {stock.dividendYield}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Expected CAGR</span>
              <span className="text-base font-bold text-cyan-400 font-mono">+{stock.expectedCAGR}%</span>
              <span className="text-[10px] text-slate-400">3-5y Est. Return</span>
            </div>
          </div>

          {/* Business Overview */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Business Model & Moat</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              {stock.description}
            </p>
          </div>

          {/* Industry Metric Breakdown vs Thresholds */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Sector Criteria Pass / Fail Diagnostics
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                {stock.passedCriteria.length} / {industryConfig.metrics.length} Passed
              </span>
            </div>

            <div className="space-y-2">
              {industryConfig.metrics.map((metric) => {
                const stockVal = stock.metrics[metric.id];
                const threshold = thresholds[metric.id] ?? metric.defaultThreshold;
                const passed = stock.passedCriteria.includes(metric.id);

                return (
                  <div
                    key={metric.id}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                      passed 
                        ? 'bg-emerald-950/20 border-emerald-800/40' 
                        : 'bg-rose-950/20 border-rose-800/40'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        {passed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white">{metric.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{metric.description}</p>
                    </div>

                    <div className="flex items-center space-x-4 self-end sm:self-auto text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block text-right">Company</span>
                        <span className={`font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stockVal}{metric.unit}
                        </span>
                      </div>

                      <div className="border-l border-slate-800 pl-3">
                        <span className="text-[10px] text-slate-500 block text-right">Target</span>
                        <span className="text-slate-300">
                          {metric.higherIsBetter ? '≥' : '≤'}{threshold}{metric.unit}
                        </span>
                      </div>

                      <div className="border-l border-slate-800 pl-3">
                        <span className="text-[10px] text-slate-500 block text-right">Median</span>
                        <span className="text-cyan-400">
                          {metric.benchmarkMedian}{metric.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => onToggleBasket(stock)}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isInBasket
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isInBasket ? (
              <>
                <Check className="w-4 h-4" />
                <span>In Basket (Click to Remove)</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Portfolio Basket</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
