import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { testBinanceConnection, fetchAllBinanceTrades } from '@/lib/binance-client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Demo trade generator
function generateDemoTrades(count: number) {
  const symbols = [
    { symbol: 'BTC/USDT', market: 'crypto' },
    { symbol: 'ETH/USDT', market: 'crypto' },
    { symbol: 'EUR/USD', market: 'forex' },
    { symbol: 'AAPL', market: 'stocks' },
    { symbol: 'SOL/USDT', market: 'crypto' },
    { symbol: 'GBP/JPY', market: 'forex' },
    { symbol: 'TSLA', market: 'stocks' },
  ];

  const directions = ['long', 'short'];
  const strategies = ['scalping', 'swing', 'day-trade', 'breakout', 'trend-follow'];
  const emotions = ['calm', 'confident', 'fomo', 'anxious'];

  const trades = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const isWin = Math.random() > 0.4; // 60% win rate

    // Generate realistic prices
    let basePrice: number;
    if (sym.symbol.includes('BTC')) basePrice = 95000 + Math.random() * 5000;
    else if (sym.symbol.includes('ETH')) basePrice = 3000 + Math.random() * 500;
    else if (sym.symbol.includes('SOL')) basePrice = 150 + Math.random() * 50;
    else if (sym.symbol === 'EUR/USD') basePrice = 1.08 + Math.random() * 0.02;
    else if (sym.symbol === 'GBP/JPY') basePrice = 188 + Math.random() * 3;
    else if (sym.symbol === 'AAPL') basePrice = 230 + Math.random() * 20;
    else basePrice = 350 + Math.random() * 50; // TSLA

    const entry = basePrice;
    const movePercent = (Math.random() * 3 + 0.2) / 100; // 0.2% to 3.2%
    const exit = dir === 'long'
      ? (isWin ? entry * (1 + movePercent) : entry * (1 - movePercent))
      : (isWin ? entry * (1 - movePercent) : entry * (1 + movePercent));

    const size = sym.market === 'crypto'
      ? +(Math.random() * 2 + 0.01).toFixed(4)
      : Math.floor(Math.random() * 50 + 1);

    const pnl = dir === 'long'
      ? (exit - entry) * size
      : (entry - exit) * size;

    const fees = Math.abs(pnl) * 0.001;
    const netPnl = +(pnl - fees).toFixed(2);

    // Random time within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursOffset = Math.floor(Math.random() * 12 + 8); // 8am - 8pm
    const openedAt = new Date(now - daysAgo * 86400000 + hoursOffset * 3600000);
    const durationMins = Math.floor(Math.random() * 240 + 5); // 5 min to 4 hours
    const closedAt = new Date(openedAt.getTime() + durationMins * 60000);

    const sl = dir === 'long'
      ? +(entry * (1 - (Math.random() * 2 + 0.5) / 100)).toFixed(sym.market === 'forex' ? 5 : 2)
      : +(entry * (1 + (Math.random() * 2 + 0.5) / 100)).toFixed(sym.market === 'forex' ? 5 : 2);

    const tp = dir === 'long'
      ? +(entry * (1 + (Math.random() * 4 + 1) / 100)).toFixed(sym.market === 'forex' ? 5 : 2)
      : +(entry * (1 - (Math.random() * 4 + 1) / 100)).toFixed(sym.market === 'forex' ? 5 : 2);

    trades.push({
      market: sym.market,
      symbol: sym.symbol,
      direction: dir,
      entryPrice: +entry.toFixed(sym.market === 'forex' ? 5 : 2),
      exitPrice: +exit.toFixed(sym.market === 'forex' ? 5 : 2),
      size,
      stopLoss: sl,
      takeProfit: tp,
      pnl: netPnl,
      fees: +fees.toFixed(2),
      riskRewardRatio: null,
      strategyTags: [strategies[Math.floor(Math.random() * strategies.length)]],
      emotionTags: [emotions[Math.floor(Math.random() * emotions.length)]],
      mistakeTags: [],
      notes: `Auto-synced from Demo broker`,
      screenshotUrl: null,
      isOpen: false,
      openedAt,
      closedAt,
    });
  }

  return trades;
}

// POST /api/broker-connections/:id/sync — trigger sync
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const connection = await prisma.brokerConnection.findUnique({ where: { id } });
    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    let imported = 0;
    let status = 'connected';
    let lastError: string | null = null;

    if (connection.broker === 'demo') {
      // Generate 5-10 random trades
      const count = Math.floor(Math.random() * 6) + 5;
      const trades = generateDemoTrades(count);

      await prisma.trade.createMany({ data: trades });
      imported = count;
    } else if (connection.broker === 'binance') {
      // Real Binance integration
      if (!connection.apiKey || !connection.apiSecret) {
        status = 'error';
        lastError = 'API key and secret are required for sync';
      } else {
        // Test connection first
        const testResult = await testBinanceConnection(connection.apiKey, connection.apiSecret);
        if (!testResult.ok) {
          status = 'error';
          lastError = `Binance auth failed: ${testResult.error}`;
        } else {
          // Fetch real trades
          const trades = await fetchAllBinanceTrades(connection.apiKey, connection.apiSecret);

          if (trades.length === 0) {
            status = 'connected';
            lastError = 'No trades found. Make sure your API key has trade history read permissions.';
          } else {
            // Deduplicate: skip trades we already have (same symbol, price, time)
            const existingTrades = await prisma.trade.findMany({
              where: { notes: 'Synced from Binance' },
              select: { symbol: true, entryPrice: true, openedAt: true },
            });

            const existingSet = new Set(
              existingTrades.map((t) => `${t.symbol}|${t.entryPrice}|${t.openedAt.toISOString()}`)
            );

            const newTrades = trades.filter(
              (t) => !existingSet.has(`${t.symbol}|${t.entryPrice}|${t.openedAt.toISOString()}`)
            );

            if (newTrades.length > 0) {
              await prisma.trade.createMany({ data: newTrades });
            }
            imported = newTrades.length;
            if (imported === 0 && trades.length > 0) {
              lastError = `All ${trades.length} trades already synced — nothing new to import.`;
            }
          }
        }
      }
    } else if (connection.broker === 'bybit') {
      status = 'error';
      lastError = 'Bybit live sync coming soon. Use Demo broker for testing.';
    } else {
      // MT5, IBKR — not yet implemented
      status = 'error';
      lastError = `${connection.broker} sync is not yet implemented. Use Demo broker for testing.`;
    }

    // Update connection status
    await prisma.brokerConnection.update({
      where: { id },
      data: {
        status,
        lastSyncAt: imported > 0 ? new Date() : connection.lastSyncAt,
        lastError,
      },
    });

    return NextResponse.json({ imported, status, lastError });
  } catch (error) {
    console.error('[POST /api/broker-connections/:id/sync]', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
