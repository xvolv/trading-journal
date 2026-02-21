import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { testBinanceConnection } from '@/lib/binance-client';

// Mask secret for API responses
function maskSecret(secret: string): string {
  if (secret.length <= 8) return '••••••••';
  return secret.slice(0, 4) + '••••' + secret.slice(-4);
}

function serialise(c: { createdAt: Date; updatedAt: Date; lastSyncAt: Date | null; apiSecret: string; [k: string]: unknown }) {
  return {
    ...c,
    apiSecret: maskSecret(c.apiSecret as string),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    lastSyncAt: c.lastSyncAt?.toISOString() ?? null,
  };
}

// GET /api/broker-connections — list all
export async function GET() {
  try {
    const connections = await prisma.brokerConnection.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(connections.map(serialise));
  } catch (error) {
    console.error('[GET /api/broker-connections]', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

// POST /api/broker-connections — create new
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { broker, label, apiKey, apiSecret } = body;
    if (!broker || !label) {
      return NextResponse.json({ error: 'broker and label are required' }, { status: 400 });
    }

    // Determine initial status
    let status = 'disconnected';
    let lastError: string | null = null;

    if (broker === 'demo') {
      status = 'connected';
    } else if (broker === 'binance' && apiKey && apiSecret) {
      // Validate Binance credentials on connect
      const test = await testBinanceConnection(apiKey, apiSecret);
      if (test.ok) {
        status = 'connected';
      } else {
        status = 'error';
        lastError = `Auth failed: ${test.error}`;
      }
    }

    const connection = await prisma.brokerConnection.create({
      data: {
        broker,
        label,
        apiKey: apiKey || '',
        apiSecret: apiSecret || '',
        status,
        lastError,
      },
    });

    return NextResponse.json(serialise(connection), { status: 201 });
  } catch (error) {
    console.error('[POST /api/broker-connections]', error);
    return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 });
  }
}
