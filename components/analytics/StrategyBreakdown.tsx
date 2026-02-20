'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { formatPnl } from '@/lib/utils';
import type { GroupBreakdown } from '@/hooks/useAnalytics';

interface Props {
  data: GroupBreakdown[];
}

export function StrategyBreakdown({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="card-solid flex h-full items-center justify-center p-5">
        <p className="text-sm text-[var(--color-text-muted)]">No strategy data yet</p>
      </div>
    );
  }

  return (
    <div className="card-solid p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">
          Strategy Performance
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          P&L by strategy tag
        </p>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-surface-border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              angle={-25}
              textAnchor="end"
              height={50}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickFormatter={(value: number) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                boxShadow: 'var(--shadow-elevated)',
              }}
              formatter={(value: number | undefined) => [formatPnl(Number(value ?? 0)), 'P&L']}
            />
            <ReferenceLine y={0} stroke="var(--color-text-muted)" strokeDasharray="3 3" />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Win rate badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {data.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-1.5 rounded-full bg-[var(--color-bg-secondary)] px-3 py-1.5"
          >
            <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              {s.label}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {s.winRate}% WR
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
