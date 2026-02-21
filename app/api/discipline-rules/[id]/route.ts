import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/discipline-rules/:id — update a rule
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const rule = await prisma.disciplineRule.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.error('[PATCH /api/discipline-rules/:id]', error);
    return NextResponse.json(
      { error: 'Failed to update discipline rule' },
      { status: 500 },
    );
  }
}

// DELETE /api/discipline-rules/:id — delete a rule
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.disciplineRule.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/discipline-rules/:id]', error);
    return NextResponse.json(
      { error: 'Failed to delete discipline rule' },
      { status: 500 },
    );
  }
}
