import { ForecastInput, ForecastSummary, IndustryCriteriaConfig, Market, ScoredStock, Stock, YearlyForecast } from '../types';

/**
 * Evaluates a stock against the active industry thresholds and produces a 0-100 composite score.
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

    // Bonus if beats industry median
    const beatsMedian = metric.higherIsBetter ? val >= metric.benchmarkMedian : val <= metric.benchmarkMedian;
    if (beatsMedian) {
      metricScore = Math.min(100, metricScore + 10);
    }

    scoreSum += metricScore;
  });

  const rawScore = metrics.length > 0 ? Math.round(scoreSum / metrics.length) : 50;
  // Penalty if failed any criteria
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
 * Computes corpus growth with Lumpsum, monthly SIP, annual Step-up %, and inflation deflation in ₹.
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

    // Simulate 12 months of compounding and monthly SIP additions
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

    // Step-up monthly SIP for the next year
    currentMonthlySip = currentMonthlySip * (1 + annualStepUpPct / 100);
  }

  const finalNominal = yearlyData[yearlyData.length - 1]?.nominalCorpus ?? lumpsum;
  const finalReal = yearlyData[yearlyData.length - 1]?.realCorpus ?? lumpsum;
  const finalBear = yearlyData[yearlyData.length - 1]?.bearCaseCorpus ?? lumpsum;
  const finalBull = yearlyData[yearlyData.length - 1]?.bullCaseCorpus ?? lumpsum;

  // Indian Milestones in Lakhs and Crores
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
 * Formats monetary amounts in Indian numbering format (Lakhs and Crores).
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
