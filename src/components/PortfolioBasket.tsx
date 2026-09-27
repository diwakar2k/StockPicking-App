/**
 * @file PortfolioBasket.tsx
 * @description Investment basket synthesizer and allocation manager for AlphaSelector India.
 * Computes portfolio-weighted expected return CAGR, dividend yields, and blended P/E multiples,
 * supporting custom percentage allocations and 1-click equal weighting.
 */

import React from 'react';
import { 
  PieChart, 
  Trash2, 
  Equal, 
  ArrowRight, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { PortfolioItem } from '../types';
import { INDUSTRIES } from '../data/industryCriteria';
import { formatCurrency } from '../utils/calculator';

/**
 * Properties for the PortfolioBasket component.
 */
interface PortfolioBasketProps {
  /** Array of active portfolio holdings and their percentage weights */
  basket: PortfolioItem[];
  /** Callback to adjust the weight percentage for a specific stock */
  onUpdateWeight: (ticker: string, weight: number) => void;
  /** Callback to remove a stock from the portfolio basket */
  onRemoveStock: (ticker: string) => void;
  /** Callback to automatically distribute weights equally across all basket stocks */
  onEqualWeight: () => void;
  /** Callback to proceed to the compounding corpus forecaster */
  onProceedToForecast: () => void;
  /** Callback to navigate back to the stock screener */
  onBackToScreener: () => void;
}

/**
 * PortfolioBasket synthesizes candidate stocks into an investment portfolio,
 * aggregating weighted fundamentals to feed directly into the corpus compounding engine.
 */
export const PortfolioBasket: React.FC<PortfolioBasketProps> = ({
  basket,
  onUpdateWeight,
  onRemoveStock,
  onEqualWeight,
  onProceedToForecast,
  onBackToScreener
}) => {
  if (basket.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-lg mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <PieChart className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Your Portfolio Basket is Empty</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Screen stocks based on your chosen sector criteria and click <strong>"Add to Basket"</strong> to assemble your prospective investment portfolio.
        </p>
        <button
          onClick={onBackToScreener}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          Go to Stock Screener
        </button>
      </div>
    );
  }

  // Calculate total portfolio weight and validation status
  const totalWeight = basket.reduce((sum, item) => sum + item.weight, 0);
  const isValidWeight = Math.abs(totalWeight - 100) < 0.5;

  // Compute weighted portfolio fundamentals
  const weightedCAGR = totalWeight > 0 
    ? basket.reduce((sum, item) => sum + (item.stock.expectedCAGR * item.weight), 0) / totalWeight 
    : 0;

  const weightedDivYield = totalWeight > 0 
    ? basket.reduce((sum, item) => sum + (item.stock.dividendYield * item.weight), 0) / totalWeight 
    : 0;

  const weightedPE = totalWeight > 0 
    ? basket.reduce((sum, item) => sum + (item.stock.peRatio * item.weight), 0) / totalWeight 
    : 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Metrics Overview */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Investment Basket Synthesizer</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Selected Portfolio Allocation ({basket.length} Stocks)
            </h2>
            <p className="text-xs text-slate-400">
              Set target percentage allocations. The resulting expected CAGR is fed into the Corpus Forecaster.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onEqualWeight}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Equal className="w-3.5 h-3.5" />
              <span>Equal Weight</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Weighted Expected CAGR</span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">
              +{weightedCAGR.toFixed(1)}% p.a.
            </span>
            <span className="text-[10px] text-slate-500 block">Portfolio growth engine</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Weighted Div Yield</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">
              {weightedDivYield.toFixed(2)}%
            </span>
            <span className="text-[10px] text-slate-500 block">Annual cash payouts</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Weighted P/E Ratio</span>
            <span className="text-lg font-bold text-slate-200 font-mono">
              {weightedPE.toFixed(1)}x
            </span>
            <span className="text-[10px] text-slate-500 block">Blended valuation</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Allocation</span>
            <span className={`text-lg font-extrabold font-mono ${isValidWeight ? 'text-emerald-400' : 'text-amber-400'}`}>
              {totalWeight.toFixed(0)}% / 100%
            </span>
            <span className="text-[10px] text-slate-500 block">
              {isValidWeight ? 'Balanced' : 'Adjust sliders to reach 100%'}
            </span>
          </div>
        </div>
      </div>

      {/* Allocation Warning if not 100% */}
      {!isValidWeight && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center space-x-2 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Total weighting is currently <strong>{totalWeight.toFixed(0)}%</strong>. Click <strong>"Equal Weight"</strong> or adjust the individual sliders to sum to 100%.
          </span>
        </div>
      )}

      {/* Stock Allocation Cards */}
      <div className="space-y-3">
        {basket.map((item) => {
          const indInfo = INDUSTRIES.find(i => i.id === item.stock.industry);

          return (
            <div
              key={item.stock.ticker}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Stock info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                    {item.stock.ticker.split('.')[0].slice(0, 4)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{item.stock.name}</span>
                      <span className="text-xs font-mono text-slate-400">({item.stock.ticker})</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300">
                        {indInfo?.shortName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono mt-0.5">
                      <span>{formatCurrency(item.stock.price, 'IN', false)}</span>
                      <span>•</span>
                      <span className="text-cyan-400">Est. CAGR: +{item.stock.expectedCAGR}%</span>
                      <span>•</span>
                      <span>Div: {item.stock.dividendYield}%</span>
                    </div>
                  </div>
                </div>

                {/* Weight Controls */}
                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                    <span className="text-xs font-mono font-bold text-emerald-400">{item.weight}%</span>
                    <span className="text-[10px] text-slate-500 uppercase">Weight</span>
                  </div>

                  <button
                    onClick={() => onRemoveStock(item.stock.ticker)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Remove stock from basket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slider */}
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={item.weight}
                  onChange={(e) => onUpdateWeight(item.stock.ticker, parseInt(e.target.value) || 0)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-xs font-mono text-slate-400 w-10 text-right">{item.weight}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBackToScreener}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors text-center cursor-pointer"
        >
          Add More Stocks
        </button>

        <button
          onClick={onProceedToForecast}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <span>Forecast Corpus Growth ({weightedCAGR.toFixed(1)}% CAGR)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
