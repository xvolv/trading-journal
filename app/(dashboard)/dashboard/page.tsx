'use client';

import { useMemo } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTrades } from '@/context/TradesContext';
import { useAccountBalance } from '@/hooks/useAccountBalance';
import { PnlHeroDisplay } from '@/components/dashboard/PnlHeroDisplay';
import { EquityCurve } from '@/components/dashboard/EquityCurve';
import { CalendarHeatmap } from '@/components/dashboard/CalendarHeatmap';
import { RecentTradesList } from '@/components/dashboard/RecentTradesList';
import { DisciplineAlert } from '@/components/dashboard/DisciplineAlert';
import { StatCard } from '@/components/ui/StatCard';
import { formatPercent, formatRatio, formatPnl } from '@/lib/utils';
import type { EquityDataPoint, CalendarDay } from '@/types/types';
import {
  Target,
  TrendingUp,
  BarChart3,
  Flame,
  Trophy,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { loading } = useTrades();
  const { summary, dailyPnl, cumulativePnl } = useAnalytics();
  const [accountBalance] = useAccountBalance();

  // ── Compute PnL by period from daily data ───────────────
  const periodPnl = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // Start of current week (Monday)
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - mondayOffset);
    const weekStartStr = weekStart.toISOString().slice(0, 10);

    // Start of current month
    const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    let today = 0;
    let week = 0;
    let month = 0;

    for (const d of dailyPnl) {
      if (d.date === todayStr) today += d.pnl;
      if (d.date >= weekStartStr) week += d.pnl;
      if (d.date >= monthStartStr) month += d.pnl;
    }

    return { today, week, month };
  }, [dailyPnl]);

  // ── Equity curve from cumulative PnL + account balance ──
  const equityData: EquityDataPoint[] = useMemo(() => {
    return cumulativePnl.map((p) => ({
      date: p.date,
      equity: accountBalance + p.pnl,
      drawdown: p.drawdown,
    }));
  }, [cumulativePnl, accountBalance]);

  // ── Calendar data from daily PnL ────────────────────────
  const calendarDays: CalendarDay[] = useMemo(() => {
    return dailyPnl.map((d) => ({
      date: d.date,
      pnl: d.pnl,
      tradeCount: d.tradeCount,
    }));
  }, [dailyPnl]);

  // ── Best / worst day ────────────────────────────────────
  const bestDay = useMemo(() => {
    if (dailyPnl.length === 0) return { date: '—', pnl: 0 };
    return dailyPnl.reduce((best, d) => (d.pnl > best.pnl ? d : best), dailyPnl[0]);
  }, [dailyPnl]);

  const worstDay = useMemo(() => {
    if (dailyPnl.length === 0) return { date: '—', pnl: 0 };
    return dailyPnl.reduce((worst, d) => (d.pnl < worst.pnl ? d : worst), dailyPnl[0]);
  }, [dailyPnl]);

  // ── Current streak ──────────────────────────────────────
  const currentStreak = useMemo(() => {
    if (dailyPnl.length === 0) return { type: 'win' as const, count: 0 };

    const sorted = [...dailyPnl].sort((a, b) => b.date.localeCompare(a.date));
    const streakType = sorted[0].pnl >= 0 ? 'win' : 'loss';
    let count = 0;

    for (const d of sorted) {
      if (streakType === 'win' && d.pnl >= 0) count++;
      else if (streakType === 'loss' && d.pnl < 0) count++;
      else break;
    }

    return { type: streakType as 'win' | 'loss', count };
  }, [dailyPnl]);

  // ── Discipline alert ────────────────────────────────────
  const disciplineMessage = useMemo(() => {
    if (periodPnl.today > 0) {
      return `You've made ${formatPnl(periodPnl.today)} today. Stay focused and manage your risk.`;
    }
    if (periodPnl.today < -300) {
      return `You're down ${formatPnl(periodPnl.today)} today. Consider stepping away.`;
    }
    return null;
  }, [periodPnl.today]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] animate-fade-in">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
          Your trading performance at a glance
        </p>
      </div>

      {/* Discipline Alert */}
      {disciplineMessage && (
        <DisciplineAlert
          message={disciplineMessage}
          type={periodPnl.today < -300 ? 'danger' : 'warning'}
        />
      )}

      {/* PNL Hero + Stat Cards Row */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PnlHeroDisplay
          netPnlToday={periodPnl.today}
          netPnlWeek={periodPnl.week}
          netPnlMonth={periodPnl.month}
        />

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Win Rate"
            value={formatPercent(summary.winRate)}
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            label="Avg R:R"
            value={formatRatio(summary.avgRiskReward)}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            label="Total Trades"
            value={String(summary.totalTrades)}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            label="Profit Factor"
            value={summary.profitFactor === Infinity ? '∞' : summary.profitFactor.toFixed(2)}
            icon={<Flame className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Equity Curve + Calendar Row */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <EquityCurve data={equityData} />
        <CalendarHeatmap days={calendarDays} />
      </div>

      {/* Streak + Best/Worst + Recent Trades Row */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Quick stats column */}
        <div className="space-y-4">
          <div className="card-solid p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                currentStreak.type === 'win'
                  ? 'bg-[var(--color-profit-bg)]'
                  : 'bg-[var(--color-loss-bg)]'
              }`}>
                <Trophy className={`h-5 w-5 ${
                  currentStreak.type === 'win'
                    ? 'text-[var(--color-profit-light)]'
                    : 'text-[var(--color-loss-light)]'
                }`} />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Current Streak</p>
                <p className={`text-xl font-bold ${
                  currentStreak.type === 'win'
                    ? 'text-[var(--color-profit-light)]'
                    : 'text-[var(--color-loss-light)]'
                }`}>
                  {currentStreak.count} {currentStreak.type === 'win' ? 'Wins' : 'Losses'}
                </p>
              </div>
            </div>
          </div>

          <div className="card-solid p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-profit-bg)]">
                <TrendingUp className="h-5 w-5 text-[var(--color-profit-light)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Best Day</p>
                <p className="text-lg font-bold text-[var(--color-profit-light)]">
                  {formatPnl(bestDay.pnl)}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{bestDay.date}</p>
              </div>
            </div>
          </div>

          <div className="card-solid p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-loss-bg)]">
                <AlertCircle className="h-5 w-5 text-[var(--color-loss-light)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Worst Day</p>
                <p className="text-lg font-bold text-[var(--color-loss-light)]">
                  {formatPnl(worstDay.pnl)}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{worstDay.date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <RecentTradesList />
      </div>
    </div>
  );
}
