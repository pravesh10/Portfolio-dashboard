export interface Stock {
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  exchange: string;
  sector: string;
}

export interface StockData extends Stock {
  investment: number;
  portfolioPercentage: number;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number | null;
  latestEarnings: string | null;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  stocks: StockData[];
}

export interface PortfolioResponse {
  stocks: StockData[];
  sectors: SectorSummary[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  lastUpdated: string;
}
