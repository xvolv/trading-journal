import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/trades/:id
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.trade.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/trades/:id]', error);
    return NextResponse.json(
      { error: 'Failed to delete trade' },
      { status: 500 },
    );
  }
}

// PATCH /api/trades/:id — partial update
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const trade = await prisma.trade.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      ...trade,
      openedAt: trade.openedAt.toISOString(),
      closedAt: trade.closedAt?.toISOString() ?? null,
      createdAt: trade.createdAt.toISOString(),
      updatedAt: trade.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('[PATCH /api/trades/:id]', error);
    return NextResponse.json(
      { error: 'Failed to update trade' },
      { status: 500 },
    );
  }
}
