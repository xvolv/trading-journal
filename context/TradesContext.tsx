'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Trade } from '@/types/types';
import { MOCK_TRADES } from '@/lib/mock-data';

/* ============================================
   TradesContext — shared trade state
   ============================================ */

interface TradesContextValue {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  deleteMultiple: (ids: string[]) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
}

const TradesContext = createContext<TradesContextValue | null>(null);

const STORAGE_KEY = 'trade-forge-trades';

function loadTrades(): Trade[] {
  if (typeof window === 'undefined') return MOCK_TRADES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Trade[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupted data — fall through
  }
  return MOCK_TRADES;
}

function saveTrades(trades: Trade[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch {
    // storage full — silently fail
  }
}

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(loadTrades);

  // Persist on every change
  useEffect(() => {
    saveTrades(trades);
  }, [trades]);

  const addTrade = useCallback((trade: Trade) => {
    setTrades((prev) => [trade, ...prev]);
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const deleteMultiple = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setTrades((prev) => prev.filter((t) => !idSet.has(t.id)));
  }, []);

  const updateTrade = useCallback((id: string, updates: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  return (
    <TradesContext.Provider
      value={{ trades, addTrade, deleteTrade, deleteMultiple, updateTrade }}
    >
      {children}
    </TradesContext.Provider>
  );
}

export function useTrades() {
  const ctx = useContext(TradesContext);
  if (!ctx) {
    throw new Error('useTrades must be used within a TradesProvider');
  }
  return ctx;
}
