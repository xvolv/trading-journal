'use client';

import { Crosshair } from 'lucide-react';

interface PriceInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  precision?: number;
  mockPrice?: number;
  showMarketButton?: boolean;
  placeholder?: string;
}

export function PriceInput({
  label,
  value,
  onChange,
  precision = 2,
  mockPrice,
  showMarketButton = false,
  placeholder,
}: PriceInputProps) {
  const handleBlur = () => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      onChange(num.toFixed(precision));
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder ?? `0.${'0'.repeat(precision)}`}
          step={Math.pow(10, -precision)}
          className="input-trade w-full pr-24"
        />
        {showMarketButton && mockPrice && (
          <button
            type="button"
            onClick={() => onChange(mockPrice.toFixed(precision))}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 border border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)] px-2 py-1 text-[10px] font-semibold text-[var(--color-accent-light)] transition-colors hover:bg-[var(--color-accent-bg)]"
          >
            <Crosshair className="h-3 w-3" />
            Market
          </button>
        )}
      </div>
    </div>
  );
}
