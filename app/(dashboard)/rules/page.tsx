'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { ShieldCheck, Plus, Loader2, RefreshCw } from 'lucide-react';
import { useTrades } from '@/context/TradesContext';
import { RuleCard } from '@/components/rules/RuleCard';
import { AddRuleForm } from '@/components/rules/AddRuleForm';
import type { DisciplineRule } from '@/types/types';

export default function RulesPage() {
  const { trades } = useTrades();
  const [rules, setRules] = useState<DisciplineRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch rules from API ──────────────────────────────
  const fetchRules = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/discipline-rules');
      if (!res.ok) throw new Error('Failed to fetch rules');
      const data = await res.json();
      setRules(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // ── Compute current values from today's trades ────────
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTrades = trades.filter((t) => {
      const d = (t.closedAt ?? t.openedAt).slice(0, 10);
      return d === today && !t.isOpen;
    });

    const totalPnl = todayTrades.reduce((sum, t) => sum + t.pnl, 0);
    const tradeCount = todayTrades.length;

    return { totalPnl, tradeCount };
  }, [trades]);

  // ── Enrich rules with live current values & breach status ──
  const enrichedRules = useMemo(() => {
    return rules.map((rule) => {
      let currentValue = 0;
      let isBreached = false;

      switch (rule.type) {
        case 'daily-loss': {
          // Track how much loss today (negative number)
          currentValue = Math.min(todayStats.totalPnl, 0);
          isBreached = currentValue <= rule.threshold; // e.g. -600 <= -500
          break;
        }
        case 'daily-profit': {
          currentValue = Math.max(todayStats.totalPnl, 0);
          isBreached = currentValue >= rule.threshold;
          break;
        }
        case 'max-trades': {
          currentValue = todayStats.tradeCount;
          isBreached = currentValue >= rule.threshold;
          break;
        }
      }

      return { ...rule, currentValue, isBreached };
    });
  }, [rules, todayStats]);

  // ── CRUD operations ───────────────────────────────────
  const handleAdd = async (newRule: { label: string; type: string; threshold: number }) => {
    const res = await fetch('/api/discipline-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRule),
    });
    if (!res.ok) throw new Error('Failed to add rule');
    const created = await res.json();
    setRules((prev) => [...prev, created]);
    setShowAddForm(false);
  };

  const handleUpdate = async (id: string, updates: Partial<DisciplineRule>) => {
    const res = await fetch(`/api/discipline-rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update rule');
    const updated = await res.json();
    setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/discipline-rules/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete rule');
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  // ── Summary stats ─────────────────────────────────────
  const breachedCount = enrichedRules.filter((r) => r.isBreached).length;
  const activeCount = enrichedRules.length;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-bg)]">
              <ShieldCheck className="h-5 w-5 text-[var(--color-accent-light)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Rules & Discipline
              </h1>
              <p className="text-sm text-[var(--color-text-tertiary)]">
                Set limits to keep your trading on track
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary text-sm py-2 px-4"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      {/* Today's Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-solid p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Active Rules</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{activeCount}</p>
        </div>
        <div className="card-solid p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Today&apos;s P&L</p>
          <p className={`mt-1 text-2xl font-bold ${todayStats.totalPnl >= 0 ? 'text-[var(--color-profit-light)]' : 'text-[var(--color-loss-light)]'}`}>
            {todayStats.totalPnl >= 0 ? '+' : ''}{todayStats.totalPnl.toFixed(2)}
          </p>
        </div>
        <div className="card-solid p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Breached</p>
          <p className={`mt-1 text-2xl font-bold ${breachedCount > 0 ? 'text-[var(--color-loss-light)]' : 'text-[var(--color-profit-light)]'}`}>
            {breachedCount} / {activeCount}
          </p>
        </div>
      </div>

      {/* Add Rule Form */}
      {showAddForm && (
        <AddRuleForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
      )}

      {/* Rules List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-text-muted)]" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-[var(--color-loss-light)]">{error}</p>
          <button
            onClick={fetchRules}
            className="mt-3 flex items-center gap-2 text-sm text-[var(--color-accent-light)] hover:underline"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      ) : enrichedRules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShieldCheck className="mb-4 h-12 w-12 text-[var(--color-text-muted)]" />
          <p className="text-lg font-semibold text-[var(--color-text-secondary)]">No rules yet</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Create your first trading rule to stay disciplined.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 btn-primary text-sm py-2 px-4"
          >
            <Plus className="h-4 w-4" />
            Add Your First Rule
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrichedRules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
