'use client';

import { useTrades } from '@/context/TradesContext';
import { PnlBadge } from '@/components/ui/PnlBadge';
import { timeAgo, getMarketColor } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function RecentTradesList() {
  const { trades } = useTrades();
  const recentTrades = trades.slice(0, 8);

  return (
    <div className="card-solid p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--color-text-tertiary)]">Recent Trades</h3>
        <a
          href="/trades"
          className="text-xs font-medium text-[var(--color-accent-light)] hover:underline"
        >
          View All →
        </a>
      </div>

      <div className="space-y-1">
        {recentTrades.map((trade) => {
          const isLong = trade.direction === 'long' || trade.direction === 'call';

          return (
            <div
              key={trade.id}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--color-surface-glass-hover)] cursor-pointer"
            >
              {/* Market dot + Direction arrow */}
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: getMarketColor(trade.market) }}
                  title={trade.market}
                />
                {isLong ? (
                  <ArrowUpRight className="h-4 w-4 text-[var(--color-profit)]" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-[var(--color-loss)]" />
                )}
              </div>

              {/* Symbol + Direction */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {trade.symbol}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] capitalize">
                  {trade.direction} · {trade.market}
                </p>
              </div>

              {/* PNL */}
              <PnlBadge value={trade.pnl} size="sm" />

              {/* Time */}
              <span className="hidden sm:block text-xs text-[var(--color-text-muted)] w-14 text-right">
                {timeAgo(trade.closedAt ?? trade.openedAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
