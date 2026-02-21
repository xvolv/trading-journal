'use client';

import { useState } from 'react';
import { Edit3, Trash2, X, Check, AlertTriangle, CheckCircle } from 'lucide-react';
import type { DisciplineRule } from '@/types/types';

interface RuleCardProps {
  rule: DisciplineRule;
  onUpdate: (id: string, updates: Partial<DisciplineRule>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TYPE_LABELS: Record<string, string> = {
  'daily-loss': 'Daily Loss Limit',
  'daily-profit': 'Daily Profit Target',
  'max-trades': 'Max Trades / Day',
};

const TYPE_ICONS: Record<string, { color: string; bgColor: string }> = {
  'daily-loss': { color: 'var(--color-loss-light)', bgColor: 'var(--color-loss-bg)' },
  'daily-profit': { color: 'var(--color-profit-light)', bgColor: 'var(--color-profit-bg)' },
  'max-trades': { color: 'var(--color-accent-light)', bgColor: 'var(--color-accent-bg)' },
};

export function RuleCard({ rule, onUpdate, onDelete }: RuleCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(rule.label);
  const [editThreshold, setEditThreshold] = useState(String(Math.abs(rule.threshold)));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const style = TYPE_ICONS[rule.type] ?? TYPE_ICONS['max-trades'];

  // Progress calculation
  const absThreshold = Math.abs(rule.threshold);
  const absCurrent = Math.abs(rule.currentValue);
  const progress = absThreshold > 0 ? Math.min((absCurrent / absThreshold) * 100, 100) : 0;
  const isNearBreach = progress >= 80;

  const handleSave = async () => {
    setSaving(true);
    const threshold = rule.type === 'daily-loss'
      ? -Math.abs(parseFloat(editThreshold) || 0)
      : Math.abs(parseFloat(editThreshold) || 0);

    await onUpdate(rule.id, { label: editLabel, threshold });
    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(rule.label);
    setEditThreshold(String(Math.abs(rule.threshold)));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(rule.id);
  };

  return (
    <div className={`card-solid p-5 transition-all duration-200 ${
      rule.isBreached ? 'ring-1 ring-[var(--color-loss)]/40' : ''
    }`}>
      <div className="flex items-start justify-between gap-3">
        {/* Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: style.bgColor }}
          >
            {rule.isBreached ? (
              <AlertTriangle className="h-5 w-5" style={{ color: 'var(--color-loss-light)' }} />
            ) : (
              <CheckCircle className="h-5 w-5" style={{ color: style.color }} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-full rounded-md border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] px-2 py-1 text-sm font-semibold text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            ) : (
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{rule.label}</p>
            )}
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              {TYPE_LABELS[rule.type] ?? rule.type}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-profit)] hover:bg-[var(--color-profit-bg)] transition-colors"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-glass-hover)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-glass-hover)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDelete}
                    className="rounded-md bg-[var(--color-loss)] px-2 py-1 text-[10px] font-bold text-white"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-md border border-[var(--color-surface-border)] px-2 py-1 text-[10px] font-bold text-[var(--color-text-secondary)]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-loss-bg)] hover:text-[var(--color-loss-light)] transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Threshold */}
      <div className="mt-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--color-text-muted)]">Threshold:</label>
            <input
              type="number"
              value={editThreshold}
              onChange={(e) => setEditThreshold(e.target.value)}
              className="w-28 rounded-md border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] px-2 py-1 text-sm font-semibold text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>
        ) : (
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">
              {rule.type === 'max-trades' ? `${rule.currentValue} / ${rule.threshold}` :
                `$${Math.abs(rule.currentValue).toFixed(0)} / $${Math.abs(rule.threshold).toFixed(0)}`}
            </span>
            {rule.isBreached && (
              <span className="text-[10px] font-bold uppercase text-[var(--color-loss-light)]">
                Breached
              </span>
            )}
            {!rule.isBreached && isNearBreach && (
              <span className="text-[10px] font-bold uppercase text-[var(--color-warning)]">
                Warning
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!isEditing && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: rule.isBreached
                ? 'var(--color-loss)'
                : isNearBreach
                  ? 'var(--color-warning)'
                  : style.color,
            }}
          />
        </div>
      )}
    </div>
  );
}
