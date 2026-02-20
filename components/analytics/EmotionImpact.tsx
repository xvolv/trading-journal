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
import type { TagImpact } from '@/hooks/useAnalytics';

interface Props {
  data: TagImpact[];
}

const EMOTION_COLORS: Record<string, string> = {
  calm: '#10b981',
  confident: '#3b82f6',
  tired: '#f59e0b',
  anxious: '#f97316',
  fomo: '#ef4444',
  revenge: '#dc2626',
  greedy: '#b91c1c',
};

export function EmotionImpact({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="card-solid flex h-full items-center justify-center p-5">
        <p className="text-sm text-[var(--color-text-muted)]">No emotion data yet</p>
      </div>
    );
  }

  return (
    <div className="card-solid p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">
          Emotion Impact
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          Average P&L when trading under each emotional state
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
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
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
              formatter={(value: number | undefined) => [formatPnl(Number(value ?? 0)), 'Avg P&L']}
            />
            <ReferenceLine y={0} stroke="var(--color-text-muted)" strokeDasharray="3 3" />
            <Bar dataKey="avgPnl" radius={[4, 4, 0, 0]} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={EMOTION_COLORS[entry.tag] ?? 'var(--color-accent)'}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight callout */}
      {data.length > 0 && (
        <div className="mt-3 rounded-lg bg-[var(--color-accent-bg)] px-4 py-3">
          <p className="text-xs text-[var(--color-accent-light)]">
            <span className="font-semibold">Insight:</span> You perform best when feeling{' '}
            <span className="font-bold">{data[0].label}</span> (avg {formatPnl(data[0].avgPnl)})
            {data[data.length - 1].avgPnl < 0 && (
              <>
                {' '}and worst when feeling{' '}
                <span className="font-bold">{data[data.length - 1].label}</span> (avg{' '}
                {formatPnl(data[data.length - 1].avgPnl)})
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
