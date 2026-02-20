'use client';

import { AlertTriangle } from 'lucide-react';
import { formatPnl } from '@/lib/utils';
import type { MistakeCost } from '@/hooks/useAnalytics';

interface Props {
  data: MistakeCost[];
}

export function MistakeTracker({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="card-solid flex h-full flex-col items-center justify-center p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-profit-bg)]">
          <span className="text-xl">🎉</span>
        </div>
        <p className="mt-3 text-sm font-medium text-[var(--color-text-secondary)]">
          No mistakes tracked!
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Keep up the disciplined trading
        </p>
      </div>
    );
  }

  const totalCost = data.reduce((s, d) => s + d.totalCost, 0);

  return (
    <div className="card-solid p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">
            Mistake Tracker
          </h3>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            Most costly trading mistakes
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-text-muted)]">Total Impact</p>
          <p
            className={`text-sm font-bold ${
              totalCost >= 0 ? 'text-[var(--color-profit-light)]' : 'text-[var(--color-loss-light)]'
            }`}
          >
            {formatPnl(totalCost)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((mistake, index) => {
          const maxCost = Math.max(...data.map((d) => Math.abs(d.totalCost)));
          const barWidth = maxCost > 0 ? (Math.abs(mistake.totalCost) / maxCost) * 100 : 0;

          return (
            <div key={mistake.tag} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-loss-bg)] text-xs font-bold text-[var(--color-loss-light)]">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {mistake.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[var(--color-text-muted)]">
                    {mistake.count}×
                  </span>
                  <span className="font-semibold text-[var(--color-loss-light)]">
                    {formatPnl(mistake.totalCost)}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-[var(--color-bg-tertiary)]">
                <div
                  className="h-full rounded-full bg-[var(--color-loss)] transition-all duration-700"
                  style={{ width: `${barWidth}%`, opacity: 0.6 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning callout */}
      {data.length > 0 && data[0].totalCost < -50 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-[var(--color-loss-bg)] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-loss-light)]" />
          <p className="text-xs text-[var(--color-loss-light)]">
            <span className="font-semibold">&quot;{data[0].label}&quot;</span> is your most costly
            mistake, costing you {formatPnl(Math.abs(data[0].totalCost))} across {data[0].count}{' '}
            trade{data[0].count !== 1 ? 's' : ''}.
          </p>
        </div>
      )}
    </div>
  );
}
