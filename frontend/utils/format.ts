/**
 * Format number as Indian currency (₹)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with 2 decimal places
 */
export const formatNumber = (num: number): string => {
  return num.toFixed(2);
};

/**
 * Format percentage with 2 decimal places
 */
export const formatPercentage = (num: number): string => {
  return `${num.toFixed(2)}%`;
};

/**
 * Get color class based on gain/loss value
 */
export const getGainLossColor = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Get background color class based on gain/loss value
 */
export const getGainLossBgColor = (value: number): string => {
  if (value > 0) return 'bg-green-100';
  if (value < 0) return 'bg-red-100';
  return 'bg-gray-50';
};

/**
 * Format date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
