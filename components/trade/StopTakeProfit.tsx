'use client';

import { Shield, Target } from 'lucide-react';

interface StopTakeProfitProps {
  stopLoss: string;
  onStopLossChange: (v: string) => void;
  takeProfit: string;
  onTakeProfitChange: (v: string) => void;
  riskReward: number | null;
  onSetTpMultiple: (multiple: number) => void;
  precision?: number;
}

export function StopTakeProfit({
  stopLoss,
  onStopLossChange,
  takeProfit,
  onTakeProfitChange,
  riskReward,
  onSetTpMultiple,
  precision = 2,
}: StopTakeProfitProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        Stop Loss & Take Profit
      </label>
      <div className="grid grid-cols-2 gap-3">
        {/* Stop Loss */}
        <div>
          <div className="relative">
            <Shield className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-loss)] " />
            <input
              type="number"
              inputMode="decimal"
              value={stopLoss}
              onChange={(e) => onStopLossChange(e.target.value)}
              placeholder={` SL 0.${'0'.repeat(precision)}`}
              step={Math.pow(10, -precision)}
              className="input-trade w-full pl-6"
            />
          </div>
          <p className="mt-1 text-[10px] text-[var(--color-loss)]">Risk level</p>
        </div>

        {/* Take Profit */}
        <div>
          <div className="relative">
            <Target className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-profit)]" />
            <input
              type="number"
              inputMode="decimal"
              value={takeProfit}
              onChange={(e) => onTakeProfitChange(e.target.value)}
              placeholder={`TP 0.${'0'.repeat(precision)}`}
              step={Math.pow(10, -precision)}
              className="input-trade w-full pl-10"
            />
          </div>
          <p className="mt-1 text-[10px] text-[var(--color-profit)]">Target</p>
        </div>
      </div>

      {/* R:R Quick Buttons */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Quick TP:
        </span>
        {[1, 1.5, 2, 3].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onSetTpMultiple(m)}
            className="border border-[var(--color-surface-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-light)]"
          >
            {m}×R
          </button>
        ))}
        {riskReward !== null && riskReward > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 bg-[var(--color-accent-bg)] px-2.5 py-1 text-xs font-bold text-[var(--color-accent-light)]">
            R:R 1:{riskReward.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
