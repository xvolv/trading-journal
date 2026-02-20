'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DisciplineAlertProps {
  message: string;
  type?: 'warning' | 'danger';
}

export function DisciplineAlert({ message, type = 'warning' }: DisciplineAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const styles = {
    warning: {
      bg: 'bg-[var(--color-warning-bg)]',
      border: 'border-[var(--color-warning)]/30',
      text: 'text-[var(--color-warning)]',
      icon: 'text-[var(--color-warning)]',
    },
    danger: {
      bg: 'bg-[var(--color-loss-bg)]',
      border: 'border-[var(--color-loss)]/30',
      text: 'text-[var(--color-loss-light)]',
      icon: 'text-[var(--color-loss)]',
    },
  };

  const s = styles[type];

  return (
    <div
      className={`flex items-center gap-3 rounded-xl ${s.bg} border ${s.border} px-4 py-3 animate-fade-in`}
    >
      <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${s.icon}`} />
      <p className={`flex-1 text-sm font-medium ${s.text}`}>{message}</p>
      <button
        onClick={() => setIsDismissed(true)}
        className={`flex h-6 w-6 items-center justify-center rounded-md ${s.text} hover:bg-white/10 transition-colors`}
        aria-label="Dismiss alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
