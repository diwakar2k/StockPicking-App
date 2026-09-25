export type Market = 'IN';

export type IndustryId = 
  | 'tech' 
  | 'banking' 
  | 'healthcare' 
  | 'fmcg' 
  | 'energy' 
  | 'auto';

export interface IndustryInfo {
  id: IndustryId;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  tagline: string;
  color: string;
  metricsSummary: string[];
}

export interface MetricDefinition {
  id: string;
  label: string;
  shortLabel: string;
  unit: '%' | 'x' | 'days' | 'ratio' | '₹';
  description: string;
  whyItMatters: string;
  higherIsBetter: boolean;
  min: number;
  max: number;
  step: number;
  defaultThreshold: number;
  benchmarkMedian: number;
}

export interface StrategyPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  thresholds: Record<string, number>;
}

export interface IndustryCriteriaConfig {
  industryId: IndustryId;
  metrics: MetricDefinition[];
  presets: StrategyPreset[];
}

export interface Stock {
  ticker: string;
  name: string;
  market: Market;
  industry: IndustryId;
  price: number;
  change24h: number;
  marketCap: number; // in Crores for India (₹)
  peRatio: number;
  dividendYield: number;
  expectedCAGR: number; // 3-5yr forward expected return estimate %
  description: string;
  metrics: Record<string, number>; // Dynamic sector-specific metrics
}

export interface ScoredStock extends Stock {
  score: number; // 0 to 100 composite score
  passedCriteria: string[];
  failedCriteria: string[];
  isMatch: boolean;
}

export interface PortfolioItem {
  stock: Stock;
  weight: number; // percentage (sum to 100)
}

export interface ForecastInput {
  lumpsum: number;
  monthlySip: number;
  annualStepUpPct: number;
  years: number;
  expectedReturnPct: number;
  inflationPct: number;
  adjustForInflation: boolean;
}

export interface YearlyForecast {
  year: number;
  investedCapital: number;
  nominalCorpus: number;
  realCorpus: number;
  annualInflow: number;
  annualGain: number;
  bearCaseCorpus: number;
  bullCaseCorpus: number;
}

export interface ForecastSummary {
  totalInvested: number;
  finalNominalCorpus: number;
  finalRealCorpus: number;
  totalGain: number;
  wealthMultiplier: number;
  bearCorpus: number;
  bullCorpus: number;
  milestones: {
    target: number;
    yearReached: number | null;
    label: string;
  }[];
  yearlyData: YearlyForecast[];
}
