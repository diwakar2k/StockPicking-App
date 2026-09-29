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
├── run-locally.bat                 # 1-click Windows desktop launcher (zero terminal commands)
├── vite.config.ts                  # Vite build configuration with relative base paths
└── package.json                    # Project dependencies and npm lifecycle scripts
```

---

## How to Use This App

### Option 1: Instant Online Access (No Installation Needed!)

If you just want to use the app without downloading or installing any software, it is already live on the web:

👉 **[Launch AlphaSelector India](https://diwakar2k.github.io/StockPicking-App/?access=alpha-feedback-2026)**

- Works directly in your browser on PC, Mac, iPad, iPhone, and Android.
- If prompted for an Access Key, enter: `alpha-feedback-2026`

---

### Option 2: Run on Your Computer (Step-by-Step for Non-Coders)

You can run this app entirely offline on your personal computer in just a few simple steps.

#### Method A: 1-Click Launch on Windows (Super Easy)

1. **Install Node.js (Only needed once)**:
   - Download the free recommended **LTS** installer from [nodejs.org](https://nodejs.org/).
   - Open the downloaded installer file and click **Next** through the setup prompts until finished.

2. **Download the App**:
   - Go to the GitHub repository: [https://github.com/diwakar2k/StockPicking-App](https://github.com/diwakar2k/StockPicking-App)
   - Click the green **"<> Code"** button near the top right, then click **"Download ZIP"**.
   - Right-click the downloaded `.zip` file and select **"Extract All..."** to unzip it to a folder (such as your Desktop or Documents).

3. **Double-Click to Start**:
   - Inside the extracted folder, double-click the **`run-locally.bat`** file.
   - The script will automatically download the necessary packages on first run and launch your web browser straight to the app at `http://localhost:5173/`!
   - When you are done using the app, simply close the black window.

---

#### Method B: Standard Setup (Windows, Mac, Linux)

If you prefer using the terminal or are on a Mac/Linux computer:

1. **Install Node.js**:
   - Ensure you have **Node.js** installed (version 18 or higher) from [nodejs.org](https://nodejs.org/).

2. **Get the Code**:
   - **Using Git**:
     ```bash
     git clone https://github.com/diwakar2k/StockPicking-App.git
     cd StockPicking-App
     ```
   - **Or Without Git**: Download the ZIP from GitHub, extract it, and open your Terminal / Command Prompt inside that folder.
     > *Tip on Windows:* Open the folder in File Explorer, click on the address bar at the top, type `cmd` or `powershell`, and press `Enter`.  
     > *Tip on Mac:* Open Terminal, type `cd ` (with a trailing space), drag the folder from Finder into Terminal, and press `Enter`.

3. **Install the Required Packages (One-Time Only)**:
   Type this command and press Enter:
   ```bash
   npm install
   ```
   *(This downloads the free charting libraries, React, and styles into the project).*

4. **Start the App**:
   Type this command and press Enter:
   ```bash
   npm run dev
   ```

5. **Open in Your Browser**:
   Open Chrome, Safari, Edge, or Firefox and go to:
   ```
   http://localhost:5173/
   ```

6. **How to Stop the App**:
   When you want to stop the local server, click on your terminal window and press `Ctrl + C` (or `Cmd + C` on Mac).

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

