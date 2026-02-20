'use client';

import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

export type SortField = 'date' | 'pnl' | 'rr' | 'symbol' | 'size';
export type SortDir = 'asc' | 'desc';

interface TradesToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filtersVisible: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
  sortField: SortField;
  sortDir: SortDir;
  onSortChange: (field: SortField) => void;
  tradeCount: number;
}

export function TradesToolbar({
  search,
  onSearchChange,
  filtersVisible,
  onToggleFilters,
  activeFilterCount,
  sortField,
  sortDir,
  onSortChange,
  tradeCount,
}: TradesToolbarProps) {
  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'date', label: 'Date' },
    { value: 'pnl', label: 'PnL' },
    { value: 'rr', label: 'R:R' },
    { value: 'symbol', label: 'Symbol' },
    { value: 'size', label: 'Size' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search symbol, notes..."
          className="input-trade w-full pl-10 pr-4"
        />
      </div>

      {/* Filters toggle */}
      <button
        type="button"
        onClick={onToggleFilters}
        className={`flex items-center gap-2 border px-4 py-2.5 text-xs font-semibold transition-all ${
          filtersVisible
            ? 'border-[var(--color-accent)] bg-[var(--color-accent-bg)] text-[var(--color-accent-light)]'
            : 'border-[var(--color-surface-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
        }`}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center bg-[var(--color-accent)] text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Sort dropdown */}
      <div className="relative">
        <select
          value={sortField}
          onChange={(e) => onSortChange(e.target.value as SortField)}
          className="input-trade appearance-none pr-8 text-xs font-semibold"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label} {sortField === o.value ? (sortDir === 'asc' ? '↑' : '↓') : ''}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
      </div>

      {/* Trade count */}
      <span className="text-xs font-medium text-[var(--color-text-muted)]">
        {tradeCount} {tradeCount === 1 ? 'trade' : 'trades'}
      </span>
    </div>
  );
}
