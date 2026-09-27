/**
 * @file calculator.ts
 * @description Financial mathematics engine for AlphaSelector India.
 * Provides institutional-grade stock scoring algorithms, multi-year compounding
 * corpus simulations with SIP step-ups and inflation deflation, and Indian Rupee (₹) currency formatting.
 */

import { ForecastInput, ForecastSummary, IndustryCriteriaConfig, Market, ScoredStock, Stock, YearlyForecast } from '../types';

/**
 * Evaluates an individual stock against sector-specific criteria thresholds and calculates
 * a normalized 0-100 composite quality score.
 *
 * Scoring Methodology:
 * 1. Threshold Verification: Checks if each sector metric meets or exceeds user thresholds.
 * 2. Range Normalization: Linearly scales each metric's value between its defined min/max bounds (10 to 100 points).
 * 3. Benchmark Outperformance Bonus: Awards a +10 point bonus if the metric beats the industry median benchmark.
 * 4. Pass-Rate Weighting: Penalizes companies that miss criteria by weighting the raw score by `(0.6 + 0.4 * passRate)`.
 * 5. Bounded Clamping: Clamps composite score to a reasonable investment spectrum of 25 to 99.
 *
 * @param stock - Stock fundamental record to evaluate.
 * @param config - Industry criteria configuration containing metric definitions and benchmarks.
 * @param thresholds - Active threshold values configured by the user or strategy preset.
 * @returns Enhanced `ScoredStock` object with composite score, passed/failed lists, and match status.
 */
export function evaluateStock(
  stock: Stock,
  config: IndustryCriteriaConfig,
  thresholds: Record<string, number>
): ScoredStock {
  const passedCriteria: string[] = [];
  const failedCriteria: string[] = [];
  let scoreSum = 0;
  const metrics = config.metrics;

  metrics.forEach((metric) => {
    const val = stock.metrics[metric.id];
    const threshold = thresholds[metric.id] ?? metric.defaultThreshold;

    // Handle missing metric safely
    if (val === undefined) {
      failedCriteria.push(metric.id);
      return;
    }

    const passes = metric.higherIsBetter ? val >= threshold : val <= threshold;

    if (passes) {
      passedCriteria.push(metric.id);
    } else {
      failedCriteria.push(metric.id);
    }

    // Normalized metric quality score (0 to 100)
    let metricScore = 50;
    if (metric.higherIsBetter) {
      const range = Math.max(metric.max - metric.min, 1);
      const ratio = (val - metric.min) / range;
      metricScore = Math.max(10, Math.min(100, ratio * 100));
    } else {
      const range = Math.max(metric.max - metric.min, 1);
      const ratio = (metric.max - val) / range;
      metricScore = Math.max(10, Math.min(100, ratio * 100));
    }

    // Benchmark bonus: reward companies beating the Indian industry median
    const beatsMedian = metric.higherIsBetter ? val >= metric.benchmarkMedian : val <= metric.benchmarkMedian;
    if (beatsMedian) {
      metricScore = Math.min(100, metricScore + 10);
    }

    scoreSum += metricScore;
  });

  const rawScore = metrics.length > 0 ? Math.round(scoreSum / metrics.length) : 50;
  
  // Weight score by the proportion of satisfied criteria (pass rate)
  const passRate = metrics.length > 0 ? passedCriteria.length / metrics.length : 1;
  const finalScore = Math.round(rawScore * (0.6 + 0.4 * passRate));

  return {
    ...stock,
    score: Math.min(99, Math.max(25, finalScore)),
    passedCriteria,
    failedCriteria,
    isMatch: passedCriteria.length === metrics.length
  };
}

/**
 * Projects multi-year wealth accumulation utilizing monthly compounding, Systematic Investment Plan (SIP)
 * inflows, compounding annual step-up contributions, inflation deflation, and scenario sensitivity spreads.
 *
 * Compounding Algorithm:
 * - Converts annual CAGR to effective monthly rate: `r_m = (1 + r)^(1/12) - 1`
 * - Simulates 12 discrete monthly compounding and deposit intervals per year.
 * - Applies annual step-up percentage to SIP: `SIP_{y+1} = SIP_y * (1 + stepUp / 100)`
 * - Computes purchasing power deflation factor: `Deflator = (1 + inflation / 100)^year`
 * - Tracks milestone achievement across standard Indian wealth milestones (₹10L to ₹5 Cr).
 *
 * @param input - Configuration containing lumpsum, monthly SIP, step-up, duration, and return rates.
 * @param _market - Target market identifier (defaults to 'IN').
 * @returns Comprehensive `ForecastSummary` containing yearly cashflows, scenario outcomes, and milestone metrics.
 */
