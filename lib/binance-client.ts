/**
 * Binance REST API client — fetches real trade history using HMAC-SHA256 auth.
 * Works with both Spot and USD-M Futures accounts.
 * Tries multiple API endpoints to handle regional blocks.
 */
import crypto from 'crypto';

// Try multiple endpoints — api.binance.com is blocked in some regions
const SPOT_ENDPOINTS = [
  'https://api1.binance.com',
  'https://api2.binance.com',
  'https://api3.binance.com',
  'https://api.binance.com',
  'https://api.binance.us',
];

const FUTURES_ENDPOINTS = [
  'https://fapi.binance.com',
];

// Cache the working endpoint so we don't retry every call
let workingSpotBase: string | null = null;

function sign(queryString: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(queryString).digest('hex');
}

async function binanceRequest<T>(
  baseUrl: string,
  path: string,
  apiKey: string,
  apiSecret: string,
  params: Record<string, string> = {}
): Promise<T> {
  params.timestamp = Date.now().toString();
  params.recvWindow = '10000';

  const queryString = new URLSearchParams(params).toString();
  const signature = sign(queryString, apiSecret);
  const url = `${baseUrl}${path}?${queryString}&signature=${signature}`;

  const res = await fetch(url, {
    headers: { 'X-MBX-APIKEY': apiKey },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ msg: res.statusText }));
    throw new Error(err.msg || `Binance API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** Try multiple endpoints until one works */
async function findWorkingEndpoint(apiKey: string, apiSecret: string): Promise<string> {
  if (workingSpotBase) {
    // Verify cached endpoint still works
    try {
      await binanceRequest(workingSpotBase, '/api/v3/account', apiKey, apiSecret);
      return workingSpotBase;
    } catch {
      workingSpotBase = null; // Cache invalid, retry all
    }
  }

  const errors: string[] = [];
  for (const base of SPOT_ENDPOINTS) {
    try {
      await binanceRequest(base, '/api/v3/account', apiKey, apiSecret);
      workingSpotBase = base;
      console.log(`[Binance] Connected via ${base}`);
      return base;
    } catch (err) {
      errors.push(`${base}: ${(err as Error).message}`);
    }
  }

  throw new Error(`Could not reach Binance API. Tried: ${errors.join('; ')}`);
}

/** Test connectivity by trying all endpoints */
export async function testBinanceConnection(apiKey: string, apiSecret: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const base = await findWorkingEndpoint(apiKey, apiSecret);
    return { ok: true, error: undefined };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}


interface BinanceSpotTrade {
  id: number;
  symbol: string;
  orderId: number;
  price: string;
  qty: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
}

interface BinanceFuturesTrade {
  id: number;
  symbol: string;
  orderId: number;
  side: 'BUY' | 'SELL';
  price: string;
  qty: string;
  realizedPnl: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  buyer: boolean;
  maker: boolean;
  positionSide: string;
}

/** Fetch spot trades for popular USDT pairs */
export async function fetchBinanceSpotTrades(apiKey: string, apiSecret: string) {
  const spotBase = workingSpotBase || await findWorkingEndpoint(apiKey, apiSecret);
  // Fetch trades for the most common pairs
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT'];
  const allTrades: Array<{
    market: string;
    symbol: string;
    direction: string;
    entryPrice: number;
    exitPrice: number | null;
    size: number;
    pnl: number;
    fees: number;
    openedAt: Date;
    closedAt: Date | null;
  }> = [];

  for (const sym of symbols) {
    try {
      const trades = await binanceRequest<BinanceSpotTrade[]>(
        spotBase,
        '/api/v3/myTrades',
        apiKey,
        apiSecret,
        { symbol: sym, limit: '100' }
      );

      if (trades.length === 0) continue;

      // Group trades by orderId to pair buys/sells
      for (const t of trades) {
        const price = parseFloat(t.price);
        const qty = parseFloat(t.qty);
        const commission = parseFloat(t.commission);

        // Format symbol nicely (BTCUSDT -> BTC/USDT)
        const base = sym.replace('USDT', '');
        const displaySymbol = `${base}/USDT`;

        allTrades.push({
          market: 'crypto',
          symbol: displaySymbol,
          direction: t.isBuyer ? 'long' : 'short',
          entryPrice: price,
          exitPrice: price, // Spot trades are filled at one price
          size: qty,
          pnl: 0, // Spot trades don't have built-in PnL
          fees: commission,
          openedAt: new Date(t.time),
          closedAt: new Date(t.time),
        });
      }
    } catch {
      // Skip symbols that fail (may not have permissions or trades)
      continue;
    }
  }

  return allTrades;
}

/** Fetch USD-M Futures trades */
export async function fetchBinanceFuturesTrades(apiKey: string, apiSecret: string) {
  const futuresBase = FUTURES_ENDPOINTS[0];
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];
  const allTrades: Array<{
    market: string;
    symbol: string;
    direction: string;
    entryPrice: number;
    exitPrice: number | null;
    size: number;
    pnl: number;
    fees: number;
    openedAt: Date;
    closedAt: Date | null;
  }> = [];

  for (const sym of symbols) {
    try {
      const trades = await binanceRequest<BinanceFuturesTrade[]>(
        futuresBase,
        '/fapi/v1/userTrades',
        apiKey,
        apiSecret,
        { symbol: sym, limit: '100' }
      );

      if (trades.length === 0) continue;

      for (const t of trades) {
        const price = parseFloat(t.price);
        const qty = parseFloat(t.qty);
        const commission = parseFloat(t.commission);
        const realizedPnl = parseFloat(t.realizedPnl);

        const base = sym.replace('USDT', '');
        const displaySymbol = `${base}/USDT`;

        allTrades.push({
          market: 'crypto',
          symbol: displaySymbol,
          direction: t.side === 'BUY' ? 'long' : 'short',
          entryPrice: price,
          exitPrice: price,
          size: qty,
          pnl: realizedPnl,
          fees: commission,
          openedAt: new Date(t.time),
          closedAt: new Date(t.time),
        });
      }
    } catch {
      continue;
    }
  }

  return allTrades;
}

/** Fetch all trades (spot + futures) and return them ready for DB insert */
export async function fetchAllBinanceTrades(apiKey: string, apiSecret: string) {
  // Try both spot and futures, merge results
  const [spot, futures] = await Promise.allSettled([
    fetchBinanceSpotTrades(apiKey, apiSecret),
    fetchBinanceFuturesTrades(apiKey, apiSecret),
  ]);

  const trades = [
    ...(spot.status === 'fulfilled' ? spot.value : []),
    ...(futures.status === 'fulfilled' ? futures.value : []),
  ];

  // Convert to Prisma-ready objects
  return trades.map((t) => ({
    market: t.market,
    symbol: t.symbol,
    direction: t.direction,
    entryPrice: t.entryPrice,
    exitPrice: t.exitPrice,
    size: t.size,
    stopLoss: null,
    takeProfit: null,
    pnl: +t.pnl.toFixed(4),
    fees: +t.fees.toFixed(4),
    riskRewardRatio: null,
    strategyTags: [],
    emotionTags: [],
    mistakeTags: [],
    notes: 'Synced from Binance',
    screenshotUrl: null,
    isOpen: false,
    openedAt: t.openedAt,
    closedAt: t.closedAt,
  }));
}
