'use client';

import { useState } from 'react';
import { X, Loader2, Eye, EyeOff, Zap, Shield } from 'lucide-react';
import type { BrokerType } from '@/types/types';
import { BROKER_INFO } from '@/types/types';

interface AddBrokerModalProps {
  onAdd: (data: { broker: BrokerType; label: string; apiKey: string; apiSecret: string }) => Promise<void>;
  onClose: () => void;
}

const BROKER_TYPES: BrokerType[] = ['demo', 'binance', 'bybit', 'mt5', 'ibkr'];

export function AddBrokerModal({ onAdd, onClose }: AddBrokerModalProps) {
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [selectedBroker, setSelectedBroker] = useState<BrokerType | null>(null);
  const [label, setLabel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSelectBroker = (broker: BrokerType) => {
    setSelectedBroker(broker);
    const info = BROKER_INFO[broker];
    setLabel(info.name);
    setStep('configure');
  };

  const handleSave = async () => {
    if (!selectedBroker || !label.trim()) return;
    setSaving(true);
    try {
      await onAdd({
        broker: selectedBroker,
        label: label.trim(),
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
      });
      onClose();
    } catch {
      setSaving(false);
    }
  };

  const isDemo = selectedBroker === 'demo';
  const canSave = selectedBroker && label.trim() && (isDemo || (apiKey.trim() && apiSecret.trim()));

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-bg-primary)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-surface-border)] px-6 py-4">
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">
            {step === 'select' ? 'Add Broker Connection' : `Configure ${BROKER_INFO[selectedBroker!]?.name}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {step === 'select' ? (
            <div className="space-y-3">
              <p className="mb-4 text-xs text-[var(--color-text-muted)]">
                Select a broker or exchange to connect
              </p>
              <div className="grid grid-cols-2 gap-3">
                {BROKER_TYPES.map((broker) => {
                  const info = BROKER_INFO[broker];
                  return (
                    <button
                      key={broker}
                      type="button"
                      onClick={() => handleSelectBroker(broker)}
                      className="flex items-center gap-3 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)] p-4 text-left transition-all hover:border-[var(--color-accent)] hover:shadow-lg"
                    >
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: info.color }}
                      >
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{info.name}</p>
                        <p className="text-[10px] capitalize text-[var(--color-text-muted)]">
                          {info.markets.join(', ')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Demo notice */}
              {isDemo && (
                <div className="flex items-start gap-2 rounded-lg bg-[var(--color-profit-bg)] p-3">
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-profit)]" />
                  <div className="text-xs text-[var(--color-profit-light)]">
                    <p className="font-bold">Demo Broker</p>
                    <p>No API keys needed. Generates sample trades for testing.</p>
                  </div>
                </div>
              )}

              {/* Label */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Connection Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="My Binance Account"
                  className="w-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
                />
              </div>

              {/* API key + secret (hidden for demo) */}
              {!isDemo && (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] px-3 py-2.5 font-mono text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      API Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        placeholder="Enter your API secret"
                        className="w-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-bg-input)] px-3 py-2.5 pr-10 font-mono text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-[var(--color-bg-tertiary)] p-3">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent-light)]" />
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      Credentials are stored locally in your database. Use read-only API keys for security.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'configure' && (
          <div className="flex items-center justify-between border-t border-[var(--color-surface-border)] px-6 py-4">
            <button
              type="button"
              onClick={() => { setStep('select'); setSelectedBroker(null); }}
              className="text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[var(--color-surface-border)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave || saving}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold transition-all ${
                  canSave && !saving
                    ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)]'
                    : 'cursor-not-allowed bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
                }`}
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
