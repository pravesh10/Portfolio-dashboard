'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { StockData } from '@/types/portfolio';
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  getGainLossColor,
} from '@/utils/format';

interface PortfolioTableProps {
  stocks: StockData[];
}

const columnHelper = createColumnHelper<StockData>();

const PortfolioTable: React.FC<PortfolioTableProps> = ({ stocks }) => {
  const columns = [
    columnHelper.accessor('name', {
      header: 'Particulars',
      cell: (info) => (
        <div>
          <div className="font-semibold text-gray-900">{info.getValue()}</div>
          <div className="text-sm text-gray-500">{info.row.original.symbol}</div>
        </div>
      ),
    }),
    columnHelper.accessor('purchasePrice', {
      header: 'Purchase Price',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('quantity', {
      header: 'Qty',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('investment', {
      header: 'Investment',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('portfolioPercentage', {
      header: 'Portfolio %',
      cell: (info) => formatPercentage(info.getValue()),
    }),
    columnHelper.accessor('exchange', {
      header: 'NSE/BSE',
      cell: (info) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('cmp', {
      header: 'CMP',
      cell: (info) => {
        const value = info.getValue();
        return (
          <span className="font-semibold text-blue-600">
            {value === 0 ? 'Loading...' : formatCurrency(value)}
          </span>
        );
      },
    }),
    columnHelper.accessor('presentValue', {
      header: 'Present Value',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('gainLoss', {
      header: 'Gain/Loss',
      cell: (info) => {
        const value = info.getValue();
        return (
          <div className={`font-semibold ${getGainLossColor(value)}`}>
            {formatCurrency(value)}
          </div>
        );
      },
    }),
    columnHelper.accessor('peRatio', {
      header: 'P/E Ratio',
      cell: (info) => {
        const value = info.getValue();
        return value ? formatNumber(value) : 'N/A';
      },
    }),
    columnHelper.accessor('latestEarnings', {
      header: 'Latest Earnings',
      cell: (info) => info.getValue() || 'N/A',
    }),
  ];

  const table = useReactTable({
    data: stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => {
            const gainLoss = row.original.gainLoss;
            
            // Permanent background color based on profit/loss
            const rowBgColor = gainLoss > 0 
              ? 'bg-green-100' 
              : gainLoss < 0 
              ? 'bg-red-100' 
              : 'bg-white';
            
            const borderColor = gainLoss > 0 
              ? 'border-green-600' 
              : gainLoss < 0 
              ? 'border-red-600' 
              : 'border-gray-300';
            
            return (
              <tr
                key={row.id}
                className={`${rowBgColor} ${borderColor} border-l-4`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
