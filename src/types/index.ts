/**
 * @file index.ts
 * @description Core TypeScript type definitions and interfaces for AlphaSelector India.
 * Defines models for Indian stock market sectors, dynamic valuation metrics,
 * stock scoring, portfolio baskets, and wealth compounding forecasting.
 */

/**
 * Supported market identifier.
 * 'IN' represents the Indian stock exchanges (National Stock Exchange - NSE / Bombay Stock Exchange - BSE) in INR (₹).
 */
export type Market = 'IN';

/**
 * Supported sector/industry identifiers with specialized fundamental valuation models.
 */
export type IndustryId = 
  | 'tech' 
  | 'banking' 
  | 'healthcare' 
  | 'fmcg' 
  | 'energy' 
  | 'auto';

/**
 * Metadata and display attributes for a target industry vertical.
 */
export interface IndustryInfo {
  /** Unique programmatic identifier matching IndustryId */
  id: IndustryId;
  /** Full descriptive name for UI display (e.g., 'Banking & Financials (BFSI)') */
  name: string;
  /** Abbreviated display label for tags and badges (e.g., 'BFSI') */
  shortName: string;
  /** Lucide icon component name to render */
  icon: string;
  /** Tailwind gradient string for visual theming */
  color: string;
  /** High-level executive summary of sector drivers */
  tagline: string;
  /** In-depth context explaining why sector requires custom valuation treatment */
  description: string;
  /** Key metric names highlighted on industry cards */
  metricsSummary: string[];
}

/**
 * Configuration and boundary constraints for a sector-specific financial metric.
 */
export interface MetricDefinition {
  /** Unique identifier corresponding to the stock's metrics property key */
  id: string;
  /** Full human-readable metric title (e.g., 'Net Interest Margin (NIM)') */
  label: string;
  /** Compact label for table pills and mobile chips (e.g., 'NIM') */
  shortLabel: string;
  /** Display unit for metric values */
  unit: '%' | 'x' | 'days' | 'ratio' | '₹';
  /** Technical definition of the financial metric */
  description: string;
  /** Fundamental rationale explaining investment significance */
  whyItMatters: string;
  /** True if higher values indicate superior performance; false if lower is preferred (e.g., NPAs, D/E) */
  higherIsBetter: boolean;
  /** Minimum slider range boundary */
  min: number;
  /** Maximum slider range boundary */
  max: number;
  /** Step increment for the slider control */
  step: number;
  /** Default screening threshold value */
  defaultThreshold: number;
  /** Indian industry median benchmark for sector comparison */
  benchmarkMedian: number;
}

/**
 * Pre-configured investment strategy template within a sector.
 */
export interface StrategyPreset {
  /** Unique strategy identifier */
  id: string;
  /** Strategy title (e.g., 'Fortress Balance Sheet') */
  name: string;
  /** One-line strategy philosophy summary */
  description: string;
  /** Lucide icon name representing the strategy */
  icon: string;
  /** Map of metric IDs to predefined threshold filter values */
  thresholds: Record<string, number>;
}

/**
 * Sector criteria configuration bundle containing metrics and strategy presets.
 */
export interface IndustryCriteriaConfig {
  /** Target industry identifier */
  industryId: IndustryId;
  /** Array of industry-specific metric definitions */
  metrics: MetricDefinition[];
  /** Ready-to-apply strategy preset configurations */
  presets: StrategyPreset[];
}

/**
 * Fundamental financial record for an Indian equity.
 */
export interface Stock {
  /** NSE/BSE ticker symbol with exchange suffix (e.g., 'TCS.NS', 'HDFCBANK.NS') */
  ticker: string;
  /** Official registered company name */
  name: string;
  /** Market exchange jurisdiction */
  market: Market;
  /** Industry sector category */
  industry: IndustryId;
  /** Current trading price in Indian Rupees (₹) */
  price: number;
  /** 24-hour price change percentage */
  change24h: number;
  /** Market capitalization in Indian Crores (₹ Cr) */
  marketCap: number;
  /** Trailing twelve months Price-to-Earnings valuation multiple */
  peRatio: number;
  /** Annual dividend yield percentage */
  dividendYield: number;
  /** Forward 3-5 year expected compound annual growth rate estimate (%) */
  expectedCAGR: number;
  /** Overview of business operations, competitive moats, and growth drivers */
  description: string;
  /** Dynamic key-value pairs of sector-specific metrics */
  metrics: Record<string, number>;
}

