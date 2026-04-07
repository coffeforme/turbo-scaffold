// App-specific utilities
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};