export function calculateForecast(input: ForecastInput, _market: Market = 'IN'): ForecastSummary {
  const {
    lumpsum,
    monthlySip,
    annualStepUpPct,
    years,
    expectedReturnPct,
    inflationPct,
    adjustForInflation
  } = input;

  // Derive effective monthly compounding rates
  const monthlyRate = Math.pow(1 + expectedReturnPct / 100, 1 / 12) - 1;
  const bearMonthlyRate = Math.pow(1 + Math.max(2, expectedReturnPct - 4) / 100, 1 / 12) - 1;
  const bullMonthlyRate = Math.pow(1 + (expectedReturnPct + 4) / 100, 1 / 12) - 1;

  let currentNominal = lumpsum;
  let currentBear = lumpsum;
  let currentBull = lumpsum;
  let totalInvested = lumpsum;
  let currentMonthlySip = monthlySip;

  const yearlyData: YearlyForecast[] = [];

  for (let year = 1; year <= years; year++) {
    const annualInflow = currentMonthlySip * 12;

    // Simulate 12 months of monthly SIP deposits and compounding
    for (let m = 1; m <= 12; m++) {
      currentNominal = currentNominal * (1 + monthlyRate) + currentMonthlySip;
      currentBear = currentBear * (1 + bearMonthlyRate) + currentMonthlySip;
      currentBull = currentBull * (1 + bullMonthlyRate) + currentMonthlySip;
      totalInvested += currentMonthlySip;
    }

    const inflationFactor = Math.pow(1 + inflationPct / 100, year);
    const realCorpus = currentNominal / inflationFactor;
    const annualGain = currentNominal - (yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].nominalCorpus : lumpsum) - annualInflow;

    yearlyData.push({
      year,
      investedCapital: Math.round(totalInvested),
      nominalCorpus: Math.round(currentNominal),
      realCorpus: Math.round(realCorpus),
      annualInflow: Math.round(annualInflow),
      annualGain: Math.round(annualGain),
      bearCaseCorpus: Math.round(currentBear),
      bullCaseCorpus: Math.round(currentBull)
    });

    // Step-up monthly SIP contribution for subsequent year
    currentMonthlySip = currentMonthlySip * (1 + annualStepUpPct / 100);
  }

  const finalNominal = yearlyData[yearlyData.length - 1]?.nominalCorpus ?? lumpsum;
  const finalReal = yearlyData[yearlyData.length - 1]?.realCorpus ?? lumpsum;
  const finalBear = yearlyData[yearlyData.length - 1]?.bearCaseCorpus ?? lumpsum;
  const finalBull = yearlyData[yearlyData.length - 1]?.bullCaseCorpus ?? lumpsum;

  // Institutional Indian wealth milestones (Lakhs and Crores)
  const milestoneTargets = [
    { target: 1000000, label: '₹10 Lakh' },
    { target: 2500000, label: '₹25 Lakh' },
    { target: 5000000, label: '₹50 Lakh' },
    { target: 10000000, label: '₹1 Crore' },
    { target: 25000000, label: '₹2.5 Crore' },
    { target: 50000000, label: '₹5 Crore' }
  ];

  const milestones = milestoneTargets.map(m => {
    const reachedEntry = yearlyData.find(d => (adjustForInflation ? d.realCorpus : d.nominalCorpus) >= m.target);
    return {
      target: m.target,
      label: m.label,
      yearReached: reachedEntry ? reachedEntry.year : null
    };
  });

  return {
    totalInvested: Math.round(totalInvested),
    finalNominalCorpus: finalNominal,
    finalRealCorpus: finalReal,
    totalGain: Math.max(0, finalNominal - totalInvested),
    wealthMultiplier: totalInvested > 0 ? Number((finalNominal / totalInvested).toFixed(2)) : 1,
    bearCorpus: finalBear,
    bullCorpus: finalBull,
    milestones,
    yearlyData
  };
}

/**
 * Formats monetary amounts according to the Indian numbering system using Lakhs (L) and Crores (Cr).
 *
 * Examples:
 * - `formatCurrency(15000000, 'IN', true)` => `"₹1.50 Cr"`
 * - `formatCurrency(250000, 'IN', true)` => `"₹2.50 L"`
 * - `formatCurrency(45000, 'IN', true)` => `"₹45.0k"`
 * - `formatCurrency(1500000, 'IN', false)` => `"₹15,00,000"`
 *
 * @param amount - Numerical amount in Indian Rupees (₹).
 * @param _market - Target market currency symbol (defaults to 'IN').
 * @param compact - When true, formats into short notations (Cr, L, k); when false, formats standard comma-separated INR.
 * @returns Human-readable formatted currency string with ₹ symbol.
 */
export function formatCurrency(amount: number, _market: Market = 'IN', compact: boolean = true): string {
  if (!compact) {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${Math.round(amount)}`;
}
