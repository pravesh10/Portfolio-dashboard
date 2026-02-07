import { YahooQuote } from './yahooFinance';

/**
 * Mock stock data for demonstration when Yahoo Finance API is unavailable
 * This provides realistic prices to show the dashboard functionality
 */
export const mockStockData: Map<string, YahooQuote> = new Map([
  ['INFY.NS', {
    symbol: 'INFY.NS',
    price: 1725.30,
    peRatio: 25.86,
    marketCap: 713971.52,
    volume: 5234567
  }],
  ['TCS.NS', {
    symbol: 'TCS.NS',
    price: 3850.00,
    peRatio: 28.45,
    marketCap: 1402345.67,
    volume: 2134567
  }],
  ['WIPRO.NS', {
    symbol: 'WIPRO.NS',
    price: 445.75,
    peRatio: 22.15,
    marketCap: 245678.90,
    volume: 8765432
  }],
  ['HDFCBANK.NS', {
    symbol: 'HDFCBANK.NS',
    price: 1700.15,
    peRatio: 18.69,
    marketCap: 1300795.86,
    volume: 4567890
  }],
  ['ICICIBANK.NS', {
    symbol: 'ICICIBANK.NS',
    price: 1215.50,
    peRatio: 17.68,
    marketCap: 859583.56,
    volume: 6789012
  }],
  ['AXISBANK.NS', {
    symbol: 'AXISBANK.NS',
    price: 1095.25,
    peRatio: 14.25,
    marketCap: 337890.45,
    volume: 5678901
  }],
  ['TATAMOTORS.NS', {
    symbol: 'TATAMOTORS.NS',
    price: 620.00,
    peRatio: 12.45,
    marketCap: 245678.90,
    volume: 9876543
  }],
  ['MARUTI.NS', {
    symbol: 'MARUTI.NS',
    price: 11500.00,
    peRatio: 31.25,
    marketCap: 347890.12,
    volume: 1234567
  }],
  ['ITC.NS', {
    symbol: 'ITC.NS',
    price: 435.50,
    peRatio: 24.56,
    marketCap: 538901.23,
    volume: 7890123
  }],
  ['HINDUNILVR.NS', {
    symbol: 'HINDUNILVR.NS',
    price: 2350.00,
    peRatio: 58.45,
    marketCap: 553456.78,
    volume: 2345678
  }],
  ['RELIANCE.NS', {
    symbol: 'RELIANCE.NS',
    price: 2895.75,
    peRatio: 26.34,
    marketCap: 1954321.09,
    volume: 5678901
  }],
  ['ONGC.NS', {
    symbol: 'ONGC.NS',
    price: 245.60,
    peRatio: 8.92,
    marketCap: 308901.23,
    volume: 8901234
  }]
]);

/**
 * Check if we should use mock data (when Yahoo Finance fails)
 */
export const shouldUseMockData = (): boolean => {
  // For now, use mock data since APIs are being blocked
  // Set USE_MOCK_DATA=false in environment to force API attempts
  return process.env.USE_MOCK_DATA !== 'false';
};
