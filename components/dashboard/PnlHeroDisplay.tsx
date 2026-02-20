'use client';

import { useState } from 'react';
import type { PnlPeriod } from '@/types/types';
import { MOCK_DASHBOARD_STATS } from '@/lib/mock-data';
import { formatPnl } from '@/lib/utils';

const PERIOD_LABELS: Record<PnlPeriod, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

export function PnlHeroDisplay() {
  const [period, setPeriod] = useState<PnlPeriod>('today');

  const pnlValues: Record<PnlPeriod, number> = {
    today: MOCK_DASHBOARD_STATS.netPnlToday,
    week: MOCK_DASHBOARD_STATS.netPnlWeek,
    month: MOCK_DASHBOARD_STATS.netPnlMonth,
  };

  const currentPnl = pnlValues[period];
  const isPositive = currentPnl >= 0;

  return (
    <div className="card-solid relative overflow-hidden p-6">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: isPositive
            ? 'radial-gradient(ellipse at 30% 50%, var(--color-profit-glow), transparent 70%)'
            : 'radial-gradient(ellipse at 30% 50%, var(--color-loss-glow), transparent 70%)',
        }}
      />

      <div className="relative">
        <p className="text-sm font-medium text-[var(--color-text-tertiary)]">Net P&L</p>

        {/* Period tabs */}
        <div className="mt-2 flex gap-1 rounded-lg bg-[var(--color-bg-primary)] p-1 w-fit">
          {(Object.keys(PERIOD_LABELS) as PnlPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                period === p
                  ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent-light)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        {/* PNL Value */}
        <p
          className={`mt-4 text-4xl font-extrabold tracking-tight md:text-5xl ${
            isPositive ? 'gradient-text-profit' : 'gradient-text-loss'
          }`}
        >
          {formatPnl(currentPnl)}
        </p>
      </div>
    </div>
  );
}
