import yahooFinance from 'yahoo-finance2';
import NodeCache from 'node-cache';

// Cache with 1 minute TTL for stock prices
const cache = new NodeCache({ stdTTL: 60 });

export interface YahooQuote {
  symbol: string;
  price: number;
  peRatio: number | null;
  marketCap: number | null;
  volume: number | null;
}

export class YahooFinanceService {
  /**
   * Fetch current market price for a single stock
   */
  async getStockPrice(symbol: string): Promise<number> {
    try {
      // Check cache first
      const cached = cache.get<number>(`price_${symbol}`);
      if (cached !== undefined) {
        return cached;
      }

      const quote = await yahooFinance.quote(symbol);
      const price = quote.regularMarketPrice || 0;
      
      // Cache the result
      cache.set(`price_${symbol}`, price);
      
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
  }

  /**
   * Fetch detailed quote information including P/E ratio
   */
  async getDetailedQuote(symbol: string): Promise<YahooQuote> {
    try {
      // Check cache first
      const cached = cache.get<YahooQuote>(`quote_${symbol}`);
      if (cached !== undefined) {
        return cached;
      }

      const quote = await yahooFinance.quote(symbol);
      
      const result: YahooQuote = {
        symbol,
        price: quote.regularMarketPrice || 0,
        peRatio: quote.trailingPE || null,
        marketCap: quote.marketCap || null,
        volume: quote.regularMarketVolume || null
      };
      
      // Cache the result
      cache.set(`quote_${symbol}`, result);
      
      return result;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  }

  /**
   * Fetch multiple stock prices in parallel
   */
  async getMultiplePrices(symbols: string[]): Promise<Map<string, number>> {
    const priceMap = new Map<string, number>();
    
    try {
      // Fetch all prices in parallel
      const promises = symbols.map(symbol => 
        this.getStockPrice(symbol)
          .then(price => ({ symbol, price }))
          .catch(error => {
            console.error(`Failed to fetch ${symbol}:`, error.message);
            return { symbol, price: 0 };
          })
      );

      const results = await Promise.all(promises);
      
      results.forEach(({ symbol, price }) => {
        priceMap.set(symbol, price);
      });

      return priceMap;
    } catch (error) {
      console.error('Error fetching multiple prices:', error);
      throw error;
    }
  }

  /**
   * Fetch multiple detailed quotes in parallel
   */
  async getMultipleQuotes(symbols: string[]): Promise<Map<string, YahooQuote>> {
    const quoteMap = new Map<string, YahooQuote>();
    
    try {
      // Fetch all quotes with longer delays to avoid rate limiting (500ms between each)
      const promises = symbols.map((symbol, index) => 
        new Promise<void>((resolve) => {
          setTimeout(() => {
            this.getDetailedQuote(symbol)
              .then(quote => {
                quoteMap.set(symbol, quote);
                console.log(`✓ Successfully fetched ${symbol}: ₹${quote.price}`);
                resolve();
              })
              .catch(error => {
                console.log(`✗ Failed to fetch ${symbol}, using fallback`);
                // Set default values on error
                quoteMap.set(symbol, {
                  symbol,
                  price: 0,
                  peRatio: null,
                  marketCap: null,
                  volume: null
                });
                resolve();
              });
          }, index * 500); // Stagger requests by 500ms (slower to avoid rate limits)
        })
      );

      await Promise.all(promises);
      
      return quoteMap;
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      throw error;
    }
  }

  /**
   * Get earnings data (limited availability through yahoo-finance2)
   */
  async getEarnings(symbol: string): Promise<string | null> {
    try {
      // Check cache first
      const cached = cache.get<string>(`earnings_${symbol}`);
      if (cached !== undefined) {
        return cached;
      }

      const quote = await yahooFinance.quote(symbol);
      const earnings = quote.epsTrailingTwelveMonths 
        ? `₹${quote.epsTrailingTwelveMonths.toFixed(2)}` 
        : null;
      
      // Cache with longer TTL (1 hour) as earnings don't change frequently
      if (earnings) {
        cache.set(`earnings_${symbol}`, earnings, 3600);
      }
      
      return earnings;
    } catch (error) {
      // Silently return null for earnings errors
      return null;
    }
  }

  /**
   * Clear cache for all symbols or a specific symbol
   */
  clearCache(symbol?: string): void {
    if (symbol) {
      cache.del([`price_${symbol}`, `quote_${symbol}`, `earnings_${symbol}`]);
    } else {
      cache.flushAll();
    }
  }
}

export const yahooFinanceService = new YahooFinanceService();
