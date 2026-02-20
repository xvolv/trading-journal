'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { formatPnl } from '@/lib/utils';
import type { CumulativePoint } from '@/hooks/useAnalytics';

interface Props {
  data: CumulativePoint[];
}

export function CumulativePnlChart({ data }: Props) {
  const latestPnl = data[data.length - 1]?.pnl ?? 0;
  const isPositive = latestPnl >= 0;

  return (
    <div className="card-solid p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">
            Cumulative P&L
          </h3>
          <p className="mt-0.5 text-xl font-bold text-[var(--color-text-primary)]">
            {formatPnl(latestPnl)}
          </p>
        </div>
        {data.length > 0 && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              isPositive
                ? 'bg-[var(--color-profit-bg)] text-[var(--color-profit-light)]'
                : 'bg-[var(--color-loss-bg)] text-[var(--color-loss-light)]'
            }`}
          >
            {isPositive ? '↑' : '↓'} {formatPnl(latestPnl)}
          </span>
        )}
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="cumPnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-surface-border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickFormatter={(value: string) => {
                const d = new Date(value);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
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
              formatter={(value: number | undefined, name?: string) => [
                formatPnl(Number(value ?? 0)),
                name === 'pnl' ? 'Cumulative P&L' : 'Drawdown',
              ]}
              labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
            />
            <ReferenceLine y={0} stroke="var(--color-text-muted)" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke={isPositive ? 'var(--color-profit)' : 'var(--color-loss)'}
              strokeWidth={2}
              fill="url(#cumPnlGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
