'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { MOCK_EQUITY_CURVE } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export function EquityCurve() {
  return (
    <div className="card-solid p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">Equity Curve</h3>
          <p className="mt-0.5 text-xl font-bold text-[var(--color-text-primary)]">
            {formatCurrency(MOCK_EQUITY_CURVE[MOCK_EQUITY_CURVE.length - 1].equity)}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-profit-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-profit-light)]">
          +{((MOCK_EQUITY_CURVE[MOCK_EQUITY_CURVE.length - 1].equity / MOCK_EQUITY_CURVE[0].equity - 1) * 100).toFixed(1)}%
        </span>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_EQUITY_CURVE} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-profit)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-profit)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-loss)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--color-loss)" stopOpacity={0} />
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
              interval={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
              domain={['dataMin - 200', 'dataMax + 200']}
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
              formatter={(value: number | string | undefined, name?: string) => {
                const num = Number(value ?? 0);
                return [
                  name === 'equity' ? formatCurrency(num) : `${num.toFixed(2)}%`,
                  name === 'equity' ? 'Equity' : 'Drawdown',
                ];
              }}
              labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="var(--color-profit)"
              strokeWidth={2}
              fill="url(#equityGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
