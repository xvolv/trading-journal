import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/discipline-rules — list all rules
export async function GET() {
  try {
    const rules = await prisma.disciplineRule.findMany({
      orderBy: { label: 'asc' },
    });
    return NextResponse.json(rules);
  } catch (error) {
    console.error('[GET /api/discipline-rules]', error);
    return NextResponse.json(
      { error: 'Failed to fetch discipline rules' },
      { status: 500 },
    );
  }
}

// POST /api/discipline-rules — create a new rule
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rule = await prisma.disciplineRule.create({
      data: {
        label: body.label,
        type: body.type,
        threshold: body.threshold,
        currentValue: body.currentValue ?? 0,
        isBreached: body.isBreached ?? false,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error('[POST /api/discipline-rules]', error);
    return NextResponse.json(
      { error: 'Failed to create discipline rule' },
      { status: 500 },
    );
  }
}
