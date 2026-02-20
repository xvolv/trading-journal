'use client';

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { HERO_CHART_DATA } from '@/lib/constants';

export function HeroChart() {
  return (
    <div className="relative h-[200px] w-full">
      {/* Glow effect behind chart */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[var(--color-profit)]/5 to-transparent" />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={HERO_CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-profit)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-profit)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
            }}
            formatter={(value: number | string | undefined) => [`$${Number(value ?? 0).toLocaleString()}`, 'PNL']}
          />
          <Area
            type="monotone"
            dataKey="pnl"
            stroke="var(--color-profit)"
            strokeWidth={2.5}
            fill="url(#heroGradient)"
            animationDuration={2000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
