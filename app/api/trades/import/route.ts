import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/trades/import — bulk-insert trades
export async function POST(request: Request) {
  try {
    const { trades } = await request.json();

    if (!Array.isArray(trades) || trades.length === 0) {
      return NextResponse.json(
        { error: 'Request body must include a non-empty "trades" array' },
        { status: 400 },
      );
    }

    const data = trades.map((t: Record<string, unknown>) => ({
      market: String(t.market ?? 'crypto'),
      symbol: String(t.symbol ?? ''),
      direction: String(t.direction ?? 'long'),
      entryPrice: Number(t.entryPrice) || 0,
      exitPrice: t.exitPrice != null ? Number(t.exitPrice) : null,
      size: Number(t.size) || 0,
      stopLoss: t.stopLoss != null ? Number(t.stopLoss) : null,
      takeProfit: t.takeProfit != null ? Number(t.takeProfit) : null,
      pnl: Number(t.pnl) || 0,
      fees: Number(t.fees) || 0,
      riskRewardRatio: t.riskRewardRatio != null ? Number(t.riskRewardRatio) : null,
      strategyTags: Array.isArray(t.strategyTags) ? t.strategyTags : [],
      emotionTags: Array.isArray(t.emotionTags) ? t.emotionTags : [],
      mistakeTags: Array.isArray(t.mistakeTags) ? t.mistakeTags : [],
      notes: String(t.notes ?? ''),
      screenshotUrl: null,
      isOpen: Boolean(t.isOpen),
      openedAt: t.openedAt ? new Date(String(t.openedAt)) : new Date(),
      closedAt: t.closedAt ? new Date(String(t.closedAt)) : null,
    }));

    const result = await prisma.trade.createMany({ data });

    return NextResponse.json({ imported: result.count }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/trades/import]', error);
    return NextResponse.json(
      { error: 'Failed to import trades' },
      { status: 500 },
    );
  }
}
