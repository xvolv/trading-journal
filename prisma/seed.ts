import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ── Symbols ────────────────────────────────────────────
  const symbols = [
    // Crypto
    { symbol: 'BTC/USDT', market: 'crypto', precision: 2, mockPrice: 43280 },
    { symbol: 'ETH/USDT', market: 'crypto', precision: 2, mockPrice: 2890 },
    { symbol: 'SOL/USDT', market: 'crypto', precision: 2, mockPrice: 112.8 },
    { symbol: 'BNB/USDT', market: 'crypto', precision: 2, mockPrice: 605.2 },
    { symbol: 'XRP/USDT', market: 'crypto', precision: 4, mockPrice: 0.6245 },
    { symbol: 'DOGE/USDT', market: 'crypto', precision: 4, mockPrice: 0.0825 },
    { symbol: 'ADA/USDT', market: 'crypto', precision: 4, mockPrice: 0.582 },
    { symbol: 'AVAX/USDT', market: 'crypto', precision: 2, mockPrice: 38.45 },
    // Forex
    { symbol: 'EUR/USD', market: 'forex', precision: 4, mockPrice: 1.0892 },
    { symbol: 'GBP/USD', market: 'forex', precision: 4, mockPrice: 1.2655 },
    { symbol: 'USD/JPY', market: 'forex', precision: 2, mockPrice: 149.8 },
    { symbol: 'GBP/JPY', market: 'forex', precision: 2, mockPrice: 188.42 },
    { symbol: 'AUD/USD', market: 'forex', precision: 4, mockPrice: 0.658 },
    { symbol: 'XAU/USD', market: 'forex', precision: 2, mockPrice: 2024.5 },
    // Stocks
    { symbol: 'AAPL', market: 'stocks', precision: 2, mockPrice: 185.6 },
    { symbol: 'NVDA', market: 'stocks', precision: 2, mockPrice: 892.3 },
    { symbol: 'TSLA', market: 'stocks', precision: 2, mockPrice: 198.5 },
    { symbol: 'META', market: 'stocks', precision: 2, mockPrice: 485.2 },
    { symbol: 'MSFT', market: 'stocks', precision: 2, mockPrice: 415.8 },
    // Futures
    { symbol: 'ES', market: 'futures', precision: 2, mockPrice: 5120.25 },
    { symbol: 'NQ', market: 'futures', precision: 2, mockPrice: 18245.5 },
    { symbol: 'CL', market: 'futures', precision: 2, mockPrice: 78.35 },
  ];

  for (const sym of symbols) {
    await prisma.symbol.upsert({
      where: { symbol: sym.symbol },
      update: sym,
      create: sym,
    });
  }
  console.log(`  ✅ ${symbols.length} symbols seeded`);

  // ── Trades ─────────────────────────────────────────────
  // Delete existing trades so seed is idempotent
  await prisma.trade.deleteMany();

  const trades = [
    {
      market: 'crypto',
      symbol: 'BTC/USDT',
      direction: 'long',
      entryPrice: 42150,
      exitPrice: 43280,
      size: 0.5,
      stopLoss: 41500,
      takeProfit: 44000,
      pnl: 565,
      fees: 12.4,
      riskRewardRatio: 2.85,
      strategyTags: ['breakout'],
      emotionTags: ['confident'],
      mistakeTags: [],
      notes: 'Clean breakout above resistance at 42k. Volume confirmed.',
      isOpen: false,
      openedAt: new Date('2026-02-20T08:15:00Z'),
      closedAt: new Date('2026-02-20T09:42:00Z'),
    },
    {
      market: 'forex',
      symbol: 'EUR/USD',
      direction: 'short',
      entryPrice: 1.0892,
      exitPrice: 1.0845,
      size: 100000,
      stopLoss: 1.092,
      takeProfit: 1.083,
      pnl: 470,
      fees: 8.5,
      riskRewardRatio: 1.68,
      strategyTags: ['trend-follow'],
      emotionTags: ['calm'],
      mistakeTags: [],
      notes: 'Following the downtrend on H4. Clean entry on pullback.',
      isOpen: false,
      openedAt: new Date('2026-02-19T14:30:00Z'),
      closedAt: new Date('2026-02-19T17:15:00Z'),
    },
    {
      market: 'crypto',
      symbol: 'ETH/USDT',
      direction: 'long',
      entryPrice: 2890,
      exitPrice: 2820,
      size: 2,
      stopLoss: 2850,
      takeProfit: 2980,
      pnl: -140,
      fees: 6.8,
      riskRewardRatio: 2.25,
      strategyTags: ['scalping'],
      emotionTags: ['fomo'],
      mistakeTags: ['late-entry'],
      notes: 'FOMO entry. Entered too late after the move started.',
      isOpen: false,
      openedAt: new Date('2026-02-19T10:00:00Z'),
      closedAt: new Date('2026-02-19T10:45:00Z'),
    },
    {
      market: 'binary',
      symbol: 'GBP/JPY',
      direction: 'call',
      entryPrice: 188.42,
      exitPrice: 188.65,
      size: 100,
      stopLoss: null,
      takeProfit: null,
      pnl: 85,
      fees: 0,
      riskRewardRatio: null,
      strategyTags: ['news'],
      emotionTags: ['confident'],
      mistakeTags: [],
      notes: 'BOE rate decision play. Expected hawkish tone.',
      isOpen: false,
      openedAt: new Date('2026-02-18T12:00:00Z'),
      closedAt: new Date('2026-02-18T12:05:00Z'),
    },
    {
      market: 'crypto',
      symbol: 'SOL/USDT',
      direction: 'long',
      entryPrice: 105.2,
      exitPrice: 112.8,
      size: 10,
      stopLoss: 102,
      takeProfit: 115,
      pnl: 76,
      fees: 4.2,
      riskRewardRatio: 2.38,
      strategyTags: ['swing'],
      emotionTags: ['calm'],
      mistakeTags: [],
      notes: 'Swing trade on daily support. Held overnight.',
      isOpen: false,
      openedAt: new Date('2026-02-17T20:00:00Z'),
      closedAt: new Date('2026-02-18T08:30:00Z'),
    },
    {
      market: 'forex',
      symbol: 'USD/JPY',
      direction: 'long',
      entryPrice: 149.8,
      exitPrice: 149.2,
      size: 50000,
      stopLoss: 149.5,
      takeProfit: 150.5,
      pnl: -200,
      fees: 5.0,
      riskRewardRatio: 2.33,
      strategyTags: ['reversal'],
      emotionTags: ['revenge'],
      mistakeTags: ['revenge-trade'],
      notes: 'Revenge trade after previous loss. Should have waited.',
      isOpen: false,
      openedAt: new Date('2026-02-17T15:00:00Z'),
      closedAt: new Date('2026-02-17T16:30:00Z'),
    },
    {
      market: 'crypto',
      symbol: 'BTC/USDT',
      direction: 'short',
      entryPrice: 43500,
      exitPrice: 42800,
      size: 0.3,
      stopLoss: 44000,
      takeProfit: 42500,
      pnl: 210,
      fees: 8.1,
      riskRewardRatio: 1.4,
      strategyTags: ['scalping'],
      emotionTags: ['calm'],
      mistakeTags: ['early-exit'],
      notes: 'Took profit too early. Could have held for full target.',
      isOpen: false,
      openedAt: new Date('2026-02-16T22:00:00Z'),
      closedAt: new Date('2026-02-17T01:15:00Z'),
    },
    {
      market: 'stocks',
      symbol: 'NVDA',
      direction: 'long',
      entryPrice: 875.5,
      exitPrice: 892.3,
      size: 5,
      stopLoss: 865,
      takeProfit: 900,
      pnl: 84.0,
      fees: 2.0,
      riskRewardRatio: 2.33,
      strategyTags: ['breakout'],
      emotionTags: ['confident'],
      mistakeTags: [],
      notes: 'NVDA earnings breakout play. Strong volume.',
      isOpen: false,
      openedAt: new Date('2026-02-15T14:30:00Z'),
      closedAt: new Date('2026-02-15T19:58:00Z'),
    },
    {
      market: 'crypto',
      symbol: 'DOGE/USDT',
      direction: 'long',
      entryPrice: 0.0825,
      exitPrice: 0.079,
      size: 50000,
      stopLoss: 0.08,
      takeProfit: 0.088,
      pnl: -175,
      fees: 3.5,
      riskRewardRatio: 2.2,
      strategyTags: ['day-trade'],
      emotionTags: ['greedy'],
      mistakeTags: ['over-leveraged'],
      notes: 'Over-leveraged on a low-cap meme trade. Bad risk management.',
      isOpen: false,
      openedAt: new Date('2026-02-14T09:00:00Z'),
      closedAt: new Date('2026-02-14T11:30:00Z'),
    },
    {
      market: 'forex',
      symbol: 'AUD/USD',
      direction: 'long',
      entryPrice: 0.658,
      exitPrice: 0.6645,
      size: 75000,
      stopLoss: 0.655,
      takeProfit: 0.665,
      pnl: 487.5,
      fees: 6.0,
      riskRewardRatio: 2.33,
      strategyTags: ['trend-follow'],
      emotionTags: ['calm'],
      mistakeTags: [],
      notes: 'AUD strength after RBA minutes. Textbook trend follow.',
      isOpen: false,
      openedAt: new Date('2026-02-13T03:00:00Z'),
      closedAt: new Date('2026-02-13T10:00:00Z'),
    },
  ];

  await prisma.trade.createMany({ data: trades });
  console.log(`  ✅ ${trades.length} trades seeded`);

  // ── Discipline Rules ───────────────────────────────────
  await prisma.disciplineRule.deleteMany();

  const rules = [
    {
      label: 'Daily Loss Limit',
      type: 'daily-loss',
      threshold: -500,
      currentValue: 0,
      isBreached: false,
    },
    {
      label: 'Max Trades Per Day',
      type: 'max-trades',
      threshold: 5,
      currentValue: 1,
      isBreached: false,
    },
    {
      label: 'Daily Profit Target',
      type: 'daily-profit',
      threshold: 1000,
      currentValue: 565,
      isBreached: false,
    },
  ];

  await prisma.disciplineRule.createMany({ data: rules });
  console.log(`  ✅ ${rules.length} discipline rules seeded`);

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
