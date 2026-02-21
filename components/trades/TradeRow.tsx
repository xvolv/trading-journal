'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { Trade } from '@/types/types';
import { formatCurrency, formatPnl, getMarketColor, timeAgo } from '@/lib/utils';
import { TradeDetailPanel } from './TradeDetailPanel';


interface TradeRowProps {
  trade: Trade;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Trade>) => Promise<void>;
}

export function TradeRow({ trade, isSelected, onToggleSelect, onDelete, onUpdate }: TradeRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = trade.direction === 'long' || trade.direction === 'call';
  const isProfit = trade.pnl >= 0;

  return (
    <>
      {/* Main row */}
      <tr
        className="group cursor-pointer border-b border-[var(--color-surface-border)] transition-colors hover:bg-[var(--color-surface-glass-hover)]"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Checkbox */}
        <td className="w-10 px-3 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect();
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
          />
        </td>

        {/* Symbol + Market */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: getMarketColor(trade.market) }}
            />
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {trade.symbol}
            </span>
          </div>
        </td>

        {/* Direction */}
        <td className="px-3 py-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold capitalize">
            {isLong ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-profit)]" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-[var(--color-loss)]" />
            )}
            <span style={{ color: isLong ? 'var(--color-profit)' : 'var(--color-loss)' }}>
              {trade.direction}
            </span>
          </span>
        </td>

        {/* Entry */}
        <td className="px-3 py-3 text-sm text-[var(--color-text-secondary)]">
          {formatCurrency(trade.entryPrice)}
        </td>

        {/* Exit */}
        <td className="px-3 py-3 text-sm text-[var(--color-text-secondary)]">
          {trade.exitPrice !== null ? formatCurrency(trade.exitPrice) : (
            <span className="text-xs text-[var(--color-accent-light)]">Open</span>
          )}
        </td>

        {/* Size */}
        <td className="hidden px-3 py-3 text-sm text-[var(--color-text-secondary)] lg:table-cell">
          {trade.size}
        </td>

        {/* PnL */}
        <td className="px-3 py-3">
          <span
            className="text-sm font-bold"
            style={{ color: isProfit ? 'var(--color-profit-light)' : 'var(--color-loss-light)' }}
          >
            {formatPnl(trade.pnl)}
          </span>
        </td>

        {/* R:R */}
        <td className="hidden px-3 py-3 text-sm text-[var(--color-text-secondary)] md:table-cell">
          {trade.riskRewardRatio !== null ? `1:${trade.riskRewardRatio.toFixed(1)}` : '—'}
        </td>

        {/* Tags */}
        <td className="hidden px-3 py-3 xl:table-cell">
          <div className="flex flex-wrap gap-1">
            {trade.strategyTags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="border border-[var(--color-surface-border)] px-1.5 py-0.5 text-[10px] font-medium capitalize text-[var(--color-text-tertiary)]"
              >
                {t}
              </span>
            ))}
            {trade.strategyTags.length > 2 && (
              <span className="text-[10px] text-[var(--color-text-muted)]">
                +{trade.strategyTags.length - 2}
              </span>
            )}
          </div>
        </td>

        {/* Date */}
        <td className="px-3 py-3 text-right text-xs text-[var(--color-text-muted)]">
          {timeAgo(trade.closedAt ?? trade.openedAt)}
        </td>

        {/* Expand icon */}
        <td className="w-8 px-2 py-3 text-[var(--color-text-muted)]">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr>
          <td colSpan={11} className="p-0">
            <TradeDetailPanel trade={trade} onDelete={onDelete} onUpdate={onUpdate} />
          </td>
        </tr>
      )}
    </>
  );
}
