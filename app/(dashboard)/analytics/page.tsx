'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { PerformanceOverview } from '@/components/analytics/PerformanceOverview';
import { PnlBarChart } from '@/components/analytics/PnlBarChart';
import { WinLossDonut } from '@/components/analytics/WinLossDonut';
import { CumulativePnlChart } from '@/components/analytics/CumulativePnlChart';
import { MarketBreakdown } from '@/components/analytics/MarketBreakdown';
import { StrategyBreakdown } from '@/components/analytics/StrategyBreakdown';
import { EmotionImpact } from '@/components/analytics/EmotionImpact';
import { MistakeTracker } from '@/components/analytics/MistakeTracker';
import { TimeAnalysis } from '@/components/analytics/TimeAnalysis';

export default function AnalyticsPage() {
  const {
    summary,
    dailyPnl,
    cumulativePnl,
    marketBreakdown,
    strategyBreakdown,
    emotionImpact,
    mistakeCosts,
    hourlyAnalysis,
    dayOfWeekAnalysis,
  } = useAnalytics();

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Analytics & Insights
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
          Deep dive into your trading performance, patterns, and psychology
        </p>
      </div>

      {/* Performance Overview — stat cards */}
      <PerformanceOverview summary={summary} />

      {/* Daily PnL Chart + Win/Loss Donut */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <PnlBarChart data={dailyPnl} />
        <WinLossDonut summary={summary} />
      </div>

      {/* Cumulative PnL — full width */}
      <CumulativePnlChart data={cumulativePnl} />

      {/* Market + Strategy Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MarketBreakdown data={marketBreakdown} />
        <StrategyBreakdown data={strategyBreakdown} />
      </div>

      {/* Emotion Impact + Mistake Tracker */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EmotionImpact data={emotionImpact} />
        <MistakeTracker data={mistakeCosts} />
      </div>

      {/* Time Analysis — full width */}
      <TimeAnalysis hourlyData={hourlyAnalysis} dayOfWeekData={dayOfWeekAnalysis} />
    </div>
  );
}
