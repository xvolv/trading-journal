'use client';

import { useState } from 'react';
import { Trash2, Clock, DollarSign, Shield, Target, FileText, Image, Edit3, X, Check, Loader2 } from 'lucide-react';
import type { Trade } from '@/types/types';
import { formatCurrency, formatPnl } from '@/lib/utils';

interface TradeDetailPanelProps {
  trade: Trade;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Trade>) => Promise<void>;
}

export function TradeDetailPanel({ trade, onDelete, onUpdate }: TradeDetailPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editExitPrice, setEditExitPrice] = useState(String(trade.exitPrice ?? ''));
  const [editStopLoss, setEditStopLoss] = useState(String(trade.stopLoss ?? ''));
  const [editTakeProfit, setEditTakeProfit] = useState(String(trade.takeProfit ?? ''));
  const [editPnl, setEditPnl] = useState(String(trade.pnl));
  const [editFees, setEditFees] = useState(String(trade.fees));
  const [editNotes, setEditNotes] = useState(trade.notes);

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

  const handleStartEdit = () => {
    setEditExitPrice(String(trade.exitPrice ?? ''));
    setEditStopLoss(String(trade.stopLoss ?? ''));
    setEditTakeProfit(String(trade.takeProfit ?? ''));
    setEditPnl(String(trade.pnl));
    setEditFees(String(trade.fees));
    setEditNotes(trade.notes);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    setSaving(true);

    const updates: Partial<Trade> = {};
    const exitVal = editExitPrice.trim() ? parseFloat(editExitPrice) : null;
    const slVal = editStopLoss.trim() ? parseFloat(editStopLoss) : null;
    const tpVal = editTakeProfit.trim() ? parseFloat(editTakeProfit) : null;
    const pnlVal = parseFloat(editPnl) || 0;
    const feesVal = parseFloat(editFees) || 0;

    if (exitVal !== trade.exitPrice) updates.exitPrice = exitVal;
    if (slVal !== trade.stopLoss) updates.stopLoss = slVal;
    if (tpVal !== trade.takeProfit) updates.takeProfit = tpVal;
    if (pnlVal !== trade.pnl) updates.pnl = pnlVal;
    if (feesVal !== trade.fees) updates.fees = feesVal;
    if (editNotes !== trade.notes) updates.notes = editNotes;

    if (Object.keys(updates).length > 0) {
      await onUpdate(trade.id, updates);
    }

    setSaving(false);
    setIsEditing(false);
  };

  const inputClass =
    'w-full rounded-md border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] px-2 py-1 text-sm font-semibold text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors';

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
              {isEditing ? (
                <input
                  type="number"
                  step="any"
                  value={editExitPrice}
                  onChange={(e) => setEditExitPrice(e.target.value)}
                  placeholder="—"
                  className={inputClass}
                />
              ) : (
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {trade.exitPrice !== null ? formatCurrency(trade.exitPrice) : 'Open'}
                </p>
              )}
            </div>
            <div className="flex items-start gap-1">
              <Shield className="mt-0.5 h-3 w-3 text-[var(--color-loss)]" />
              <div className="flex-1">
                <p className="text-[10px] text-[var(--color-text-muted)]">Stop Loss</p>
                {isEditing ? (
                  <input
                    type="number"
                    step="any"
                    value={editStopLoss}
                    onChange={(e) => setEditStopLoss(e.target.value)}
                    placeholder="—"
                    className={inputClass}
                  />
                ) : (
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {trade.stopLoss !== null ? formatCurrency(trade.stopLoss) : '—'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-1">
              <Target className="mt-0.5 h-3 w-3 text-[var(--color-profit)]" />
              <div className="flex-1">
                <p className="text-[10px] text-[var(--color-text-muted)]">Take Profit</p>
                {isEditing ? (
                  <input
                    type="number"
                    step="any"
                    value={editTakeProfit}
                    onChange={(e) => setEditTakeProfit(e.target.value)}
                    placeholder="—"
                    className={inputClass}
                  />
                ) : (
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {trade.takeProfit !== null ? formatCurrency(trade.takeProfit) : '—'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-1">
              <DollarSign className="mt-0.5 h-3 w-3 text-[var(--color-warning)]" />
              <div className="flex-1">
                <p className="text-[10px] text-[var(--color-text-muted)]">Fees</p>
                {isEditing ? (
                  <input
                    type="number"
                    step="any"
                    value={editFees}
                    onChange={(e) => setEditFees(e.target.value)}
                    className={inputClass}
                  />
                ) : (
                  <p className="font-semibold text-[var(--color-text-primary)]">{formatCurrency(trade.fees)}</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)]">Net PnL</p>
              {isEditing ? (
                <input
                  type="number"
                  step="any"
                  value={editPnl}
                  onChange={(e) => setEditPnl(e.target.value)}
                  className={inputClass}
                />
              ) : (
                <p
                  className="font-bold"
                  style={{ color: trade.pnl >= 0 ? 'var(--color-profit-light)' : 'var(--color-loss-light)' }}
                >
                  {formatPnl(trade.pnl)}
                </p>
              )}
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

          {isEditing ? (
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add notes..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          ) : trade.notes ? (
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

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {/* Edit / Save / Cancel */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 rounded-md bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-[var(--color-accent-light)] disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {onUpdate && (
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-light)]"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit Trade
                  </button>
                )}

                {/* Delete */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
