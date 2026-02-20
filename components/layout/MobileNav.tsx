'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  ScrollText,
  BarChart3,
  Settings,
} from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Trades', href: '/trades', icon: ScrollText },
  { label: 'New', href: '/trade/new', icon: PlusCircle, isAction: true },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[var(--mobile-nav-height)] items-center justify-around border-t border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)]/95 backdrop-blur-xl md:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#4f46e5] text-white shadow-lg shadow-[var(--color-accent)]/30 -mt-4"
            >
              <Icon className="h-6 w-6" />
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive
                ? 'text-[var(--color-accent-light)]'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
