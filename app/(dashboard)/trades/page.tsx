'use client';

import { useState, useMemo, useCallback } from 'react';
import { ScrollText, Plus } from 'lucide-react';
import Link from 'next/link';
import { useTrades } from '@/context/TradesContext';
import { TradesToolbar, type SortField, type SortDir } from '@/components/trades/TradesToolbar';
import { TradesFilters, type FilterState, EMPTY_FILTERS, type ResultFilter } from '@/components/trades/TradesFilters';
import { TradeRow } from '@/components/trades/TradeRow';
import { BulkActions } from '@/components/trades/BulkActions';
import type { Trade } from '@/types/types';

/* ============================================
   Helpers
   ============================================ */

function isInDateRange(trade: Trade, range: FilterState['dateRange']): boolean {
  if (range === 'all') return true;
  const d = new Date(trade.closedAt ?? trade.openedAt);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === 'today') return d >= startOfDay;
  if (range === 'week') {
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return d >= startOfWeek;
  }
  if (range === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return d >= startOfMonth;
  }
  return true;
}

function getResult(trade: Trade): ResultFilter {
  if (trade.isOpen) return 'open';
  return trade.pnl >= 0 ? 'winner' : 'loser';
}

function sortTrades(trades: Trade[], field: SortField, dir: SortDir): Trade[] {
  const sorted = [...trades].sort((a, b) => {
    switch (field) {
      case 'date': {
        const da = new Date(a.closedAt ?? a.openedAt).getTime();
        const db = new Date(b.closedAt ?? b.openedAt).getTime();
        return da - db;
      }
      case 'pnl':
        return a.pnl - b.pnl;
      case 'rr':
        return (a.riskRewardRatio ?? 0) - (b.riskRewardRatio ?? 0);
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'size':
        return a.size - b.size;
      default:
        return 0;
    }
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}

/* ============================================
   Page Component
   ============================================ */

export default function TradesPage() {
  const { trades, deleteTrade, deleteMultiple, updateTrade } = useTrades();

  // Search & filters
  const [search, setSearch] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  // Sort
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSortChange = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDir('desc');
      }
    },
    [sortField]
  );

  // Compute active filter count
  const activeFilterCount =
    filters.markets.length +
    filters.directions.length +
    filters.results.length +
    (filters.dateRange !== 'all' ? 1 : 0);

  // Filter + search + sort pipeline
  const filteredTrades = useMemo(() => {
    let list = trades;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q) ||
          t.market.toLowerCase().includes(q)
      );
    }

    // Market filter
    if (filters.markets.length > 0) {
      list = list.filter((t) => filters.markets.includes(t.market));
    }

    // Direction filter
    if (filters.directions.length > 0) {
      list = list.filter((t) => filters.directions.includes(t.direction));
    }

    // Result filter
    if (filters.results.length > 0) {
      list = list.filter((t) => filters.results.includes(getResult(t)));
    }

    // Date filter
    list = list.filter((t) => isInDateRange(t, filters.dateRange));

    // Sort
    list = sortTrades(list, sortField, sortDir);

    return list;
  }, [trades, search, filters, sortField, sortDir]);

  // Selection helpers
  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selected.size === filteredTrades.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredTrades.map((t) => t.id)));
    }
  }, [filteredTrades, selected.size]);

  const handleDeleteSelected = useCallback(() => {
    deleteMultiple(Array.from(selected));
    setSelected(new Set());
  }, [selected, deleteMultiple]);

  const handleDeleteSingle = useCallback(
    (id: string) => {
      deleteTrade(id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [deleteTrade]
  );

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScrollText className="h-6 w-6 text-[var(--color-accent)]" />
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Trades Journal</h1>
        </div>
        <Link
          href="/trade/new"
          className="flex items-center gap-2 bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-accent-light)]"
        >
          <Plus className="h-4 w-4" />
          New Trade
        </Link>
      </div>

      {/* Toolbar */}
      <TradesToolbar
        search={search}
        onSearchChange={setSearch}
        filtersVisible={filtersVisible}
        onToggleFilters={() => setFiltersVisible(!filtersVisible)}
        activeFilterCount={activeFilterCount}
        sortField={sortField}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        tradeCount={filteredTrades.length}
      />

      {/* Filters panel */}
      {filtersVisible && (
        <div className="mt-3">
          <TradesFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(EMPTY_FILTERS)}
          />
        </div>
      )}

      {/* Table */}
      {filteredTrades.length > 0 ? (
        <div className="mt-4 overflow-x-auto border border-[var(--color-surface-border)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)]">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === filteredTrades.length && filteredTrades.length > 0}
                    onChange={selectAll}
                    className="h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
                  />
                </th>
                {[
                  { label: 'Symbol', field: 'symbol' as SortField },
                  { label: 'Dir', field: null },
                  { label: 'Entry', field: null },
                  { label: 'Exit', field: null },
                  { label: 'Size', field: 'size' as SortField, hideClass: 'hidden lg:table-cell' },
                  { label: 'PnL', field: 'pnl' as SortField },
                  { label: 'R:R', field: 'rr' as SortField, hideClass: 'hidden md:table-cell' },
                  { label: 'Tags', field: null, hideClass: 'hidden xl:table-cell' },
                  { label: 'Date', field: 'date' as SortField, align: 'text-right' },
                ].map((col, i) => (
                  <th
                    key={i}
                    className={`px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] ${col.hideClass || ''} ${col.align || ''} ${col.field ? 'cursor-pointer select-none hover:text-[var(--color-text-primary)]' : ''}`}
                    onClick={col.field ? () => handleSortChange(col.field!) : undefined}
                  >
                    {col.label}
                    {col.field && sortField === col.field && (
                      <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                  isSelected={selected.has(trade.id)}
                  onToggleSelect={() => toggleSelect(trade.id)}
                  onDelete={handleDeleteSingle}
                  onUpdate={updateTrade}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center py-20 text-center">
          <ScrollText className="mb-4 h-12 w-12 text-[var(--color-text-muted)]" />
          <p className="text-lg font-semibold text-[var(--color-text-secondary)]">No trades found</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {search || activeFilterCount > 0
              ? 'Try adjusting your search or filters.'
              : 'Log your first trade to get started.'}
          </p>
          {!search && activeFilterCount === 0 && (
            <Link
              href="/trade/new"
              className="mt-4 flex items-center gap-2 bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-accent-light)]"
            >
              <Plus className="h-4 w-4" />
              New Trade
            </Link>
          )}
        </div>
      )}

      {/* Bulk Actions */}
      <BulkActions
        count={selected.size}
        onDeleteSelected={handleDeleteSelected}
        onDeselectAll={() => setSelected(new Set())}
      />
    </div>
  );
}
