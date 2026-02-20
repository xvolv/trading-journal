'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { AnalyticsSummary } from '@/hooks/useAnalytics';

interface Props {
  summary: AnalyticsSummary;
}

const COLORS = {
  wins: 'var(--color-profit)',
  losses: 'var(--color-loss)',
  breakeven: 'var(--color-text-muted)',
};

export function WinLossDonut({ summary }: Props) {
  const data = [
    { name: 'Wins', value: summary.wins, color: COLORS.wins },
    { name: 'Losses', value: summary.losses, color: COLORS.losses },
    ...(summary.breakeven > 0
      ? [{ name: 'Breakeven', value: summary.breakeven, color: COLORS.breakeven }]
      : []),
  ];

  const total = summary.totalTrades;

  return (
    <div className="card-solid p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">Win / Loss</h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          Trade outcome distribution
        </p>
      </div>

      <div className="relative h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={3}
              dataKey="value"
              animationDuration={1200}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                boxShadow: 'var(--shadow-elevated)',
              }}
              formatter={(value: number | undefined, name?: string) => {
                const num = Number(value ?? 0);
                return [
                  `${num} (${total > 0 ? ((num / total) * 100).toFixed(1) : 0}%)`,
                  name ?? '',
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">
            {summary.winRate.toFixed(0)}%
          </span>
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            Win Rate
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-6">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: d.color }} />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {d.name} ({d.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
