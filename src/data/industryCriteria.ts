import { IndustryCriteriaConfig, IndustryInfo, IndustryId } from '../types';

export const INDUSTRIES: IndustryInfo[] = [
  {
    id: 'tech',
    name: 'Technology & SaaS',
    shortName: 'Tech',
    icon: 'Cpu',
    color: 'from-blue-600 to-indigo-600',
    tagline: 'High growth, strong operating leverage & scalable recurring revenue',
    description: 'Companies in Cloud, Enterprise Software, Semiconductors, and Digital Platforms where unit economics, retention, and reinvestment speed dominate.',
    metricsSummary: ['Rule of 40', 'YoY Revenue Growth', 'Gross Margin', 'EV / Sales', 'FCF Margin']
  },
  {
    id: 'banking',
    name: 'Banking & Financials (BFSI)',
    shortName: 'BFSI',
    icon: 'Landmark',
    color: 'from-emerald-600 to-teal-600',
    tagline: 'Credit quality, net interest spreads & capital buffer reserves',
    description: 'Commercial banks, investment institutions, and NBFCs. Standard Debt/Equity metrics do not apply; asset quality, NIM, and leverage management are crucial.',
    metricsSummary: ['Net Interest Margin (NIM)', 'Net NPA Ratio', 'Return on Assets (ROA)', 'Return on Equity (ROE)', 'Capital Adequacy (CAR)']
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Pharma',
    shortName: 'Healthcare',
    icon: 'Activity',
    color: 'from-rose-600 to-pink-600',
    tagline: 'R&D reinvestment, patent pipelines & defensive cash flows',
    description: 'Pharmaceutical manufacturers, biotech innovators, and hospital networks. Reinvestment into R&D and operating margins against regulatory price controls.',
    metricsSummary: ['R&D % of Revenue', 'Operating Margin (OPM)', 'ROCE', 'Debt / Equity', 'Free Cash Flow']
  },
  {
    id: 'fmcg',
    name: 'FMCG & Consumer Goods',
    shortName: 'Consumer',
    icon: 'ShoppingBag',
    color: 'from-amber-600 to-orange-600',
    tagline: 'Brand moat, negative working capital & compounding return on capital',
    description: 'Fast-moving consumer goods, retail chains, and packaged food makers. Thrives on customer loyalty, pricing power, and efficient working capital cycles.',
    metricsSummary: ['ROCE / ROIC', 'Cash Conversion Cycle', 'Operating Margin', 'FCF Conversion %', 'Dividend Payout']
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    shortName: 'Energy',
    icon: 'Zap',
    color: 'from-cyan-600 to-blue-700',
    tagline: 'Infrastructure capital, robust cash flow yields & high dividends',
    description: 'Power generation, oil & gas exploration, renewable infrastructure, and regulated utilities. Driven by capacity utilization, EV/EBITDA, and debt servicing.',
    metricsSummary: ['FCF Yield', 'EV / EBITDA', 'Dividend Yield', 'Interest Coverage Ratio', 'Debt / Equity']
  },
  {
    id: 'auto',
    name: 'Auto & Manufacturing',
    shortName: 'Auto & Industrials',
    icon: 'Car',
    color: 'from-purple-600 to-violet-700',
    tagline: 'Cyclical demand, operating efficiency & asset turnover',
    description: 'Automakers, component suppliers, and heavy machinery fabricators. Focuses on capacity utilization, margins through commodity cycles, and asset efficiency.',
    metricsSummary: ['EBITDA Margin', 'Asset Turnover', 'ROCE', 'Interest Coverage', 'Debt / Equity']
  }
];

