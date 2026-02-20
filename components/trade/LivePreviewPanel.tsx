'use client';

import {
  DollarSign,
  Scale,
  Percent,
  MapPin,
  Receipt,
  AlertTriangle,
  Brain,
} from 'lucide-react';
import type { LivePreview as LivePreviewType } from '@/types/types';
import { formatCurrency } from '@/lib/utils';

interface LivePreviewPanelProps {
  preview: LivePreviewType;
  symbolLabel?: string;
  precision?: number;
}

export function LivePreviewPanel({ preview, symbolLabel, precision = 2 }: LivePreviewPanelProps) {
  const hasPnl = preview.potentialPnl !== null;
  const isProfit = (preview.potentialPnl ?? 0) >= 0;

  const riskColor =
    preview.riskPercent === null
      ? 'var(--color-text-muted)'
      : preview.riskPercent <= 2
        ? 'var(--color-profit)'
        : preview.riskPercent <= 5
          ? 'var(--color-warning)'
          : 'var(--color-loss)';

  return (
    <div className="card-solid relative overflow-hidden border-l-4 p-4" style={{
      borderLeftColor: hasPnl
        ? isProfit
          ? 'var(--color-profit)'
          : 'var(--color-loss)'
        : 'var(--color-accent)',
    }}>
      {/* Glow effect */}
      {hasPnl && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at top left, ${
              isProfit ? 'var(--color-profit)' : 'var(--color-loss)'
            }, transparent 70%)`,
          }}
        />
      )}

      <div className="relative">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
          <Scale className="h-3.5 w-3.5" />
          Live Preview
        </h3>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {/* Potential PnL */}
          <div className="flex items-start gap-2">
            <DollarSign className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: hasPnl ? (isProfit ? 'var(--color-profit)' : 'var(--color-loss)') : 'var(--color-text-muted)' }} />
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--color-text-muted)]">PnL</p>
              <p
                className="text-lg font-bold"
                style={{
                  color: hasPnl
                    ? isProfit
                      ? 'var(--color-profit-light)'
                      : 'var(--color-loss-light)'
                    : 'var(--color-text-muted)',
                }}
              >
                {hasPnl
                  ? `${isProfit ? '+' : ''}${formatCurrency(preview.potentialPnl!)}`
                  : '—'}
              </p>
            </div>
          </div>

          {/* Risk : Reward */}
          <div className="flex items-start gap-2">
            <Scale className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent-light)]" />
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--color-text-muted)]">R:R</p>
              <p className="text-lg font-bold text-[var(--color-text-primary)]">
                {preview.riskReward !== null ? `1:${preview.riskReward.toFixed(1)}` : '—'}
              </p>
            </div>
          </div>

          {/* Risk % */}
          <div className="flex items-start gap-2">
            <Percent className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: riskColor }} />
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--color-text-muted)]">Risk %</p>
              <p className="text-sm font-bold" style={{ color: riskColor }}>
                {preview.riskPercent !== null ? `${preview.riskPercent.toFixed(1)}%` : '—'}
              </p>
            </div>
          </div>

          {/* Breakeven */}
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-text-tertiary)]" />
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--color-text-muted)]">Breakeven</p>
              <p className="text-sm font-bold text-[var(--color-text-primary)]">
                {preview.breakeven !== null ? preview.breakeven.toFixed(precision) : '—'}
              </p>
            </div>
          </div>

          {/* Fee impact */}
          <div className="flex items-start gap-2 col-span-2">
            <Receipt className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-warning)]" />
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--color-text-muted)]">Fees</p>
              <p className="text-sm font-medium text-[var(--color-warning)]">
                {preview.feeImpact !== null ? `-${formatCurrency(preview.feeImpact)}` : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Rule Violations */}
        {preview.ruleViolations.length > 0 && (
          <div className="mt-3 border border-[var(--color-loss)] bg-[var(--color-loss-bg)] p-3">
            {preview.ruleViolations.map((v, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-semibold text-[var(--color-loss-light)]">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {v}
              </div>
            ))}
          </div>
        )}

        {/* Emotional Warning */}
        {preview.emotionalWarning && (
          <div className="mt-3 flex items-center gap-2 border border-[var(--color-warning)] bg-[var(--color-warning-bg)] p-3 text-sm font-semibold text-[var(--color-warning)]">
            <Brain className="h-4 w-4 flex-shrink-0" />
            {preview.emotionalWarning}
          </div>
        )}
      </div>
    </div>
  );
}
