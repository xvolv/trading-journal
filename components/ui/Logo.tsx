import { Activity } from 'lucide-react';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#4f46e5] shadow-lg">
        <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#4f46e5] opacity-40 blur-md" />
      </div>
      {!collapsed && (
        <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
          Trade<span className="text-[var(--color-accent-light)]">Forge</span>
        </span>
      )}
    </div>
  );
}
