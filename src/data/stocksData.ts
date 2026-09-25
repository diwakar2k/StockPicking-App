import { Stock } from '../types';

export const STOCKS_DATA: Stock[] = [
  // ==========================================
  // INDIAN EQUITIES ONLY (NSE / BSE in ₹)
  // ==========================================

  // --- 1. TECHNOLOGY & SAAS (INDIA) ---
  {
    ticker: 'TCS.NS',
    name: 'Tata Consultancy Services',
    market: 'IN',
    industry: 'tech',
    price: 4210.50,
    change24h: 0.85,
    marketCap: 1520000, // Cr
    peRatio: 30.5,
    dividendYield: 1.85,
    expectedCAGR: 13.5,
    description: 'India largest IT services conglomerate with industry-leading operating margins, multi-billion dollar digital transformation contracts, and sterling shareholder capital return.',
    metrics: {
      ruleOf40: 36.2,
      revGrowth: 10.5,
      grossMargin: 64.0,
      evSales: 6.2,
      fcfMargin: 25.7
    }
  },
  {
    ticker: 'INFY.NS',
    name: 'Infosys Limited',
    market: 'IN',
    industry: 'tech',
    price: 1845.20,
    change24h: 1.25,
    marketCap: 765000,
    peRatio: 28.2,
    dividendYield: 2.10,
    expectedCAGR: 14.0,
    description: 'Digital transformation titan with cutting-edge Topaz generative AI capabilities, strong European order pipeline, and highly disciplined capital allocation.',
    metrics: {
      ruleOf40: 34.8,
      revGrowth: 11.2,
      grossMargin: 62.5,
      evSales: 5.1,
      fcfMargin: 23.6
    }
  },
  {
    ticker: 'PERSISTENT.NS',
    name: 'Persistent Systems',
    market: 'IN',
    industry: 'tech',
    price: 5350.00,
    change24h: 2.10,
    marketCap: 82000,
    peRatio: 46.5,
    dividendYield: 0.80,
    expectedCAGR: 19.5,
    description: 'Mid-cap hypergrowth leader focused on software engineering, cloud modernization, and healthcare AI solutions with 20%+ compounding trajectory.',
    metrics: {
      ruleOf40: 42.5,
      revGrowth: 23.5,
      grossMargin: 68.0,
      evSales: 7.8,
      fcfMargin: 19.0
    }
  },
  {
    ticker: 'KPITTECH.NS',
    name: 'KPIT Technologies',
    market: 'IN',
    industry: 'tech',
    price: 1720.00,
    change24h: -0.45,
    marketCap: 47000,
    peRatio: 52.0,
    dividendYield: 0.45,
    expectedCAGR: 21.0,
    description: 'Global pure-play software integrator for autonomous driving, EV battery management systems, and connected vehicle software architecture.',
    metrics: {
      ruleOf40: 47.0,
      revGrowth: 29.0,
      grossMargin: 71.5,
      evSales: 9.4,
      fcfMargin: 18.0
    }
  },
  {
    ticker: 'TATAELXSI.NS',
    name: 'Tata Elxsi Ltd',
    market: 'IN',
    industry: 'tech',
    price: 7150.00,
    change24h: 1.15,
    marketCap: 44500,
    peRatio: 55.0,
    dividendYield: 0.95,
    expectedCAGR: 18.0,
    description: 'Premium engineering design and technology provider specializing in automotive software, medical device electronics, and broadcast OTT media.',
    metrics: {
      ruleOf40: 44.0,
      revGrowth: 18.5,
      grossMargin: 69.0,
      evSales: 8.5,
      fcfMargin: 25.5
    }
  },
  {
    ticker: 'COFORGE.NS',
    name: 'Coforge Limited',
    market: 'IN',
    industry: 'tech',
    price: 6840.00,
    change24h: 1.80,
    marketCap: 42800,
    peRatio: 41.5,
    dividendYield: 1.10,
    expectedCAGR: 18.5,
    description: 'Fast-growing digital and cloud engineering firm with dominance in travel, insurance, and banking verticals with sustained large-deal momentum.',
    metrics: {
      ruleOf40: 39.5,
      revGrowth: 21.0,
      grossMargin: 66.0,
      evSales: 6.8,
      fcfMargin: 18.5
    }
  },

  // --- 2. BANKING & BFSI (INDIA) ---
  {
    ticker: 'HDFCBANK.NS',
    name: 'HDFC Bank Ltd',
    market: 'IN',
    industry: 'banking',
    price: 1680.00,
    change24h: 0.65,
    marketCap: 1280000,
    peRatio: 18.5,
    dividendYield: 1.15,
    expectedCAGR: 15.0,
    description: 'India largest private sector lender with unmatched nationwide branch distribution, premier underwriting credit quality, and expanding NIM spreads post-merger.',
    metrics: {
      nim: 3.65,
      netNpa: 0.38,
      roa: 1.95,
      car: 18.8,
      pbRatio: 2.70
    }
  },
  {
    ticker: 'ICICIBANK.NS',
    name: 'ICICI Bank Ltd',
    market: 'IN',
    industry: 'banking',
    price: 1245.00,
    change24h: 1.10,
    marketCap: 875000,
    peRatio: 17.8,
    dividendYield: 0.90,
    expectedCAGR: 16.5,
    description: 'Leader in digital banking ecosystem with iMobile, pristine asset quality with sub-0.5% NPAs, and highest return ratios (ROA > 2.3%) in large-cap banking.',
    metrics: {
      nim: 4.35,
      netNpa: 0.42,
      roa: 2.30,
      car: 16.9,
      pbRatio: 2.85
    }
  },
  {
    ticker: 'KOTAKBANK.NS',
    name: 'Kotak Mahindra Bank',
    market: 'IN',
    industry: 'banking',
    price: 1810.00,
    change24h: -0.20,
    marketCap: 360000,
    peRatio: 21.0,
    dividendYield: 0.40,
    expectedCAGR: 14.5,
    description: 'Fortress balance sheet powerhouse with high CASA ratio, conservative lending culture, and industry-leading capital adequacy cushion (CAR > 20%).',
    metrics: {
      nim: 5.10,
      netNpa: 0.34,
      roa: 2.45,
      car: 20.5,
      pbRatio: 2.60
    }
  },
  {
    ticker: 'SBIN.NS',
    name: 'State Bank of India',
    market: 'IN',
    industry: 'banking',
    price: 810.00,
    change24h: 1.40,
    marketCap: 722000,
    peRatio: 10.8,
    dividendYield: 1.70,
    expectedCAGR: 13.5,
    description: 'India largest public lender, key driver of infrastructure credit expansion, multi-year low credit costs, and deeply attractive P/B valuation.',
    metrics: {
      nim: 3.25,
      netNpa: 0.57,
      roa: 1.05,
      car: 14.2,
      pbRatio: 1.45
    }
  },
  {
    ticker: 'AXISBANK.NS',
    name: 'Axis Bank Ltd',
    market: 'IN',
    industry: 'banking',
    price: 1190.00,
    change24h: 0.45,
    marketCap: 368000,
    peRatio: 14.2,
    dividendYield: 0.85,
    expectedCAGR: 15.5,
    description: 'Premier retail and corporate lender successfully scaling Citibank consumer portfolio acquisition with expanding return ratios and digital market share.',
    metrics: {
      nim: 4.05,
      netNpa: 0.36,
      roa: 1.82,
      car: 16.6,
      pbRatio: 2.15
    }
  },
  {
    ticker: 'BAJFINANCE.NS',
    name: 'Bajaj Finance Ltd',
    market: 'IN',
    industry: 'banking',
    price: 7320.00,
    change24h: 1.60,
    marketCap: 452000,
    peRatio: 31.0,
    dividendYield: 0.50,
    expectedCAGR: 20.0,
    description: 'India undisputed retail consumer finance giant with omnichannel cross-sell capabilities, 25%+ AUM CAGR, and industry-leading return on equity.',
    metrics: {
      nim: 9.80,
      netNpa: 0.45,
      roa: 4.20,
      car: 22.5,
      pbRatio: 4.80
    }
  },

  // --- 3. HEALTHCARE & PHARMA (INDIA) ---
  {
    ticker: 'SUNPHARMA.NS',
    name: 'Sun Pharmaceutical Industries',
    market: 'IN',
    industry: 'healthcare',
    price: 1890.00,
    change24h: 1.30,
    marketCap: 453000,
    peRatio: 36.0,
    dividendYield: 0.85,
    expectedCAGR: 15.0,
    description: 'India premier pharmaceutical powerhouse with expanding global specialty formulations portfolio (Ilumya, Cequa, Winlevi) and robust cash generation.',
    metrics: {
      rdSpend: 7.8,
      opm: 27.5,
      roce: 18.5,
      debtEquity: 0.08
    }
  },
  {
    ticker: 'DRREDDY.NS',
    name: 'Dr. Reddy Laboratories',
    market: 'IN',
    industry: 'healthcare',
    price: 6650.00,
    change24h: -0.50,
    marketCap: 111000,
    peRatio: 20.5,
    dividendYield: 0.70,
    expectedCAGR: 13.0,
    description: 'Leading generic innovator with strong US biosimilar pipeline, expanding footprint in China & Europe, and zero-debt net cash balance sheet.',
    metrics: {
      rdSpend: 9.2,
      opm: 25.8,
      roce: 22.0,
      debtEquity: 0.05
    }
  },
  {
    ticker: 'DIVISLAB.NS',
    name: 'Divis Laboratories',
    market: 'IN',
    industry: 'healthcare',
    price: 5420.00,
    change24h: 2.25,
    marketCap: 144000,
    peRatio: 64.0,
    dividendYield: 0.60,
    expectedCAGR: 17.5,
    description: 'Global API & custom synthesis leader with world-scale manufacturing capabilities, proprietary green chemistry, and client retention.',
    metrics: {
      rdSpend: 5.5,
      opm: 31.2,
      roce: 19.8,
      debtEquity: 0.01
    }
  },
  {
    ticker: 'CIPLA.NS',
    name: 'Cipla Limited',
    market: 'IN',
    industry: 'healthcare',
    price: 1560.00,
    change24h: 0.70,
    marketCap: 126000,
    peRatio: 26.5,
    dividendYield: 0.85,
    expectedCAGR: 14.0,
    description: 'Dominant respiratory medicine leader with entrenched domestic branded business, expanding inhaler market share in the US, and low leverage.',
    metrics: {
      rdSpend: 6.8,
      opm: 24.5,
      roce: 20.5,
      debtEquity: 0.04
    }
  },
  {
    ticker: 'TORNTPHARM.NS',
    name: 'Torrent Pharmaceuticals',
    market: 'IN',
    industry: 'healthcare',
    price: 3280.00,
    change24h: 1.10,
    marketCap: 111000,
    peRatio: 48.0,
    dividendYield: 0.90,
    expectedCAGR: 16.0,
    description: 'High-margin chronic therapy specialist (cardiovascular and CNS formulations) with exceptional free cash flow generation and successful M&A integration.',
    metrics: {
      rdSpend: 5.2,
      opm: 31.5,
      roce: 21.5,
      debtEquity: 0.35
    }
  },

  // --- 4. FMCG & CONSUMER GOODS (INDIA) ---
  {
    ticker: 'HINDUNILVR.NS',
    name: 'Hindustan Unilever Ltd',
    market: 'IN',
    industry: 'fmcg',
    price: 2740.00,
    change24h: 0.40,
    marketCap: 643000,
    peRatio: 58.0,
    dividendYield: 1.55,
    expectedCAGR: 11.5,
    description: 'Dominant consumer franchise reaching 9 out of 10 Indian households, legendary rural distribution network, and near-zero working capital footprint.',
    metrics: {
      roce: 32.5,
      ccc: -18,
      opm: 23.8,
      fcfConversion: 96.0
    }
  },
  {
    ticker: 'ITC.NS',
    name: 'ITC Limited',
    market: 'IN',
    industry: 'fmcg',
    price: 505.00,
    change24h: 0.75,
    marketCap: 630000,
    peRatio: 28.5,
    dividendYield: 2.85,
    expectedCAGR: 13.5,
    description: 'Cash-generating juggernaut with market leadership in cigarettes, rapid scaling in FMCG packaged foods, paperboards, and hotel demerger upside.',
    metrics: {
      roce: 39.0,
      ccc: 32,
      opm: 36.5,
      fcfConversion: 98.0
    }
  },
  {
    ticker: 'NESTLEIND.NS',
    name: 'Nestle India Ltd',
    market: 'IN',
    industry: 'fmcg',
    price: 2650.00,
    change24h: -0.15,
    marketCap: 255000,
    peRatio: 72.0,
    dividendYield: 1.20,
    expectedCAGR: 12.0,
    description: 'Unassailable moats in infant nutrition and packaged noodles (Maggi), with unmatched return on capital exceeding 60% on operational equity.',
    metrics: {
      roce: 64.0,
      ccc: -28,
      opm: 24.2,
      fcfConversion: 92.5
    }
  },
  {
    ticker: 'TITAN.NS',
    name: 'Titan Company Ltd',
    market: 'IN',
    industry: 'fmcg',
    price: 3540.00,
    change24h: 1.50,
    marketCap: 314000,
    peRatio: 82.0,
    dividendYield: 0.35,
    expectedCAGR: 17.5,
    description: 'Tata Group crown jewel dominating the formalization of Indian wedding jewelry (Tanishq), luxury watches, and eyewear with 20%+ compounding.',
    metrics: {
      roce: 26.5,
      ccc: 68,
      opm: 11.2,
      fcfConversion: 88.0
    }
  },
  {
    ticker: 'VBL.NS',
    name: 'Varun Beverages Ltd',
    market: 'IN',
    industry: 'fmcg',
    price: 1540.00,
    change24h: 2.30,
    marketCap: 200000,
    peRatio: 68.0,
    dividendYield: 0.30,
    expectedCAGR: 21.0,
    description: 'One of the largest PepsiCo bottling franchisees in the world, expanding aggressively in energy drinks (Sting) and African geographies.',
    metrics: {
      roce: 28.0,
      ccc: 12,
      opm: 22.8,
      fcfConversion: 94.0
    }
  },

  // --- 5. ENERGY & UTILITIES (INDIA) ---
  {
    ticker: 'RELIANCE.NS',
    name: 'Reliance Industries Ltd',
    market: 'IN',
    industry: 'energy',
    price: 2980.00,
    change24h: 0.90,
    marketCap: 2015000,
    peRatio: 26.5,
    dividendYield: 0.40,
    expectedCAGR: 15.0,
    description: 'Conglomerate behemoth combining world-scale petrochemical refining with consumer telecommunications (Jio) and gigawatt green energy solar initiatives.',
    metrics: {
      fcfYield: 5.8,
      evEbitda: 11.2,
      divYield: 0.45,
      interestCoverage: 8.5
    }
  },
  {
    ticker: 'NTPC.NS',
    name: 'NTPC Limited',
    market: 'IN',
    industry: 'energy',
    price: 415.00,
    change24h: 1.65,
    marketCap: 402000,
    peRatio: 17.5,
    dividendYield: 2.10,
    expectedCAGR: 14.5,
    description: 'India largest power utility delivering guaranteed 15.5% regulated ROE on thermal fleet while scaling 60GW of renewable capacity by 2032.',
    metrics: {
      fcfYield: 7.4,
      evEbitda: 8.4,
      divYield: 2.20,
      interestCoverage: 4.8
    }
  },
  {
    ticker: 'POWERGRID.NS',
    name: 'Power Grid Corporation',
    market: 'IN',
    industry: 'energy',
    price: 345.00,
    change24h: 0.35,
    marketCap: 320000,
    peRatio: 18.2,
    dividendYield: 3.65,
    expectedCAGR: 12.5,
    description: 'Monopoly interstate transmission operator with 99.8% grid availability, assured cost-plus return framework, and consistent high dividend yields.',
    metrics: {
      fcfYield: 9.8,
      evEbitda: 7.2,
      divYield: 3.80,
      interestCoverage: 6.2
    }
  },
  {
    ticker: 'TATAPOWER.NS',
    name: 'Tata Power Co. Ltd',
    market: 'IN',
    industry: 'energy',
    price: 440.00,
    change24h: 1.95,
    marketCap: 140000,
    peRatio: 34.0,
    dividendYield: 0.50,
    expectedCAGR: 16.5,
    description: 'Integrated power pioneer with aggressive green transition across solar rooftop EPC, EV charging networks, and utility-scale pumped hydro storage.',
    metrics: {
      fcfYield: 6.2,
      evEbitda: 9.8,
      divYield: 0.60,
      interestCoverage: 4.1
    }
  },
  {
    ticker: 'COALINDIA.NS',
    name: 'Coal India Ltd',
    market: 'IN',
    industry: 'energy',
    price: 495.00,
    change24h: 0.40,
    marketCap: 305000,
    peRatio: 8.5,
    dividendYield: 5.25,
    expectedCAGR: 12.0,
    description: 'World largest coal producer with quasi-monopoly status in India, robust operating cash flows, zero net debt, and extraordinary dividend payouts.',
    metrics: {
      fcfYield: 14.5,
      evEbitda: 4.8,
      divYield: 5.50,
      interestCoverage: 28.0
    }
  },

  // --- 6. AUTO & MANUFACTURING (INDIA) ---
  {
    ticker: 'TATAMOTORS.NS',
    name: 'Tata Motors Ltd',
    market: 'IN',
    industry: 'auto',
    price: 980.00,
    change24h: 2.40,
    marketCap: 360000,
    peRatio: 12.5,
    dividendYield: 0.65,
    expectedCAGR: 17.0,
    description: 'Global automotive manufacturer with Jaguar Land Rover luxury turnaround, EV passenger car market dominance in India, and balance sheet de-leveraging.',
    metrics: {
      ebitdaMargin: 14.8,
      assetTurnover: 2.45,
      roce: 21.0,
      debtEquity: 0.42
    }
  },
  {
    ticker: 'M&M.NS',
    name: 'Mahindra & Mahindra Ltd',
    market: 'IN',
    industry: 'auto',
    price: 3120.00,
    change24h: 1.80,
    marketCap: 387000,
    peRatio: 26.5,
    dividendYield: 0.75,
    expectedCAGR: 16.0,
    description: 'Uncontested leader in Indian rugged SUVs (Thar, Scorpio-N, XUV700) and global farm tractor equipment with expanding operating margins.',
    metrics: {
      ebitdaMargin: 15.6,
      assetTurnover: 2.85,
      roce: 24.5,
      debtEquity: 0.18
    }
  },
  {
    ticker: 'MARUTI.NS',
    name: 'Maruti Suzuki India',
    market: 'IN',
    industry: 'auto',
    price: 12400.00,
    change24h: 0.50,
    marketCap: 390000,
    peRatio: 27.0,
    dividendYield: 1.05,
    expectedCAGR: 13.0,
    description: 'Dominant passenger vehicle manufacturer with over 41% domestic market share, extensive rural dealer network, and massive net cash reserves.',
    metrics: {
      ebitdaMargin: 12.8,
      assetTurnover: 3.10,
      roce: 20.2,
      debtEquity: 0.02
    }
  },
  {
    ticker: 'BAJAJ-AUTO.NS',
    name: 'Bajaj Auto Ltd',
    market: 'IN',
    industry: 'auto',
    price: 9850.00,
    change24h: 0.90,
    marketCap: 275000,
    peRatio: 34.0,
    dividendYield: 0.80,
    expectedCAGR: 15.5,
    description: 'Premier two-wheeler and three-wheeler exporter with Triumph premium motorcycle alliance and highest operating margin in the 2-wheeler space.',
    metrics: {
      ebitdaMargin: 19.8,
      assetTurnover: 3.40,
      roce: 31.0,
      debtEquity: 0.01
    }
  },
  {
    ticker: 'BEL.NS',
    name: 'Bharat Electronics Ltd',
    market: 'IN',
    industry: 'auto',
    price: 295.00,
    change24h: 2.10,
    marketCap: 215000,
    peRatio: 45.0,
    dividendYield: 0.70,
    expectedCAGR: 19.0,
    description: 'Defence electronics titan with near-monopoly in radar, sonar, electronic warfare systems, and avionics benefiting from Indian defence indigenization.',
    metrics: {
      ebitdaMargin: 23.5,
      assetTurnover: 2.20,
      roce: 28.5,
      debtEquity: 0.01
    }
  },
  {
    ticker: 'LT.NS',
    name: 'Larsen & Toubro Ltd',
    market: 'IN',
    industry: 'auto',
    price: 3620.00,
    change24h: 1.05,
    marketCap: 497000,
    peRatio: 33.5,
    dividendYield: 0.85,
    expectedCAGR: 15.5,
    description: 'India premier infrastructure engineering conglomerate with record multi-trillion rupee order book across domestic mega-projects and Middle East energy capex.',
    metrics: {
      ebitdaMargin: 11.5,
      assetTurnover: 1.95,
      roce: 17.5,
      debtEquity: 0.58
    }
  }
];
