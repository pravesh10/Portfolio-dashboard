'use client';

import React from 'react';
import { SectorSummary as SectorSummaryType } from '@/types/portfolio';
import { formatCurrency, getGainLossColor, getGainLossBgColor } from '@/utils/format';

interface SectorSummaryProps {
  sectors: SectorSummaryType[];
}

const SectorSummary: React.FC<SectorSummaryProps> = ({ sectors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {sectors.map((sector) => {
        const gainLossPercentage = 
          (sector.gainLoss / sector.totalInvestment) * 100;
        
        return (
          <div
            key={sector.sector}
            className={`rounded-lg shadow-md p-6 border-l-4 ${
              sector.gainLoss >= 0 ? 'border-green-500' : 'border-red-500'
            } ${getGainLossBgColor(sector.gainLoss)}`}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {sector.sector}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Investment:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(sector.totalInvestment)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Present Value:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(sector.totalPresentValue)}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                <span className="text-sm font-medium text-gray-600">Gain/Loss:</span>
                <div className="text-right">
                  <div className={`font-bold ${getGainLossColor(sector.gainLoss)}`}>
                    {formatCurrency(sector.gainLoss)}
                  </div>
                  <div className={`text-xs ${getGainLossColor(sector.gainLoss)}`}>
                    ({gainLossPercentage > 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">Stocks:</span>
                <span className="text-xs font-medium text-gray-700">
                  {sector.stocks.length} holdings
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectorSummary;
