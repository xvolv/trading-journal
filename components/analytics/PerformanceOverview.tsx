'use client';

import {
  DollarSign,
  Target,
  TrendingUp,
  BarChart3,
  Flame,
  Zap,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { formatPnl, formatPercent, formatRatio } from '@/lib/utils';
import type { AnalyticsSummary } from '@/hooks/useAnalytics';

interface Props {
  summary: AnalyticsSummary;
}

export function PerformanceOverview({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        label="Net P&L"
        value={formatPnl(summary.totalPnl)}
        icon={<DollarSign className="h-5 w-5" />}
        trend={
          summary.totalPnl !== 0
            ? { value: formatPnl(summary.totalPnl), positive: summary.totalPnl > 0 }
            : null
        }
      />
      <StatCard
        label="Win Rate"
        value={formatPercent(summary.winRate)}
        icon={<Target className="h-5 w-5" />}
        trend={
          summary.winRate >= 50
            ? { value: `${summary.wins}W / ${summary.losses}L`, positive: true }
            : { value: `${summary.wins}W / ${summary.losses}L`, positive: false }
        }
      />
      <StatCard
        label="Profit Factor"
        value={summary.profitFactor === Infinity ? '∞' : summary.profitFactor.toFixed(2)}
        icon={<Flame className="h-5 w-5" />}
        trend={
          summary.profitFactor > 1
            ? { value: 'Profitable', positive: true }
            : summary.profitFactor > 0
            ? { value: 'Unprofitable', positive: false }
            : null
        }
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
        label="Expectancy"
        value={formatPnl(summary.expectancy)}
        icon={<Zap className="h-5 w-5" />}
        trend={
          summary.expectancy !== 0
            ? { value: 'per trade', positive: summary.expectancy > 0 }
            : null
        }
      />
    </div>
  );
}
