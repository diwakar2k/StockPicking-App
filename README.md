# AlphaSelector India (StockPicking App)

> **Created & Maintained by [Diwakar Sharma](https://github.com/diwakar2k)**  
> GitHub Profile: [@diwakar2k](https://github.com/diwakar2k) | Repository: [StockPicking-App](https://github.com/diwakar2k/StockPicking-App)

An institutional-grade, industry-adaptive stock screener and compounding wealth forecasting application built specifically for the **Indian Stock Market (NSE / BSE in ₹)**.

## Key Features

1. **Industry-Specific Evaluation Matrix**:
   - **Technology & SaaS**: Rule of 40 (Growth + FCF Margin), YoY Revenue Growth, Gross Margin, EV/Sales, FCF Margin.
   - **Banking & BFSI**: Net Interest Margin (NIM), Net NPA (credit quality), Return on Assets (ROA), Capital Adequacy Ratio (CAR), Price-to-Book (P/B).
   - **Healthcare & Pharma**: R&D as % of Sales, Operating Profit Margin (OPM), ROCE, Debt-to-Equity.
   - **FMCG & Consumer Goods**: ROCE, Cash Conversion Cycle (CCC in days), Operating Margin, FCF Conversion %.
   - **Energy & Utilities**: Free Cash Flow Yield, EV/EBITDA, Dividend Yield, Interest Coverage Ratio.
   - **Auto & Manufacturing**: Fixed Asset Turnover, EBITDA Margin, ROCE, Debt-to-Equity.

2. **Investment Basket Synthesizer**:
   - Pick candidate stocks across multiple industries.
   - Set custom percentage allocations or use 1-click **Equal Weight**.
   - Automatically computes weighted portfolio expected CAGR, dividend yield, and blended P/E.

3. **Corpus Size Forecasting Simulator (SIP & Lumpsum)**:
   - Initial Lumpsum Capital (₹).
   - Monthly SIP Inflow (₹).
   - Annual Salary Step-Up % (compounding SIP increase).
   - Inflation Deflator toggle (Nominal Corpus vs Real Purchasing Power).
   - Bear / Base / Bull scenario sensitivity matrix.
   - Milestone tracker (₹10L, ₹25L, ₹50L, ₹1 Cr, ₹2.5 Cr, ₹5 Cr).
   - Interactive Recharts area visualization and CSV cashflow export.

4. **Zero-Cost Client-Side Architecture**:
   - Runs locally in the browser with zero subscription or hosting fees.
   - Persistent `localStorage` database.
   - Built-in Quarterly Results Editor & 1-Click Live Price Sync.

---

## Project Structure & Architecture

```
StockPicking App/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD: automated build and deploy to GitHub Pages
├── public/                         # Static assets (favicons, SVG icons)
├── src/
│   ├── assets/                     # Media and vector assets
│   ├── components/
│   │   ├── AccessGate.tsx          # Private evaluation gatekeeper (link-only auth)
│   │   ├── CorpusForecaster.tsx    # Multi-year compounding simulation & Recharts visualization
│   │   ├── CriteriaConfigurator.tsx# Dynamic sector sliders & 1-click strategy presets
│   │   ├── DataUpdateModal.tsx     # Quarterly results editor & local sync management
│   │   ├── Header.tsx              # Top navigation & quick workflow steps
│   │   ├── IndustrySelector.tsx    # Sector activation cards & universe counts
│   │   ├── PortfolioBasket.tsx     # Investment basket synthesizer & weighted fundamentals
│   │   ├── ShareModal.tsx          # Auto-unlock share link generator & copy dialog
│   │   ├── StockDetailModal.tsx    # In-depth fundamental diagnostics & pass/fail analysis
│   │   └── StockScreener.tsx       # Real-time multi-criteria screening table
│   ├── data/
│   │   ├── industryCriteria.ts     # Sector metric definitions, benchmarks, and strategy presets
│   │   └── stocksData.ts           # Curated seed universe of Indian blue-chip & growth equities
│   ├── types/
│   │   └── index.ts                # TypeScript domain models and interface contracts
│   ├── utils/
│   │   ├── calculator.ts           # Financial scoring algorithms & compounding mathematics
│   │   └── dataStorage.ts          # LocalStorage persistence & accounting governance standards
│   ├── App.tsx                     # Application root orchestrator and state coordinator
│   ├── index.css                   # Tailwind CSS v4 styling rules
│   └── main.tsx                    # React 19 bootstrap entry point
├── deploy-with-email.ps1           # 1-click Surge deployment script
├── push-to-github.ps1              # Automated git version control & GitHub push script
├── vite.config.ts                  # Vite build configuration with relative base paths
└── package.json                    # Project dependencies and npm lifecycle scripts
```

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production and verify type safety
npm run build

# 4. Preview the production build locally
npm run preview
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## Version Control & GitHub Integration

This project is hosted on GitHub:
- **Repository**: [https://github.com/diwakar2k/StockPicking-App](https://github.com/diwakar2k/StockPicking-App)
- **Branch**: `main`
- **CI/CD**: GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys every push to GitHub Pages automatically.

### Recommended Version Control Workflow for Future Edits

Whenever you make edits to this project:

1. **Verify Build & Type Safety**:
   ```bash
   npm run build
   ```

2. **Push Changes to GitHub**:
   Use the included automated PowerShell push script:
   ```powershell
   .\push-to-github.ps1 -CommitMessage "Describe your edits here"
   ```
   Or use standard Git commands:
   ```bash
   git add .
   git commit -m "Describe your edits here"
   git push origin main
   ```

3. **Automatic Deployment**:
   Once pushed, GitHub Actions immediately checks out the code, executes `npm ci` and `npm run build`, and publishes the latest version to GitHub Pages.

---

## Author & Maintainer

- **Author**: Diwakar Sharma
- **GitHub Profile**: [https://github.com/diwakar2k](https://github.com/diwakar2k)
- **Repository**: [https://github.com/diwakar2k/StockPicking-App](https://github.com/diwakar2k/StockPicking-App)
- **License**: MIT

