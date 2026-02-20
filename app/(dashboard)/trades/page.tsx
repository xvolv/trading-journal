import { ScrollText } from 'lucide-react';

export default function TradesPage() {
  return (
    <div className="mx-auto max-w-[1400px] animate-fade-in">
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-bg)]">
          <ScrollText className="h-8 w-8 text-[var(--color-accent-light)]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
          Trades Journal
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
          Full trades table with filtering, sorting, and bulk actions — coming in Phase 2.
        </p>
      </div>
    </div>
  );
}
