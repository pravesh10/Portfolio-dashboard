import { Stock, StockData, SectorSummary, PortfolioResponse } from '../types/portfolio';
import { yahooFinanceService } from './yahooFinance';
import { googleFinanceService } from './googleFinance';
import { alphaVantageService } from './alphaVantageService';
import { samplePortfolio } from '../data/samplePortfolio';
import { mockStockData, shouldUseMockData } from './mockData';

export class PortfolioService {
  private portfolio: Stock[] = samplePortfolio;

  /**
   * Get the complete portfolio with all calculations
   */
  async getPortfolio(): Promise<PortfolioResponse> {
    try {
      // Get all stock symbols
      const symbols = this.portfolio.map(stock => stock.symbol);
      
      // Try multiple data sources with fallback hierarchy
      let quotesMap;
      
      if (shouldUseMockData()) {
        console.log('📊 Using mock data (USE_MOCK_DATA env var is not set to false)');
        quotesMap = mockStockData;
      } else {
        console.log('🔄 Fetching REAL stock data from APIs...');
        
        // Priority 1: Alpha Vantage (if configured)
        if (alphaVantageService.isConfigured()) {
          console.log('🌟 Trying Alpha Vantage API (PRIMARY)...');
          try {
            quotesMap = await alphaVantageService.getMultipleQuotes(symbols);
            const validPrices = Array.from(quotesMap.values()).filter(q => q.price > 0).length;
            
            if (validPrices > 0) {
              console.log(`✅ SUCCESS: Alpha Vantage returned ${validPrices}/${symbols.length} stocks`);
            } else {
              console.log('⚠️ Alpha Vantage returned no valid prices, trying fallback...');
              throw new Error('No valid prices from Alpha Vantage');
            }
          } catch (alphaError) {
            console.log('❌ Alpha Vantage failed, trying Google Finance...');
            
            // Priority 2: Google Finance (fallback)
            try {
              quotesMap = await googleFinanceService.getMultipleQuotes(symbols);
              const validPrices = Array.from(quotesMap.values()).filter(q => q.price > 0).length;
              
              if (validPrices > 0) {
                console.log(`✅ Google Finance SUCCESS: ${validPrices}/${symbols.length} stocks`);
              } else {
                throw new Error('No valid prices');
              }
            } catch (googleError) {
              console.log('❌ Google Finance also failed, trying Yahoo Finance...');
              
              // Priority 3: Yahoo Finance (fallback)
              try {
                quotesMap = await yahooFinanceService.getMultipleQuotes(symbols);
                const validPrices = Array.from(quotesMap.values()).filter(q => q.price > 0).length;
                
                if (validPrices > 0) {
                  console.log(`✅ Yahoo Finance SUCCESS: ${validPrices}/${symbols.length} stocks`);
                } else {
                  throw new Error('No valid prices');
                }
              } catch (yahooError) {
                console.log('❌ All APIs failed, using mock data');
                quotesMap = mockStockData;
              }
            }
          }
        } else {
          console.log('⚠️ Alpha Vantage API key not configured');
          console.log('Trying Google Finance...');
          
          // If Alpha Vantage not configured, try Google then Yahoo
          try {
            quotesMap = await googleFinanceService.getMultipleQuotes(symbols);
            const validPrices = Array.from(quotesMap.values()).filter(q => q.price > 0).length;
            
            if (validPrices > 0) {
              console.log(`✅ Google Finance SUCCESS: ${validPrices}/${symbols.length} stocks`);
            } else {
              throw new Error('No valid prices');
            }
          } catch (error) {
            console.log('Trying Yahoo Finance...');
            try {
              quotesMap = await yahooFinanceService.getMultipleQuotes(symbols);
              const validPrices = Array.from(quotesMap.values()).filter(q => q.price > 0).length;
              
              if (validPrices > 0) {
                console.log(`✅ Yahoo Finance SUCCESS: ${validPrices}/${symbols.length} stocks`);
              } else {
                throw new Error('No valid prices');
              }
            } catch (finalError) {
              console.log('❌ All APIs failed, using mock data');
              quotesMap = mockStockData;
            }
          }
        }
      }
      
      // Calculate total investment first
      const totalInvestment = this.portfolio.reduce(
        (sum, stock) => sum + (stock.purchasePrice * stock.quantity),
        0
      );

      // Process each stock with live data
      const stocksData: StockData[] = await Promise.all(
        this.portfolio.map(async (stock) => {
          const quote = quotesMap.get(stock.symbol);
          const cmp = quote?.price || 0;
          const peRatio = quote?.peRatio || null;
          
          const investment = stock.purchasePrice * stock.quantity;
          const presentValue = cmp * stock.quantity;
          const gainLoss = presentValue - investment;
          const portfolioPercentage = (investment / totalInvestment) * 100;
          
          // Get earnings data
          let latestEarnings: string | null = null;
          try {
            latestEarnings = await yahooFinanceService.getEarnings(stock.symbol);
          } catch (error) {
            console.error(`Failed to fetch earnings for ${stock.symbol}`);
          }

          return {
            ...stock,
            investment,
            portfolioPercentage,
            cmp,
            presentValue,
            gainLoss,
            peRatio,
            latestEarnings
          };
        })
      );

      // Group by sector
      const sectors = this.groupBySector(stocksData);
      
      // Calculate totals
      const totalPresentValue = stocksData.reduce(
        (sum, stock) => sum + stock.presentValue,
        0
      );
      const totalGainLoss = totalPresentValue - totalInvestment;

      return {
        stocks: stocksData,
        sectors,
        totalInvestment,
        totalPresentValue,
        totalGainLoss,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting portfolio:', error);
      throw error;
    }
  }

  /**
   * Group stocks by sector and calculate sector summaries
   */
  private groupBySector(stocks: StockData[]): SectorSummary[] {
    const sectorMap = new Map<string, StockData[]>();

    // Group stocks by sector
    stocks.forEach(stock => {
      if (!sectorMap.has(stock.sector)) {
        sectorMap.set(stock.sector, []);
      }
      sectorMap.get(stock.sector)!.push(stock);
    });

    // Calculate summaries for each sector
    const sectors: SectorSummary[] = [];
    sectorMap.forEach((sectorStocks, sector) => {
      const totalInvestment = sectorStocks.reduce(
        (sum, stock) => sum + stock.investment,
        0
      );
      const totalPresentValue = sectorStocks.reduce(
        (sum, stock) => sum + stock.presentValue,
        0
      );
      const gainLoss = totalPresentValue - totalInvestment;

      sectors.push({
        sector,
        totalInvestment,
        totalPresentValue,
        gainLoss,
        stocks: sectorStocks
      });
    });

    // Sort sectors by investment value (descending)
    return sectors.sort((a, b) => b.totalInvestment - a.totalInvestment);
  }

  /**
   * Get portfolio holdings (without live data)
   */
  getHoldings(): Stock[] {
    return this.portfolio;
  }

  /**
   * Add a new stock to the portfolio
   */
  addStock(stock: Stock): void {
    this.portfolio.push(stock);
  }

  /**
   * Remove a stock from the portfolio
   */
  removeStock(symbol: string): boolean {
    const index = this.portfolio.findIndex(s => s.symbol === symbol);
    if (index !== -1) {
      this.portfolio.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Update a stock in the portfolio
   */
  updateStock(symbol: string, updates: Partial<Stock>): boolean {
    const index = this.portfolio.findIndex(s => s.symbol === symbol);
    if (index !== -1) {
      this.portfolio[index] = { ...this.portfolio[index], ...updates };
      return true;
    }
    return false;
  }
}

export const portfolioService = new PortfolioService();
