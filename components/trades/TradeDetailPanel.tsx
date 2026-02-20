'use client';

import { useState } from 'react';
import { Trash2, Clock, DollarSign, Shield, Target, FileText, Image } from 'lucide-react';
import type { Trade } from '@/types/types';
import { formatCurrency, formatPnl } from '@/lib/utils';

interface TradeDetailPanelProps {
  trade: Trade;
  onDelete: (id: string) => void;
}

export function TradeDetailPanel({ trade, onDelete }: TradeDetailPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openedDate = new Date(trade.openedAt);
  const closedDate = trade.closedAt ? new Date(trade.closedAt) : null;
  const duration = closedDate
    ? Math.round((closedDate.getTime() - openedDate.getTime()) / 60000)
    : null;

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="animate-fade-in border-t border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)] px-6 py-5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Column 1: Prices & Stats */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Trade Details
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)]">Entry</p>
              <p className="font-semibold text-[var(--color-text-primary)]">{formatCurrency(trade.entryPrice)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)]">Exit</p>
              <p className="font-semibold text-[var(--color-text-primary)]">
                {trade.exitPrice !== null ? formatCurrency(trade.exitPrice) : 'Open'}
              </p>
            </div>
            <div className="flex items-start gap-1">
              <Shield className="mt-0.5 h-3 w-3 text-[var(--color-loss)]" />
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)]">Stop Loss</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {trade.stopLoss !== null ? formatCurrency(trade.stopLoss) : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-1">
              <Target className="mt-0.5 h-3 w-3 text-[var(--color-profit)]" />
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)]">Take Profit</p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {trade.takeProfit !== null ? formatCurrency(trade.takeProfit) : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-1">
              <DollarSign className="mt-0.5 h-3 w-3 text-[var(--color-warning)]" />
              <div>
                <p className="text-[10px] text-[var(--color-text-muted)]">Fees</p>
                <p className="font-semibold text-[var(--color-text-primary)]">{formatCurrency(trade.fees)}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)]">Net PnL</p>
              <p
                className="font-bold"
                style={{ color: trade.pnl >= 0 ? 'var(--color-profit-light)' : 'var(--color-loss-light)' }}
              >
                {formatPnl(trade.pnl)}
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Tags */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Tags
          </h4>
          {trade.strategyTags.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] text-[var(--color-text-muted)]">Strategy</p>
              <div className="flex flex-wrap gap-1">
                {trade.strategyTags.map((t) => (
                  <span key={t} className="border border-[var(--color-accent)] bg-[var(--color-accent-bg)] px-2 py-0.5 text-[10px] font-semibold capitalize text-[var(--color-accent-light)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {trade.emotionTags.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] text-[var(--color-text-muted)]">Emotion</p>
              <div className="flex flex-wrap gap-1">
                {trade.emotionTags.map((t) => (
                  <span key={t} className="border border-[var(--color-warning)] bg-[var(--color-warning-bg)] px-2 py-0.5 text-[10px] font-semibold capitalize text-[var(--color-warning)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {trade.mistakeTags.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] text-[var(--color-text-muted)]">Mistakes</p>
              <div className="flex flex-wrap gap-1">
                {trade.mistakeTags.map((t) => (
                  <span key={t} className="border border-[var(--color-loss)] bg-[var(--color-loss-bg)] px-2 py-0.5 text-[10px] font-semibold capitalize text-[var(--color-loss-light)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {trade.strategyTags.length === 0 && trade.emotionTags.length === 0 && trade.mistakeTags.length === 0 && (
            <p className="text-xs italic text-[var(--color-text-muted)]">No tags</p>
          )}
        </div>

        {/* Column 3: Notes + Time + Actions */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Notes & Info
          </h4>

          {trade.notes ? (
            <div className="flex items-start gap-1.5">
              <FileText className="mt-0.5 h-3 w-3 flex-shrink-0 text-[var(--color-text-muted)]" />
              <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{trade.notes}</p>
            </div>
          ) : (
            <p className="text-xs italic text-[var(--color-text-muted)]">No notes</p>
          )}

          {trade.screenshotUrl && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-accent-light)]">
              <Image className="h-3 w-3" />
              Screenshot attached
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Clock className="h-3 w-3" />
            <span>
              {openedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {' '}at {openedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {duration !== null && (
              <span className="ml-1 text-[var(--color-text-tertiary)]">· {formatDuration(duration)}</span>
            )}
          </div>

          {/* Delete */}
          <div className="pt-2">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-loss-light)]">Delete?</span>
                <button
                  type="button"
                  onClick={() => onDelete(trade.id)}
                  className="bg-[var(--color-loss)] px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-[var(--color-loss-light)]"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-loss-light)]"
              >
                <Trash2 className="h-3 w-3" />
                Delete Trade
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
