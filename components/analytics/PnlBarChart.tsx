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
import type { DailyPnl } from '@/hooks/useAnalytics';

interface Props {
  data: DailyPnl[];
}

export function PnlBarChart({ data }: Props) {
  return (
    <div className="card-solid p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">Daily P&L</h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          Profit and loss per trading day
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
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
              formatter={(value: number | undefined) => [formatPnl(Number(value ?? 0)), 'P&L']}
              labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
            />
            <ReferenceLine y={0} stroke="var(--color-text-muted)" strokeDasharray="3 3" />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]} animationDuration={1200}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pnl >= 0 ? 'var(--color-profit)' : 'var(--color-loss)'}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
