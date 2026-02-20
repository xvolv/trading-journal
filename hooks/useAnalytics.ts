'use client';

import { useMemo } from 'react';
import type { Trade, MarketType, StrategyTag, EmotionTag, MistakeTag } from '@/types/types';
import { useTrades } from '@/context/TradesContext';

/* ============================================
   Computed Analytics Types
   ============================================ */

export interface AnalyticsSummary {
  totalPnl: number;
  totalFees: number;
  winRate: number;
  profitFactor: number;
  avgRiskReward: number;
  totalTrades: number;
  wins: number;
  losses: number;
  breakeven: number;
  avgWin: number;
  avgLoss: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  expectancy: number;
  largestWin: number;
  largestLoss: number;
}

export interface DailyPnl {
  date: string;
  pnl: number;
  tradeCount: number;
}

export interface GroupBreakdown {
  label: string;
  pnl: number;
  tradeCount: number;
  winRate: number;
  color: string;
}

export interface TagImpact {
  tag: string;
  label: string;
  avgPnl: number;
  tradeCount: number;
  totalPnl: number;
}

export interface MistakeCost {
  tag: string;
  label: string;
  count: number;
  totalCost: number;
  avgCost: number;
}

export interface TimeSlot {
  label: string;
  pnl: number;
  tradeCount: number;
  winRate: number;
}

export interface CumulativePoint {
  date: string;
  pnl: number;
  drawdown: number;
}

/* ============================================
   Constants
   ============================================ */

const MARKET_COLORS: Record<MarketType, string> = {
  crypto: '#f59e0b',
  forex: '#3b82f6',
  binary: '#a855f7',
  stocks: '#10b981',
  futures: '#ec4899',
};

const MARKET_LABELS: Record<MarketType, string> = {
  crypto: 'Crypto',
  forex: 'Forex',
  binary: 'Binary',
  stocks: 'Stocks',
  futures: 'Futures',
};

const STRATEGY_LABELS: Record<StrategyTag, string> = {
  scalping: 'Scalping',
  swing: 'Swing',
  'day-trade': 'Day Trade',
  news: 'News',
  breakout: 'Breakout',
  reversal: 'Reversal',
  'trend-follow': 'Trend Follow',
  'mean-reversion': 'Mean Reversion',
};

const STRATEGY_COLORS: Record<StrategyTag, string> = {
  scalping: '#6366f1',
  swing: '#8b5cf6',
  'day-trade': '#3b82f6',
  news: '#06b6d4',
  breakout: '#10b981',
  reversal: '#f59e0b',
  'trend-follow': '#ec4899',
  'mean-reversion': '#14b8a6',
};

const EMOTION_LABELS: Record<EmotionTag, string> = {
  calm: 'Calm',
  confident: 'Confident',
  fomo: 'FOMO',
  revenge: 'Revenge',
  anxious: 'Anxious',
  greedy: 'Greedy',
  tired: 'Tired',
};

