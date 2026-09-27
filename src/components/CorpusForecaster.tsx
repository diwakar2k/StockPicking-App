/**
 * @file CorpusForecaster.tsx
 * @description Wealth compounding simulator and corpus forecasting dashboard for AlphaSelector India.
 * Simulates portfolio growth over 1 to 30 years using monthly compounding, SIP inflows, annual salary
 * step-ups, inflation purchasing power deflation, bear/bull sensitivity spreads, and milestone tracking.
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Download, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line 
} from 'recharts';
import { ForecastInput } from '../types';
import { calculateForecast, formatCurrency } from '../utils/calculator';

/**
 * Properties for the CorpusForecaster component.
 */
interface CorpusForecasterProps {
  /** Baseline expected return percentage computed from the weighted portfolio basket */
  defaultCAGR: number;
}

/**
 * CorpusForecaster provides an interactive compounding simulator with dynamic controls,
 * Recharts visualization, sensitivity matrices, milestone tracking, and CSV cashflow export.
 */
export const CorpusForecaster: React.FC<CorpusForecasterProps> = ({
  defaultCAGR
}) => {
  // Initial default states calibrated for Indian financial planning
  const [lumpsum, setLumpsum] = useState<number>(100000);
  const [monthlySip, setMonthlySip] = useState<number>(15000);
  const [annualStepUpPct, setAnnualStepUpPct] = useState<number>(10);
  const [years, setYears] = useState<number>(10);
  const [expectedReturnPct, setExpectedReturnPct] = useState<number>(defaultCAGR > 0 ? Number(defaultCAGR.toFixed(1)) : 14.5);
  const [inflationPct, setInflationPct] = useState<number>(6.0);
  const [adjustForInflation, setAdjustForInflation] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Compute multi-year forecast input configuration
  const forecastInput: ForecastInput = useMemo(() => ({
    lumpsum,
    monthlySip,
    annualStepUpPct,
    years,
    expectedReturnPct,
    inflationPct,
    adjustForInflation
  }), [lumpsum, monthlySip, annualStepUpPct, years, expectedReturnPct, inflationPct, adjustForInflation]);

  // Execute mathematical compounding simulation
  const summary = useMemo(() => {
    return calculateForecast(forecastInput, 'IN');
  }, [forecastInput]);

  // Transform yearly cashflows into chart-compatible data objects
  const chartData = useMemo(() => {
    return summary.yearlyData.map((d) => ({
      year: `Year ${d.year}`,
      invested: d.investedCapital,
      gain: Math.max(0, d.nominalCorpus - d.investedCapital),
      nominal: d.nominalCorpus,
      real: d.realCorpus,
      bear: d.bearCaseCorpus,
      bull: d.bullCaseCorpus
    }));
  }, [summary]);

  // Quick preset shortcuts for Indian Rupee amounts (₹)
  const quickLumpsumOptions = [0, 50000, 100000, 500000, 1000000];
  const quickSipOptions = [5000, 10000, 15000, 25000, 50000];

  /**
   * Generates and downloads a CSV export containing the full year-by-year cashflow schedule.
   */
  const handleExportCSV = () => {
    const headers = ['Year', 'Total Invested (INR)', 'Nominal Corpus (INR)', 'Real (Inflation Adjusted INR)', 'Annual Inflow (INR)', 'Annual Growth Gain (INR)'];
    const rows = summary.yearlyData.map(d => [
      d.year,
      d.investedCapital,
      d.nominalCorpus,
      d.realCorpus,
      d.annualInflow,
      d.annualGain
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `corpus_forecast_${years}years_INR.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Hero Title */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Compound Wealth Projection Simulator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Corpus Size & Cash Flow Forecasting
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Simulate the compounding power of your chosen portfolio basket over 1 to 30 years. Factor in 
          <strong className="text-emerald-400"> initial lumpsum inflows</strong>, 
          <strong className="text-emerald-400"> recurring monthly SIPs</strong>, 
          <strong className="text-cyan-400"> annual salary step-ups</strong>, and 
          <strong className="text-amber-400"> inflation purchasing power deflation</strong>.
        </p>
      </div>

      {/* Main Grid: Inputs on Left, Output & Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center justify-between">
              <span>Investment Inflows</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                Live Dynamic
              </span>
            </h3>

            {/* Initial Lumpsum */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Initial Lumpsum Capital</label>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {formatCurrency(lumpsum, 'IN', false)}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="5000"
                value={lumpsum}
                onChange={(e) => setLumpsum(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500/60"
              />
              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickLumpsumOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setLumpsum(opt)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors cursor-pointer ${
                      lumpsum === opt
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {formatCurrency(opt, 'IN', true)}
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly SIP */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Monthly SIP Contribution</label>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {formatCurrency(monthlySip, 'IN', false)} / mo
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="1000"
                value={monthlySip}
                onChange={(e) => setMonthlySip(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500/60"
              />
              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickSipOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setMonthlySip(opt)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors cursor-pointer ${
                      monthlySip === opt
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {formatCurrency(opt, 'IN', true)}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Step-Up % */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <label className="text-xs font-semibold text-slate-300">Annual SIP Step-Up</label>
                  <span className="text-[10px] text-slate-500">(Salary increase)</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  +{annualStepUpPct}% / yr
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={annualStepUpPct}
                onChange={(e) => setAnnualStepUpPct(parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Fixed SIP)</span>
                <span>10% (Typical Hike)</span>
                <span>25% (Aggressive)</span>
              </div>
            </div>

            {/* Investment Horizon */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Investment Horizon</label>
                <span className="text-xs font-mono font-bold text-white">
                  {years} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value) || 1)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Year</span>
                <span>10 Years</span>
                <span>20 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Expected CAGR Return */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Expected Annual CAGR</label>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{expectedReturnPct}% p.a.
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="28"
                step="0.5"
                value={expectedReturnPct}
                onChange={(e) => setExpectedReturnPct(parseFloat(e.target.value) || 6)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              {defaultCAGR > 0 && (
                <button
                  onClick={() => setExpectedReturnPct(Number(defaultCAGR.toFixed(1)))}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center space-x-1 cursor-pointer"
                >
                  <span>Sync with Basket Weighted CAGR (+{defaultCAGR.toFixed(1)}%)</span>
                </button>
              )}
            </div>

            {/* Inflation Deflator */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Expected Annual Inflation</label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {inflationPct}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={inflationPct}
                onChange={(e) => setInflationPct(parseFloat(e.target.value) || 1)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adjustForInflation}
                  onChange={(e) => setAdjustForInflation(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-xs text-slate-300">
                  Deflate projection to Real Purchasing Power
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Results (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-lg shadow-emerald-950/20">
              <span className="text-[11px] text-slate-400 block">Projected Corpus</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono block">
                {formatCurrency(adjustForInflation ? summary.finalRealCorpus : summary.finalNominalCorpus, 'IN', true)}
              </span>
              <span className="text-[10px] text-slate-400">
                {adjustForInflation ? 'Real Value (Deflated)' : 'Nominal Value'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Invested Capital</span>
              <span className="text-lg sm:text-xl font-extrabold text-white font-mono block">
                {formatCurrency(summary.totalInvested, 'IN', true)}
              </span>
              <span className="text-[10px] text-slate-500">Lumpsum + SIPs</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Gains</span>
              <span className="text-lg sm:text-xl font-bold text-cyan-400 font-mono block">
                +{formatCurrency(summary.totalGain, 'IN', true)}
              </span>
              <span className="text-[10px] text-slate-500">Pure compounding</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Wealth Multiplier</span>
              <span className="text-lg sm:text-xl font-black text-amber-400 font-mono block">
                {summary.wealthMultiplier}x
              </span>
              <span className="text-[10px] text-slate-500">Times capital</span>
            </div>
          </div>

          {/* Interactive Recharts Projection Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                  <span>Growth Trajectory Over {years} Years</span>
                </h4>
                <p className="text-xs text-slate-400">Visualizing invested capital vs pure wealth creation</p>
              </div>

              {/* Legend Badges */}
              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                  <span className="text-slate-300">Wealth Gain</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-600"></span>
                  <span className="text-slate-300">Invested Capital</span>
                </div>
              </div>
            </div>

            {/* Recharts Area Container */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#475569" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1e293b" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 10 }} 
                    tickFormatter={(val) => formatCurrency(val, 'IN', true)}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val), 'IN', false), '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="invested"
                    stackId="1"
                    stroke="#64748b"
                    fill="url(#colorInvested)"
                    name="Invested Capital"
                  />
                  <Area
                    type="monotone"
                    dataKey="gain"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#colorGain)"
                    name="Compounded Gain"
                  />
                  {adjustForInflation && (
                    <Line
                      type="monotone"
                      dataKey="real"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      dot={false}
                      name="Real Purchasing Power"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Sensitivity Matrix (Bear vs Base vs Bull) */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span>CAGR Scenario Sensitivity Analysis</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold flex items-center space-x-1">
                    <span>🐻 Bear Case</span>
                  </span>
                  <span className="font-mono text-slate-400 font-bold">
                    +{Math.max(2, expectedReturnPct - 4)}%
                  </span>
                </div>
                <span className="text-base font-bold text-slate-200 font-mono block">
                  {formatCurrency(summary.bearCorpus, 'IN', true)}
                </span>
                <span className="text-[10px] text-slate-500 block">Conservative returns</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                    <span>⚖️ Base Case</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    +{expectedReturnPct}%
                  </span>
                </div>
                <span className="text-base font-extrabold text-emerald-400 font-mono block">
                  {formatCurrency(summary.finalNominalCorpus, 'IN', true)}
                </span>
                <span className="text-[10px] text-slate-400 block">Target portfolio CAGR</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-semibold flex items-center space-x-1">
                    <span>🐂 Bull Case</span>
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">
                    +{expectedReturnPct + 4}%
                  </span>
                </div>
                <span className="text-base font-bold text-cyan-400 font-mono block">
                  {formatCurrency(summary.bullCorpus, 'IN', true)}
                </span>
                <span className="text-[10px] text-slate-500 block">Outperformance scenario</span>
              </div>
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Milestone Achievement Tracker</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {summary.milestones.map((m) => (
                <div
                  key={m.target}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    m.yearReached !== null
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold font-mono block">{m.label}</span>
                    <span className="text-[10px] text-slate-400">
                      {m.yearReached ? `Year ${m.yearReached}` : `Beyond Yr ${years}`}
                    </span>
                  </div>
                  {m.yearReached ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Table Toggle & CSV Export Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setShowTable(!showTable)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              {showTable ? 'Hide Year-by-Year Table' : 'Show Year-by-Year Cashflows'}
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Year-by-Year Breakdown Table */}
          {showTable && (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Year</th>
                    <th className="p-3">Annual Inflow</th>
                    <th className="p-3">Total Invested</th>
                    <th className="p-3">Annual Compounded Gain</th>
                    <th className="p-3 text-right">Ending Corpus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {summary.yearlyData.map((d) => (
                    <tr key={d.year} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">Year {d.year}</td>
                      <td className="p-3">{formatCurrency(d.annualInflow, 'IN', true)}</td>
                      <td className="p-3 text-slate-400">{formatCurrency(d.investedCapital, 'IN', true)}</td>
                      <td className="p-3 text-cyan-400">+{formatCurrency(d.annualGain, 'IN', true)}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        {formatCurrency(adjustForInflation ? d.realCorpus : d.nominalCorpus, 'IN', true)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
