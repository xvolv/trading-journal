/* ============================================
   CSV Parser — zero-dependency client-side parser
   ============================================ */

export interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

/**
 * Parse a CSV string into headers + rows.
 * Handles quoted fields, commas inside quotes, and CRLF/LF.
 */
export function parseCSV(text: string): ParsedCSV {
  const lines = splitCSVLines(text);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1)
    .filter((line) => line.trim().length > 0)
    .map(parseCSVLine);

  return { headers, rows };
}

function splitCSVLines(text: string): string[] {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++; // skip CRLF
      lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);
  return lines;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

/* ============================================
   Column Mapping — auto-detect CSV headers
   ============================================ */

export type TradeField =
  | 'symbol'
  | 'market'
  | 'direction'
  | 'entryPrice'
  | 'exitPrice'
  | 'size'
  | 'stopLoss'
  | 'takeProfit'
  | 'pnl'
  | 'fees'
  | 'notes'
  | 'openedAt'
  | 'closedAt'
  | '__skip__';

export const TRADE_FIELD_LABELS: Record<TradeField, string> = {
  symbol: 'Symbol',
  market: 'Market',
  direction: 'Direction',
  entryPrice: 'Entry Price',
  exitPrice: 'Exit Price',
  size: 'Size / Qty',
  stopLoss: 'Stop Loss',
  takeProfit: 'Take Profit',
  pnl: 'P&L',
  fees: 'Fees',
  notes: 'Notes',
  openedAt: 'Opened At',
  closedAt: 'Closed At',
  __skip__: '— Skip —',
};

const HEADER_PATTERNS: [RegExp, TradeField][] = [
  [/^symbol$/i, 'symbol'],
  [/^ticker$/i, 'symbol'],
  [/^pair$/i, 'symbol'],
  [/^instrument$/i, 'symbol'],
  [/^asset$/i, 'symbol'],
  [/^market$/i, 'market'],
  [/^type$/i, 'market'],
  [/^direction$/i, 'direction'],
  [/^side$/i, 'direction'],
  [/^(buy|sell)$/i, 'direction'],
  [/^entry\s*price$/i, 'entryPrice'],
  [/^open\s*price$/i, 'entryPrice'],
  [/^entry$/i, 'entryPrice'],
  [/^exit\s*price$/i, 'exitPrice'],
  [/^close\s*price$/i, 'exitPrice'],
  [/^exit$/i, 'exitPrice'],
  [/^size$/i, 'size'],
  [/^qty$/i, 'size'],
  [/^quantity$/i, 'size'],
  [/^volume$/i, 'size'],
  [/^lot(s)?$/i, 'size'],
  [/^amount$/i, 'size'],
  [/^stop\s*loss$/i, 'stopLoss'],
  [/^sl$/i, 'stopLoss'],
  [/^take\s*profit$/i, 'takeProfit'],
  [/^tp$/i, 'takeProfit'],
  [/^p[&n]l$/i, 'pnl'],
  [/^profit$/i, 'pnl'],
  [/^pnl$/i, 'pnl'],
  [/^net\s*pnl$/i, 'pnl'],
  [/^result$/i, 'pnl'],
  [/^gain$/i, 'pnl'],
  [/^fee(s)?$/i, 'fees'],
  [/^commission$/i, 'fees'],
  [/^note(s)?$/i, 'notes'],
  [/^comment(s)?$/i, 'notes'],
  [/^open(ed)?\s*(at|date|time)?$/i, 'openedAt'],
  [/^date$/i, 'openedAt'],
  [/^time$/i, 'openedAt'],
  [/^close(d)?\s*(at|date|time)?$/i, 'closedAt'],
  [/^exit\s*(date|time)$/i, 'closedAt'],
];

/**
 * Auto-map CSV headers to Trade fields.
 * Returns a mapping: header index → TradeField.
 */
export function autoMapHeaders(headers: string[]): TradeField[] {
  const used = new Set<TradeField>();

  return headers.map((header) => {
    const clean = header.trim();
    for (const [pattern, field] of HEADER_PATTERNS) {
      if (pattern.test(clean) && !used.has(field)) {
        used.add(field);
        return field;
      }
    }
    return '__skip__' as TradeField;
  });
}

/**
 * Convert parsed CSV rows to trade objects using the column mapping.
 */
export function mapRowsToTrades(
  rows: string[][],
  mapping: TradeField[],
): Record<string, unknown>[] {
  return rows.map((row) => {
    const trade: Record<string, unknown> = {
      market: 'crypto',
      direction: 'long',
      isOpen: false,
    };

    mapping.forEach((field, i) => {
      if (field === '__skip__' || i >= row.length) return;

      const val = row[i].trim();
      if (!val) return;

      switch (field) {
        case 'symbol':
          trade.symbol = val;
          break;
        case 'market':
          trade.market = val.toLowerCase();
          break;
        case 'direction': {
          const lower = val.toLowerCase();
          if (lower === 'buy' || lower === 'long') trade.direction = 'long';
          else if (lower === 'sell' || lower === 'short') trade.direction = 'short';
          else trade.direction = lower;
          break;
        }
        case 'entryPrice':
        case 'exitPrice':
        case 'size':
        case 'stopLoss':
        case 'takeProfit':
        case 'pnl':
        case 'fees':
          trade[field] = parseFloat(val.replace(/[$,]/g, '')) || 0;
          break;
        case 'notes':
          trade.notes = val;
          break;
        case 'openedAt':
        case 'closedAt':
          trade[field] = new Date(val).toISOString();
          break;
      }
    });

    return trade;
  });
}
