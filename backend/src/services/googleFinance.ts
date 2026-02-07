import NodeCache from 'node-cache';
const googleFinance = require('google-finance');

// Cache with 1 minute TTL for stock prices
const cache = new NodeCache({ stdTTL: 60 });

export interface GoogleQuote {
  symbol: string;
  price: number;
  peRatio: number | null;
  marketCap: number | null;
}

export class GoogleFinanceService {
  /**
   * Fetch stock quote from Google Finance
   */
  async getStockQuote(symbol: string): Promise<GoogleQuote> {
    try {
      // Check cache first
      const cached = cache.get<GoogleQuote>(`gquote_${symbol}`);
      if (cached !== undefined) {
        return cached;
      }

      // Convert symbol format for Google Finance (remove .NS suffix for NSE stocks)
      const googleSymbol = this.convertSymbol(symbol);
      
      const result = await googleFinance.historical({
        symbol: googleSymbol,
        from: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        to: new Date(), // Today
      });

      const latestData = result && result.length > 0 ? result[result.length - 1] : null;
      
      const quote: GoogleQuote = {
        symbol,
        price: latestData?.close || 0,
        peRatio: null, // Google Finance API doesn't provide P/E ratio easily
        marketCap: null,
      };
      
      // Cache the result
      cache.set(`gquote_${symbol}`, quote);
      
      return quote;
    } catch (error) {
      console.error(`Error fetching from Google Finance for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Convert Yahoo Finance symbol format to Google Finance format
   * Example: INFY.NS -> NSE:INFY
   */
  private convertSymbol(yahooSymbol: string): string {
    if (yahooSymbol.endsWith('.NS')) {
      // NSE stocks
      const baseSymbol = yahooSymbol.replace('.NS', '');
      return `NSE:${baseSymbol}`;
    } else if (yahooSymbol.endsWith('.BO')) {
      // BSE stocks
      const baseSymbol = yahooSymbol.replace('.BO', '');
      return `BOM:${baseSymbol}`;
    } else if (yahooSymbol.includes('.')) {
      // Other exchanges
      return yahooSymbol;
    }
    // Default: assume NASDAQ
    return `NASDAQ:${yahooSymbol}`;
  }

  /**
   * Fetch multiple quotes with rate limiting
   */
  async getMultipleQuotes(symbols: string[]): Promise<Map<string, GoogleQuote>> {
    const quoteMap = new Map<string, GoogleQuote>();
    
    // Fetch quotes one by one with delays
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      try {
        await new Promise(resolve => setTimeout(resolve, i * 1000)); // 1 second delay
        const quote = await this.getStockQuote(symbol);
        quoteMap.set(symbol, quote);
        console.log(`✓ Google Finance: Successfully fetched ${symbol}: ₹${quote.price}`);
      } catch (error) {
        console.log(`✗ Google Finance: Failed to fetch ${symbol}`);
        quoteMap.set(symbol, {
          symbol,
          price: 0,
          peRatio: null,
          marketCap: null,
        });
      }
    }
    
    return quoteMap;
  }

  /**
   * Clear cache
   */
  clearCache(symbol?: string): void {
    if (symbol) {
      cache.del(`gquote_${symbol}`);
    } else {
      cache.flushAll();
    }
  }
}

export const googleFinanceService = new GoogleFinanceService();
