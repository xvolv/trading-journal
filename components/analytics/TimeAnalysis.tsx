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
import type { TimeSlot } from '@/hooks/useAnalytics';

interface Props {
  hourlyData: TimeSlot[];
  dayOfWeekData: TimeSlot[];
}

function getBarColor(pnl: number) {
  return pnl >= 0 ? 'var(--color-profit)' : 'var(--color-loss)';
}

export function TimeAnalysis({ hourlyData, dayOfWeekData }: Props) {
  const hasHourly = hourlyData.some((d) => d.tradeCount > 0);
  const hasDaily = dayOfWeekData.some((d) => d.tradeCount > 0);

  if (!hasHourly && !hasDaily) {
    return (
      <div className="card-solid flex items-center justify-center p-5">
        <p className="text-sm text-[var(--color-text-muted)]">No time data yet</p>
      </div>
    );
  }

  return (
    <div className="card-solid p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">
          Time Analysis
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          When you trade best and worst
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Hour */}
        {hasHourly && (
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              By Hour (UTC)
            </h4>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-surface-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }}
                    interval={1}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                    tickFormatter={(v: number) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-surface-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '12px',
                      boxShadow: 'var(--shadow-elevated)',
                    }}
                    formatter={(value: number | undefined) => [formatPnl(Number(value ?? 0)), 'P&L']}
                  />
                  <ReferenceLine y={0} stroke="var(--color-text-muted)" strokeDasharray="3 3" />
                  <Bar dataKey="pnl" radius={[2, 2, 0, 0]} animationDuration={1000}>
                    {hourlyData.map((entry, index) => (
                      <Cell key={`h-${index}`} fill={getBarColor(entry.pnl)} fillOpacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* By Day of Week */}
        {hasDaily && (
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              By Day of Week
            </h4>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
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
                    tickFormatter={(v: string) => v.slice(0, 3)}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                    tickFormatter={(v: number) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-surface-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '12px',
                      boxShadow: 'var(--shadow-elevated)',
                    }}
                    formatter={(value: number | undefined) => [formatPnl(Number(value ?? 0)), 'P&L']}
                  />
                  <ReferenceLine y={0} stroke="var(--color-text-muted)" strokeDasharray="3 3" />
                  <Bar dataKey="pnl" radius={[4, 4, 0, 0]} animationDuration={1000}>
                    {dayOfWeekData.map((entry, index) => (
                      <Cell key={`d-${index}`} fill={getBarColor(entry.pnl)} fillOpacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Best/worst summary */}
      {hasDaily && (
        <div className="mt-4 flex flex-wrap gap-3">
          {(() => {
            const activeDays = dayOfWeekData.filter((d) => d.tradeCount > 0);
            if (activeDays.length === 0) return null;
            const best = [...activeDays].sort((a, b) => b.pnl - a.pnl)[0];
            const worst = [...activeDays].sort((a, b) => a.pnl - b.pnl)[0];
            return (
              <>
                <div className="flex items-center gap-2 rounded-full bg-[var(--color-profit-bg)] px-3 py-1.5">
                  <span className="text-xs text-[var(--color-profit-light)]">
                    Best: <span className="font-semibold">{best.label}</span> ({formatPnl(best.pnl)})
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[var(--color-loss-bg)] px-3 py-1.5">
                  <span className="text-xs text-[var(--color-loss-light)]">
                    Worst: <span className="font-semibold">{worst.label}</span> ({formatPnl(worst.pnl)})
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
