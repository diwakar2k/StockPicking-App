/**
 * @file StockScreener.tsx
 * @description Real-time stock screener table and candidate evaluator for AlphaSelector India.
 * Filters and ranks equities across chosen sectors against configured threshold criteria,
 * displaying sector pass/fail badges, expected CAGR, composite quality scores, and basket actions.
 */

import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Plus, 
  Check, 
  AlertTriangle, 
  ArrowRight 
} from 'lucide-react';
import { IndustryId, ScoredStock, Stock } from '../types';
import { INDUSTRIES, INDUSTRY_CRITERIA } from '../data/industryCriteria';
import { formatCurrency } from '../utils/calculator';

/**
 * Properties for the StockScreener component.
 */
interface StockScreenerProps {
  /** Array of evaluated stocks enriched with scores and pass/fail diagnostics */
  scoredStocks: ScoredStock[];
  /** Array of currently chosen industry sector IDs */
  selectedIndustries: IndustryId[];
  /** Currently selected portfolio basket stocks */
  basket: Stock[];
  /** Callback to add or remove an equity from the portfolio basket */
  onToggleBasket: (stock: Stock) => void;
  /** Callback to inspect a stock in detail inside the diagnostics modal */
  onInspectStock: (stock: ScoredStock) => void;
  /** Callback to bulk-add all stocks that passed 100% of criteria to the basket */
  onAddAllMatches: (stocks: Stock[]) => void;
  /** Callback to navigate forward to the portfolio basket view */
  onProceedToBasket: () => void;
}

/**
 * StockScreener renders the interactive screening results list with real-time text search,
 * match filtering, multi-parameter sorting, and 1-click basket synthesis.
 */
export const StockScreener: React.FC<StockScreenerProps> = ({
  scoredStocks,
  selectedIndustries,
  basket,
  onToggleBasket,
  onInspectStock,
  onAddAllMatches,
  onProceedToBasket
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'matches'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'cagr' | 'marketCap' | 'price'>('score');

  // Filter and sort stocks according to active criteria, mode, and search terms
  const filteredStocks = scoredStocks
    .filter((stock) => {
      // Must belong to selected industries
      if (!selectedIndustries.includes(stock.industry)) return false;
      // Filter matches only if toggled
      if (filterMode === 'matches' && !stock.isMatch) return false;
      // Search query filter (matches name or ticker)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          stock.name.toLowerCase().includes(query) ||
          stock.ticker.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'cagr') return b.expectedCAGR - a.expectedCAGR;
      if (sortBy === 'marketCap') return b.marketCap - a.marketCap;
      if (sortBy === 'price') return b.price - a.price;
      return 0;
    });

  const matchingStocks = scoredStocks.filter(s => selectedIndustries.includes(s.industry) && s.isMatch);

  return (
    <div className="space-y-6">
      {/* Control Bar: Search, Filters, and Sorting */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company or ticker (e.g., TCS, HDFC, Infosys)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          {/* Quick Actions & Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Toggle: All vs Matches Only */}
            <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Ranked ({scoredStocks.filter(s => selectedIndustries.includes(s.industry)).length})
              </button>
              <button
                onClick={() => setFilterMode('matches')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterMode === 'matches'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Passed All Filters ({matchingStocks.length})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-950/80 rounded-xl px-2.5 py-1.5 border border-slate-800 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="score" className="bg-slate-900 text-white">Sort by Quality Score</option>
                <option value="cagr" className="bg-slate-900 text-white">Sort by Expected CAGR</option>
                <option value="marketCap" className="bg-slate-900 text-white">Sort by Market Cap</option>
                <option value="price" className="bg-slate-900 text-white">Sort by Price</option>
              </select>
            </div>

            {/* Add All Matches to Basket */}
            {matchingStocks.length > 0 && (
              <button
                onClick={() => onAddAllMatches(matchingStocks)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-emerald-400 transition-colors cursor-pointer"
                title="Add all stocks passing criteria to your investment basket"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add {matchingStocks.length} Matches</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span>Evaluating against:</span>
            <div className="flex items-center gap-1.5">
              {selectedIndustries.map(id => {
                const ind = INDUSTRIES.find(i => i.id === id);
                return (
                  <span key={id} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono">
                    {ind?.shortName}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            <span className="font-semibold text-emerald-400">{matchingStocks.length}</span> stocks meet 100% of your sector criteria
          </div>
        </div>
      </div>

      {/* Stocks Cards / List */}
      {filteredStocks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No stocks match your exact criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try relaxing your threshold sliders in the Criteria Tuning tab, or toggle to "All Ranked" to see near-matches.
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
          >
            Show All Ranked Candidates
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredStocks.map((stock) => {
            const indInfo = INDUSTRIES.find(i => i.id === stock.industry);
            const indConfig = INDUSTRY_CRITERIA[stock.industry];
            const isInBasket = basket.some(b => b.ticker === stock.ticker);

            return (
              <div
                key={stock.ticker}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  stock.isMatch
                    ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 shadow-md'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 opacity-90'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Ticker, Name, Price, and Score */}
                  <div className="flex items-start sm:items-center space-x-4">
                    {/* Score Badge */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      <span className={`text-lg font-black font-mono leading-none ${
                        stock.score >= 80 ? 'text-emerald-400' : stock.score >= 60 ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {stock.score}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1">Score</span>
                    </div>

                    {/* Stock Details */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-white text-base hover:text-emerald-300 cursor-pointer" onClick={() => onInspectStock(stock)}>
                          {stock.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {stock.ticker}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {indInfo?.shortName}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 mt-1.5 text-xs font-mono">
                        <span className="font-bold text-white">
                          {formatCurrency(stock.price, 'IN', false)}
                        </span>
                        <span className={`text-xs ${stock.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.change24h >= 0 ? '+' : ''}{stock.change24h}%
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">
                          P/E: <strong className="text-slate-200">{stock.peRatio}x</strong>
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-cyan-400 font-semibold">
                          Est. CAGR: +{stock.expectedCAGR}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Industry-Specific Metric Pills */}
                  <div className="flex-1 flex flex-wrap items-center gap-2 lg:justify-center">
                    {indConfig.metrics.map((m) => {
                      const val = stock.metrics[m.id];
                      const passed = stock.passedCriteria.includes(m.id);

                      return (
                        <div
                          key={m.id}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border ${
                            passed
                              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-900/40 text-rose-300'
                          }`}
                          title={`${m.label}: ${val}${m.unit} (${passed ? 'Passed filter' : 'Failed filter'})`}
                        >
                          <span className="text-slate-400 text-[10px]">{m.shortLabel}:</span>
                          <span className="font-bold">{val}{m.unit}</span>
                          {passed ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => onInspectStock(stock)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                    >
                      Diagnostics
                    </button>

                    <button
                      onClick={() => onToggleBasket(stock)}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        isInBasket
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      }`}
                    >
                      {isInBasket ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>In Basket</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Basket</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Floating Bar to proceed to Portfolio / Forecaster */}
      {basket.length > 0 && (
        <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
              {basket.length}
            </div>
            <div>
              <span className="font-bold text-sm text-white block">
                {basket.length} stock{basket.length > 1 ? 's' : ''} in your portfolio basket
              </span>
              <span className="text-[11px] text-slate-400">
                Ready to configure weights and forecast long-term wealth corpus
              </span>
            </div>
          </div>

          <button
            onClick={onProceedToBasket}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>Configure Weights & Forecast</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
