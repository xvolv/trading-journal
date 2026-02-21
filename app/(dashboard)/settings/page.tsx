'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, DollarSign, Check, Loader2, RotateCcw, Plus, Link2 } from 'lucide-react';
import { useAccountBalance } from '@/hooks/useAccountBalance';
import { DEFAULT_ACCOUNT_BALANCE } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { BrokerCard } from '@/components/settings/BrokerCard';
import { AddBrokerModal } from '@/components/settings/AddBrokerModal';
import type { BrokerConnection, BrokerType } from '@/types/types';

export default function SettingsPage() {
  const [balance, setBalance] = useAccountBalance();
  const [inputValue, setInputValue] = useState(String(balance));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Broker connections state
  const [connections, setConnections] = useState<BrokerConnection[]>([]);
  const [loadingBrokers, setLoadingBrokers] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/broker-connections');
      if (res.ok) {
        setConnections(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoadingBrokers(false);
    }
  }, []);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  const handleAddBroker = async (data: { broker: BrokerType; label: string; apiKey: string; apiSecret: string }) => {
    const res = await fetch('/api/broker-connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchConnections();
    }
  };

  const handleSync = async (id: string) => {
    const res = await fetch(`/api/broker-connections/${id}/sync`, { method: 'POST' });
    const result = await res.json();
    // Refresh connections to get updated status/lastSyncAt
    await fetchConnections();
    return result;
  };

  const handleDeleteBroker = async (id: string) => {
    await fetch(`/api/broker-connections/${id}`, { method: 'DELETE' });
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) return;

    setSaving(true);
    setBalance(val);

    // Brief visual feedback
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 300);
  };

  const handleReset = () => {
    setInputValue(String(DEFAULT_ACCOUNT_BALANCE));
    setBalance(DEFAULT_ACCOUNT_BALANCE);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanged = parseFloat(inputValue) !== balance;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-bg)]">
          <Settings className="h-5 w-5 text-[var(--color-accent-light)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Settings
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Manage your trading preferences
          </p>
        </div>
      </div>

      {/* Account Balance Section */}
      <div className="card-solid overflow-hidden">
        <div className="border-b border-[var(--color-surface-border)] px-6 py-4">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Account Balance</h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            This is used to calculate equity curves, risk percentages, and portfolio performance.
          </p>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Current Balance Display */}
          <div className="flex items-center gap-4 rounded-xl bg-[var(--color-bg-tertiary)] p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-profit-bg)]">
              <DollarSign className="h-6 w-6 text-[var(--color-profit-light)]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Current Balance
              </p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          {/* Balance Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
              Update Balance
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--color-text-muted)]">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="w-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] py-2.5 pl-7 pr-3 text-sm font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
                  placeholder="Enter your account balance"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanged || isNaN(parseFloat(inputValue))}
                className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${
                  saved
                    ? 'bg-[var(--color-profit)] text-white'
                    : saving || !hasChanged || isNaN(parseFloat(inputValue))
                      ? 'cursor-not-allowed bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
                      : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)]'
                }`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="h-4 w-4" />
                ) : null}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>

          {/* Reset to default */}
          <div className="flex items-center justify-between border-t border-[var(--color-surface-border)] pt-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              Default: {formatCurrency(DEFAULT_ACCOUNT_BALANCE)}
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-light)]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* Broker Connections Section */}
      <div className="card-solid overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-surface-border)] px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[var(--color-accent-light)]" />
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Broker Connections</h2>
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              Connect to your exchange or broker for auto-import of trades.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[var(--color-accent-light)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Broker
          </button>
        </div>

        <div className="px-6 py-5">
          {loadingBrokers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-text-muted)]" />
            </div>
          ) : connections.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-bg-tertiary)]">
                <Link2 className="h-6 w-6 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">No brokers connected</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Add a broker to start auto-importing your trades. Try the Demo broker to see it in action.
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-bg)] px-4 py-2 text-xs font-bold text-[var(--color-accent-light)] transition-colors hover:bg-[var(--color-accent)]/20"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Your First Broker
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {connections.map((conn) => (
                <BrokerCard
                  key={conn.id}
                  connection={conn}
                  onSync={handleSync}
                  onDelete={handleDeleteBroker}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data Export placeholder */}
      <div className="card-solid p-5 opacity-60">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Data Export</h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Export your trade journal as CSV or JSON — coming soon.
        </p>
      </div>

      {/* Add broker modal */}
      {showAddModal && (
        <AddBrokerModal
          onAdd={handleAddBroker}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
