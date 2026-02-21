'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddRuleFormProps {
  onAdd: (rule: { label: string; type: string; threshold: number }) => Promise<void>;
  onCancel: () => void;
}

const RULE_TYPES = [
  { value: 'daily-loss', label: 'Daily Loss Limit', prefix: '-$' },
  { value: 'daily-profit', label: 'Daily Profit Target', prefix: '$' },
  { value: 'max-trades', label: 'Max Trades / Day', prefix: '' },
];

export function AddRuleForm({ onAdd, onCancel }: AddRuleFormProps) {
  const [type, setType] = useState('daily-loss');
  const [label, setLabel] = useState('');
  const [threshold, setThreshold] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedType = RULE_TYPES.find((t) => t.value === type)!;

  const handleSubmit = async () => {
    const val = parseFloat(threshold);
    if (!label.trim() || isNaN(val) || val <= 0) return;

    setSaving(true);
    const finalThreshold = type === 'daily-loss' ? -val : val;
    await onAdd({ label: label.trim(), type, threshold: finalThreshold });
    setSaving(false);
  };

  // Auto-fill label when type changes
  const handleTypeChange = (newType: string) => {
    setType(newType);
    const found = RULE_TYPES.find((t) => t.value === newType);
    if (found && !label.trim()) {
      setLabel(found.label);
    }
  };

  return (
    <div className="card-solid p-5 ring-1 ring-[var(--color-accent)]/30 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">New Rule</h3>
        <button
          onClick={onCancel}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-glass-hover)] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Type selector */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Rule Type
          </label>
          <div className="flex gap-2">
            {RULE_TYPES.map((rt) => (
              <button
                key={rt.value}
                onClick={() => handleTypeChange(rt.value)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  type === rt.value
                    ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent-light)] ring-1 ring-[var(--color-accent)]'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {rt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Label */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={selectedType.label}
            className="w-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>

        {/* Threshold */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Threshold
          </label>
          <div className="relative">
            {selectedType.prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)]">
                {selectedType.prefix}
              </span>
            )}
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder={type === 'max-trades' ? '5' : '500'}
              className={`w-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] py-2 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
                selectedType.prefix ? 'pl-8' : 'pl-3'
              }`}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving || !label.trim() || !threshold}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
            saving || !label.trim() || !threshold
              ? 'cursor-not-allowed bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
              : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)]'
          }`}
        >
          <Plus className="h-4 w-4" />
          {saving ? 'Saving...' : 'Add Rule'}
        </button>
      </div>
    </div>
  );
}
