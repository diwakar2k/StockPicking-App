/**
 * @file App.tsx
 * @description Main application root and orchestration component for AlphaSelector India.
 * Coordinates global state management, access authentication, sector criteria calibrations,
 * real-time scoring, portfolio basket synthesis, and multi-year corpus forecasting.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Database } from 'lucide-react';
import { Header } from './components/Header';
import { IndustrySelector } from './components/IndustrySelector';
import { CriteriaConfigurator } from './components/CriteriaConfigurator';
import { StockScreener } from './components/StockScreener';
import { PortfolioBasket } from './components/PortfolioBasket';
import { CorpusForecaster } from './components/CorpusForecaster';
import { StockDetailModal } from './components/StockDetailModal';
import { DataUpdateModal } from './components/DataUpdateModal';
import { AccessGate } from './components/AccessGate';
import { ShareModal } from './components/ShareModal';
import { IndustryId, PortfolioItem, ScoredStock, Stock, StrategyPreset } from './types';
import { INDUSTRIES, INDUSTRY_CRITERIA } from './data/industryCriteria';
import { evaluateStock } from './utils/calculator';
import { loadStocks, saveStocks, resetStocksToDefault } from './utils/dataStorage';

/**
 * Default access key required to unlock the private feedback deployment.
 */
const DEFAULT_ACCESS_KEY = 'alpha-feedback-2026';

/**
 * Root Application component orchestrating navigation, state persistence, and modal dialogs.
 */
