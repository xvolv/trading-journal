'use client';

import type { SizeMode } from '@/types/types';

interface PositionSizeInputProps {
  sizeMode: SizeMode;
  onModeChange: (mode: SizeMode) => void;
  quantity: string;
  onQuantityChange: (v: string) => void;
  riskDollars: string;
  onRiskDollarsChange: (v: string) => void;
  feesPercent: string;
  onFeesPercentChange: (v: string) => void;
  symbolLabel?: string;
  effectiveQty: number;
}

export function PositionSizeInput({
  sizeMode,
  onModeChange,
  quantity,
  onQuantityChange,
  riskDollars,
  onRiskDollarsChange,
  feesPercent,
  onFeesPercentChange,
  symbolLabel,
  effectiveQty,
}: PositionSizeInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        Position Size
      </label>

      {/* Mode toggle */}
      <div className="mb-3 flex gap-1 rounded-none bg-[var(--color-bg-tertiary)] p-1">
        <button
          type="button"
          onClick={() => onModeChange('quantity')}
          className={`flex-1 px-3 py-1.5 text-xs font-semibold transition-all ${
            sizeMode === 'quantity'
              ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          }`}
        >
          Quantity
        </button>
        <button
          type="button"
          onClick={() => onModeChange('risk-dollar')}
          className={`flex-1 px-3 py-1.5 text-xs font-semibold transition-all ${
            sizeMode === 'risk-dollar'
              ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          }`}
        >
          Risk $
        </button>
      </div>

      {sizeMode === 'quantity' ? (
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            placeholder="0.00"
            className="input-trade w-full pr-20"
          />
          {symbolLabel && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--color-text-muted)]">
              {symbolLabel.split('/')[0] || symbolLabel}
            </span>
          )}
        </div>
      ) : (
        <div>
          <div className="relative">
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--color-text-muted)]">
              $
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={riskDollars}
              onChange={(e) => onRiskDollarsChange(e.target.value)}
              placeholder="100"
              className="input-trade w-full pl-7 pr-4"
            />
          </div>
          {effectiveQty > 0 && (
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              ≈ {effectiveQty.toFixed(4)} {symbolLabel?.split('/')[0] || 'units'}
            </p>
          )}
        </div>
      )}

      {/* Fees */}
      <div className="mt-3">
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Fees %
        </label>
        <input
          type="number"
          inputMode="decimal"
          value={feesPercent}
          onChange={(e) => onFeesPercentChange(e.target.value)}
          placeholder="0.1"
          step="0.01"
          className="input-trade w-full"
        />
      </div>
    </div>
  );
}
