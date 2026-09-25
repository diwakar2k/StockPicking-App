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

const DEFAULT_ACCESS_KEY = 'alpha-feedback-2026';

export function App() {
  // Check authorization via URL param (?access=...) or existing session
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

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'industries' | 'screener' | 'basket' | 'forecaster'>('industries');
  
  // Default selected industries: Tech, BFSI, FMCG
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryId[]>(['tech', 'banking', 'fmcg']);
  const [activeCriteriaIndustry, setActiveCriteriaIndustry] = useState<IndustryId>('tech');

  // Stock universe persisted in localStorage
  const [stocks, setStocks] = useState<Stock[]>(() => loadStocks());

  // Industry-specific criteria thresholds
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

  // Selected stocks basket with weights
  const [basket, setBasket] = useState<PortfolioItem[]>([]);
  
  // Drill-down stock modal
  const [inspectedStock, setInspectedStock] = useState<ScoredStock | null>(null);

  // Data update & assessment methodology modal
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);

  // Sync active criteria industry if current active is deselected
  useEffect(() => {
    if (selectedIndustries.length > 0 && !selectedIndustries.includes(activeCriteriaIndustry)) {
      setActiveCriteriaIndustry(selectedIndustries[0]);
    }
  }, [selectedIndustries, activeCriteriaIndustry]);

  // If not authorized, display the access gate
  if (!isAuthorized) {
    return (
      <AccessGate
        expectedKey={DEFAULT_ACCESS_KEY}
        onUnlock={() => setIsAuthorized(true)}
      />
    );
  }

  // Handle stock dataset updates (e.g. from live sync or manual editing)
  const handleUpdateStocks = (newStocks: Stock[]) => {
    setStocks(newStocks);
    saveStocks(newStocks);
    // Also update any stocks in the basket if their data changed
    setBasket(prev => prev.map(item => {
      const match = newStocks.find(s => s.ticker === item.stock.ticker);
      return match ? { ...item, stock: match } : item;
    }));
  };

  // Evaluate stocks dynamically against active criteria
  const scoredStocks: ScoredStock[] = useMemo(() => {
    return stocks.map(stock => {
      const config = INDUSTRY_CRITERIA[stock.industry];
      const indThresholds = thresholds[stock.industry] || {};
      return evaluateStock(stock, config, indThresholds);
    });
  }, [stocks, thresholds]);

  // Basket stock objects for easy lookup
  const basketStocks = useMemo(() => basket.map(b => b.stock), [basket]);

  // Weighted basket CAGR to feed into forecaster
  const basketWeightedCAGR = useMemo(() => {
    const totalWeight = basket.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) return 15.0;
    return basket.reduce((sum, item) => sum + item.stock.expectedCAGR * item.weight, 0) / totalWeight;
  }, [basket]);

  // --- Handlers ---
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

  const handleSelectAllIndustries = () => {
    setSelectedIndustries(INDUSTRIES.map(i => i.id));
  };

  const handleClearIndustries = () => {
    setSelectedIndustries([INDUSTRIES[0].id]);
  };

  const handleUpdateThreshold = (industryId: IndustryId, metricId: string, value: number) => {
    setThresholds(prev => ({
      ...prev,
      [industryId]: {
        ...prev[industryId],
        [metricId]: value
      }
    }));
  };

  const handleApplyPreset = (industryId: IndustryId, preset: StrategyPreset) => {
    setThresholds(prev => ({
      ...prev,
      [industryId]: {
        ...prev[industryId],
        ...preset.thresholds
      }
    }));
  };

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

  const handleAddAllMatches = (matchingStocks: Stock[]) => {
    const map = new Map<string, Stock>();
    basket.forEach(item => map.set(item.stock.ticker, item.stock));
    matchingStocks.forEach(s => map.set(s.ticker, s));

    const combined = Array.from(map.values());
    const equalW = combined.length > 0 ? Math.round(100 / combined.length) : 0;
    setBasket(combined.map(s => ({ stock: s, weight: equalW })));
  };

  const handleUpdateWeight = (ticker: string, weight: number) => {
    setBasket(prev => prev.map(item => {
      if (item.stock.ticker === ticker) {
        return { ...item, weight };
      }
      return item;
    }));
  };

  const handleRemoveStock = (ticker: string) => {
    const next = basket.filter(item => item.stock.ticker !== ticker);
    if (next.length > 0) {
      const equalW = Math.round(100 / next.length);
      setBasket(next.map(item => ({ ...item, weight: equalW })));
    } else {
      setBasket([]);
    }
  };

  const handleEqualWeight = () => {
    if (basket.length === 0) return;
    const equalW = Math.round(100 / basket.length);
    setBasket(prev => prev.map(item => ({ ...item, weight: equalW })));
  };

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

      {/* Main Container */}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ALPHA SELECTOR INDIA // Indian Stock Market Screener & Wealth Simulator</span>
          <span>NSE / BSE Equities • Protected Link-Only Review</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
