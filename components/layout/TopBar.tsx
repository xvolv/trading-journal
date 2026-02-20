'use client';

import Link from 'next/link';
import { Bell, PlusCircle, Search } from 'lucide-react';

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-[var(--topbar-height)] items-center justify-between border-b border-[var(--color-surface-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-xl px-6">
      {/* Search */}
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Search trades, tags..."
          className="h-9 w-64 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-glass-hover)] hover:text-[var(--color-text-secondary)] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
        </button>

        {/* New trade button */}
        <Link
          href="/trade/new"
          className="btn-primary text-sm py-2 px-4"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">New Trade</span>
        </Link>
      </div>
    </header>
  );
}
