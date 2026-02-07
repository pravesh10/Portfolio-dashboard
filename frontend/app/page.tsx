'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PortfolioTable from '@/components/PortfolioTable';
import SectorSummary from '@/components/SectorSummary';
import PortfolioSummary from '@/components/PortfolioSummary';
import { portfolioApi } from '@/services/api';
import { PortfolioResponse } from '@/types/portfolio';
import { formatDate } from '@/utils/format';

export default function Home() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchPortfolio = useCallback(async () => {
    try {
      setError(null);
      const data = await portfolioApi.getPortfolio();
      setPortfolio(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
      setLoading(false);
      console.error('Error fetching portfolio:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchPortfolio();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchPortfolio]);

  const handleRefresh = () => {
    setLoading(true);
    fetchPortfolio();
  };

  if (loading && !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Portfolio</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Portfolio Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time portfolio tracking and analysis
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  autoRefresh
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {autoRefresh ? '🔄 Auto-Refresh ON' : '⏸️ Auto-Refresh OFF'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Refreshing...' : '🔄 Refresh Now'}
              </button>
            </div>
          </div>
          
          {/* Last Updated */}
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last updated: {formatDate(portfolio.lastUpdated)}
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <PortfolioSummary
          totalInvestment={portfolio.totalInvestment}
          totalPresentValue={portfolio.totalPresentValue}
          totalGainLoss={portfolio.totalGainLoss}
          lastUpdated={portfolio.lastUpdated}
        />

        {/* Sector Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sector-wise Summary</h2>
          <SectorSummary sectors={portfolio.sectors} />
        </div>

        {/* Portfolio Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Holdings</h2>
          <PortfolioTable stocks={portfolio.stocks} />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-12 pb-8">
          <p>Data sourced from Yahoo Finance API</p>
          <p className="mt-2">
            Note: Stock prices update automatically every 15 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
