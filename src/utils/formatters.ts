const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(Math.round(amount));
}

export function formatCount(count: number): string {
  return new Intl.NumberFormat('en-IN').format(count);
}
