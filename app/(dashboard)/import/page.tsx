'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileSpreadsheet, ArrowRight, Check, X, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import {
  parseCSV,
  autoMapHeaders,
  mapRowsToTrades,
  TRADE_FIELD_LABELS,
  type TradeField,
  type ParsedCSV,
} from '@/lib/csv-parser';

type ImportStep = 'upload' | 'map' | 'preview' | 'done';

interface ImportResult {
  imported: number;
  errors: string[];
}

export default function ImportPage() {
  const [step, setStep] = useState<ImportStep>('upload');
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState<ParsedCSV | null>(null);
  const [mapping, setMapping] = useState<TradeField[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── File handling ──────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a .csv file');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const csv = parseCSV(text);

      if (csv.headers.length === 0 || csv.rows.length === 0) {
        alert('CSV appears empty or could not be parsed');
        return;
      }

      setParsed(csv);
      setMapping(autoMapHeaders(csv.headers));
      setStep('map');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // ── Column mapping ────────────────────────────────────
  const updateMapping = (index: number, field: TradeField) => {
    setMapping((prev) => {
      const next = [...prev];
      next[index] = field;
      return next;
    });
  };

  const mappedFieldCount = mapping.filter((f) => f !== '__skip__').length;
  const hasSymbol = mapping.includes('symbol');
  const hasEntry = mapping.includes('entryPrice');

  // ── Preview data ──────────────────────────────────────
  const previewTrades = parsed ? mapRowsToTrades(parsed.rows.slice(0, 5), mapping) : [];
  const allTrades = parsed ? mapRowsToTrades(parsed.rows, mapping) : [];

  // ── Import ────────────────────────────────────────────
  const handleImport = async () => {
    if (allTrades.length === 0) return;

    setImporting(true);
    const errors: string[] = [];

    try {
      const res = await fetch('/api/trades/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades: allTrades }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        errors.push(data.error || `Server returned ${res.status}`);
      }

      const data = await res.json().catch(() => ({ imported: 0 }));
      setResult({ imported: data.imported ?? allTrades.length, errors });
    } catch (err) {
      errors.push(String(err));
      setResult({ imported: 0, errors });
    }

    setImporting(false);
    setStep('done');
  };

  // ── Reset ─────────────────────────────────────────────
  const handleReset = () => {
    setStep('upload');
    setFileName('');
    setParsed(null);
    setMapping([]);
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const fieldOptions = Object.entries(TRADE_FIELD_LABELS) as [TradeField, string][];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-bg)]">
          <Upload className="h-5 w-5 text-[var(--color-accent-light)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Import Trades</h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Upload a CSV file to bulk-import trades from your broker
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {(['upload', 'map', 'preview', 'done'] as ImportStep[]).map((s, i) => {
          const labels = ['Upload', 'Map Columns', 'Preview', 'Done'];
          const isCurrent = s === step;
          const isDone =
            (s === 'upload' && step !== 'upload') ||
            (s === 'map' && (step === 'preview' || step === 'done')) ||
            (s === 'preview' && step === 'done');

          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className="h-px w-6"
                  style={{
                    backgroundColor: isDone
                      ? 'var(--color-accent)'
                      : 'var(--color-surface-border)',
                  }}
                />
              )}
              <div
                className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent-light)] ring-1 ring-[var(--color-accent)]'
                    : isDone
                      ? 'bg-[var(--color-profit-bg)] text-[var(--color-profit-light)]'
                      : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
                }`}
              >
                {isDone && <Check className="h-3 w-3" />}
                {labels[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* ───── STEP: UPLOAD ───── */}
      {step === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 transition-all ${
            dragOver
              ? 'border-[var(--color-accent)] bg-[var(--color-accent-bg)]'
              : 'border-[var(--color-surface-border)] hover:border-[var(--color-text-muted)]'
          }`}
        >
          <FileSpreadsheet
            className={`mb-4 h-12 w-12 ${
              dragOver ? 'text-[var(--color-accent-light)]' : 'text-[var(--color-text-muted)]'
            }`}
          />
          <p className="text-lg font-semibold text-[var(--color-text-secondary)]">
            {dragOver ? 'Drop your CSV here' : 'Drag & drop your CSV file'}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            or click to browse
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="mt-5 cursor-pointer rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-accent-light)]"
          >
            Select CSV File
          </label>

          <div className="mt-8 w-full max-w-md space-y-2 rounded-xl bg-[var(--color-bg-tertiary)] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Supported columns
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Symbol, Direction (Buy/Sell/Long/Short), Entry Price, Exit Price, Size, P&L, Fees,
              Stop Loss, Take Profit, Date, Notes
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Works with most broker CSV exports — columns are auto-detected.
            </p>
          </div>
        </div>
      )}

      {/* ───── STEP: MAP COLUMNS ───── */}
      {step === 'map' && parsed && (
        <div className="space-y-4">
          <div className="card-solid overflow-hidden">
            <div className="border-b border-[var(--color-surface-border)] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Map Columns</h2>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    {fileName} · {parsed.rows.length} rows · {parsed.headers.length} columns · {mappedFieldCount} mapped
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[var(--color-surface-border)]">
              {parsed.headers.map((header, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3">
                  <div className="w-1/3 min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                      {header}
                    </p>
                    <p className="truncate text-xs text-[var(--color-text-muted)]">
                      e.g. {parsed.rows[0]?.[i] ?? '—'}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)]" />

                  <select
                    value={mapping[i]}
                    onChange={(e) => updateMapping(i, e.target.value as TradeField)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
                      mapping[i] === '__skip__'
                        ? 'border-[var(--color-surface-border)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
                        : 'border-[var(--color-accent)] bg-[var(--color-accent-bg)] text-[var(--color-accent-light)] font-medium'
                    }`}
                  >
                    {fieldOptions.map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Validation */}
          {(!hasSymbol || !hasEntry) && (
            <div className="flex items-center gap-2 rounded-lg bg-[var(--color-loss-bg)] p-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-[var(--color-loss-light)]" />
              <p className="text-xs text-[var(--color-loss-light)]">
                You must map at least <strong>Symbol</strong> and <strong>Entry Price</strong> to continue.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep('preview')}
              disabled={!hasSymbol || !hasEntry}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${
                hasSymbol && hasEntry
                  ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)]'
                  : 'cursor-not-allowed bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
              }`}
            >
              Preview
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={handleReset} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ───── STEP: PREVIEW ───── */}
      {step === 'preview' && parsed && (
        <div className="space-y-4">
          <div className="card-solid overflow-hidden">
            <div className="border-b border-[var(--color-surface-border)] px-6 py-4">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Preview</h2>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Showing first {Math.min(5, previewTrades.length)} of {allTrades.length} trades
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-bg-secondary)]">
                    {mapping
                      .filter((f) => f !== '__skip__')
                      .map((f) => (
                        <th
                          key={f}
                          className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]"
                        >
                          {TRADE_FIELD_LABELS[f]}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {previewTrades.map((trade, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--color-surface-border)] transition-colors hover:bg-[var(--color-surface-glass-hover)]"
                    >
                      {mapping
                        .filter((f) => f !== '__skip__')
                        .map((f) => {
                          const val = trade[f];
                          const display =
                            val === undefined || val === null || val === ''
                              ? '—'
                              : String(val);

                          const isPnl = f === 'pnl';
                          const numVal = isPnl ? Number(val) : 0;

                          return (
                            <td
                              key={f}
                              className={`px-4 py-3 text-sm ${
                                isPnl
                                  ? numVal >= 0
                                    ? 'font-bold text-[var(--color-profit-light)]'
                                    : 'font-bold text-[var(--color-loss-light)]'
                                  : 'text-[var(--color-text-secondary)]'
                              }`}
                            >
                              {isPnl && numVal > 0 ? `+${display}` : display}
                            </td>
                          );
                        })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-accent-light)] disabled:opacity-50"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {importing ? 'Importing...' : `Import ${allTrades.length} Trades`}
            </button>
            <button
              onClick={() => setStep('map')}
              disabled={importing}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              Back to Mapping
            </button>
          </div>
        </div>
      )}

      {/* ───── STEP: DONE ───── */}
      {step === 'done' && result && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {result.errors.length === 0 ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-profit-bg)]">
                <Check className="h-8 w-8 text-[var(--color-profit-light)]" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">
                Import Complete!
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Successfully imported <strong className="text-[var(--color-profit-light)]">{result.imported}</strong> trades.
              </p>
            </>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-loss-bg)]">
                <X className="h-8 w-8 text-[var(--color-loss-light)]" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">
                Import Failed
              </h2>
              {result.errors.map((err, i) => (
                <p key={i} className="mt-1 text-sm text-[var(--color-loss-light)]">
                  {err}
                </p>
              ))}
            </>
          )}

          <div className="mt-6 flex items-center gap-3">
            {result.errors.length === 0 && (
              <a
                href="/trades"
                className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-accent-light)]"
              >
                View Trades
              </a>
            )}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-surface-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <RotateCcw className="h-4 w-4" />
              Import More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