/**
 * Evaluated stock model enriched with screening diagnostics and composite scoring.
 */
export interface ScoredStock extends Stock {
  /** Composite quality score ranging from 0 to 100 */
  score: number;
  /** Array of metric IDs that satisfied the configured threshold conditions */
  passedCriteria: string[];
  /** Array of metric IDs that failed to meet the threshold conditions */
  failedCriteria: string[];
  /** True if the company meets 100% of the active sector criteria */
  isMatch: boolean;
}

/**
 * Portfolio basket component representing a weighted equity holding.
 */
export interface PortfolioItem {
  /** Underlying stock details */
  stock: Stock;
  /** Portfolio allocation weighting percentage (0 to 100%) */
  weight: number;
}

/**
 * Input parameters for the corpus compounding simulator.
 */
export interface ForecastInput {
  /** Initial lumpsum investment capital in ₹ */
  lumpsum: number;
  /** Recurring monthly Systematic Investment Plan (SIP) contribution in ₹ */
  monthlySip: number;
  /** Annual percentage increase in monthly SIP contribution (salary step-up) */
  annualStepUpPct: number;
  /** Total investment projection duration in years (1 to 30) */
  years: number;
  /** Expected annual portfolio compound return percentage (CAGR) */
  expectedReturnPct: number;
  /** Anticipated annual inflation rate percentage for purchasing power deflation */
  inflationPct: number;
  /** Toggle to calculate real purchasing power corpus alongside nominal corpus */
  adjustForInflation: boolean;
}

/**
 * Single-year snapshot produced by the wealth projection engine.
 */
export interface YearlyForecast {
  /** Timeline year index (1 to N) */
  year: number;
  /** Cumulative capital invested up to this year (₹) */
  investedCapital: number;
  /** Nominal accumulated corpus without inflation adjustment (₹) */
  nominalCorpus: number;
  /** Real corpus deflated by cumulative inflation to reflect current purchasing power (₹) */
  realCorpus: number;
  /** Total capital added during this specific year (₹) */
  annualInflow: number;
  /** Net investment growth gain generated during this specific year (₹) */
  annualGain: number;
  /** Conservative bear-case corpus scenario (-4% return adjustment) */
  bearCaseCorpus: number;
  /** Optimistic bull-case corpus scenario (+4% return adjustment) */
  bullCaseCorpus: number;
}

/**
 * Aggregate summary metrics and milestone analysis returned by the forecaster.
 */
export interface ForecastSummary {
  /** Total principal capital contributed across lumpsum and monthly SIPs (₹) */
  totalInvested: number;
  /** Final nominal corpus accumulated at end of investment horizon (₹) */
  finalNominalCorpus: number;
  /** Final inflation-adjusted real purchasing power corpus (₹) */
  finalRealCorpus: number;
  /** Total net investment wealth generated purely from compounding returns (₹) */
  totalGain: number;
  /** Ratio of final nominal corpus to total principal invested (e.g., 3.4x) */
  wealthMultiplier: number;
  /** Estimated final corpus under conservative bear market conditions */
  bearCorpus: number;
  /** Estimated final corpus under accelerated bull market conditions */
  bullCorpus: number;
  /** Indian wealth milestone progression (₹10L, ₹25L, ₹50L, ₹1 Cr, ₹2.5 Cr, ₹5 Cr) */
  milestones: {
    /** Target corpus value in ₹ */
    target: number;
    /** Year index when milestone is achieved, or null if beyond horizon */
    yearReached: number | null;
    /** Formatted Indian currency milestone label */
    label: string;
  }[];
  /** Year-by-year cashflow and compounding breakdown */
  yearlyData: YearlyForecast[];
}
