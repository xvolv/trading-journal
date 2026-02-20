import { PnlHeroDisplay } from '@/components/dashboard/PnlHeroDisplay';
import { EquityCurve } from '@/components/dashboard/EquityCurve';
import { CalendarHeatmap } from '@/components/dashboard/CalendarHeatmap';
import { RecentTradesList } from '@/components/dashboard/RecentTradesList';
import { DisciplineAlert } from '@/components/dashboard/DisciplineAlert';
import { StatCard } from '@/components/ui/StatCard';
import { MOCK_DASHBOARD_STATS } from '@/lib/mock-data';
import { formatPercent, formatRatio, formatPnl } from '@/lib/utils';
import {
  Target,
  TrendingUp,
  BarChart3,
  Flame,
  Trophy,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS;

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
      <DisciplineAlert
        message="You're approaching your daily profit target (+$565 / $1,000). Consider scaling down risk."
        type="warning"
      />

      {/* PNL Hero + Stat Cards Row */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <PnlHeroDisplay />

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Win Rate"
            value={formatPercent(stats.winRate)}
            icon={<Target className="h-5 w-5" />}
            trend={{ value: '5.2%', positive: true }}
          />
          <StatCard
            label="Avg R:R"
            value={formatRatio(stats.avgRiskReward)}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: '0.3', positive: true }}
          />
          <StatCard
            label="Total Trades"
            value={String(stats.totalTrades)}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            label="Profit Factor"
            value={stats.profitFactor.toFixed(2)}
            icon={<Flame className="h-5 w-5" />}
            trend={{ value: '0.4', positive: true }}
          />
        </div>
      </div>

      {/* Equity Curve + Calendar Row */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <EquityCurve />
        <CalendarHeatmap />
      </div>

      {/* Streak + Best/Worst + Recent Trades Row */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Quick stats column */}
        <div className="space-y-4">
          <div className="card-solid p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-profit-bg)]">
                <Trophy className="h-5 w-5 text-[var(--color-profit-light)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-tertiary)]">Current Streak</p>
                <p className="text-xl font-bold text-[var(--color-profit-light)]">
                  {stats.currentStreak.count} {stats.currentStreak.type === 'win' ? 'Wins' : 'Losses'}
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
                  {formatPnl(stats.bestDay.pnl)}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{stats.bestDay.date}</p>
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
                  {formatPnl(stats.worstDay.pnl)}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{stats.worstDay.date}</p>
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
