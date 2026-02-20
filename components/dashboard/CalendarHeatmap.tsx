'use client';

import { MOCK_CALENDAR_DAYS } from '@/lib/mock-data';
import { formatPnl } from '@/lib/utils';
import { useState } from 'react';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getPnlColor(pnl: number): string {
  if (pnl === 0) return 'bg-[var(--color-bg-tertiary)]';
  if (pnl > 400) return 'bg-emerald-500/70';
  if (pnl > 200) return 'bg-emerald-500/50';
  if (pnl > 0) return 'bg-emerald-500/30';
  if (pnl > -200) return 'bg-red-500/30';
  if (pnl > -400) return 'bg-red-500/50';
  return 'bg-red-500/70';
}

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0, Sunday = 6 (ISO)
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6;

  const grid: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  return grid;
}

export function CalendarHeatmap() {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const year = 2026;
  const month = 1; // February (0-indexed)
  const grid = getMonthGrid(year, month);
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const dayDataMap = new Map(
    MOCK_CALENDAR_DAYS.map((d) => [d.date, d])
  );

  return (
    <div className="card-solid p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">Calendar</h3>
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">{monthName}</span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[10px] font-medium text-[var(--color-text-muted)] py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const data = dayDataMap.get(dateStr);
          const pnl = data?.pnl ?? 0;
          const tradeCount = data?.tradeCount ?? 0;
          const hasData = !!data;
          const isHovered = hoveredDay === dateStr;

          return (
            <div
              key={dateStr}
              className={`relative aspect-square rounded-md flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-150 ${
                hasData
                  ? getPnlColor(pnl)
                  : 'bg-[var(--color-bg-tertiary)]/50'
              } ${
                isHovered ? 'ring-2 ring-[var(--color-accent)] scale-110 z-10' : ''
              }`}
              onMouseEnter={() => setHoveredDay(dateStr)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <span className={`${hasData ? 'text-white/80' : 'text-[var(--color-text-muted)]'}`}>
                {day}
              </span>

              {/* Tooltip */}
              {isHovered && hasData && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-surface-border)] px-3 py-2 text-xs shadow-lg">
                  <p className={`font-bold ${pnl >= 0 ? 'text-[var(--color-profit-light)]' : 'text-[var(--color-loss-light)]'}`}>
                    {formatPnl(pnl)}
                  </p>
                  <p className="text-[var(--color-text-muted)]">{tradeCount} trade{tradeCount !== 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[var(--color-text-muted)]">
        <span>Loss</span>
        <div className="flex gap-0.5">
          <div className="h-3 w-3 rounded-sm bg-red-500/70" />
          <div className="h-3 w-3 rounded-sm bg-red-500/50" />
          <div className="h-3 w-3 rounded-sm bg-red-500/30" />
          <div className="h-3 w-3 rounded-sm bg-[var(--color-bg-tertiary)]" />
          <div className="h-3 w-3 rounded-sm bg-emerald-500/30" />
          <div className="h-3 w-3 rounded-sm bg-emerald-500/50" />
          <div className="h-3 w-3 rounded-sm bg-emerald-500/70" />
        </div>
        <span>Profit</span>
      </div>
    </div>
  );
}
