# AlphaSelector India (StockPicking App)

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

## Running Locally

```bash
# Navigate to the folder
cd "C:\Users\diwak\StockPicking App"

# Start the development server
npm run dev

# Or run the production preview server
npm run preview
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.
