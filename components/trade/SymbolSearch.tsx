'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Star, Clock, TrendingUp } from 'lucide-react';
import type { SymbolInfo } from '@/types/types';
import { SYMBOLS_LIST, RECENT_SYMBOLS } from '@/lib/constants';
import { getMarketColor } from '@/lib/utils';

interface SymbolSearchProps {
  value: SymbolInfo | null;
  onSelect: (symbol: SymbolInfo) => void;
}

export function SymbolSearch({ value, onSelect }: SymbolSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [symbolsList, setSymbolsList] = useState<SymbolInfo[]>(SYMBOLS_LIST);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch symbols from API on mount, fallback to mock
  useEffect(() => {
    let cancelled = false;
    fetch('/api/symbols')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: SymbolInfo[]) => {
        if (!cancelled) setSymbolsList(data);
      })
      .catch((err) => {
        console.warn('Failed to fetch symbols from API, using mock:', err);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return symbolsList.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.market.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [query, symbolsList]);

  const recentSymbols = useMemo(
    () =>
      RECENT_SYMBOLS.map((s) => symbolsList.find((sym) => sym.symbol === s)!).filter(
        Boolean
      ),
    [symbolsList]
  );

  const showList = isOpen && (filtered.length > 0 || (query === '' && recentSymbols.length > 0));
  const displayList = query.trim() ? filtered : recentSymbols;

  useEffect(() => {
    setFocusIdx(-1);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showList) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx((i) => Math.min(i + 1, displayList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && focusIdx >= 0) {
      e.preventDefault();
      onSelect(displayList[focusIdx]);
      setQuery(displayList[focusIdx].symbol);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        Market / Symbol
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : value ? value.symbol : query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (value) setQuery('');
          }}
          placeholder="Search BTC/USDT, EUR/USD, NVDA..."
          className="input-trade w-full pl-20 pr-4 border border-red-500"
          onKeyDown={handleKeyDown}
        />
        {value && !isOpen && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-[10px] font-bold uppercase"
            style={{
              backgroundColor: getMarketColor(value.market) + '20',
              color: getMarketColor(value.market),
            }}
          >
            {value.market}
          </span>
        )}
      </div>

      {showList && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto border border-[var(--color-surface-border)] bg-[var(--color-bg-card)] shadow-lg"
        >
          {!query.trim() && (
            <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <Clock className="h-3 w-3" /> Recent
            </div>
          )}
          {displayList.map((sym, i) => (
            <button
              key={sym.symbol}
              type="button"
              onClick={() => {
                onSelect(sym);
                setQuery(sym.symbol);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--color-surface-glass-hover)] ${
                i === focusIdx ? 'bg-[var(--color-surface-glass-hover)]' : ''
              }`}
            >
              <TrendingUp
                className="h-4 w-4"
                style={{ color: getMarketColor(sym.market) }}
              />
              <span className="font-medium text-[var(--color-text-primary)]">
                {sym.symbol}
              </span>
              <span
                className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: getMarketColor(sym.market) + '18',
                  color: getMarketColor(sym.market),
                }}
              >
                {sym.market}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                ${sym.mockPrice.toLocaleString()}
              </span>
              {RECENT_SYMBOLS.includes(sym.symbol) && (
                <Star className="h-3 w-3 text-[var(--color-warning)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
