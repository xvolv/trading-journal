'use client';

import { useState } from 'react';
import { ChevronDown, Settings2, Layers, DollarSign, Tag } from 'lucide-react';

interface AdvancedSectionProps {
  commissionOverride: string;
  onCommissionChange: (v: string) => void;
  fundingFee: string;
  onFundingFeeChange: (v: string) => void;
  customField: string;
  onCustomFieldChange: (v: string) => void;
}

export function AdvancedSection({
  commissionOverride,
  onCommissionChange,
  fundingFee,
  onFundingFeeChange,
  customField,
  onCustomFieldChange,
}: AdvancedSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[var(--color-surface-border)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
      >
        <span className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          Advanced
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-[var(--color-surface-border)] px-4 py-4 animate-fade-in">
          {/* Commission override */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <DollarSign className="h-3 w-3" />
              Commission Override
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={commissionOverride}
              onChange={(e) => onCommissionChange(e.target.value)}
              placeholder="Leave empty to use default"
              className="input-trade w-full"
            />
          </div>

          {/* Funding fee */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <Layers className="h-3 w-3" />
              Funding Fee
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={fundingFee}
              onChange={(e) => onFundingFeeChange(e.target.value)}
              placeholder="0.00"
              className="input-trade w-full"
            />
          </div>

          {/* Custom Field */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              <Tag className="h-3 w-3" />
              Custom Note (session, news event, etc.)
            </label>
            <input
              type="text"
              value={customField}
              onChange={(e) => onCustomFieldChange(e.target.value)}
              placeholder="e.g. FOMC meeting, Asian session"
              className="input-trade w-full"
            />
          </div>

          <p className="text-[10px] italic text-[var(--color-text-muted)]">
            Scaling in/out & broker sync — coming in a future update.
          </p>
        </div>
      )}
    </div>
  );
}
