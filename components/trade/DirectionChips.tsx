'use client';

import { TrendingUp, TrendingDown, Phone, PhoneOff } from 'lucide-react';
import type { TradeDirection, MarketType } from '@/types/types';

interface DirectionChipsProps {
  market: MarketType | null;
  value: TradeDirection | null;
  onChange: (dir: TradeDirection) => void;
}

export function DirectionChips({ market, value, onChange }: DirectionChipsProps) {
  const isBinary = market === 'binary';

  const options: { value: TradeDirection; label: string; icon: React.ReactNode; color: string; activeColor: string; glowColor: string }[] = isBinary
    ? [
        {
          value: 'call',
          label: 'Call',
          icon: <Phone className="h-5 w-5" />,
          color: 'var(--color-profit)',
          activeColor: 'var(--color-profit-bg)',
          glowColor: 'var(--color-profit-glow)',
        },
        {
          value: 'put',
          label: 'Put',
          icon: <PhoneOff className="h-5 w-5" />,
          color: 'var(--color-loss)',
          activeColor: 'var(--color-loss-bg)',
          glowColor: 'var(--color-loss-glow)',
        },
      ]
    : [
        {
          value: 'long',
          label: 'Long',
          icon: <TrendingUp className="h-5 w-5" />,
          color: 'var(--color-profit)',
          activeColor: 'var(--color-profit-bg)',
          glowColor: 'var(--color-profit-glow)',
        },
        {
          value: 'short',
          label: 'Short',
          icon: <TrendingDown className="h-5 w-5" />,
          color: 'var(--color-loss)',
          activeColor: 'var(--color-loss-bg)',
          glowColor: 'var(--color-loss-glow)',
        },
      ];

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        Direction
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="flex items-center justify-center gap-2 border px-4 py-3.5 text-sm font-bold uppercase tracking-wide transition-all duration-200"
              style={{
                borderColor: isActive ? opt.color : 'var(--color-surface-border)',
                backgroundColor: isActive ? opt.activeColor : 'transparent',
                color: isActive ? opt.color : 'var(--color-text-secondary)',
                boxShadow: isActive ? `0 0 20px ${opt.glowColor}` : 'none',
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
