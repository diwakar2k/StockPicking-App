/**
 * @file dataStorage.ts
 * @description Local persistence layer and data governance methodology for AlphaSelector India.
 * Manages client-side storage of stock fundamentals in localStorage, tracking update timestamps,
 * and defining multi-cycle accounting normalization standards.
 */

import { Stock } from '../types';
import { STOCKS_DATA } from '../data/stocksData';

/**
 * Key utilized for persisting the stock fundamental universe in browser localStorage.
 */
const STORAGE_KEY = 'alpha_selector_stocks_v1';

/**
 * Key utilized for persisting the last synchronization timestamp in browser localStorage.
 */
const LAST_SYNC_KEY = 'alpha_selector_last_sync';

/**
 * Specification detailing the fundamental data governance and accounting treatment methodology.
 */
export interface DataHistoryInfo {
  /** Time horizon considered for fundamental financial ratios (e.g., TTM and multi-year medians) */
  metricHorizon: string;
  /** Primary source of financial data (e.g., audited regulatory filings with BSE/NSE) */
  sourceType: string;
  /** Scheduled update cadence aligned with quarterly corporate earnings season */
  rebalanceFrequency: string;
  /** Normalization techniques applied to eliminate cyclical distortions */
  cycleSmoothing: string;
}

/**
 * Institutional data methodology guidelines applied across AlphaSelector Indian equity records.
 */
export const DATA_HISTORY_METHODOLOGY: DataHistoryInfo = {
  metricHorizon: 'Trailing 12 Months (TTM) + 3-Year Multi-Cycle Median',
  sourceType: 'Audited Annual / Quarterly Filings (BSE/NSE MCA filings)',
  rebalanceFrequency: 'Quarterly post-earnings announcement season (Q1, Q2, Q3, Q4)',
  cycleSmoothing: '5-Year Normalized Free Cash Flow and ROE to eliminate one-off windfall distortions'
};

/**
 * Retrieves the current stock fundamental universe from browser localStorage.
 * Falls back to the embedded seed dataset if storage is empty, uninitialized, or corrupted.
 *
 * @returns Array of `Stock` objects representing the investable universe.
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
    console.warn('Failed to parse stocks from localStorage, falling back to seed defaults:', err);
  }
  return STOCKS_DATA;
}

/**
 * Persists the modified stock fundamental universe into browser localStorage.
 *
 * @param stocks - Updated array of `Stock` objects to store.
 */
export function saveStocks(stocks: Stock[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  } catch (err) {
    console.error('Failed to save stocks to localStorage:', err);
  }
}

/**
 * Retrieves the human-readable timestamp of the most recent data synchronization.
 *
 * @returns Timestamp string or fallback default indicator.
 */
export function getLastSyncTime(): string {
  return localStorage.getItem(LAST_SYNC_KEY) || 'Current TTM Results';
}

/**
 * Updates the recorded data synchronization timestamp in localStorage.
 *
 * @param timeStr - Formatted date/time string representing the update moment.
 */
export function setLastSyncTime(timeStr: string): void {
  localStorage.setItem(LAST_SYNC_KEY, timeStr);
}

/**
 * Clears custom modifications from browser localStorage and resets the universe
 * back to the official default seed dataset.
 *
 * @returns Default seed array of `Stock` objects.
 */
export function resetStocksToDefault(): Stock[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  } catch (err) {
    console.warn('Failed to clear localStorage keys:', err);
  }
  return STOCKS_DATA;
}
