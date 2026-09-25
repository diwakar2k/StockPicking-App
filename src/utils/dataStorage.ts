import { Stock, Market, IndustryId } from '../types';
import { STOCKS_DATA } from '../data/stocksData';

const STORAGE_KEY = 'alpha_selector_stocks_v1';
const LAST_SYNC_KEY = 'alpha_selector_last_sync';

export interface DataHistoryInfo {
  metricHorizon: string;
  sourceType: string;
  rebalanceFrequency: string;
  cycleSmoothing: string;
}

export const DATA_HISTORY_METHODOLOGY: DataHistoryInfo = {
  metricHorizon: 'Trailing 12 Months (TTM) + 3-Year Multi-Cycle Median',
  sourceType: 'Audited Annual / Quarterly Filings (BSE/NSE MCA filings)',
  rebalanceFrequency: 'Quarterly post-earnings announcement season (Q1, Q2, Q3, Q4)',
  cycleSmoothing: '5-Year Normalized Free Cash Flow and ROE to eliminate one-off windfall distortions'
};

/**
 * Loads stocks from localStorage or returns default seed data.
 */
export function loadStocks(): Stock[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stocks from localStorage, using defaults', err);
  }
  return STOCKS_DATA;
}

/**
 * Persists stock universe into localStorage.
 */
export function saveStocks(stocks: Stock[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  } catch (err) {
    console.error('Failed to save stocks to localStorage', err);
  }
}

/**
 * Retrieves the timestamp of the last data update.
 */
export function getLastSyncTime(): string {
  return localStorage.getItem(LAST_SYNC_KEY) || 'Current TTM Results';
}

/**
 * Sets the last sync timestamp.
 */
export function setLastSyncTime(timeStr: string): void {
  localStorage.setItem(LAST_SYNC_KEY, timeStr);
}

/**
 * Resets local database back to default seed data.
 */
export function resetStocksToDefault(): Stock[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  } catch (err) {}
  return STOCKS_DATA;
}
