'use client';

import { Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface BulkActionsProps {
  count: number;
  onDeleteSelected: () => void;
  onDeselectAll: () => void;
}

export function BulkActions({ count, onDeleteSelected, onDeselectAll }: BulkActionsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (count === 0) return null;

  return (
    <div className="sticky bottom-0 z-30 flex items-center justify-between border-t border-[var(--color-surface-border)] bg-[var(--color-bg-primary)]/95 px-4 py-3 backdrop-blur-sm animate-fade-in">
      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
        {count} {count === 1 ? 'trade' : 'trades'} selected
      </span>
      <div className="flex items-center gap-3">
        {confirmDelete ? (
          <>
            <span className="text-xs text-[var(--color-loss-light)]">
              Delete {count} {count === 1 ? 'trade' : 'trades'}?
            </span>
            <button
              type="button"
              onClick={() => {
                onDeleteSelected();
                setConfirmDelete(false);
              }}
              className="bg-[var(--color-loss)] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[var(--color-loss-light)]"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="border border-[var(--color-surface-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 border border-[var(--color-loss)] bg-[var(--color-loss-bg)] px-4 py-1.5 text-xs font-bold text-[var(--color-loss-light)] transition-colors hover:bg-[var(--color-loss)]  hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
            <button
              type="button"
              onClick={onDeselectAll}
              className="flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <X className="h-3.5 w-3.5" />
              Deselect
            </button>
          </>
        )}
      </div>
    </div>
  );
}
