import axios from 'axios';
import { PortfolioResponse, Stock } from '@/types/portfolio';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const portfolioApi = {
  /**
   * Fetch complete portfolio with live data
   */
  getPortfolio: async (): Promise<PortfolioResponse> => {
    const response = await api.get<PortfolioResponse>('/portfolio');
    return response.data;
  },

  /**
   * Fetch portfolio holdings without live data
   */
  getHoldings: async (): Promise<Stock[]> => {
    const response = await api.get<Stock[]>('/portfolio/holdings');
    return response.data;
  },

  /**
   * Add a new stock to the portfolio
   */
  addStock: async (stock: Stock): Promise<void> => {
    await api.post('/portfolio/stock', stock);
  },

  /**
   * Remove a stock from the portfolio
   */
  removeStock: async (symbol: string): Promise<void> => {
    await api.delete(`/portfolio/stock/${symbol}`);
  },

  /**
   * Update a stock in the portfolio
   */
  updateStock: async (symbol: string, updates: Partial<Stock>): Promise<void> => {
    await api.put(`/portfolio/stock/${symbol}`, updates);
  },
};

export default api;
