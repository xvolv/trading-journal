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
   (fetches from API, falls back to mock data)
   ============================================ */

interface TradesContextValue {
  trades: Trade[];
  loading: boolean;
  addTrade: (trade: Trade) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  deleteMultiple: (ids: string[]) => Promise<void>;
  updateTrade: (id: string, updates: Partial<Trade>) => Promise<void>;
}

const TradesContext = createContext<TradesContextValue | null>(null);

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch trades from API on mount ──────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchTrades() {
      try {
        const res = await fetch('/api/trades');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Trade[] = await res.json();
        if (!cancelled) {
          setTrades(data);
        }
      } catch (err) {
        console.warn('Failed to fetch trades from API, using mock data:', err);
        if (!cancelled) {
          setTrades(MOCK_TRADES);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrades();
    return () => { cancelled = true; };
  }, []);

  // ── Add trade via API ──────────────────────────────────
  const addTrade = useCallback(async (trade: Trade) => {
    // Optimistic update
    setTrades((prev) => [trade, ...prev]);

    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Replace the optimistic entry with the server response (has real ID)
      const created: Trade = await res.json();
      setTrades((prev) =>
        prev.map((t) => (t.id === trade.id ? created : t)),
      );
    } catch (err) {
      console.warn('Failed to save trade to API, keeping local copy:', err);
    }
  }, []);

  // ── Delete trade via API ───────────────────────────────
  const deleteTrade = useCallback(async (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`/api/trades/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.warn('Failed to delete trade from API:', err);
    }
  }, []);

  // ── Delete multiple trades via API ─────────────────────
  const deleteMultiple = useCallback(async (ids: string[]) => {
    const idSet = new Set(ids);
    setTrades((prev) => prev.filter((t) => !idSet.has(t.id)));

    // Fire all deletes in parallel
    await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/trades/${id}`, { method: 'DELETE' }).catch((err) =>
          console.warn(`Failed to delete trade ${id}:`, err),
        ),
      ),
    );
  }, []);

  // ── Update trade via API ───────────────────────────────
  const updateTrade = useCallback(async (id: string, updates: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );

    try {
      const res = await fetch(`/api/trades/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.warn('Failed to update trade in API:', err);
    }
  }, []);

  return (
    <TradesContext.Provider
      value={{ trades, loading, addTrade, deleteTrade, deleteMultiple, updateTrade }}
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
