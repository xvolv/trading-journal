import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/broker-connections/:id — update
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const connection = await prisma.brokerConnection.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      ...connection,
      apiSecret: connection.apiSecret.length <= 8 ? '••••••••' : connection.apiSecret.slice(0, 4) + '••••' + connection.apiSecret.slice(-4),
      createdAt: connection.createdAt.toISOString(),
      updatedAt: connection.updatedAt.toISOString(),
      lastSyncAt: connection.lastSyncAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error('[PATCH /api/broker-connections/:id]', error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}

// DELETE /api/broker-connections/:id — remove
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.brokerConnection.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/broker-connections/:id]', error);
    return NextResponse.json({ error: 'Failed to delete connection' }, { status: 500 });
  }
}
