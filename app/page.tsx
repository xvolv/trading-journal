import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  Download,
  Shield,
  Zap,
  TrendingUp,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { HeroChart } from '@/components/landing/HeroChart';
import { Logo } from '@/components/ui/Logo';

const FEATURES = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Auto-Sync Trades',
    description:
      'Connect your broker via API and import trades automatically. Supports Binance, MetaTrader, IQ Option, and more.',
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'AI Pattern Detection',
    description:
      'Our AI analyzes your trading patterns and finds recurring mistakes, winning setups, and optimal times to trade.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Risk Rules & Discipline',
    description:
      'Set daily loss limits, max trades, and hard stops. Get alerts before you break your own rules.',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Calendar Heatmap',
    description:
      'Visualize your performance day by day. See green and red days at a glance to spot weekly patterns.',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Advanced Analytics',
    description:
      'Equity curves, PNL distributions, win rates by strategy, hour, and market. Over 50 stat widgets.',
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: 'Export & Backup',
    description:
      'Export to CSV, PDF, or full backup. Your data is yours — download everything with one click.',
  },
];

const STATS = [
  { value: '10,000+', label: 'Active Traders' },
  { value: '2.5M+', label: 'Trades Logged' },
  { value: '4.9★', label: 'User Rating' },
  { value: '99.9%', label: 'Uptime' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar />

      {/* ============ Hero Section ============ */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Background Gradient Orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[var(--color-accent)]/8 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--color-profit)]/6 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: Copy */}
            <div className="animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-surface-border)] bg-[var(--color-surface-glass)] px-4 py-1.5 text-sm text-[var(--color-text-secondary)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-profit)] animate-pulse" />
                Now in public beta
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                <span className="text-[var(--color-text-primary)]">Track, Analyze,</span>
                <br />
                <span className="gradient-text">Win.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)]">
                The ultimate trading journal for crypto, forex, binary, and beyond.
                AI-powered insights, strict risk rules, and beautiful analytics —
                your edge in one place.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard" className="btn-secondary text-base px-8 py-3">
                  Try Demo
                </Link>
              </div>

              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                No credit card required · Free forever for basic use
              </p>
            </div>

            {/* Right: Hero Chart Card */}
            <div className="animate-fade-in-up delay-200 opacity-0 animate-float">
              <div className="glass-card overflow-hidden p-6 md:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--color-text-tertiary)]">Demo Equity Curve</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--color-profit-light)]">
                      +$6,200
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-profit-bg)] px-3 py-1 text-sm font-semibold text-[var(--color-profit-light)]">
                    <TrendingUp className="h-3.5 w-3.5" /> +62%
                  </span>
                </div>
                <HeroChart />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Social Proof Stats ============ */}
      <section className="border-y border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-12 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
              <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Features Grid ============ */}
      <section id="features" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              Everything you need to{' '}
              <span className="gradient-text">trade smarter</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              From quick trade logging to deep AI analytics — every tool a disciplined trader needs.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={`delay-${(index + 1) * 100}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ How It Works ============ */}
      <section id="how-it-works" className="border-t border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)] py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Get started in under 60 seconds. No complex setup.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Log Your Trades',
                description:
                  'Manually enter trades in seconds or auto-import from your broker via API.',
              },
              {
                step: '02',
                title: 'Get Instant Insights',
                description:
                  'See your PNL, equity curve, win rate, and AI-detected patterns update in real time.',
              },
              {
                step: '03',
                title: 'Improve & Repeat',
                description:
                  'Set discipline rules, track your psychology, and watch your consistency grow.',
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="card-solid p-8">
                  <span className="text-5xl font-black text-[var(--color-accent)]/20">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA Section ============ */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="glass-card relative overflow-hidden p-12 md:p-16">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 left-1/2 h-[300px] w-[400px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/10 blur-[80px]" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
                Ready to trade smarter?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-[var(--color-text-secondary)]">
                Join thousands of traders who use Trade Forge to track their edge, eliminate mistakes,
                and grow their accounts.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
                  Create Free Account <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="border-t border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Logo />
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                How It Works
              </a>
              <a href="#" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                Terms
              </a>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              © 2026 Trade Forge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
