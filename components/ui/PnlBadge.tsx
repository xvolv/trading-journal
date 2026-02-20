import { formatPnl } from '@/lib/utils';

interface PnlBadgeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_STYLES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
} as const;

export function PnlBadge({ value, size = 'md', className = '' }: PnlBadgeProps) {
  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${SIZE_STYLES[size]} ${
        isPositive
          ? 'bg-[var(--color-profit-bg)] text-[var(--color-profit-light)]'
          : 'bg-[var(--color-loss-bg)] text-[var(--color-loss-light)]'
      } ${className}`}
    >
      {formatPnl(value)}
    </span>
  );
}
