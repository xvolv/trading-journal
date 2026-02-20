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
} from 'recharts';
import { formatPnl } from '@/lib/utils';
import type { GroupBreakdown } from '@/hooks/useAnalytics';

interface Props {
  data: GroupBreakdown[];
}

export function MarketBreakdown({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="card-solid flex h-full items-center justify-center p-5">
        <p className="text-sm text-[var(--color-text-muted)]">No market data yet</p>
      </div>
    );
  }

  return (
    <div className="card-solid p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">
          Market Breakdown
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          P&L by market type
        </p>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-surface-border)"
              horizontal={false}
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickFormatter={(value: number) => `$${value}`}
            />
            <YAxis
              type="category"
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 500 }}
              width={60}
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
              labelFormatter={(label) => String(label)}
            />
            <Bar dataKey="pnl" radius={[0, 6, 6, 0]} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <div className="mt-4 space-y-2">
        {data.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between rounded-lg bg-[var(--color-bg-secondary)] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ background: m.color }} />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                {m.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[var(--color-text-muted)]">{m.tradeCount} trades</span>
              <span className="text-[var(--color-text-muted)]">{m.winRate}% WR</span>
              <span
                className={`font-semibold ${
                  m.pnl >= 0 ? 'text-[var(--color-profit-light)]' : 'text-[var(--color-loss-light)]'
                }`}
              >
                {formatPnl(m.pnl)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
