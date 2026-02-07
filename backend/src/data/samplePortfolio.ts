import { Stock } from '../types/portfolio';

export const samplePortfolio: Stock[] = [
  // Technology Sector
  {
    symbol: 'INFY.NS',
    name: 'Infosys Ltd',
    purchasePrice: 1450.50,
    quantity: 50,
    exchange: 'NSE',
    sector: 'Technology'
  },
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services',
    purchasePrice: 3500.00,
    quantity: 30,
    exchange: 'NSE',
    sector: 'Technology'
  },
  {
    symbol: 'WIPRO.NS',
    name: 'Wipro Ltd',
    purchasePrice: 420.75,
    quantity: 100,
    exchange: 'NSE',
    sector: 'Technology'
  },
  
  // Financial Sector
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank',
    purchasePrice: 1650.00,
    quantity: 40,
    exchange: 'NSE',
    sector: 'Financials'
  },
  {
    symbol: 'ICICIBANK.NS',
    name: 'ICICI Bank',
    purchasePrice: 950.50,
    quantity: 60,
    exchange: 'NSE',
    sector: 'Financials'
  },
  {
    symbol: 'AXISBANK.NS',
    name: 'Axis Bank',
    purchasePrice: 875.25,
    quantity: 50,
    exchange: 'NSE',
    sector: 'Financials'
  },
  
  // Automobile Sector
  {
    symbol: 'TATAMOTORS.NS',
    name: 'Tata Motors',
    purchasePrice: 580.00,
    quantity: 80,
    exchange: 'NSE',
    sector: 'Automobile'
  },
  {
    symbol: 'MARUTI.NS',
    name: 'Maruti Suzuki',
    purchasePrice: 9500.00,
    quantity: 10,
    exchange: 'NSE',
    sector: 'Automobile'
  },
  
  // FMCG Sector
  {
    symbol: 'ITC.NS',
    name: 'ITC Ltd',
    purchasePrice: 420.50,
    quantity: 120,
    exchange: 'NSE',
    sector: 'FMCG'
  },
  {
    symbol: 'HINDUNILVR.NS',
    name: 'Hindustan Unilever',
    purchasePrice: 2450.00,
    quantity: 25,
    exchange: 'NSE',
    sector: 'FMCG'
  },
  
  // Energy Sector
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries',
    purchasePrice: 2400.00,
    quantity: 35,
    exchange: 'NSE',
    sector: 'Energy'
  },
  {
    symbol: 'ONGC.NS',
    name: 'Oil and Natural Gas Corp',
    purchasePrice: 180.50,
    quantity: 200,
    exchange: 'NSE',
    sector: 'Energy'
  }
];
