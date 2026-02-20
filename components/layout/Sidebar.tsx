'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  ScrollText,
  BarChart3,
  ShieldCheck,
  Settings,
  Import,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'New Trade', href: '/trade/new', icon: PlusCircle },
  { label: 'Trades', href: '/trades', icon: ScrollText },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Rules', href: '/rules', icon: ShieldCheck },
  { label: 'Import', href: '/import', icon: Import },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 border-r border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)] transition-all duration-300 ease-[var(--ease-smooth)] ${
        isCollapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-surface-border)]">
        <Logo collapsed={isCollapsed} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-glass-hover)] hover:text-[var(--color-text-secondary)] transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent-light)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-glass-hover)] hover:text-[var(--color-text-primary)]'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-[var(--color-accent-light)]' : ''
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[var(--color-surface-border)] p-3">
        <div
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-purple-600 text-xs font-bold text-white">
            TF
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                Trader
              </p>
              <p className="truncate text-xs text-[var(--color-text-tertiary)]">
                trader@email.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
