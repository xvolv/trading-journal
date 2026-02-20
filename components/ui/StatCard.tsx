import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean } | null;
  className?: string;
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`card-solid p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-bg)]">
          <div className="text-[var(--color-accent-light)]">{icon}</div>
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              trend.positive
                ? 'bg-[var(--color-profit-bg)] text-[var(--color-profit-light)]'
                : 'bg-[var(--color-loss-bg)] text-[var(--color-loss-light)]'
            }`}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-[var(--color-text-tertiary)]">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {value}
        </p>
      </div>
    </div>
  );
}
