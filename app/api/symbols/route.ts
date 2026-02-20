import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/symbols — list all symbols
export async function GET() {
  try {
    const symbols = await prisma.symbol.findMany({
      orderBy: { symbol: 'asc' },
    });
    return NextResponse.json(symbols);
  } catch (error) {
    console.error('[GET /api/symbols]', error);
    return NextResponse.json(
      { error: 'Failed to fetch symbols' },
      { status: 500 },
    );
  }
}
