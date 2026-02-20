'use client';

import { X } from 'lucide-react';
import type { MarketType, TradeDirection } from '@/types/types';

export type ResultFilter = 'winner' | 'loser' | 'open';
export type DateFilter = 'today' | 'week' | 'month' | 'all';

export interface FilterState {
  markets: MarketType[];
  directions: TradeDirection[];
  results: ResultFilter[];
  dateRange: DateFilter;
}

export const EMPTY_FILTERS: FilterState = {
  markets: [],
  directions: [],
  results: [],
  dateRange: 'all',
};

interface TradesFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

type ChipDef<T extends string> = { value: T; label: string; color?: string };

const MARKET_CHIPS: ChipDef<MarketType>[] = [
  { value: 'crypto', label: 'Crypto', color: '#f7931a' },
  { value: 'forex', label: 'Forex', color: '#4ade80' },
  { value: 'stocks', label: 'Stocks', color: '#818cf8' },
  { value: 'binary', label: 'Binary', color: '#f472b6' },
  { value: 'futures', label: 'Futures', color: '#38bdf8' },
];

const DIRECTION_CHIPS: ChipDef<TradeDirection>[] = [
  { value: 'long', label: 'Long' },
  { value: 'short', label: 'Short' },
  { value: 'call', label: 'Call' },
  { value: 'put', label: 'Put' },
];

const RESULT_CHIPS: ChipDef<ResultFilter>[] = [
  { value: 'winner', label: 'Winners' },
  { value: 'loser', label: 'Losers' },
  { value: 'open', label: 'Open' },
];

const DATE_CHIPS: ChipDef<DateFilter>[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

function toggleInArray<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export function TradesFilters({ filters, onChange, onClear }: TradesFiltersProps) {
  const activeCount =
    filters.markets.length +
    filters.directions.length +
    filters.results.length +
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className="space-y-4 border border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)] p-4 animate-fade-in">
      {/* Market */}
      <FilterRow label="Market">
        {MARKET_CHIPS.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            active={filters.markets.includes(c.value)}
            accentColor={c.color}
            onClick={() =>
              onChange({ ...filters, markets: toggleInArray(filters.markets, c.value) })
            }
          />
        ))}
      </FilterRow>

      {/* Direction */}
      <FilterRow label="Direction">
        {DIRECTION_CHIPS.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            active={filters.directions.includes(c.value)}
            onClick={() =>
              onChange({
                ...filters,
                directions: toggleInArray(filters.directions, c.value),
              })
            }
          />
        ))}
      </FilterRow>

      {/* Result */}
      <FilterRow label="Result">
        {RESULT_CHIPS.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            active={filters.results.includes(c.value)}
            onClick={() =>
              onChange({ ...filters, results: toggleInArray(filters.results, c.value) })
            }
          />
        ))}
      </FilterRow>

      {/* Date */}
      <FilterRow label="Date">
        {DATE_CHIPS.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            active={filters.dateRange === c.value}
            onClick={() => onChange({ ...filters, dateRange: c.value })}
          />
        ))}
      </FilterRow>

      {/* Clear */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-semibold text-[var(--color-loss-light)] transition-colors hover:text-[var(--color-loss)]"
        >
          <X className="h-3 w-3" />
          Clear All ({activeCount})
        </button>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  label,
  active,
  accentColor,
  onClick,
}: {
  label: string;
  active: boolean;
  accentColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border px-3 py-1.5 text-xs font-semibold transition-all"
      style={{
        borderColor: active
          ? accentColor || 'var(--color-accent)'
          : 'var(--color-surface-border)',
        backgroundColor: active
          ? (accentColor || 'var(--color-accent)') + '18'
          : 'transparent',
        color: active
          ? accentColor || 'var(--color-accent-light)'
          : 'var(--color-text-secondary)',
      }}
    >
      {label}
    </button>
  );
}
