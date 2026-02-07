'use client';

import React from 'react';
import { formatCurrency, getGainLossColor } from '@/utils/format';

interface PortfolioSummaryProps {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  lastUpdated: string;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalInvestment,
  totalPresentValue,
  totalGainLoss,
  lastUpdated,
}) => {
  const gainLossPercentage = (totalGainLoss / totalInvestment) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalInvestment)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Present Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalPresentValue)}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
        totalGainLoss >= 0 ? 'border-green-500' : 'border-red-500'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${getGainLossColor(totalGainLoss)}`}>
              {formatCurrency(totalGainLoss)}
            </p>
            <p className={`text-sm font-medium ${getGainLossColor(totalGainLoss)}`}>
              {gainLossPercentage > 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
            </p>
          </div>
          <div className={`p-3 rounded-full ${
            totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <svg className={`w-8 h-8 ${
              totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                totalGainLoss >= 0
                  ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              } />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
