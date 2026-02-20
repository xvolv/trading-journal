import { clsx, type ClassValue } from 'clsx';

/** Merge Tailwind class names, handling conflicts */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format a number as currency (USD) */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format PNL with sign and color-appropriate prefix */
export function formatPnl(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${formatCurrency(value)}`;
}

/** Format percentage with one decimal */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Format a ratio like 2.35:1 */
export function formatRatio(value: number): string {
  return `${value.toFixed(2)}:1`;
}

/** Relative time string (e.g. "2h ago", "3d ago") */
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/** Get market display color */
export function getMarketColor(market: string): string {
  const colors: Record<string, string> = {
    crypto: '#f59e0b',
    forex: '#3b82f6',
    binary: '#a855f7',
    stocks: '#10b981',
    futures: '#ec4899',
  };
  return colors[market] ?? '#6b7280';
}

/* ============================================
   Trade Risk Math
   ============================================ */

/** Calculate PnL from trade parameters */
export function calcPnl(
  direction: 'long' | 'short' | 'call' | 'put',
  entry: number,
  exit: number,
  size: number,
  fees: number
): number {
  const isLong = direction === 'long' || direction === 'call';
  const rawPnl = isLong ? (exit - entry) * size : (entry - exit) * size;
  return rawPnl - fees;
}

/** Calculate Risk:Reward ratio */
export function calcRiskReward(
  direction: 'long' | 'short' | 'call' | 'put',
  entry: number,
  sl: number,
  tp: number
): number | null {
  const isLong = direction === 'long' || direction === 'call';
  const risk = isLong ? entry - sl : sl - entry;
  const reward = isLong ? tp - entry : entry - tp;
  if (risk <= 0) return null;
  return reward / risk;
}

/** Calculate breakeven price accounting for fees */
export function calcBreakeven(
  entry: number,
  fees: number,
  size: number,
  direction: 'long' | 'short' | 'call' | 'put'
): number {
  if (size <= 0) return entry;
  const feePerUnit = fees / size;
  const isLong = direction === 'long' || direction === 'call';
  return isLong ? entry + feePerUnit : entry - feePerUnit;
}

/** Calculate risk as a percentage of account balance */
export function calcRiskPercent(riskAmount: number, accountBalance: number): number {
  if (accountBalance <= 0) return 0;
  return (Math.abs(riskAmount) / accountBalance) * 100;
}

/** Format a price with the given decimal precision */
export function formatPrice(value: number, precision: number): string {
  return value.toFixed(precision);
}
