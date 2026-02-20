import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: string;
}

export function FeatureCard({ icon, title, description, delay = '' }: FeatureCardProps) {
  return (
    <div
      className={`glass-card group p-6 animate-fade-in-up opacity-0 ${delay}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-bg)] text-[var(--color-accent-light)] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>
    </div>
  );
}
