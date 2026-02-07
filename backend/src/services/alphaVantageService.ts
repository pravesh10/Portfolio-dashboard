import axios from 'axios';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Cache with 1 minute TTL for stock prices
const cache = new NodeCache({ stdTTL: 60 });

export interface AlphaVantageQuote {
  symbol: string;
  price: number;
  peRatio: number | null;
  marketCap: number | null;
  volume: number | null;
}

export class AlphaVantageService {
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';
  private requestQueue: Promise<any>[] = [];
  private lastRequestTime = 0;
  private minRequestInterval = 12000; // 12 seconds between requests (5 per minute)

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ ALPHA_VANTAGE_API_KEY not found in environment variables');
    }
  }

  /**
   * Rate limiting: Wait before making next request
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Convert NSE symbol to Alpha Vantage format
   * INFY.NS -> INFY (Alpha Vantage doesn't need .NS suffix for global quotes)
   */
  private convertSymbol(yahooSymbol: string): string {
    // Remove exchange suffix for Alpha Vantage
    return yahooSymbol.replace(/\.(NS|BO)$/, '');
  }

  /**
   * Fetch quote using GLOBAL_QUOTE endpoint
   */
  async getStockQuote(symbol: string): Promise<AlphaVantageQuote> {
    try {
      // Check cache first
      const cached = cache.get<AlphaVantageQuote>(`av_${symbol}`);
      if (cached !== undefined) {
        return cached;
      }

      // Rate limiting
      await this.waitForRateLimit();

      const alphaSymbol = this.convertSymbol(symbol);
      
      // Try NSE exchange first for Indian stocks
      let url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${alphaSymbol}&apikey=${this.apiKey}`;
      
      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;

      // Check for API limit message
      if (data.Note && data.Note.includes('API call frequency')) {
        console.log(`⚠️ Alpha Vantage rate limit reached for ${symbol}`);
        throw new Error('Rate limit reached');
      }

      // Check for error message
      if (data['Error Message']) {
        console.log(`❌ Alpha Vantage error for ${symbol}: ${data['Error Message']}`);
        throw new Error(data['Error Message']);
      }

      const quote = data['Global Quote'];
      
      if (!quote || Object.keys(quote).length === 0) {
        console.log(`⚠️ No data returned for ${symbol}`);
        throw new Error('No data available');
      }

      const result: AlphaVantageQuote = {
        symbol,
        price: parseFloat(quote['05. price']) || 0,
        peRatio: null, // GLOBAL_QUOTE doesn't provide P/E ratio
        marketCap: null,
        volume: parseInt(quote['06. volume']) || null
      };

      // Cache the result
      if (result.price > 0) {
        cache.set(`av_${symbol}`, result);
        console.log(`✅ Alpha Vantage: ${symbol} = ₹${result.price.toFixed(2)}`);
      }

      return result;
    } catch (error: any) {
      console.log(`❌ Alpha Vantage failed for ${symbol}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch multiple quotes with rate limiting
   */
  async getMultipleQuotes(symbols: string[]): Promise<Map<string, AlphaVantageQuote>> {
    const quoteMap = new Map<string, AlphaVantageQuote>();
    
    console.log(`📊 Fetching ${symbols.length} stocks from Alpha Vantage...`);
    
    // Fetch quotes one by one with rate limiting
    for (const symbol of symbols) {
      try {
        const quote = await this.getStockQuote(symbol);
        quoteMap.set(symbol, quote);
      } catch (error) {
        // On error, set default values
        quoteMap.set(symbol, {
          symbol,
          price: 0,
          peRatio: null,
          marketCap: null,
          volume: null
        });
      }
    }

    const successCount = Array.from(quoteMap.values()).filter(q => q.price > 0).length;
    console.log(`✅ Alpha Vantage completed: ${successCount}/${symbols.length} stocks fetched`);
    
    return quoteMap;
  }

  /**
   * Clear cache
   */
  clearCache(symbol?: string): void {
    if (symbol) {
      cache.del(`av_${symbol}`);
    } else {
      cache.flushAll();
    }
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return this.apiKey !== '';
  }
}

export const alphaVantageService = new AlphaVantageService();
