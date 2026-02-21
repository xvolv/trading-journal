'use client';

import { useState } from 'react';
import { RefreshCw, Trash2, Loader2, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { BrokerConnection } from '@/types/types';
import { BROKER_INFO } from '@/types/types';

interface BrokerCardProps {
  connection: BrokerConnection;
  onSync: (id: string) => Promise<{ imported: number; status: string; lastError: string | null }>;
  onDelete: (id: string) => Promise<void>;
}

export function BrokerCard({ connection, onSync, onDelete }: BrokerCardProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const info = BROKER_INFO[connection.broker] ?? { name: connection.broker, icon: '?', markets: [], color: '#888' };

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await onSync(connection.id);
      if (result.imported > 0) {
        setSyncResult(`✓ Imported ${result.imported} trades`);
      } else if (result.lastError) {
        setSyncResult(`⚠ ${result.lastError}`);
      }
    } catch {
      setSyncResult('⚠ Sync failed');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 5000);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(connection.id);
  };

  const statusConfig = {
    connected: { icon: CheckCircle, color: 'var(--color-profit)', bg: 'var(--color-profit-bg)', label: 'Connected' },
    disconnected: { icon: XCircle, color: 'var(--color-text-muted)', bg: 'var(--color-bg-tertiary)', label: 'Disconnected' },
    error: { icon: AlertTriangle, color: 'var(--color-loss)', bg: 'var(--color-loss-bg)', label: 'Error' },
  };

  const st = statusConfig[connection.status] ?? statusConfig.disconnected;
  const StatusIcon = st.icon;

  return (
    <div className="card-solid overflow-hidden transition-all hover:border-[var(--color-accent)]/30">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between">
          {/* Broker info */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: info.color }}
            >
              {info.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{connection.label}</h3>
              <p className="text-[11px] text-[var(--color-text-muted)]">{info.name}</p>
            </div>
          </div>

          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: st.bg, color: st.color }}
          >
            <StatusIcon className="h-3 w-3" />
            {st.label}
          </div>
        </div>

        {/* API key (masked) */}
        <div className="mt-3 flex items-center gap-4 text-[11px] text-[var(--color-text-muted)]">
          <span>Key: <code className="font-mono text-[var(--color-text-tertiary)]">{connection.apiKey ? connection.apiKey.slice(0, 6) + '••••' : 'none'}</code></span>
          {connection.lastSyncAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last sync: {new Date(connection.lastSyncAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Error message */}
        {connection.lastError && (
          <p className="mt-2 text-[11px] text-[var(--color-loss-light)]">
            {connection.lastError}
          </p>
        )}

        {/* Sync result feedback */}
        {syncResult && (
          <p className={`mt-2 text-xs font-semibold ${syncResult.startsWith('✓') ? 'text-[var(--color-profit-light)]' : 'text-[var(--color-warning)]'}`}>
            {syncResult}
          </p>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2 border-t border-[var(--color-surface-border)] pt-3">
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-bg)] px-3 py-1.5 text-xs font-bold text-[var(--color-accent-light)] transition-colors hover:bg-[var(--color-accent)]/20 disabled:opacity-50"
          >
            {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>

          {confirmDelete ? (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[var(--color-loss-light)]">Delete?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-[var(--color-loss)] px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-[var(--color-loss-light)] disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="ml-auto flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-loss-light)]"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