const MISTAKE_LABELS: Record<MistakeTag, string> = {
  'over-leveraged': 'Over-sized',
  'no-stop-loss': 'No SL',
  'early-exit': 'Early Exit',
  'late-entry': 'Late Entry',
  'revenge-trade': 'Revenge Trade',
  'ignored-plan': 'Ignored Plan',
  chased: 'Chased',
  'no-plan': 'No Plan',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* ============================================
   Hook
   ============================================ */

export function useAnalytics() {
  const { trades } = useTrades();

  // Only consider closed trades for analytics
  const closedTrades = useMemo(
    () => trades.filter((t) => !t.isOpen && t.closedAt),
    [trades]
  );

  /* ---------- Summary Stats ---------- */
  const summary: AnalyticsSummary = useMemo(() => {
    if (closedTrades.length === 0) {
      return {
        totalPnl: 0, totalFees: 0, winRate: 0, profitFactor: 0,
        avgRiskReward: 0, totalTrades: 0, wins: 0, losses: 0, breakeven: 0,
        avgWin: 0, avgLoss: 0, bestTrade: null, worstTrade: null,
        expectancy: 0, largestWin: 0, largestLoss: 0,
      };
    }

    const wins = closedTrades.filter((t) => t.pnl > 0);
    const losses = closedTrades.filter((t) => t.pnl < 0);
    const be = closedTrades.filter((t) => t.pnl === 0);
    const totalPnl = closedTrades.reduce((s, t) => s + t.pnl, 0);
    const totalFees = closedTrades.reduce((s, t) => s + t.fees, 0);
    const grossProfit = wins.reduce((s, t) => s + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
    const rrTrades = closedTrades.filter((t) => t.riskRewardRatio !== null);

    const sorted = [...closedTrades].sort((a, b) => b.pnl - a.pnl);

    return {
      totalPnl,
      totalFees,
      winRate: (wins.length / closedTrades.length) * 100,
      profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
      avgRiskReward: rrTrades.length > 0
        ? rrTrades.reduce((s, t) => s + (t.riskRewardRatio ?? 0), 0) / rrTrades.length
        : 0,
      totalTrades: closedTrades.length,
      wins: wins.length,
      losses: losses.length,
      breakeven: be.length,
      avgWin: wins.length > 0 ? grossProfit / wins.length : 0,
      avgLoss: losses.length > 0 ? grossLoss / losses.length : 0,
      bestTrade: sorted[0] ?? null,
      worstTrade: sorted[sorted.length - 1] ?? null,
      expectancy: totalPnl / closedTrades.length,
      largestWin: sorted[0]?.pnl ?? 0,
      largestLoss: sorted[sorted.length - 1]?.pnl ?? 0,
    };
  }, [closedTrades]);

  /* ---------- Daily PnL ---------- */
  const dailyPnl: DailyPnl[] = useMemo(() => {
    const map = new Map<string, { pnl: number; count: number }>();
    for (const t of closedTrades) {
      const day = (t.closedAt ?? t.openedAt).slice(0, 10);
      const entry = map.get(day) ?? { pnl: 0, count: 0 };
      entry.pnl += t.pnl;
      entry.count += 1;
      map.set(day, entry);
    }
    return Array.from(map.entries())
      .map(([date, d]) => ({ date, pnl: Math.round(d.pnl * 100) / 100, tradeCount: d.count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [closedTrades]);

  /* ---------- Market Breakdown ---------- */
  const marketBreakdown: GroupBreakdown[] = useMemo(() => {
    const map = new Map<MarketType, { pnl: number; count: number; wins: number }>();
    for (const t of closedTrades) {
      const entry = map.get(t.market) ?? { pnl: 0, count: 0, wins: 0 };
      entry.pnl += t.pnl;
      entry.count += 1;
      if (t.pnl > 0) entry.wins += 1;
      map.set(t.market, entry);
    }
    return Array.from(map.entries())
      .map(([market, d]) => ({
        label: MARKET_LABELS[market],
        pnl: Math.round(d.pnl * 100) / 100,
        tradeCount: d.count,
        winRate: d.count > 0 ? Math.round((d.wins / d.count) * 100) : 0,
        color: MARKET_COLORS[market],
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [closedTrades]);

  /* ---------- Strategy Breakdown ---------- */
  const strategyBreakdown: GroupBreakdown[] = useMemo(() => {
    const map = new Map<StrategyTag, { pnl: number; count: number; wins: number }>();
    for (const t of closedTrades) {
      for (const tag of t.strategyTags) {
        const entry = map.get(tag) ?? { pnl: 0, count: 0, wins: 0 };
        entry.pnl += t.pnl;
        entry.count += 1;
        if (t.pnl > 0) entry.wins += 1;
        map.set(tag, entry);
      }
    }
    return Array.from(map.entries())
      .map(([tag, d]) => ({
        label: STRATEGY_LABELS[tag],
        pnl: Math.round(d.pnl * 100) / 100,
        tradeCount: d.count,
        winRate: d.count > 0 ? Math.round((d.wins / d.count) * 100) : 0,
        color: STRATEGY_COLORS[tag],
      }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [closedTrades]);

  /* ---------- Emotion Impact ---------- */
  const emotionImpact: TagImpact[] = useMemo(() => {
    const map = new Map<EmotionTag, { totalPnl: number; count: number }>();
    for (const t of closedTrades) {
      for (const tag of t.emotionTags) {
        const entry = map.get(tag) ?? { totalPnl: 0, count: 0 };
        entry.totalPnl += t.pnl;
        entry.count += 1;
        map.set(tag, entry);
      }
    }
    return Array.from(map.entries())
      .map(([tag, d]) => ({
        tag,
        label: EMOTION_LABELS[tag],
        avgPnl: Math.round((d.totalPnl / d.count) * 100) / 100,
        tradeCount: d.count,
        totalPnl: Math.round(d.totalPnl * 100) / 100,
      }))
      .sort((a, b) => b.avgPnl - a.avgPnl);
  }, [closedTrades]);

  /* ---------- Mistake Tracker ---------- */
  const mistakeCosts: MistakeCost[] = useMemo(() => {
    const map = new Map<MistakeTag, { count: number; totalCost: number }>();
    for (const t of closedTrades) {
      for (const tag of t.mistakeTags) {
        const entry = map.get(tag) ?? { count: 0, totalCost: 0 };
        entry.count += 1;
        entry.totalCost += t.pnl; // pnl is negative for losses
        map.set(tag, entry);
      }
    }
    return Array.from(map.entries())
      .map(([tag, d]) => ({
        tag,
        label: MISTAKE_LABELS[tag],
        count: d.count,
        totalCost: Math.round(d.totalCost * 100) / 100,
        avgCost: Math.round((d.totalCost / d.count) * 100) / 100,
      }))
      .sort((a, b) => a.totalCost - b.totalCost); // worst cost first
  }, [closedTrades]);

  /* ---------- Time Analysis ---------- */
  const hourlyAnalysis: TimeSlot[] = useMemo(() => {
    const map = new Map<number, { pnl: number; count: number; wins: number }>();
    for (const t of closedTrades) {
      const hour = new Date(t.openedAt).getUTCHours();
      const entry = map.get(hour) ?? { pnl: 0, count: 0, wins: 0 };
      entry.pnl += t.pnl;
      entry.count += 1;
      if (t.pnl > 0) entry.wins += 1;
      map.set(hour, entry);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([hour, d]) => ({
        label: `${String(hour).padStart(2, '0')}:00`,
        pnl: Math.round(d.pnl * 100) / 100,
        tradeCount: d.count,
        winRate: d.count > 0 ? Math.round((d.wins / d.count) * 100) : 0,
      }));
  }, [closedTrades]);

  const dayOfWeekAnalysis: TimeSlot[] = useMemo(() => {
    const map = new Map<number, { pnl: number; count: number; wins: number }>();
    for (const t of closedTrades) {
      const dow = new Date(t.openedAt).getUTCDay();
      const entry = map.get(dow) ?? { pnl: 0, count: 0, wins: 0 };
      entry.pnl += t.pnl;
      entry.count += 1;
      if (t.pnl > 0) entry.wins += 1;
      map.set(dow, entry);
    }
    return Array.from({ length: 7 }, (_, i) => {
      const d = map.get(i) ?? { pnl: 0, count: 0, wins: 0 };
      return {
        label: DAY_NAMES[i],
        pnl: Math.round(d.pnl * 100) / 100,
        tradeCount: d.count,
        winRate: d.count > 0 ? Math.round((d.wins / d.count) * 100) : 0,
      };
    });
  }, [closedTrades]);

  /* ---------- Cumulative PnL + Drawdown ---------- */
  const cumulativePnl: CumulativePoint[] = useMemo(() => {
    if (dailyPnl.length === 0) return [];
    let running = 0;
    let peak = 0;
    return dailyPnl.map((d) => {
      running += d.pnl;
      if (running > peak) peak = running;
      const drawdown = peak > 0 ? ((running - peak) / peak) * 100 : 0;
      return {
        date: d.date,
        pnl: Math.round(running * 100) / 100,
        drawdown: Math.round(drawdown * 100) / 100,
      };
    });
  }, [dailyPnl]);

  return {
    summary,
    dailyPnl,
    marketBreakdown,
    strategyBreakdown,
    emotionImpact,
    mistakeCosts,
    hourlyAnalysis,
    dayOfWeekAnalysis,
    cumulativePnl,
    closedTrades,
  };
}
