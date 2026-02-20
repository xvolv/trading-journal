import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/trades — list all trades, newest first
export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { openedAt: 'desc' },
    });

    // Serialise dates to ISO strings so the frontend Trade type stays happy
    const serialised = trades.map((t) => ({
      ...t,
      openedAt: t.openedAt.toISOString(),
      closedAt: t.closedAt?.toISOString() ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    return NextResponse.json(serialised);
  } catch (error) {
    console.error('[GET /api/trades]', error);
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 },
    );
  }
}

// POST /api/trades — create a new trade
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const trade = await prisma.trade.create({
      data: {
        market: body.market,
        symbol: body.symbol,
        direction: body.direction,
        entryPrice: body.entryPrice,
        exitPrice: body.exitPrice ?? null,
        size: body.size,
        stopLoss: body.stopLoss ?? null,
        takeProfit: body.takeProfit ?? null,
        pnl: body.pnl ?? 0,
        fees: body.fees ?? 0,
        riskRewardRatio: body.riskRewardRatio ?? null,
        strategyTags: body.strategyTags ?? [],
        emotionTags: body.emotionTags ?? [],
        mistakeTags: body.mistakeTags ?? [],
        notes: body.notes ?? '',
        screenshotUrl: body.screenshotUrl ?? null,
        isOpen: body.isOpen ?? false,
        openedAt: body.openedAt ? new Date(body.openedAt) : new Date(),
        closedAt: body.closedAt ? new Date(body.closedAt) : null,
      },
    });

    return NextResponse.json({
      ...trade,
      openedAt: trade.openedAt.toISOString(),
      closedAt: trade.closedAt?.toISOString() ?? null,
      createdAt: trade.createdAt.toISOString(),
      updatedAt: trade.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/trades]', error);
    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 },
    );
  }
}
