'use client';

import { Check } from 'lucide-react';
import type { TagOption } from '@/types/types';

interface TagSelectorProps<T extends string> {
  label: string;
  options: TagOption<T>[];
  selected: T[];
  onToggle: (tag: T) => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
  green: {
    bg: 'var(--color-profit-bg)',
    text: 'var(--color-profit-light)',
    border: 'var(--color-profit)',
    activeBg: 'var(--color-profit-bg)',
  },
  red: {
    bg: 'transparent',
    text: 'var(--color-loss-light)',
    border: 'var(--color-loss)',
    activeBg: 'var(--color-loss-bg)',
  },
  yellow: {
    bg: 'transparent',
    text: 'var(--color-warning)',
    border: 'var(--color-warning)',
    activeBg: 'var(--color-warning-bg)',
  },
  accent: {
    bg: 'transparent',
    text: 'var(--color-accent-light)',
    border: 'var(--color-accent)',
    activeBg: 'var(--color-accent-bg)',
  },
  blue: {
    bg: 'transparent',
    text: 'var(--color-info)',
    border: 'var(--color-info)',
    activeBg: 'var(--color-info-bg)',
  },
};

export function TagSelector<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: TagSelectorProps<T>) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected.includes(opt.value);
          const colors = COLOR_MAP[opt.color] || COLOR_MAP.accent;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-all duration-150"
              style={{
                borderColor: isActive ? colors.border : 'var(--color-surface-border)',
                backgroundColor: isActive ? colors.activeBg : 'transparent',
                color: isActive ? colors.text : 'var(--color-text-secondary)',
              }}
            >
              {isActive && <Check className="h-3 w-3" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