export function App() {
  /**
   * Authorization State:
   * Checks whether the user arrived with a valid URL token (`?access=alpha-feedback-2026`)
   * or possesses an existing active browser session.
   */
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlKey = params.get('access');
      if (urlKey && urlKey.trim().toLowerCase() === DEFAULT_ACCESS_KEY.toLowerCase()) {
        sessionStorage.setItem('alpha_access_granted', 'true');
        return true;
      }
      return sessionStorage.getItem('alpha_access_granted') === 'true';
    }
    return false;
  });

  // Navigation and Modal Visibility States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'industries' | 'screener' | 'basket' | 'forecaster'>('industries');
  
  // Default selected industries: Tech, BFSI, FMCG
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryId[]>(['tech', 'banking', 'fmcg']);
  const [activeCriteriaIndustry, setActiveCriteriaIndustry] = useState<IndustryId>('tech');

  // Stock fundamental universe loaded from localStorage
  const [stocks, setStocks] = useState<Stock[]>(() => loadStocks());

  // Industry-specific criteria thresholds initialized to default benchmark thresholds
  const [thresholds, setThresholds] = useState<Record<IndustryId, Record<string, number>>>(() => {
    const initial: Record<IndustryId, Record<string, number>> = {
      tech: {},
      banking: {},
      healthcare: {},
      fmcg: {},
      energy: {},
      auto: {}
    };
    (Object.keys(INDUSTRY_CRITERIA) as IndustryId[]).forEach((indId) => {
      INDUSTRY_CRITERIA[indId].metrics.forEach((m) => {
        initial[indId][m.id] = m.defaultThreshold;
      });
    });
    return initial;
  });

  // Selected portfolio basket items with target weights
  const [basket, setBasket] = useState<PortfolioItem[]>([]);
  
  // Currently inspected stock for deep-dive diagnostics modal
  const [inspectedStock, setInspectedStock] = useState<ScoredStock | null>(null);

  // Data update and assessment methodology modal state
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);

  /**
   * Effect: Ensure the active criteria sector tab remains valid if the current
   * sector is toggled off in the industries list.
   */
  useEffect(() => {
    if (selectedIndustries.length > 0 && !selectedIndustries.includes(activeCriteriaIndustry)) {
      setActiveCriteriaIndustry(selectedIndustries[0]);
    }
  }, [selectedIndustries, activeCriteriaIndustry]);

  // If visitor is unauthenticated, render the link-only access gate
  if (!isAuthorized) {
    return (
      <AccessGate
        expectedKey={DEFAULT_ACCESS_KEY}
        onUnlock={() => setIsAuthorized(true)}
      />
    );
  }

  /**
   * Handles stock dataset updates (e.g. from live price refresh or fundamental edits)
   * and synchronizes with localStorage and existing basket holdings.
   */
  const handleUpdateStocks = (newStocks: Stock[]) => {
    setStocks(newStocks);
    saveStocks(newStocks);
    // Update any stocks in the basket if their price or fundamentals changed
    setBasket(prev => prev.map(item => {
      const match = newStocks.find(s => s.ticker === item.stock.ticker);
      return match ? { ...item, stock: match } : item;
    }));
  };

  /**
   * Dynamically evaluates all stocks against active industry criteria and thresholds,
   * calculating real-time composite quality scores and pass/fail diagnostics.
   */
  const scoredStocks: ScoredStock[] = useMemo(() => {
    return stocks.map(stock => {
      const config = INDUSTRY_CRITERIA[stock.industry];
      const indThresholds = thresholds[stock.industry] || {};
      return evaluateStock(stock, config, indThresholds);
    });
  }, [stocks, thresholds]);

  // Array of Stock objects currently held in the portfolio basket
  const basketStocks = useMemo(() => basket.map(b => b.stock), [basket]);

  /**
   * Computes the weighted expected CAGR from the portfolio basket to feed into the forecaster.
   */
  const basketWeightedCAGR = useMemo(() => {
    const totalWeight = basket.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) return 15.0;
    return basket.reduce((sum, item) => sum + item.stock.expectedCAGR * item.weight, 0) / totalWeight;
  }, [basket]);

  // --- Handlers: Industry Selection ---

  /** Toggles an industry sector on or off */
  const handleToggleIndustry = (id: IndustryId) => {
    if (selectedIndustries.includes(id)) {
      if (selectedIndustries.length === 1) {
        alert('Please keep at least one industry selected.');
        return;
      }
      setSelectedIndustries(selectedIndustries.filter(i => i !== id));
    } else {
      setSelectedIndustries([...selectedIndustries, id]);
    }
  };

  /** Selects all available industries */
  const handleSelectAllIndustries = () => {
    setSelectedIndustries(INDUSTRIES.map(i => i.id));
  };

  /** Resets selected industries to the first default industry */
  const handleClearIndustries = () => {
    setSelectedIndustries([INDUSTRIES[0].id]);
  };

  // --- Handlers: Criteria Calibration ---

  /** Updates an individual metric's threshold filter value */
  const handleUpdateThreshold = (industryId: IndustryId, metricId: string, value: number) => {
    setThresholds(prev => ({
      ...prev,
      [industryId]: {
        ...prev[industryId],
        [metricId]: value
      }
    }));
  };

  /** Applies a predefined strategy preset */
  const handleApplyPreset = (industryId: IndustryId, preset: StrategyPreset) => {
    setThresholds(prev => ({
      ...prev,
      [industryId]: {
        ...prev[industryId],
        ...preset.thresholds
      }
    }));
  };

  /** Resets an industry's thresholds back to defaults */
  const handleResetIndustry = (industryId: IndustryId) => {
    const resetObj: Record<string, number> = {};
    INDUSTRY_CRITERIA[industryId].metrics.forEach(m => {
      resetObj[m.id] = m.defaultThreshold;
    });
    setThresholds(prev => ({
      ...prev,
      [industryId]: resetObj
    }));
  };

  // --- Handlers: Portfolio Basket Management ---

  /** Adds or removes a stock from the portfolio basket, re-equalizing weights */
  const handleToggleBasket = (stock: Stock) => {
    const exists = basket.some(b => b.stock.ticker === stock.ticker);
    if (exists) {
      const next = basket.filter(b => b.stock.ticker !== stock.ticker);
      if (next.length > 0) {
        const equalW = Math.round(100 / next.length);
        setBasket(next.map(item => ({ ...item, weight: equalW })));
      } else {
        setBasket([]);
      }
    } else {
      const next = [...basket, { stock, weight: 0 }];
      const equalW = Math.round(100 / next.length);
      setBasket(next.map(item => ({ ...item, weight: equalW })));
    }
  };

  /** Bulk-adds all matching stocks to the portfolio basket */
  const handleAddAllMatches = (matchingStocks: Stock[]) => {
    const map = new Map<string, Stock>();
    basket.forEach(item => map.set(item.stock.ticker, item.stock));
    matchingStocks.forEach(s => map.set(s.ticker, s));

    const combined = Array.from(map.values());
    const equalW = combined.length > 0 ? Math.round(100 / combined.length) : 0;
    setBasket(combined.map(s => ({ stock: s, weight: equalW })));
  };

  /** Updates the weighting percentage for a specific holding */
  const handleUpdateWeight = (ticker: string, weight: number) => {
    setBasket(prev => prev.map(item => {
      if (item.stock.ticker === ticker) {
        return { ...item, weight };
      }
      return item;
    }));
  };

  /** Removes a stock from the basket and re-balances weights */
  const handleRemoveStock = (ticker: string) => {
    const next = basket.filter(item => item.stock.ticker !== ticker);
    if (next.length > 0) {
      const equalW = Math.round(100 / next.length);
      setBasket(next.map(item => ({ ...item, weight: equalW })));
    } else {
      setBasket([]);
    }
  };

  /** Distributes weights equally across all holdings in the basket */
  const handleEqualWeight = () => {
    if (basket.length === 0) return;
    const equalW = Math.round(100 / basket.length);
    setBasket(prev => prev.map(item => ({ ...item, weight: equalW })));
  };

  /** Resets the entire application state back to clean defaults */
  const handleResetAll = () => {
    if (confirm('Reset all criteria and stock universe back to curated defaults?')) {
      const def = resetStocksToDefault();
      setStocks(def);
      setBasket([]);
      setSelectedIndustries(['tech', 'banking', 'fmcg']);
      setActiveCriteriaIndustry('tech');
      const initial: Record<IndustryId, Record<string, number>> = {
        tech: {},
        banking: {},
        healthcare: {},
        fmcg: {},
        energy: {},
        auto: {}
      };
      (Object.keys(INDUSTRY_CRITERIA) as IndustryId[]).forEach((indId) => {
        INDUSTRY_CRITERIA[indId].metrics.forEach((m) => {
          initial[indId][m.id] = m.defaultThreshold;
        });
      });
      setThresholds(initial);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedIndustriesCount={selectedIndustries.length}
        basketCount={basket.length}
        onReset={handleResetAll}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Secondary Bar: Indian Market & Data Status */}
      <div className="border-b border-slate-800/60 bg-slate-950/60 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Market: <strong className="text-slate-200">NSE / BSE Indian Equities (₹)</strong></span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Access: <strong className="text-emerald-400">Link-Only Protected</strong></span>
          </div>

          <button
            onClick={() => setIsDataModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Sync & Methodology</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: Industry Selection */}
        {activeTab === 'industries' && (
          <IndustrySelector
            selectedIndustries={selectedIndustries}
            onToggleIndustry={handleToggleIndustry}
            onSelectAll={handleSelectAllIndustries}
            onClear={handleClearIndustries}
            onProceed={() => setActiveTab('screener')}
          />
        )}

        {/* TAB 2: Dynamic Criteria Tuning & Screener */}
        {activeTab === 'screener' && (
          <div className="space-y-8">
            <CriteriaConfigurator
              selectedIndustries={selectedIndustries}
              activeIndustry={activeCriteriaIndustry}
              onSelectActiveIndustry={setActiveCriteriaIndustry}
              thresholds={thresholds}
              onUpdateThreshold={handleUpdateThreshold}
              onApplyPreset={handleApplyPreset}
              onResetIndustry={handleResetIndustry}
            />

            <div className="pt-4 border-t border-slate-800">
              <StockScreener
                scoredStocks={scoredStocks}
                selectedIndustries={selectedIndustries}
                basket={basketStocks}
                onToggleBasket={handleToggleBasket}
                onInspectStock={(stock) => setInspectedStock(stock)}
                onAddAllMatches={handleAddAllMatches}
                onProceedToBasket={() => setActiveTab('basket')}
              />
            </div>
          </div>
        )}

        {/* TAB 3: Portfolio Basket */}
        {activeTab === 'basket' && (
          <PortfolioBasket
            basket={basket}
            onUpdateWeight={handleUpdateWeight}
            onRemoveStock={handleRemoveStock}
            onEqualWeight={handleEqualWeight}
            onProceedToForecast={() => setActiveTab('forecaster')}
            onBackToScreener={() => setActiveTab('screener')}
          />
        )}

        {/* TAB 4: Corpus Forecaster */}
        {activeTab === 'forecaster' && (
          <CorpusForecaster
            defaultCAGR={basketWeightedCAGR}
          />
        )}
      </main>

      {/* Stock Diagnostics Deep-Dive Modal */}
      {inspectedStock && (
        <StockDetailModal
          stock={inspectedStock}
          onClose={() => setInspectedStock(null)}
          isInBasket={basket.some(b => b.stock.ticker === inspectedStock.ticker)}
          onToggleBasket={(stock) => handleToggleBasket(stock)}
          thresholds={thresholds[inspectedStock.industry] || {}}
        />
      )}

      {/* Data Management & Methodology Modal */}
      <DataUpdateModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        stocks={stocks}
        onUpdateStocks={handleUpdateStocks}
      />

      {/* Private Share Link Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        accessKey={DEFAULT_ACCESS_KEY}
        publicUrl={typeof window !== 'undefined' ? window.location.href.split('?')[0] : ''}
      />

      {/* Footer with Creator Attribution */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-300">ALPHA SELECTOR INDIA</span>
            <span className="text-slate-500"> — Adaptive Indian Equities Screener & Wealth Simulator</span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Created by <strong className="text-white">Diwakar Sharma</strong></span>
            <span className="text-slate-600">•</span>
            <a
              href="https://github.com/diwakar2k"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>@diwakar2k</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