export const INDUSTRY_CRITERIA: Record<IndustryId, IndustryCriteriaConfig> = {
  tech: {
    industryId: 'tech',
    metrics: [
      {
        id: 'ruleOf40',
        label: 'Rule of 40 Score',
        shortLabel: 'Rule of 40',
        unit: '%',
        description: 'Revenue Growth Rate (%) + Free Cash Flow Margin (%)',
        whyItMatters: 'Gold standard for tech/SaaS companies. Scores > 40% signify sustainable, capital-efficient hypergrowth.',
        higherIsBetter: true,
        min: 10,
        max: 80,
        step: 1,
        defaultThreshold: 40,
        benchmarkMedian: 35
      },
      {
        id: 'revGrowth',
        label: 'YoY Revenue Growth',
        shortLabel: 'Rev Growth',
        unit: '%',
        description: 'Year-over-year top-line revenue expansion rate',
        whyItMatters: 'Indicates product-market fit, market share capture, and pricing power in fast-evolving sectors.',
        higherIsBetter: true,
        min: 5,
        max: 50,
        step: 1,
        defaultThreshold: 18,
        benchmarkMedian: 15
      },
      {
        id: 'grossMargin',
        label: 'Gross Profit Margin',
        shortLabel: 'Gross Margin',
        unit: '%',
        description: 'Gross Profit divided by Total Revenue',
        whyItMatters: 'High gross margins (>70%) provide fuel to aggressively fund sales, marketing, and R&D without diluting equity.',
        higherIsBetter: true,
        min: 40,
        max: 90,
        step: 1,
        defaultThreshold: 65,
        benchmarkMedian: 60
      },
      {
        id: 'evSales',
        label: 'EV / Sales Ratio',
        shortLabel: 'EV/Sales',
        unit: 'x',
        description: 'Enterprise Value relative to Annual Revenue',
        whyItMatters: 'Key valuation gauge when earnings are deliberately depressed due to heavy growth reinvestment.',
        higherIsBetter: false,
        min: 2,
        max: 25,
        step: 0.5,
        defaultThreshold: 12,
        benchmarkMedian: 9.5
      },
      {
        id: 'fcfMargin',
        label: 'Free Cash Flow Margin',
        shortLabel: 'FCF Margin',
        unit: '%',
        description: 'Free Cash Flow divided by Total Revenue',
        whyItMatters: 'Separates companies with real self-funding cash generation from unprofitable hype.',
        higherIsBetter: true,
        min: 0,
        max: 45,
        step: 1,
        defaultThreshold: 18,
        benchmarkMedian: 14
      }
    ],
    presets: [
      {
        id: 'hyper_growth',
        name: 'Hyper-Growth Scalers',
        description: 'Maximum top-line expansion with healthy Rule of 40 score',
        icon: 'Rocket',
        thresholds: { ruleOf40: 45, revGrowth: 25, grossMargin: 70, evSales: 18, fcfMargin: 15 }
      },
      {
        id: 'tech_cash_cow',
        name: 'Cash Flow Compounders',
        description: 'High cash margins and strong balance sheets at reasonable valuations',
        icon: 'ShieldCheck',
        thresholds: { ruleOf40: 38, revGrowth: 14, grossMargin: 65, evSales: 9, fcfMargin: 24 }
      },
      {
        id: 'undervalued_saas',
        name: 'Disciplined GARP Tech',
        description: 'Solid margins with strictly controlled EV/Sales multiples',
        icon: 'Tag',
        thresholds: { ruleOf40: 35, revGrowth: 15, grossMargin: 60, evSales: 6.5, fcfMargin: 16 }
      }
    ]
  },

  banking: {
    industryId: 'banking',
    metrics: [
      {
        id: 'nim',
        label: 'Net Interest Margin (NIM)',
        shortLabel: 'NIM',
        unit: '%',
        description: 'Difference between interest income and interest paid, relative to assets',
        whyItMatters: 'Measures lending profitability and low-cost deposit franchise (CASA) power.',
        higherIsBetter: true,
        min: 2.0,
        max: 6.5,
        step: 0.1,
        defaultThreshold: 3.5,
        benchmarkMedian: 3.2
      },
      {
        id: 'netNpa',
        label: 'Net Non-Performing Assets (NPA)',
        shortLabel: 'Net NPA',
        unit: '%',
        description: 'Bad loans net of provisioning relative to net customer advances',
        whyItMatters: 'The single most vital risk barometer. Lower net NPA protects against sudden insolvency and heavy write-offs.',
        higherIsBetter: false,
        min: 0.2,
        max: 3.5,
        step: 0.1,
        defaultThreshold: 1.2,
        benchmarkMedian: 1.5
      },
      {
        id: 'roa',
        label: 'Return on Assets (ROA)',
        shortLabel: 'ROA',
        unit: '%',
        description: 'Annual Net Income divided by Total Assets',
        whyItMatters: 'Banks are highly leveraged; an ROA > 1.2%–1.5% indicates exceptional operational efficiency and underwriting quality.',
        higherIsBetter: true,
        min: 0.5,
        max: 2.5,
        step: 0.1,
        defaultThreshold: 1.2,
        benchmarkMedian: 1.1
      },
      {
        id: 'car',
        label: 'Capital Adequacy Ratio (CAR / Tier-1)',
        shortLabel: 'CAR',
        unit: '%',
        description: 'Total regulatory capital divided by risk-weighted assets',
        whyItMatters: 'Provides safety cushion during economic downturns and enables loan book growth without frequent equity dilution.',
        higherIsBetter: true,
        min: 11,
        max: 24,
        step: 0.5,
        defaultThreshold: 15.0,
        benchmarkMedian: 14.5
      },
      {
        id: 'pbRatio',
        label: 'Price to Book (P/B)',
        shortLabel: 'P/B Ratio',
        unit: 'x',
        description: 'Stock price relative to Net Book Value per share',
        whyItMatters: 'Since bank assets are marked-to-market, P/B is the premier valuation multiple for financial institutions.',
        higherIsBetter: false,
        min: 0.5,
        max: 4.5,
        step: 0.1,
        defaultThreshold: 2.5,
        benchmarkMedian: 2.0
      }
    ],
    presets: [
      {
        id: 'fortress_balance_sheet',
        name: 'Fortress Banks',
        description: 'Near-zero NPAs, high capital adequacy, and superior underwriting',
        icon: 'Shield',
        thresholds: { nim: 3.8, netNpa: 0.8, roa: 1.4, car: 16.5, pbRatio: 3.0 }
      },
      {
        id: 'high_roe_compounders',
        name: 'High-Spreads Retail Giants',
        description: 'Robust NIM with strong consumer franchise profitability',
        icon: 'TrendingUp',
        thresholds: { nim: 4.0, netNpa: 1.2, roa: 1.3, car: 15.0, pbRatio: 2.6 }
      },
      {
        id: 'value_rebound',
        name: 'Deep Value Financials',
        description: 'Low P/B valuation with improving asset quality and healthy buffers',
        icon: 'Tag',
        thresholds: { nim: 3.0, netNpa: 1.6, roa: 0.9, car: 14.0, pbRatio: 1.5 }
      }
    ]
  },

  healthcare: {
    industryId: 'healthcare',
    metrics: [
      {
        id: 'rdSpend',
        label: 'R&D % of Revenue',
        shortLabel: 'R&D / Rev',
        unit: '%',
        description: 'Research & Development expenditures relative to total sales',
        whyItMatters: 'Guarantees fresh patent pipeline, biosimilar launches, and protection against patent cliff expirations.',
        higherIsBetter: true,
        min: 3,
        max: 22,
        step: 0.5,
        defaultThreshold: 7.5,
        benchmarkMedian: 6.8
      },
      {
        id: 'opm',
        label: 'Operating Profit Margin (OPM)',
        shortLabel: 'OPM',
        unit: '%',
        description: 'Operating income divided by revenue',
        whyItMatters: 'Demonstrates manufacturing efficiency, pricing power in specialty formulations, and regulatory cost resilience.',
        higherIsBetter: true,
        min: 12,
        max: 38,
        step: 1,
        defaultThreshold: 20,
        benchmarkMedian: 18
      },
      {
        id: 'roce',
        label: 'Return on Capital Employed (ROCE)',
        shortLabel: 'ROCE',
        unit: '%',
        description: 'EBIT divided by Total Capital Employed',
        whyItMatters: 'Proves management allocates capital prudently across multi-year clinical trial cycles.',
        higherIsBetter: true,
        min: 10,
        max: 40,
        step: 1,
        defaultThreshold: 18,
        benchmarkMedian: 15
      },
      {
        id: 'debtEquity',
        label: 'Debt to Equity Ratio',
        shortLabel: 'D/E',
        unit: 'ratio',
        description: 'Total Debt divided by Shareholders Equity',
        whyItMatters: 'Low debt provides runway during protracted FDA reviews or clinical delays.',
        higherIsBetter: false,
        min: 0.0,
        max: 1.5,
        step: 0.05,
        defaultThreshold: 0.4,
        benchmarkMedian: 0.45
      }
    ],
    presets: [
      {
        id: 'pipeline_innovators',
        name: 'R&D Innovators',
        description: 'Heavy R&D reinvestment creating moat against generic competition',
        icon: 'FlaskConical',
        thresholds: { rdSpend: 10, opm: 22, roce: 18, debtEquity: 0.3 }
      },
      {
        id: 'defensive_quality',
        name: 'Defensive Cash Flow Pharma',
        description: 'Clean balance sheet, steady ROCE, and robust operational margins',
        icon: 'ShieldCheck',
        thresholds: { rdSpend: 6.5, opm: 20, roce: 22, debtEquity: 0.2 }
      }
    ]
  },

  fmcg: {
    industryId: 'fmcg',
    metrics: [
      {
        id: 'roce',
        label: 'Return on Capital Employed (ROCE)',
        shortLabel: 'ROCE',
        unit: '%',
        description: 'EBIT divided by Total Capital Employed',
        whyItMatters: 'Top FMCG brands enjoy extraordinary ROCE (>30%) because of consumer brand equity and asset-light distribution.',
        higherIsBetter: true,
        min: 15,
        max: 70,
        step: 1,
        defaultThreshold: 28,
        benchmarkMedian: 24
      },
      {
        id: 'ccc',
        label: 'Cash Conversion Cycle',
        shortLabel: 'CCC (Days)',
        unit: 'days',
        description: 'Days to convert inventory and receivables into cash minus payable days',
        whyItMatters: 'Negative or near-zero CCC means company operates on supplier credit, essentially self-financing its distribution.',
        higherIsBetter: false,
        min: -60,
        max: 90,
        step: 2,
        defaultThreshold: 35,
        benchmarkMedian: 45
      },
      {
        id: 'opm',
        label: 'Operating Profit Margin (OPM)',
        shortLabel: 'OPM',
        unit: '%',
        description: 'Operating income divided by Net Sales',
        whyItMatters: 'Reveals pricing power when agricultural / packaging raw material prices rise.',
        higherIsBetter: true,
        min: 10,
        max: 35,
        step: 0.5,
        defaultThreshold: 18,
        benchmarkMedian: 16
      },
      {
        id: 'fcfConversion',
        label: 'FCF / Net Profit Conversion',
        shortLabel: 'FCF / PAT',
        unit: '%',
        description: 'Free Cash Flow divided by Reported Net Profit',
        whyItMatters: 'Verifies earnings quality. Premium FMCG companies convert 90%+ of net earnings into pure free cash flow.',
        higherIsBetter: true,
        min: 50,
        max: 130,
        step: 2,
        defaultThreshold: 85,
        benchmarkMedian: 78
      }
    ],
    presets: [
      {
        id: 'compounding_moat',
        name: 'Monopoly Brand Moats',
        description: 'Outstanding ROCE and high cash conversion with minimal working capital',
        icon: 'Award',
        thresholds: { roce: 35, ccc: 20, opm: 22, fcfConversion: 92 }
      },
      {
        id: 'stable_cash_compounders',
        name: 'Steady Dividends & Value',
        description: 'Consistent operating margins and dependable cash generation',
        icon: 'DollarSign',
        thresholds: { roce: 24, ccc: 40, opm: 16, fcfConversion: 80 }
      }
    ]
  },

  energy: {
    industryId: 'energy',
    metrics: [
      {
        id: 'fcfYield',
        label: 'Free Cash Flow Yield',
        shortLabel: 'FCF Yield',
        unit: '%',
        description: 'Free Cash Flow per share divided by Market Price',
        whyItMatters: 'Capital-intensive sectors generate immense cash at peak cycle; FCF Yield gauges real cash returns to owners.',
        higherIsBetter: true,
        min: 3,
        max: 18,
        step: 0.5,
        defaultThreshold: 7.5,
        benchmarkMedian: 6.5
      },
      {
        id: 'evEbitda',
        label: 'EV / EBITDA Ratio',
        shortLabel: 'EV/EBITDA',
        unit: 'x',
        description: 'Enterprise Value relative to annual EBITDA',
        whyItMatters: 'Crucial for high-depreciation, asset-heavy firms to normalize differences in capital structure and tax regimes.',
        higherIsBetter: false,
        min: 3,
        max: 15,
        step: 0.5,
        defaultThreshold: 7.5,
        benchmarkMedian: 8.2
      },
      {
        id: 'divYield',
        label: 'Dividend Yield',
        shortLabel: 'Div Yield',
        unit: '%',
        description: 'Annual dividend payout divided by current share price',
        whyItMatters: 'Energy and utility investors rely on reliable income distributions that outperform fixed deposits.',
        higherIsBetter: true,
        min: 1.0,
        max: 9.0,
        step: 0.2,
        defaultThreshold: 3.5,
        benchmarkMedian: 3.0
      },
      {
        id: 'interestCoverage',
        label: 'Interest Coverage Ratio',
        shortLabel: 'Int Coverage',
        unit: 'x',
        description: 'EBIT divided by annual interest expense',
        whyItMatters: 'Protects the enterprise against surging interest rate cycles and debt rollover shocks.',
        higherIsBetter: true,
        min: 2,
        max: 15,
        step: 0.5,
        defaultThreshold: 5.0,
        benchmarkMedian: 4.2
      }
    ],
    presets: [
      {
        id: 'dividend_cash_titans',
        name: 'High Dividend Aristocrats',
        description: 'Top-tier dividend yields backed by generous free cash flow coverage',
        icon: 'Coins',
        thresholds: { fcfYield: 8.5, evEbitda: 7.0, divYield: 4.5, interestCoverage: 5.5 }
      },
      {
        id: 'capital_efficient_power',
        name: 'De-leveraged Green Transition',
        description: 'Solid interest coverage and disciplined valuation multiples',
        icon: 'SunMedium',
        thresholds: { fcfYield: 6.5, evEbitda: 8.0, divYield: 2.8, interestCoverage: 6.0 }
      }
    ]
  },

  auto: {
    industryId: 'auto',
    metrics: [
      {
        id: 'ebitdaMargin',
        label: 'EBITDA Margin',
        shortLabel: 'EBITDA %',
        unit: '%',
        description: 'EBITDA divided by Total Revenue',
        whyItMatters: 'Reflects operating leverage and ability to withstand raw material cost swings (steel, aluminum, rubber).',
        higherIsBetter: true,
        min: 6,
        max: 22,
        step: 0.5,
        defaultThreshold: 13.0,
        benchmarkMedian: 11.5
      },
      {
        id: 'assetTurnover',
        label: 'Fixed Asset Turnover Ratio',
        shortLabel: 'Asset Turn',
        unit: 'x',
        description: 'Revenue divided by Net Fixed Assets',
        whyItMatters: 'Shows how efficiently manufacturing plant and assembly line capex generates sales.',
        higherIsBetter: true,
        min: 1.0,
        max: 5.0,
        step: 0.1,
        defaultThreshold: 2.2,
        benchmarkMedian: 1.9
      },
      {
        id: 'roce',
        label: 'ROCE',
        shortLabel: 'ROCE',
        unit: '%',
        description: 'Return on Capital Employed',
        whyItMatters: 'Distinguishes cyclical value-destroyers from high-tier automakers who earn well above cost of capital.',
        higherIsBetter: true,
        min: 8,
        max: 32,
        step: 1,
        defaultThreshold: 16,
        benchmarkMedian: 13
      },
      {
        id: 'debtEquity',
        label: 'Debt to Equity Ratio',
        shortLabel: 'D/E',
        unit: 'ratio',
        description: 'Total Debt divided by Shareholders Equity',
        whyItMatters: 'Cyclical downturns punish over-leveraged auto firms; low D/E ensures survival through industry troughs.',
        higherIsBetter: false,
        min: 0.0,
        max: 1.5,
        step: 0.05,
        defaultThreshold: 0.5,
        benchmarkMedian: 0.6
      }
    ],
    presets: [
      {
        id: 'ev_leaders',
        name: 'High-Efficiency Auto Titans',
        description: 'High asset turnover with double-digit margins and minimal leverage',
        icon: 'Zap',
        thresholds: { ebitdaMargin: 14.5, assetTurnover: 2.5, roce: 18, debtEquity: 0.3 }
      },
      {
        id: 'cyclical_value',
        name: 'Resilient Industrials',
        description: 'Safe balance sheet with solid interest safety through cycles',
        icon: 'Wrench',
        thresholds: { ebitdaMargin: 11.0, assetTurnover: 2.0, roce: 14, debtEquity: 0.5 }
      }
    ]
  }
};
